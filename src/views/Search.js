import React, { useEffect, useState, useRef } from 'react';
import SearchFilters from '../components/SearchFilters';
import CrossRef from '../components/CrossRef';
import CommonData from '../components/CommonData';
import Spinner from '../components/Spinner';

import { ReactComponent as WaitingSvg } from '../icons/waiting.svg';

function Search() {
        
    const { CrossrefClient } = require("@jamesgopsill/crossref-client");
    const client = new CrossrefClient();

    let firstInit = React.useRef(true);

    var searchOuput,urlApi,tempOffset;
    var timerOff = false;
    var pagination = []; // Сюда будем записывать обе ссылки полученные по api 1123

    const [itemsNum,setItemsNum] = useState('25'); // Элементов на странице поиск по CrossRef
    const [offsetCrossRef,setOffsetCrossRef] = useState(0); // 0 = первая страница пагинации, текущий оффсет в виде количества items пропуска
    const [typeSearch,setTypeSearch] = useState('works'); // State для определения базы по которой ищем ДО запуска
    const [typeOutcome, setTypeOutcome] = useState(''); // State для определения базы по которой ищем ПОСЛЕ запуска
    const [queryStarted,setQueryStarted] = useState(false); // Поисоковй запрос инициализирован
    const [textOutput,setTextOutput] = useState(""); // State поискового запроса
    const [searchResults,setSearchResults] = useState([]); // Поисковая выдача записывается в этот state (все статьи)
    const [prevLinks, setPrevLinks] = useState([]); // State где будем хранить все пролистанные страницы, чтобы вернуться к ним по пагинации
    const [nextLinks, setNextLinks] = useState('no link'); // State для страницы Следующая страница в поисковой выдаче
    const [allBookmarks, setAllBookmarks] = useState([]); // State закладок добавленных пользователем получаемых из БД

    // Filters 
    const [filterYear,setFilterYear] = useState('');
    const [filterAuthor,setFilterAuthor] = useState('');
    const [filterType,setFilterType] = useState('');

    /* Headers для fetch CrossRef */
    // const headerCrossRef = {
    //     "Content-type": "application/json;charset=UTF-8",
    //     // "Accept": "application/json;charset=UTF-8",
    //     "Accept": "application/json",
    //     "User-Agent": "Kirill (Local beta-testing; mailto:kirill.labutkin@gmail.com) JavaScript/React.js"
    // }

    useEffect(()=>{
        document.querySelector('body').scrollTo(0,0);
    },[]);

    /**
     * Пагинация поискового запроса на основании ссылок из json по API, если fetch происходит по data sets
     */
     function prevPage() {
        if (prevLinks.length > 1) {
            setQueryStarted(true); /* Запустили Loader */
            var returnUrl = prevLinks[prevLinks.length - 2]; // Из стейта searchPagination берем предпоследний элемент массива
            fetch(returnUrl, {
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok || response.status > 399 ) {
                    throw new Error("There was a problem with the server connection");
                }
                return response.json();
            })
            .then(response => {
                searchOuput = Object.entries(response.data).map(item => {
                    return (item.pop())
                });
                paginateCommon(searchOuput); // Выводим полученный массив в результаты выдачи заменой state
                pagination = Object.entries(response.links); // Обновили из API ссылки для пагинации
                var prevLinksWithoutLast = prevLinks.slice(0,-1);
                setPrevLinks(prevLinksWithoutLast); // // Убрали последнюю страница из массива ссылок Предыдущая страница
                setNextLinks(pagination[1][1]); // Переписали ссылку для пагинации Следующая страница
            })
            .catch(err => {
                console.error(err);
            })
        }
    }

    /**
     * Пагинация поискового запроса на основании ссылок из json по API, если fetch происходит по data sets
     */
     function nextPage() {
        if (nextLinks !== 'no link') {
            setQueryStarted(true); /* Запустили Loader */
            fetch(nextLinks, {
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok || response.status > 399 ) {
                    throw new Error("There was a problem with the server connection");
                }
                return response.json();
            })
            .then(response => {
                searchOuput = Object.entries(response.data).map(item => {
                    return (item.pop())
                });
                paginateCommon(searchOuput); // Выводим полученный массив в результаты выдачи заменой state
                pagination = Object.entries(response.links); // Обновили из API ссылки для пагинации
                setPrevLinks([...prevLinks,pagination[0][1]]); // Добавили текущую страницу в массив страниц Предудущая страница 
                setNextLinks(pagination[1][1]); // Переписали ссылку для пагинации Следующая страница
            })
            .catch(err => {
                console.error(err);
            })
        }
    }

    /**
     * Получение данных из БД о наличии bookmarks по User id
     */
    useEffect(() => {
        function CheckBookmarks() {
            const queryCheckBookmarks = {
                "data": "bookmarkQuery",
                "id": 2
            };
            fetch('https://kirilab.ru/science/func.php', {
                method: 'POST',
                body: JSON.stringify(queryCheckBookmarks)
            })
            .then(response => {
                if (!response.ok || response.status > 399 ) {
                    throw new Error("There was a problem with the server connection");
                }
                return response.json();
            })
            .then(response => {
                setAllBookmarks(response);
            })
            .catch(err => {
                console.log(err);
            })
        }
        CheckBookmarks();
    }, []);
    
    /**
     * Инициализируется из компоненты Crossref, отправляет повторный запрос fetch к CrossRef updateQuery, если offset больше нуля
     */
    function paginateCrossRef(event) {
        event.stopPropagation();
        if (event.target.getAttribute('data-pagination') === 'previous') {
            tempOffset = offsetCrossRef - itemsNum; // offset - количество items пропуска, itemsNum - количество на одной странице
        } else {
            tempOffset = offsetCrossRef + itemsNum; 
        }
        if (tempOffset < 0) {
            setOffsetCrossRef(0);
        } else if (tempOffset > (10000 - itemsNum)) {
            tempOffset = 10000 - itemsNum;
            setOffsetCrossRef(tempOffset);
        // } else if(tempOffset > (searchResults[3][1]['total-results'] - itemsNum)) {
        //     setOffsetCrossRef((searchResults[3][1]['total-results'] - itemsNum));
        } else if(tempOffset > (searchResults['totalResults'] - itemsNum)) {
        setOffsetCrossRef((searchResults['totalResults'] - itemsNum));
        } else {
            setOffsetCrossRef(tempOffset);
        }
    }

    /**
     * Инициализируется из компоненты Crossref, выбор страницы в пагинации с лимитами по api и запуск через useEffect offsetCrossRef
     */
    function goToPage() {
        var inputPagination = document.getElementById('paginate-input').value;
        var onlyDigits = parseInt(inputPagination.replace(/\D/g, ''));
        var totalItems = Math.floor(searchResults['totalResults']);
        if (totalItems > 10000) {
            totalItems = 10000;
        }
        if (onlyDigits !== '' && onlyDigits > 1 && onlyDigits <= 400) {
            if (onlyDigits > (totalItems / itemsNum)) { 
                setOffsetCrossRef(totalItems-itemsNum);
            } else {
                setOffsetCrossRef(onlyDigits*itemsNum-itemsNum);
            }
        } else if (onlyDigits > 400) {
            setOffsetCrossRef(399*itemsNum);
        } else {
            setOffsetCrossRef(0);
        }
    }

    /**
     * Обновляем выдачу поиска и плавно экран наверх, чтобы избежать дерганий
     */
    useEffect(() => {
        if (firstInit.current === true) {
            firstInit.current = false;
        } else {
            window.scrollTo(0, 0,'smooth');
            updateQuery();
        }
    },[offsetCrossRef,itemsNum]);

    /** 
     * Fetch с поисковым запросом к БД
    */
    
        
    const controller = new AbortController();
    const signal = controller.signal;
    var launchTimer;
    var counterN = 0;

    async function updateQuery() {

        setQueryStarted(true); /* Запустили Loader */
        setTimeout(() => {
            timerOff = true;
        },1800); // Если загрузка была уже в течение 1.8 секунд, то искуственную задержку loader'a выключаем в useEffect
        var searchRequest = textOutput; /* Взяли из state, что ввел пользователь */
        setTypeOutcome(typeSearch); /* Обновили state показывающий, какая БД сейчас используется в fetch */
        // var myEmail = 'kirill.labutkin@gmail.com';

        // Запустить проверку по времени

        launchTimer = setInterval(checkResult,1000);

        /* Если выбран поиск по статьям (works) */
        if (typeSearch === 'works') {
            
            // setSearchResults([]);

            const search = {
                query: encodeURIComponent(searchRequest),
            }

            client.works(search).then(r => {
                if (r.ok && r.status == 200) {
                    searchOuput = r.content.message;
                    setSearchResults(searchOuput);
                }
            })

        /* Если выбран поиск по статьям (sets) */
        } else if (typeSearch === 'sets') {
            searchOuput = ''
            setSearchResults([]);
            /* Конструируем запрос */
            if (filterYear !== '') {
                var urlYear = '%20AND%20publicationYear:' + encodeURIComponent(filterYear);
            } else {
                var urlYear = '';
            }

            if (filterAuthor !== '') {
                var urlAuthor = '%20AND%20creators.familyName:' + encodeURIComponent(filterAuthor);
            } else {
                var urlAuthor = '';
            }

            if (filterType !== '') {
                var urlType = '%20AND%20types.resourceTypeGeneral:' + encodeURIComponent(filterType);
            } else {
                var urlType = '';
            }
            
            urlApi = `
            https://api.datacite.org/dois?query=
            ${encodeURIComponent(searchRequest)}
            ${urlYear}
            ${urlAuthor}
            ${urlType}
            `;
            fetch(urlApi, {
                method: 'GET',
                signal,
                cache: "force-cache",
                headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    "Accept": "application/json;charset=UTF-8",
                    "User-Agent": "Kirill (Local beta-testing; mailto:kirill.labutkin@gmail.com) JavaScript/React.js"
                }
            })
            .then(response => {
                if (!response.ok || response.status > 399 ) {
                    throw new Error("There was a problem with the server connection");
                }
                return response.json();
            })
            .then(response => {
                searchOuput = Object.entries(response.data).map(item => {
                    return (item.pop())
                });
                pagination = Object.entries(response.links); // Получили массив ссылок для пагинации
                
                setPrevLinks([urlApi]); // Отчистили стейт всех предыдущих страниц (пагинация) и добавили текущую страницу
                if (pagination.length > 1) {
                    setNextLinks(pagination[1][1]); // Получили ссылку пагинации при первичной загрузке Следующая страницу
                } else {
                    setNextLinks('no link');
                }
                setSearchResults(searchOuput); // Обновили выдачу поиска
            })
            .catch(err => {
                console.error(err);
            })
        }
    }

    function checkResult() {
        counterN ++;
        if (counterN == 12) {
            clearInterval(launchTimer);
            stopSearch();
        }
    }

    function stopSearch() {
        setQueryStarted(false);
        controller.abort();
    }

    /**
     * Если state searchResults изменился, то статус загрузки false и далее отключается анимация загрузки
     */
    useEffect(() => {
        if (searchResults?.length > 0 || searchResults?.items?.length > 0) {
            if (timerOff) {
                setQueryStarted(false);
                timerOff = false;
            } else {
                setTimeout(() => {
                    setQueryStarted(false);
                },1200);
                timerOff = false;
            }
        }
    },[searchResults]);

    /**
     * Функция обновления поисковой выдачи из CommonData при перелистывании страницы
     */
    function paginateCommon(props) {
        setSearchResults(searchOuput); 
    }
    
    /**
     * Кнопка добавления статьи в закладки пользователя и отправки в БД
     * @param {*} props - идентификатор добавляемой статьи
     */
    function AddBookmark(props) {
        var typeDb = typeOutcome;
        const queryAddBookmark = {
            "data": "addBookmark",
            "id": 2,
            "bookmark": props,
            "database": typeDb
        };
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryAddBookmark)
        })
        .then(response => {
            if (!response.ok || response.status > 399 ) {
                throw new Error("There was a problem with the server connection");
            }
            return response.json();
        })
        .then((response) => {
            if (response == false) {
            } else {
                setAllBookmarks(response);
            }
        })
        .catch(err => {
            console.error(err);
        })
    }

    /**
     * Кнопка удаления закладки из БД 
     * @param {*} props - идентификатор удаляемой статьи
     */
    function RemoveBookmark(props) {
        const queryRemoveBookmark = {
            "data": "removeBookmark",
            "id": 2,
            "doi": props
        }
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryRemoveBookmark)
        })
        .then(response => {
            if (!response.ok || response.status > 399 ) {
                throw new Error("There was a problem with the server connection");
            }
            return response.json();
        })
        .then((response) => {
            setAllBookmarks(response);
        })
        .catch(err => {
            console.error(err);
        })
    }

    return (
        <div className='main search'>
            {/* <div className=''> */}
                {/* <div className='search__query'> */}
                    
                    <SearchFilters
                        textOutput={textOutput}
                        typeSearch={typeSearch}
                        passSetTextOutput={setTextOutput}
                        passQueryStarted={queryStarted}
                        passUpdateQuery={updateQuery}
                        passSetTypeSearch={setTypeSearch}
                        setFilterYear={setFilterYear}
                        setFilterAuthor={setFilterAuthor}
                        setFilterType={setFilterType}
                        stopSearch={stopSearch}
                    />

                    {searchResults == '' ? // Не было отправлено поискового запроса или не было ответа
                        !queryStarted  ? // Не была начата загрузка (loader)
                            <div className='search__waiting'>
                                    <h3 className='search__h-waiting'>Please type your search request in Search form</h3>
                                    <div className='search__image-waiting'><WaitingSvg /></div>
                            </div>
                        : 
                            <div className='search__results'>
                                <Spinner />
                            </div>

                    : queryStarted ? // Проверка не идет ли загрузка
                    
                        <div className='search__results'>
                            <Spinner />
                        </div>
                        
                    : typeOutcome == 'works' && typeSearch == 'works' ? // Есть поисковой ответ, проверяем источник works/sets
                    
                    <CrossRef
                        searchResults={searchResults}
                        allBookmarks={allBookmarks}
                        RemoveBookmark={RemoveBookmark}
                        AddBookmark={AddBookmark}
                        paginateCrossRef={paginateCrossRef}
                        offsetCrossRef={offsetCrossRef}
                        itemsNum={itemsNum}
                        setItemsNum={setItemsNum}
                        goToPage={goToPage}
                    />

                    // typeOutcome != 'works', значит вкладка 'sets'
                    : typeOutcome == 'sets' && typeSearch == 'sets' ?
                    <CommonData
                    allBookmarks={allBookmarks}
                    RemoveBookmark={RemoveBookmark}
                    AddBookmark={AddBookmark}
                    searchOuput={searchOuput}
                    paginateCommon={paginateCommon}
                    prevLinks={prevLinks}
                    nextLinks={nextLinks}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    searchResults={searchResults}
                    />
                    : 
                    <div className='search__waiting'>
                        <h3 className='search__h-waiting'>Please type your search request in Search form</h3>
                        <div className='search__image-waiting'><WaitingSvg /></div>
                    </div>
                    }
                {/* </div> */}
            {/* </div>         */}
        </div>
    );
}
    
export default Search;