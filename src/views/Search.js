import React, { useEffect, useState, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SearchFilters from '../components/SearchFilters';
import CrossRef from '../components/CrossRef';

import { ReactComponent as WaitingSvg } from '../icons/waiting.svg';
import { CiteStyles } from '../data/DataCitesStyles.js';
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import { FiArrowUp } from "react-icons/fi";
import { FiArrowDown } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { ImCopy } from "react-icons/im";
import { BsQuestionCircle } from "react-icons/bs";
import { BsArrowUp } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import { AiOutlineTag } from "react-icons/ai";

function Search() {

    // Refs links 
    let firstInit = React.useRef(true);
    let citeText = React.useRef(); // Реф для нахождения поля с текстом цитаты для копирования в буфер пользователя

    var searchOuput,loadStyle,urlApi,tempOffset;
    var timerOff = false;

    const [itemsNum,setItemsNum] = '25'; // Элементов на странице поиск по CrossRef
    const [offsetCrossRef,setOffsetCrossRef] = useState(0); // 0 = первая страница пагинации, текущий оффсет в виде количества items пропуска
    const [typeSearch,setTypeSearch] = useState('sets'); // State для определения базы по которой ищем ДО запуска
    const [typeOutcome, setTypeOutcome] = useState(''); // State для определения базы по которой ищем ПОСЛЕ запуска

    var pagination = []; // Сюда будем записывать обе ссылки полученные по api
    let abstractCombine = []; // Переменная для суммирования описаний статьи и дальнейшего подсчета знаков
    const [queryStarted,setQueryStarted] = useState(false); // Поисоковй запрос инициализирован
    const [fullDesc,setFullDesc] = useState({}); // State для показа полного описания статьи true - показать полное, false - короткое
    const [textOutput,setTextOutput] = useState(""); // State поискового запроса
    const [searchResults,setSearchResults] = useState([]); // Поисковая выдача записывается в этот state (все статьи)

    const [errorCite,setErrorCite] = useState(null); // Стейт для ошибки при fecth стиля цитирования
    
    const [prevLinks, setPrevLinks] = useState([]); // State где будем хранить все пролистанные страницы, чтобы вернуться к ним по пагинации
    const [nextLinks, setNextLinks] = useState('no link'); // State для страницы Следующая страница в поисковой выдаче
    
    const [allBookmarks, setAllBookmarks] = useState([]); // State закладок добавленных пользователем получаемых из БД
    const [cite,setCite] = useState({}); // Стили цицитирования загруженные в генераторе цитирования 
    const [loadTag,setLoadTag] = useState('apa'); // State того, что нажато из списка стилей цитирования (тег)
    const [chosenStyle,setChosenStyle] = useState('apa'); // Стиль цитирования для API (полный)
    const [styleLoading, setStyleLoading] = useState(false); // Статус загрузки fetch стилей цитирования для показа загрузки

    const [numberItems,setNumberItems] = useState('25'); // сколько items на странице

    /* Headers для fetch CrossRef */
    const headerCrossRef = {
        "Accept": "application/json",
        "User-Agent": "Kirill (Local beta-testing; mailto:kirill.labutkin@gmail.com) JavaScript/React.js"
    }

    /**
     * Получение данных из БД о наличии bookmarks по User id
     * @param {object} queryCheckBookmarks - Объект с id пользователя и data-запросом
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
            .then(response => response.json())
            .then(response => {
                setAllBookmarks(response);
            });
        }
        CheckBookmarks();
    }, []);
    
    /**
     * Инициализируется из компоненты Crossref, отправляет повторный запрос fetch к CrossRef updateQuery, если offset больше нуля
     * @param {*} event 
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
        } else if(tempOffset > (searchResults[3][1]['total-results'] - itemsNum)) {
            setOffsetCrossRef((searchResults[3][1]['total-results'] - itemsNum));
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
        var totalItems = Math.floor(searchResults[3][1]['total-results']);
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
    useEffect(() => {
        if (firstInit.current === true) {
            firstInit.current = false;
        } else {
            updateQuery();
        }
    },[offsetCrossRef,numberItems]);

    /** 
     * Fetch с поисковым запросом к БД
    */
    async function updateQuery() {
        setQueryStarted(true); /* Запустили Loader */
        setTimeout(() => {
            timerOff = true;
        },2000); // Если загрузка была уже в течение 2 секунд, то искуственную задержку loader'a выключаем в useEffect
        var searchRequest = textOutput; /* Взяли из state, что ввел пользователь */
        setTypeOutcome(typeSearch); /* Обновили state показывающий, какая БД сейчас используется в fetch */

        /* Если выбран поиск по статьям (works) */
        if (typeSearch === 'works') { // 
            urlApi = `http://api.crossref.org/works?query=${encodeURIComponent(searchRequest)}&rows=${numberItems}&offset=${offsetCrossRef}`;
            try {
                let response = await fetch(urlApi, {method: 'GET', cache: "force-cache", headers: headerCrossRef});
                if (response.status === 200) {
                    searchOuput = Object.entries(await response.json());
                    setSearchResults(searchOuput); // Обновили выдачу поиска
                } else {
                    setSearchResults([]);
                    throw "An error occured while searching"
                }
            } catch (error) {
                errorSearch(error);
            }
        /* Если выбран поиск по статьям (sets) */
        } else if (typeSearch === 'sets') {
            urlApi = `https://api.datacite.org/dois?query=${encodeURIComponent(searchRequest)}`;

            fetch(urlApi, {
                method: 'GET',
                cache: "force-cache",
                headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    "Accept": "application/json",
                    "User-Agent": "Kirill (Local beta-testing; mailto:kirill.labutkin@gmail.com) JavaScript/React.js"
                }
            })
            .then(response => response.json())
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
            });
        }
    }
    useEffect(() => {
        if (searchResults.length > 0) {
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
    },[searchResults]); // Если state searchResults изменился, то статус загрузки false и далее отключается анимация загрузки

    /**
     * Функция в случае ошибки fetch api БД 
     * @param {*} error - Текст ошибки из updateQuery() на осн. status
     */
    function errorSearch(error) {
        console.error(error);
    }

    /**
     * Пагинация поискового запроса на основании ссылок из json по API, если fetch происходит по data sets
     */
    function prevPage() {
        if (prevLinks.length > 1) {
            var returnUrl = prevLinks[prevLinks.length - 2]; // Из стейта searchPagination берем предпоследний элемент массива
            fetch(returnUrl, {
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(response => {
                searchOuput = Object.entries(response.data);
                setSearchResults(searchOuput); // Выводим полученный массив в результаты выдачи заменой state
                pagination = Object.entries(response.links); // Обновили из API ссылки для пагинации
                var prevLinksWithoutLast = prevLinks.slice(0,-1);
                console.log("Все кроме последнего" + prevLinksWithoutLast);
                setPrevLinks(prevLinksWithoutLast); // // Убрали последнюю страница из массива ссылок Предыдущая страница
                setNextLinks(pagination[1][1]); // Переписали ссылку для пагинации Следующая страница
                console.log(pagination[1][1]);
            })
        } else {
            console.log(
                "First page"
            );
        }
    }

    /**
     * Пагинация поискового запроса на основании ссылок из json по API, если fetch происходит по data sets
     */
    function nextPage() {
        if (nextLinks === 'no link') {
            console.log("Нет ссылки на следующую страницу");
        } else {
            fetch(nextLinks, {
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(response => {
                searchOuput = Object.entries(response.data);
                setSearchResults(searchOuput); // Выводим полученный массив в результаты выдачи заменой state
                pagination = Object.entries(response.links); // Обновили из API ссылки для пагинации
                setPrevLinks([...prevLinks,pagination[0][1]]); // Добавили текущую страницу в массив страниц Предудущая страница 
                setNextLinks(pagination[1][1]); // Переписали ссылку для пагинации Следующая страница
            })
        }
    }

    /**
     * Открытие полного описания статьи при нажатии на кнопку Показать полное описание
     * @param {*} index - порядковый индекс статьи для определения item
     * @returns 
     */
    const btnFullDesc = (index) => () => {
        setFullDesc(fullDesc => ({
          ...fullDesc,[index]: !fullDesc[index]
        }));
      };
    
    /**
     * Кнопка добавления статьи в закладки пользователя и отправки в БД
     * @param {*} props - идентификатор добавляемой статьи
     */
    function AddBookmark(props) {
        var typeDb = typeSearch;
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
        .then(response => response.json())
        .then((response) => {
            if (response == false) {
                console.log("answer already exist");
            } else {
                setAllBookmarks(response);
            }
        });
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
        .then(response => response.json())
        .then((response) => {
            setAllBookmarks(response);
        });
    }

    /**
     * Генератор цитат статьи
     * @param {*} index - порядковый индекс статьи для определения item
     * @param {*} doi - doi идентификатор статьи
     */
    function OpenCites(index,doi) {
        setCite({});
        var citePopup = document.getElementById("cites-"+index);
        citePopup.classList.toggle('cites--hidden');
        citePopup.classList.toggle('cites--active');
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
        LoadCite(doi);
        setErrorCite(null);
    }

    /**
     * Закрыть модальное окно с цитатами
     */
    function HideCites() {
        var openedPopup = document.querySelector('.cites--active');
        openedPopup.classList.toggle('cites--hidden');
        openedPopup.classList.toggle('cites--active');
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
    }

    /**
     * Кнопка fetch выбранный стиль цитирования с doi по api
     * @param {*} doi - doi идентификатор выбранной статьи для fetch в doi.org
     */
    function LoadCite(doi) {
        if (!cite[chosenStyle]) {
            setStyleLoading(true); // Включаем отображение анимации загрузки
            fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
                redirect: 'follow',
                headers: {
                    "Accept": `text/x-bibliography; style=${chosenStyle}`,
                }
            })
            .then(response => {
                if(response.status === 404) {
                    throw Error('The DOI was not found. It seems that there is no such publication in the DOI database.');
                } else if (response.status !== 200) {
                    throw Error(`Error: ${response.status}. There was a problem receiving a data from the DOI server. Please try again later or try to use a link below (https://citation.crosscite.org/).`);
                } 
                return response.text();
            })
            .then(response => {
                setCite({...cite, [chosenStyle]: response});
            })
            .catch(err => {
                setErrorCite(err.message);
                if ((err.message === "Failed to fetch")) {
                    setErrorCite("The DOI server didn't response. Please try again later.");
                }
            });
        }
    }

    /**
     * Убрать анимацию загрузки после того, как получен ответ от doi
     */
    useEffect(() => {
        setStyleLoading(false); // Выключаем отображение анимации загрузки
        setErrorCite(null); // Стейт наличия ошибки при загрузке items null
    },[cite]);

    /**
     * Изменение стейтов при нажатии на выбор стиля цитирования, записывается loadTag, из json берется loadSyle
     * @param {*} event - элемент по которому кликнули
     */
    function chooseStyle(event) {
        document.querySelectorAll('.cites__li-style').forEach(i => {
            i.classList.remove('cites__li-style--active');
        });
        event.target.classList.add('cites__li-style--active');
        setLoadTag(event.target.getAttribute('data-tag'));
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        setErrorCite(null);
        setStyleLoading(false);
    }

    /**
     * При изменении стейта loadTag (выбрали стиль) записывается chosenStyle. То есть полное наименование стиля для отправки в DOI
     */
    useEffect(() => {
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        setChosenStyle(loadStyle);
    },[loadTag]);

    /**
     * При нажатии на кнопку Скопировать в буфер (копируем цитату в модальном окне)
     */
    function copyCite(index) {
        navigator.clipboard.writeText(citeText.current.textContent);
        var copiedSpan = document.getElementById('ccs-'+index);
        copiedSpan.classList.add('copied--active');
        setTimeout(closeCopySpan, 2000);
        function closeCopySpan() {
            copiedSpan.classList.remove('copied--active');
        }
    }

    /**
     * Скопировать doi внизу модального окна
     * @param {*} event - элемент по которому произошел клик
     */ 
    function copyDoi(event) {
        navigator.clipboard.writeText(event.target.parentNode.querySelector('.cites__text-doi').textContent);
        var copiedDoiSpan = event.target.parentNode.querySelector('.doi-copied-span');
        copiedDoiSpan.classList.add('doi-copied-span--active');
        setTimeout(closeCopyDoi, 2000);
        function closeCopyDoi () {
            copiedDoiSpan.classList.remove('doi-copied-span--active');
        }
    }

    /**
     * Открыть список IDentifiers
     * @param {*} index - порядковый номер item в массиве
     * @param {*} event - элемент по которому произошел клик
     */ 
    function openListIds(index,event) {
        event.stopPropagation();
        var btnIdents = event.target;
        var identList = document.getElementById('idents-' + index);
        if (btnIdents.classList.contains('light-open--active')) {
            btnIdents.querySelector('span').textContent = "Open full list";
        } else {
            btnIdents.querySelector('span').textContent = "Close list";
        }
        identList.classList.toggle('search-item__list-idents--active');
        btnIdents.classList.toggle('light-open--active');
        btnIdents.querySelector('svg').style.transform = 'rotate(180deg)';
    }

    /**
     * Открыть список subjects 
     * @param {*} index - порядковый номер item в массиве
     * @param {*} event - элемент по которому произошел клик
     */
    function OpenSubjects(index,event) {
        event.stopPropagation();
        var subjectList = document.getElementById('subjects-'+index);
        var btnSubjects = event.target;
        if (btnSubjects.classList.contains('sm-btn-sec--active')) {
            btnSubjects.querySelector('span > span').textContent = "Show subjects";
        } else {
            btnSubjects.querySelector('span > span').textContent = "Hide subjects";
        }
        btnSubjects.classList.toggle('sm-btn-sec--active');
        subjectList.classList.toggle('search-item__tags--hidden');
    }

    return (
        <div className='main'>
            <div className='search'>
                <div className='search__query'>
                    <SearchFilters 
                        passSetTextOutput={setTextOutput}
                        passQueryStarted={queryStarted}
                        passUpdateQuery={updateQuery}
                        passSetTypeSearch={setTypeSearch}
                        />
                    {!queryStarted ? 
                    // Развилка по компонентам, в зависимости по какой базе мы ищем. Смотри state typeSearch и typeOutcome
                    typeOutcome == 'works' ? 
                    <CrossRef
                        passSearchResults={searchResults}
                        passAllBookmarks={allBookmarks}
                        passRemoveBookmark={RemoveBookmark}
                        passAddBookmark={AddBookmark}
                        passOpenListIds={openListIds}
                        passOpenCites={OpenCites}
                        paginateCrossRef={paginateCrossRef}
                        offsetCrossRef={offsetCrossRef}
                        itemsNum={itemsNum}
                        setItemsNum={setItemsNum}
                        goToPage={goToPage}
                    /> :
                    <div className='search__results'>
                        {(prevLinks.length > 1 || nextLinks !== 'no link') ?
                            <div className='search__top-pagination'>
                                <button className={`search__prev-link pagination ${prevLinks.length < 2 && 'search__prev-link--inactive'}`} onClick={() => prevPage()}><FaChevronLeft />Previous page</button>
                                <button className='search__next-link pagination' onClick={() => nextPage()}>Next page<FaChevronRight /></button>
                            </div>
                            : null
                        }
                        <div className='modal-bgn modal-bgn--hidden' onClick={() => HideCites()}></div>

                        {/* LOADER и ожидание поискового запроса */}
                        {searchResults == '' ? !queryStarted ? 
                                <div className='search__waiting'>
                                        <h3 className='search__h-waiting'>Please type your search request in Search form</h3>
                                        <div className='search__image-waiting'><WaitingSvg /></div>
                                </div>
                                : 
                                <div className='search__container-loader'>
                                    <div className='search__loader'></div>
                                </div>
                        : searchResults.map((item,index) => 
                            <div key={index} className='search-item block'>
                                {/* TITLE */}
                                <h3 className='search-item__title'>
                                    {item.attributes.titles ? 
                                        item.attributes.titles.length > 0 ? 
                                            item.attributes.titles[0].title 
                                            : <span>No title provided</span> 
                                        : <span>No title provided</span>
                                    }
                                </h3> 

                                {/* AUTHOR */}
                                <div className='search-item__author'>
                                    {item.attributes.creators ?
                                        item.attributes.creators.length > 0 ?
                                            item.attributes.creators.map((item,subindex) => {
                                                return (
                                                    <span key={"author-"+index+"-"+subindex}>{item.name}</span>
                                                );
                                            })
                                        : "No information about the authors provided"
                                    : "No information about the authors provided" }
                                </div>
                                
                                {/* PUBLISHER */}
                                <div className='search-item__publisher'>
                                    <span>
                                        {item.attributes.publisher ? item.attributes.publisher : "No information about the publisher provided"}
                                    </span>
                                    <span className='search-item__year'>
                                        {item.attributes.publicationYear ? item.attributes.publicationYear : "No publication date provided"}
                                    </span>
                                    {item.attributes.url ?
                                    <span className='search-item__url'><a href={item.attributes.url} target="_blank" rel="noopener noreferrer" className='link-out'>Publication source<FaExternalLinkAlt /></a></span>
                                    : null}
                                    {/*  LANG  AND TYPE */}
                                    <div className='search-item__flags'>
                                        {item.attributes.types ? item.attributes.types.resourceTypeGeneral ? <span className='tag'>{item.attributes.types.resourceTypeGeneral}</span> : null : null}
                                        {item.attributes.language == null ? null : <span className='tag'>{item.attributes.language}</span>}
                                    </div>
                                </div>


                                {/* ABSTRACT */}
                                <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>
                                    
                                    {item.attributes.descriptions ? item.attributes.descriptions.length > 0 ?
                                    item.attributes.descriptions.map((item,subindex) => {
                                        abstractCombine = (item.descriptionType + ": " + item.description)
                                        return (
                                            <span key={"abstract-"+index+"-"+subindex}>
                                                {fullDesc[index] ? 
                                                <CSSTransition 
                                                classNames="slide"
                                                timeout={1100}
                                                in={true}
                                                appear={true}>
                                                    <span>{abstractCombine}</span>
                                                </CSSTransition>
                                                : abstractCombine.substring(0, 650)+"..." }
                                            </span>
                                        )
                                    })
                                    : <span>No description provided</span> : <span>No description provided</span>}
                                </div>
                                

                                <div className='search-item__ref-container'>  
                                    {/* ADD TO BOOKMARKS */}

                                    {allBookmarks != null ?
                                        allBookmarks.some(i => item.id == i.doi) ?
                                        <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => RemoveBookmark(item.id)} >
                                            <span><FaStar />Delete Bookmark</span>
                                        </button>
                                        : 
                                        <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item)} >
                                            <span><FaRegStar />Add Bookmark</span>
                                        </button>
                                    :  
                                    <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item)} >
                                        <span><FaRegStar />Add Bookmark</span>
                                    </button>}

                                    {/* CITE */}
                                    <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={() => OpenCites(index,item.id)}>
                                        <span><RiDoubleQuotesL />Cite this work</span>
                                    </button>

                                    
                                    {(item.attributes.subjects && item.attributes.subjects.length > 0) ? 
                                        <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={(event) => OpenSubjects(index,event)}><span><AiOutlineTag /><span>Show subjects</span></span></button> :
                                        null
                                    }

                                    {/* REFERENCES */}
                                    {/* {item.attributes.relatedIdentifiers ? item.attributes.relatedIdentifiers.length > 0 ? 
                                    <button className='search-item__ref-button sm-btn sm-btn-sec' onClick={(event) => {showRefLinks(index,event)}} >
                                        {btnLinks[index] ?
                                        <span><FiLink2 /> Close cite list<span className='search-item__refs-counter'>{item.attributes.relatedIdentifiers.length}</span></span>
                                        : <span><FiLink2 /> Open cite list<span className='search-item__refs-counter'>{item.attributes.relatedIdentifiers.length}</span></span>
                                        }
                                        
                                    </button> : null : null }   */}

                                    {/* FULL DESC */}
                                    {abstractCombine.length > 650 ? 
                                        <button className='search-item__btn-abstract sm-btn sm-btn-sec' onClick={btnFullDesc(index)}>
                                            {fullDesc[index] ? 
                                            <span><FiArrowUp />Hide full description</span>
                                            : <span><FiArrowDown />Show full description</span>}
                                        </button>
                                    : null}
                                    
                                </div>
                                
                                {/* CITATION POPUP MODAL */}
                                <div id={"cites-"+index} className='cites cites--hidden'>

                                    <div className='cites__heading'>
                                        <h4>DOI Citation Formatter</h4>
                                        <span className='cites__close' onClick={() => HideCites()}><GrClose /></span>
                                    </div>

                                    <div className='cites__attr'>
                                        <div className='cites__title'>
                                            <span className='cites__span-title'>
                                                {item.attributes.titles ? 
                                                item.attributes.titles.length > 0 ? 
                                                    item.attributes.titles[0].title 
                                                    : <span>No title provided</span> 
                                                : <span>No title provided</span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className='cites__choose-style'>    

                                        <div className='cites__box-styles'>

                                            <ul className='cites__list-style'>   
                                                {CiteStyles.map((st,subindex) => {
                                                    return (
                                                        <li data-tag={`${st.tag}`} className={`cites__li-style ${st.tag == loadTag ? 'cites__li-style--active' : 'cites__li-style--inactive'}`} key={subindex} onClick={(event) => chooseStyle(event)}>
                                                            {st.title}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <button className={`cites__btn-reload sm-btn ${cite[chosenStyle] ? "cites__btn-reload--loaded" : ''}`} onClick={() => LoadCite(item.id)}>
                                                {cite[chosenStyle] ? "Loaded" : !errorCite ? "Load citation" : "Reload"}
                                            </button>
                                            {(!cite[chosenStyle] && !styleLoading) ? <div className='cites__arrow'><BsArrowUp /></div> : null}
                                        </div>
                                    </div>

                                    <div className='cites__style'>

                                        <div className='cites__output'>
                                                {errorCite ? errorCite :
                                                    styleLoading ?  <div className='loader-container'><span className='loader'></span></div> 
                                                        : cite[chosenStyle] ? 
                                                            <CSSTransition 
                                                            classNames="ease"
                                                            timeout={1000}
                                                            in={true}
                                                            appear={true}>
                                                                <div className='cites__cite' ref={citeText}>{cite[chosenStyle]}</div>
                                                            </CSSTransition>
                                                            : <div className='cites__action'>Please, press Load citation button to upload this citation style.</div>
                                                }

                                        </div>

                                        <div className='cites__cont-copy'>
                                            <span className='cites__desc-style'>
                                                {CiteStyles.find(elem => elem.tag === loadTag).desc}
                                            </span>
                                            <a className='cites__about-style link-out-question' href={CiteStyles.find(elem => elem.tag == loadTag).link} target='_blank' rel='noopener noreferrer'><BsQuestionCircle />More details</a>
                                            {(errorCite || styleLoading || !cite[chosenStyle]) ? null :
                                                <button className='cites__btn-copy sm-btn sm-btn--sm' onClick={() => copyCite(index)}><span><ImCopy />Copy to Clipboard</span></button>
                                            }   
                                                <span id={`ccs-${index}`} className='copied'>This citation was copied</span>
                                            </div>             
                                    </div>

                                    <div className='cites__ad-cont'>
                                        <span className='cites__ad-text'>Need more styles of citation? Paste the article DOI to this link <a className='link-out-question' href='https://citation.crosscite.org/' target='_blank' rel='noopener noreferrer'>crosscite.org<FaExternalLinkAlt /></a></span>
                                    </div>
                                    <div className='cites__cont-doi'>
                                        <div className='cites__cont-doi-inner'>
                                            <span className='cites__h-doi'>DOI</span>
                                            <span className='cites__text-doi'>{item.id}</span>
                                            <span className='cites__copy-doi' onClick={(event) => copyDoi(event,index)}><ImCopy />Copy</span>
                                            <span className='doi-copied-span'>Doi in your clipboard</span>
                                        </div>
                                    </div>

                                </div>
                                
                                {/* Список цитируемых работ или работ где цитируется, их тысячи для каждого item, грузит сервер и не все в формте doi */}
                                {/* {item.attributes.relatedIdentifiers ?
                                            <div  id={"refs-links-"+index} className='search-item__references'>
                                                {item.attributes.relatedIdentifiers.map((item,subindex) => {
                                                    return (
                                                        <div className='search-item__ref-links' key={"ref-type-"+index+"-"+subindex} >
                                                            <span>{item.relatedIdentifierType}</span>
                                                            <span>{item.relatedIdentifier}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            : null} */}

                                {/* IDENTIFIERS */}
                                <div className='search-item__identifiers'>
                                        <span className='search-item__id-type'>DOI</span>
                                        <span className='search-item__id-number'>{item.attributes.doi ? item.attributes.doi : "No DOI provided"}</span>
                                        {item.attributes.identifiers ? item.attributes.identifiers.length !== 0 ? <button className='search-item__open-id-list light-open' onClick={(event) => openListIds(index,event)}><span>Open full list</span><RiArrowDownSLine /></button> : null : null }
                              
                                    {item.attributes.identifiers ?
                                        item.attributes.identifiers.length === 0 ? null :
                                            <div id={'idents-' + index} className='search-item__list-idents'>
                                                {item.attributes.identifiers.map((item,subindex) => {
                                                    return (
                                                        <p key={"id-type-"+index+"-"+subindex}>
                                                            <span className='search-item__id-type'>
                                                                {item.identifierType ? item.identifierType : "No ID Type"}
                                                            </span>
                                                            <span className='search-item__id-number'>
                                                                {item.identifier ? item.identifier : "No ID Number"}
                                                            </span>
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                    : null
                                    }
                                </div>
                                
                                {/* RIGHTS */}
                                <div className='search-item__rights'>
                                    {item.attributes.rightsList.length > 0 ? item.attributes.rightsList[0].rights : <p>No attribution provided. Please visit a publication source website.</p>}
                                    {item.attributes.rightsList.length > 0 ? <a href={item.attributes.rightsList[0].rightsUri} target="_blank" rel="noopener noreferrer">About this attribution <FiExternalLink /></a> : null}
                                </div>
                                
                                {/* TAGS */}
                                {item.attributes.subjects ?
                                    item.attributes.subjects.length > 0 ?
                                        <div id={'subjects-'+index} className='search-item__tags search-item__tags--hidden'>
                                            {item.attributes.subjects.map((item,subindex) => {
                                                return (
                                                    <span className='sm-tag' key={"subject-"+index+"-"+subindex}>{item.subject}</span>
                                                );
                                            })}
                                        </div>
                                    : null
                                : null}
                                
                            </div> 
                        )}

                        {(prevLinks.length > 1 || nextLinks !== 'no link') ?
                            <div className='search__bottom-pagination'>
                                <button className={`search__prev-link pagination ${prevLinks.length < 2 && 'search__prev-link--inactive'}`} onClick={() => prevPage()}><FaChevronLeft />Previous page</button>
                                <button className='search__next-link pagination' onClick={() => nextPage()}>Next page<FaChevronRight /></button>
                            </div>
                            : null
                        }
                    </div>

                    : 
                    <div className='search__results'>
                        <div className='search__container-loader'>
                            <div className='search__loader'></div>
                        </div>
                    </div>}
                    
                </div>
            </div>
        </div>
    );
 
}
    
export default Search;