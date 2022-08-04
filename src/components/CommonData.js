import React, { useState } from "react";
import { CSSTransition } from 'react-transition-group';
import CiteModal from '../components/search/CiteModal';

import { FaChevronLeft,FaChevronRight,FaExternalLinkAlt,FaStar,FaRegStar } from "react-icons/fa";
import { FiArrowUp, FiArrowDown,FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL,RiArrowDownSLine } from "react-icons/ri";
import { AiOutlineTag } from "react-icons/ai";

function CommonData(props) {
    const {
        searchResults,
        passAllBookmarks,
        passRemoveBookmark,
        passAddBookmark,
        prevLinks,
        nextLinks,
        prevPage,
        nextPage
    } = props;

    let abstractCombine = []; // Переменная для суммирования описаний статьи и дальнейшего подсчета знаков

    const allItems = searchResults; // Массив всех статей

    const [fullDesc,setFullDesc] = useState({}); // В каких item открыто full desc. Index: true/false
    const [openedCites,setOpenedCites] = useState({}); // State текущего открытого модального окна с Citation formatter

    /**
     * Pagination of search results Common DataCite
     * @returns {JSX.Element}
     */
    function pagination() {
        return prevLinks.length > 1 || nextLinks !== "no link" ? (
        <div className="search__top-pagination">
            <button
                className={`search__prev-link pagination ${prevLinks.length < 2 && "search__prev-link--inactive"}`}
                onClick={() => prevPage()}>
                <FaChevronLeft />Previous page
            </button>

            <button
                className="search__next-link pagination"
                onClick={() => nextPage()}>
                Next page<FaChevronRight />
            </button>

        </div>
        ) : null;
    }

    /**
     * Title, publisher, date, format, type etc of the item
     * @param {*} item 
     * @param {*} index 
     * @returns {JSX.Element}
     */
    function headerItem(item, index) {
        return (
        <React.Fragment>
            <h3 className="search-item__title">
                {item.attributes.titles ? 
                    item.attributes.titles.length > 0 ?
                        item.attributes.titles[0].title ?
                            item.attributes.titles[0].title
                        : <span>No title provided</span>
                    : <span>No title provided</span>
                : <span>No title provided</span>
                }
            </h3>

            <div className="search-item__author">
                {item.attributes.creators?.length > 0
                ? item.attributes.creators.map((item, subindex) => {
                    return (
                        <span key={"names-" + subindex} className="search-item__names-author">
                            {item.givenName && item.familyName ? (
                                <>
                                    <span key={"name-" + index + "-" + subindex} className='search-item__name'>
                                        {subindex != 0 ? ', ' : null}
                                        {item.givenName}
                                    </span>
                                    <span key={"given-" + index + "-" + subindex} className='search-item__surname'>
                                        {item.familyName}
                                    </span>
                                </>
                            ) : (
                                <span key={"name-" + index + "-" + subindex}>
                                    {item.name}
                                </span>
                            )}
                        </span>
                    );
                })
                : "No information about the authors provided"}
            </div>

            <div className="search-item__publisher">
                <span>
                    {item.attributes.publisher
                    ? item.attributes.publisher
                    : "No information about the publisher provided"}
                </span>

                <span className="search-item__year">
                    {item.attributes.publicationYear
                    ? item.attributes.publicationYear
                    : "No publication date provided"}
                </span>

                {item.attributes.url ?
                    <span className='search-item__url'>
                        <a href={item.attributes.url} target="_blank" rel="noopener noreferrer" className='link-out'>
                            Publication source<FaExternalLinkAlt />
                        </a>
                    </span>
                : null}

                <div className='search-item__flags'>
                    {item.attributes.types ? 
                        item.attributes.types.resourceTypeGeneral ? 
                            <span className='tag'>
                                {item.attributes.types.resourceTypeGeneral}
                            </span> 
                        : null 
                    : null}

                    {item.attributes.language == null ? 
                        null 
                        : 
                        <span className='tag'>
                            {item.attributes.language}
                        </span>
                    }
                </div>
            </div>
        </React.Fragment>
        );
    }

    /**
     * Short/Full description of the item
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function bodyItem(item,index) {
        return (
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
                            : abstractCombine.substring(0, 700)+"..." }
                        </span>
                    )
                })
                : <span>No description provided</span> : <span>No description provided</span>}
            </div>
        );
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
     * При нажатии запоминает какой item имеет открытое полное описание
     * @param {*} index - Index of the item from array allItems
     * @returns 
     */
    function btnFullDesc(index) {
        setFullDesc(fullDesc => ({
            ...fullDesc,[index]: !fullDesc[index]
        }));
    }

    /**
     * Active buttons of each item: full desc, citation modal open, bookmark add/delete
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function buttonsItem(item,index) {
        return (
            <div className='search-item__ref-container'>  
                {(passAllBookmarks != null && passAllBookmarks.some(i => item.id == i.doi)) ?
                    <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => passRemoveBookmark(item.id)} >
                        <span><FaStar />Delete Bookmark</span>
                    </button>
                    : 
                    <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => passAddBookmark(item)} >
                        <span><FaRegStar />Add Bookmark</span>
                    </button>
                }
                
                {openedCites[index] ? 
                <CiteModal 
                item={item}
                index={index}
                InitCitation={InitCitation}
                />
                : null
                }

                <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={() => InitCitation(index)}>
                    <span><RiDoubleQuotesL />Cite this work</span>
                </button>

                {(item.attributes.subjects && item.attributes.subjects.length > 0) ? 
                    <button 
                        className='search-item__cites-button sm-btn sm-btn-sec' 
                        onClick={(event) => OpenSubjects(index,event)}>
                        <span>
                            <AiOutlineTag /><span>Show subjects</span>
                        </span>
                    </button> 
                : null }
                
                {abstractCombine.length > 700 ? 
                    <button className='search-item__btn-abstract sm-btn sm-btn-sec' onClick={() => btnFullDesc(index)}>
                        {fullDesc[index] ? 
                            <span><FiArrowUp />Hide full description</span>
                        : <span><FiArrowDown />Show full description</span>}
                    </button>
                : null}
            
            </div> 
        );
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

    /**
     * Identifiers at the buttom of the item (DOI,ISBN,ISSN) with opener via parent component
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
     function footerItem(item,index) {
        return(
            <>
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
            
            <div className='search-item__rights'>
                {item.attributes.rightsList.length > 0 ?
                    item.attributes.rightsList[0].rights ? 
                        item.attributes.rightsList[0].rights 
                        : <p>No attribution provided. Please visit a publication source website.</p>
                    : <p>No attribution provided. Please visit a publication source website.</p>
                    }

                {item.attributes.rightsList.length > 0 ? item.attributes.rightsList[0].rightsUri ?
                    <a 
                        href={item.attributes.rightsList[0].rightsUri} 
                        target="_blank" 
                        rel="noopener noreferrer">
                        About this attribution <FiExternalLink />
                    </a> 
                : null : null}
            </div>

            {item.attributes.subjects ? item.attributes.subjects.length > 0 ?
                <div id={'subjects-'+index} className='search-item__tags search-item__tags--hidden'>
                    {item.attributes.subjects.map((item,subindex) => {
                        return (
                            <span 
                                className='sm-tag' 
                                key={"subject-"+index+"-"+subindex}>
                                {item.subject}
                            </span>
                        );
                    })}
                </div>
            : null : null}

            </>
        );
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

    return (
    <div className="search__results">
        {pagination()}

        {allItems.map((item, index) => (
        <div key={index} className="search-item block">
            {headerItem(item, index)}
            {bodyItem(item,index)}
            {buttonsItem(item,index)}
            {footerItem(item,index)}
        </div>
        ))}
    </div>
    );
}
export default CommonData;
