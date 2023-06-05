import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import CiteModal from '../components/search/CiteModal';
import Spinner from '../components/Spinner';
import '../styles/library.scss';

import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { FaExternalLinkAlt, FaStar, FaChevronLeft,FaChevronRight } from "react-icons/fa";
import { RiDoubleQuotesL, RiArrowDownSLine } from "react-icons/ri";
import { AiOutlineTag } from "react-icons/ai";

function Library() {
    const [listBookmarks,setListBookmarks] = useState();
    const [loading, setLoading] = useState(true);
    const [fullDesc,setFullDesc] = useState({}); // В каких item открыто full desc. Index: true/false
    const [openedCites,setOpenedCites] = useState({}); // State текущего открытого модального окна с Citation formatter
    // const [typeOutcome, setTypeOutcome] = useState(''); // State для определения базы по которой ищем ПОСЛЕ запуска
    const [currentLibrary,setCurrentLibrary] = useState('works');
    // const [containerSize, setContainerSize] = useState('static')

    let firstInit = React.useRef(true);
    var userId = 2; // Temporary user id 

    useEffect(()=>{
        document.querySelector('body').scrollTo(0,0);
    },[]);

    /**
     * Открыть список subjects для DB Commons только
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
     * Кнопка удаления закладки из БД 
     * @param {*} props - идентификатор удаляемой статьи
     */
    function RemoveBookmark(props,event) {
        var thisItem = event.target.parentNode.parentNode;
        thisItem.classList.add('search__item-container--hidden');

        thisItem.addEventListener("transitionend",() => {
            setTimeout(() => {
                thisItem.classList.add('search__item-container--removed');
            },100);
        })
        const queryRemoveBookmark = {
            "data": "removeBookmark",
            "id": 2,
            "doi": props
        }
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryRemoveBookmark)
        })
        // .then(response => response.json())
        // .then((response) => {
        //     // setAllBookmarks(response);
        //     GetBookmarks();
        // });
    }

    /**
     * При нажатии инициализирует модальное окно Citation formatter
     * @param {*} index - Index of the item from array allItems
     */
        function InitCitation(index) {
        openedCites[index] ?
        setOpenedCites({})
        :
        setOpenedCites({[index]: true})
    }

    /**
     * Switch between description length
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function btnFullDesc(index) {
        setFullDesc(fullDesc => ({
            ...fullDesc,[index]: !fullDesc[index]
        }));
    }

    /**
     * Get list of bookmarks
     */
    
    function GetBookmarks() {
        setLoading(true);
        const bookmarkLibrary = {
            "data": "bookmarkLibrary",
            "id": userId
        };
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(bookmarkLibrary)
        })
        .then(response => response.json())
        .then(response => {
            setListBookmarks(response);
        })
    }
    useEffect(() => {
        GetBookmarks();
    },[])
    
    /**
     * If listBookmarks loaded -> disable loading
     */
    useEffect(() => {
        if (firstInit.current === true) {
            firstInit.current = false;
        } else {
            setLoading(false);
        }
    },[listBookmarks]);

    /**
     * Change library source
     * @param {*} event 
     */
    function changeLibrary(event) {
        event.stopPropagation();
        var dataType = event.target.getAttribute('data-type');
        var allTypes = document.querySelectorAll('.search__btn-type');
        allTypes.forEach(item => {item.classList.remove('sm-btn-sec--active')});
        event.target.classList.add('sm-btn-sec--active');
        setCurrentLibrary(dataType);
    }

    /**
     * Catch errors and store in DB while loop bookmarks
     * @param {*} tempItem 
     */
    // function errorLog(tempItem,error_doi,error_text) {
    //     const errorHandler = {
    //         "data": "errorHandler",
    //         "id": userId,
    //         "location": "Library",
    //         "error_doi": error_doi,
    //         "error": tempItem,
    //         "error_text": error_text,
    //     };
    //     fetch('https://kirilab.ru/science/func.php', {
    //         method: 'POST',
    //         body: JSON.stringify(errorHandler)
    //     })
    // }

    /**
     * Header of Itme in Library
     * @param {*} item 
     * @param {*} index 
     * @returns {JSX.Element}
     */
    function Header(item, index) {
        return (
            <>
                <h3 key={"title-" + index} className="search-item__title">
                    {item.title}
                </h3>

                <div key={"authors-" + index} className="search-item__author">
                    <span className="search-item__names-author">
                        {item.author}
                    </span>
                </div>

                <div key={"publisher" + index} className="search-item__publisher">

                    <span>
                        {item.publisher}
                    </span>

                    <span className="search-item__year">
                        {item.year}
                    </span>

                    {item.url !== '' ?
                        <span className='search-item__url'>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className='link-out'>
                                Publication source<FaExternalLinkAlt />
                            </a>
                        </span>
                    : null}

                    <div className='search-item__flags'>
                        {item.type !== '' ?
                            <span className='tag'>
                                {item.type}
                            </span>
                        : null}

                        {item.lang !== '' ?
                            <span className='tag'>
                                {item.lang}
                            </span>
                        : null}
                    </div>
                </div>
            </>
        );
    }

    /**
     * Short or Full Description in Library (item)
     * @param {*} item 
     * @param {*} index 
     * @returns {JSX.Element}
     */
    function Description(item,index) {
        var desc = item.description;
        var descFull;
        if (desc) {
            if (desc.length > 700) {
                descFull = desc;
                desc = desc.substring(0, 700)+"...";
            }
        } else {
            desc = "No description provided";
        }
        return (
            <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>                     
                {fullDesc[index] ? 
                    <CSSTransition 
                    classNames="slide"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span >{descFull}</span>
                    </CSSTransition>
                : desc}
            </div>
        );
    }

    /**
     * Buttons of the item
     * @param {*} item 
     * @param {*} index 
     * @returns {JSX.Element}
     */
    function Buttons(item,index) {
        return (

            <div className='search-item__ref-container'>
                
                <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={(event) => RemoveBookmark(item.doi,event)} >
                    <span><FaStar />Delete Bookmark</span>
                </button>

                {openedCites[index] ? 
                <CiteModal 
                item={item}
                index={index}
                InitCitation={InitCitation}
                Library={true}
                />
                : null
                }

                <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={() => InitCitation(index)}>
                    <span><RiDoubleQuotesL />Cite this work</span>
                </button>

                {Object.keys(item.subjects).length !== 0 ?
                    <button 
                        className='search-item__cites-button sm-btn sm-btn-sec' 
                        onClick={(event) => OpenSubjects(index,event)}>
                        <span>
                            <AiOutlineTag /><span>Show subjects</span>
                        </span>
                    </button> 
                : null}

                {item.description.length  > 700 ? 
                    <button className='search-item__btn-abstract sm-btn sm-btn-sec' onClick={() => btnFullDesc(index)}>
                        {fullDesc[index] ? 
                        <span><FiArrowUp />Hide full description</span>
                        : <span><FiArrowDown />Show full description</span>}
                    </button>
                : null}

            </div>
        );
    }

    function Footer(item,index) {
        return (
            <>
            <div className='search-item__identifiers'>

                <span className='search-item__id-type'>DOI</span>
                <span className='search-item__id-number'>
                    {item.doi ? item.doi : "No DOI provided"}
                </span>

                {(item.isbn || item.issn) ? 
                    <button 
                        className='search-item__open-id-list light-open' 
                        onClick={(event) => openListIds(index,event)}>
                            <span>Open full list</span><RiArrowDownSLine />
                    </button>
                : null}

                {(item.isbn || item.issn) ?
                    <div id={'idents-' + index} className='search-item__list-idents'>
                        {item.isbn ?
                            <p><span className='search-item__id-type'>ISBN</span>
                                <span className='search-item__id-number'>{item.isbn}</span></p>
                        :null}
                        {item.issn ?
                            <p><span className='search-item__id-type'>ISSN</span>
                                <span className='search-item__id-number'>{item.issn}</span></p>
                        :null}
                    </div>
                : null}

            </div>

            {item.subjects ?
                <div id={'subjects-'+index} className='search-item__tags search-item__tags--hidden'>
                    {item.subjects.split(',').map((item,subindex) => {
                        return (
                            item ?
                            <span className='sm-tag' key={"subject-"+index+"-"+subindex}>
                                {item}
                            </span>
                            : null
                        );
                    })}
                </div>
            : null }
            
            </>
        );
    }
    /**
     * Pagination of search results Common DataCite
     * @returns {JSX.Element}
     */
    // function pagination() {
    //     return (
    //     <div className="search__top-pagination">
    //         <button
    //             className='search__prev-link pagination search__prev-link--inactive'>
    //             <FaChevronLeft />Previous page
    //         </button>

    //         <button
    //             className="search__next-link pagination">
    //             Next page<FaChevronRight />
    //         </button>

    //     </div>
    //     );
    // }

    return(
        
        <div className="main library">

            <div className="library__heading block">
                <h2>Library</h2>
                <p>In the library section stored all you bookmarks. You can add new bookmarks in the Search section.</p>
                <div>
                    {/* <h4>Switcher</h4> */}
                    <div className='search__btn-types'>
                        <button data-type='works' className='search__btn-type sm-btn-sec sm-btn-sec--active' onClick={(event) => changeLibrary(event)}>Works</button>
                        <button  data-type='sets' className='search__btn-type sm-btn-sec' onClick={(event) => changeLibrary(event)}>Sets</button>
                    </div>
                </div>
            </div>
            <React.Fragment>
            {!loading ? (
            <div className="library__items">
                {listBookmarks === null ?
                <div>No bookmarks</div>
                :
                listBookmarks.map((item,index) =>
                    item.db_type === currentLibrary ? 

                        <div key={index} className='search-item block'>

                            {Header(item, index)}

                            {Description(item,index)}

                            {Buttons(item,index)}

                            {Footer(item,index)}

                        </div>
                    : null
                    
                )}
                {/* <div className='library__pagination'>
                    {pagination()}
                </div> */}
            </div>
            ) : (
            <Spinner />
            )}
            </React.Fragment>
        </div>
        
    );   
}

export default Library;