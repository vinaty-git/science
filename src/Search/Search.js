import React, { useEffect, useState, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SearchFilters from './SearchFilters';
import CrossRef from './CrossRef';
import { ReactComponent as WaitingSvg } from '../icons/waiting.svg';
import { CiteStyles } from '../Cites/DataCitesStyles.js';
// import jsonData from "../data/SearchAPI";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import { FiArrowUp } from "react-icons/fi";
import { FiArrowDown } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
// import { FiLink2 } from "react-icons/fi";
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
    let citeText = React.useRef(); // Реф для нахождения поля с текстом цитаты для копирования в буфер пользователя

    // Все States и переменные
    var searchOuput; // Поисковая выдача переменная для получения ответа по API
    const [typeSearch,setTypeSearch] = useState('sets'); // State для определения базы по которой ищем ДО запуска
    const [typeOutcome, setTypeOutcome] = useState(''); // State для определения базы по которой ищем ПОСЛЕ запуска

    var pagination = []; // Сюда будем записывать обе ссылки полученные по api
    // var paginationUrl; // URL куда мы позднее подставим ссылку в пагинации
    let abstractCombine = []; // Переменная для суммирования описаний статьи и дальнейшего подсчета знаков
    const [queryStarted,setQueryStarted] = useState(false); // Поисоковй запрос инициализирован
    const [fullDesc,setFullDesc] = useState({}); // State для показа полного описания статьи true - показать полное, false - короткое
    const [textOutput,setTextOutput] = useState(""); // State поискового запроса
    // const [btnLinks,setBtnLinks] = useState({}); // State раскрытия ссылок на цитируемые статьи
    const [searchResults,setSearchResults] = useState([]); // Поисковая выдача записывается в этот state (все статьи)
    // var entries = Object.entries(jsonData.data);
    const [errorCite,setErrorCite] = useState(null); // Стейт для ошибки при fecth стиля цитирования
    
    const [prevLinks, setPrevLinks] = useState([]); // State где будем хранить все пролистанные страницы, чтобы вернуться к ним по пагинации
    const [nextLinks, setNextLinks] = useState('no link'); // State для страницы Следующая страница в поисковой выдаче
    
    const [allBookmarks, setAllBookmarks] = useState([]); // State закладок добавленных пользователем получаемых из БД
    const [cite,setCite] = useState({}); // Стили цицитирования загруженные в генераторе цитирования
    var loadStyle; // Загруженный текущий стиль цитирования в модальном окне
    var urlApi;// Объявили пустую переменную, в функции добавили в нее url для API
    // const [currentApi,setCurrentApi] = useState(null); 
    const [loadTag,setLoadTag] = useState('apa'); // State того, что нажато из списка стилей цитирования (тег)
    const [chosenStyle,setChosenStyle] = useState('apa'); // Стиль цитирования для API (полный)
    const [styleLoading, setStyleLoading] = useState(false); // Статус загрузки fetch стилей цитирования для показа загрузки

    //  Получение данных из БД о наличии bookmarks для User id 2
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

    // Отправляем fetch с поисковым запросом на основании textOutput
    function updateQuery() {
        setQueryStarted(true);
        var searchRequest = textOutput; // Взяли из state, что ввел пользователь
        setTypeOutcome(typeSearch);
        if (typeSearch === 'works') { // Если выбран поиск по статьям (works)
            urlApi = `http://api.crossref.org/works?query=${encodeURIComponent(searchRequest)}`;
            fetch(urlApi, {
                method: 'GET',
                cache: "force-cache",
                headers: {
                    // "Content-type": "application/json;charset=UTF-8",
                    "Accept": "application/json",
                    "User-Agent": "Kirill (Local beta-testing; mailto:kirill.labutkin@gmail.com) JavaScript/React.js"
                }
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                searchOuput = Object.entries(response);
                setSearchResults(searchOuput); // Обновили выдачу поиска
            });
        } else if (typeSearch === 'sets') { // Если выбран поиск по datasets (common api))
            urlApi = `https://api.datacite.org/dois?query=${encodeURIComponent(searchRequest)}`; // Подставили в api

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
                searchOuput = Object.entries(response.data); // Получили json поисковой выдачи
                pagination = Object.entries(response.links); // Получили массив ссылок для пагинации
                
                setPrevLinks([urlApi]); // Отчистили стейт всех предыдущих страниц (пагинация) и добавили текущую страницу
                if (pagination.length > 1) {
                    setNextLinks(pagination[1][1]); // Получили ссылку пагинации при первичной загрузке Следующая страницу
                } else {
                    setNextLinks('no link');
                }
                setSearchResults(searchOuput); // Обновили выдачу поиска 
                // console.log(response.data);
            });
        }
    }
    useEffect(() => {
        if (searchResults.length > 0) {
            setQueryStarted(false);
        }
    },[searchResults]); // Если state searchResults изменился, то статус загрузки false и далее отключается анимация загрузки


    ////// PAGINATION //////

    // Пагинация поискового запроса на основании ссылок из json по API, где ссылка вперед задана, а обратную берем из стейта
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

    // Следующая страница в пагинации
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

    // Кнопка открыть ссылки references Временно убрал, не удалять
    // const showRefLinks = (index,event) => {
    //     let reference = document.getElementById("refs-links-"+index);
    //     reference.classList.toggle("search-item__references--show");
    //     event.target.classList.toggle('sm-btn-sec--active');
    //     setBtnLinks(btnLinks => ({
    //         ...btnLinks,[index]:!btnLinks[index]
    //     }));
    // }

    // Открытие полного описания статьи
    const btnFullDesc = (index) => () => {
        setFullDesc(fullDesc => ({
          ...fullDesc,[index]: !fullDesc[index]
        }));
      };
    
    // Кнопка добавления статьи в закладки пользователя и отправки в БД
    function AddBookmark(props) {
        const queryAddBookmark = {
            "data": "addBookmark",
            "id": 2,
            "bookmark": props
        };
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryAddBookmark)
        })
        .then(response => response.json())
        .then((response) => {
            if (response == false) {
                console.log("answer alredy exist");
            } else {
                setAllBookmarks(response);
            }
        });
    }

    // Кнопка удаления закладки из БД 
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

    // ГЕНЕРАТОР ЦИТАТ МОДАЛЬНОЕ ОКНО
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

    // Закрыть модальное окно с цитатами
    function HideCites() {
        var openedPopup = document.querySelector('.cites--active');
        openedPopup.classList.toggle('cites--hidden');
        openedPopup.classList.toggle('cites--active');
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
    }

    //Кнопка fetch выбранный стиль цитирования с doi по api
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

    // Убрать анимацию загрузки после того, как получен ответ от doi
    useEffect(() => {
        setStyleLoading(false); // Выключаем отображение анимации загрузки
        setErrorCite(null); // Стейт наличия ошибки при загрузке items null
    },[cite]);

    // Изменение стейтов при нажатии на выбор стиля цитирования, записывается loadTag, из json берется loadSyle
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

    // При изменении стейта loadTag (выбрали стиль) записывается chosenStyle. То есть полное наименование стиля для отправки в DOI
    useEffect(() => {
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        setChosenStyle(loadStyle);
    },[loadTag]);

    // При нажатии на кнопку Скопировать в буфер (копируем цитату в модальном окне)
    function copyCite(index) {
        navigator.clipboard.writeText(citeText.current.textContent);
        var copiedSpan = document.getElementById('ccs-'+index);
        copiedSpan.classList.add('copied--active');
        setTimeout(closeCopySpan, 2000);
        function closeCopySpan() {
            copiedSpan.classList.remove('copied--active');
        }
    }
    // Скопировать doi внизу модального окна 
    function copyDoi(event) {
        navigator.clipboard.writeText(event.target.parentNode.querySelector('.cites__text-doi').textContent);
        var copiedDoiSpan = event.target.parentNode.querySelector('.doi-copied-span');
        copiedDoiSpan.classList.add('doi-copied-span--active');
        setTimeout(closeCopyDoi, 2000);
        function closeCopyDoi () {
            copiedDoiSpan.classList.remove('doi-copied-span--active');
        }
    }

    // Открыть список IDentifiers 
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

    // Открыть список subjects 
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
                        FaChevronLeft={<FaChevronLeft />}
                        FaChevronRight={<FaChevronRight />}
                        passSearchResults={searchResults}
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
                                    {item[1].attributes.titles ? 
                                        item[1].attributes.titles.length > 0 ? 
                                            item[1].attributes.titles[0].title 
                                            : <span>No title provided</span> 
                                        : <span>No title provided</span>
                                    }
                                </h3> 

                                {/* AUTHOR */}
                                <div className='search-item__author'>
                                    {item[1].attributes.creators ?
                                        item[1].attributes.creators.length > 0 ?
                                            item[1].attributes.creators.map((item,subindex) => {
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
                                        {item[1].attributes.publisher ? item[1].attributes.publisher : "No information about the publisher provided"}
                                    </span>
                                    <span className='search-item__year'>
                                        {item[1].attributes.publicationYear ? item[1].attributes.publicationYear : "No publication date provided"}
                                    </span>
                                    {item[1].attributes.url ?
                                    <span className='search-item__url'><a href={item[1].attributes.url} target="_blank" rel="noopener noreferrer" className='link-out'>Publication source<FaExternalLinkAlt /></a></span>
                                    : null}
                                    {/*  LANG  AND TYPE */}
                                    <div className='search-item__flags'>
                                        {item[1].attributes.types ? item[1].attributes.types.resourceTypeGeneral ? <span className='tag'>{item[1].attributes.types.resourceTypeGeneral}</span> : null : null}
                                        {item[1].attributes.language == null ? null : <span className='tag'>{item[1].attributes.language}</span>}
                                    </div>
                                </div>


                                {/* ABSTRACT */}
                                <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>
                                    
                                    {item[1].attributes.descriptions ? item[1].attributes.descriptions.length > 0 ?
                                    item[1].attributes.descriptions.map((item,subindex) => {
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
                                        allBookmarks.some(i => item[1].id == i.doi) ?
                                        <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => RemoveBookmark(item[1].id)} >
                                            <span><FaStar />Delete Bookmark</span>
                                        </button>
                                        : 
                                        <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item[1])} >
                                            <span><FaRegStar />Add Bookmark</span>
                                        </button>
                                    :  
                                    <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item[1])} >
                                        <span><FaRegStar />Add Bookmark</span>
                                    </button>}

                                    {/* CITE */}
                                    <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={() => OpenCites(index,item[1].id)}>
                                        <span><RiDoubleQuotesL />Cite this work</span>
                                    </button>

                                    
                                    {(item[1].attributes.subjects && item[1].attributes.subjects.length > 0) ? 
                                        <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={(event) => OpenSubjects(index,event)}><span><AiOutlineTag /><span>Show subjects</span></span></button> :
                                        null
                                    }

                                    {/* REFERENCES */}
                                    {/* {item[1].attributes.relatedIdentifiers ? item[1].attributes.relatedIdentifiers.length > 0 ? 
                                    <button className='search-item__ref-button sm-btn sm-btn-sec' onClick={(event) => {showRefLinks(index,event)}} >
                                        {btnLinks[index] ?
                                        <span><FiLink2 /> Close cite list<span className='search-item__refs-counter'>{item[1].attributes.relatedIdentifiers.length}</span></span>
                                        : <span><FiLink2 /> Open cite list<span className='search-item__refs-counter'>{item[1].attributes.relatedIdentifiers.length}</span></span>
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
                                                {item[1].attributes.titles ? 
                                                item[1].attributes.titles.length > 0 ? 
                                                    item[1].attributes.titles[0].title 
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
                                            <button className={`cites__btn-reload sm-btn ${cite[chosenStyle] ? "cites__btn-reload--loaded" : ''}`} onClick={() => LoadCite(item[1].id)}>
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
                                            <span className='cites__text-doi'>{item[1].id}</span>
                                            <span className='cites__copy-doi' onClick={(event) => copyDoi(event,index)}><ImCopy />Copy</span>
                                            <span className='doi-copied-span'>Doi in your clipboard</span>
                                        </div>
                                    </div>

                                </div>
                                
                                {/* Список цитируемых работ или работ где цитируется, их тысячи для каждого item, грузит сервер и не все в формте doi */}
                                {/* {item[1].attributes.relatedIdentifiers ?
                                            <div  id={"refs-links-"+index} className='search-item__references'>
                                                {item[1].attributes.relatedIdentifiers.map((item,subindex) => {
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
                                        <span className='search-item__id-number'>{item[1].attributes.doi ? item[1].attributes.doi : "No DOI provided"}</span>
                                        {item[1].attributes.identifiers ? item[1].attributes.identifiers.length !== 0 ? <button className='search-item__open-id-list light-open' onClick={(event) => openListIds(index,event)}><span>Open full list</span><RiArrowDownSLine /></button> : null : null }
                              
                                    {item[1].attributes.identifiers ?
                                        item[1].attributes.identifiers.length === 0 ? null :
                                            <div id={'idents-' + index} className='search-item__list-idents'>
                                                {item[1].attributes.identifiers.map((item,subindex) => {
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
                                    {item[1].attributes.rightsList.length > 0 ? item[1].attributes.rightsList[0].rights : <p>No attribution provided. Please visit a publication source website.</p>}
                                    {item[1].attributes.rightsList.length > 0 ? <a href={item[1].attributes.rightsList[0].rightsUri} target="_blank" rel="noopener noreferrer">About this attribution <FiExternalLink /></a> : null}
                                </div>
                                
                                {/* TAGS */}
                                {item[1].attributes.subjects ?
                                    item[1].attributes.subjects.length > 0 ?
                                        <div id={'subjects-'+index} className='search-item__tags search-item__tags--hidden'>
                                            {item[1].attributes.subjects.map((item,subindex) => {
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