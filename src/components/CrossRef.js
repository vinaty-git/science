import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import CiteModal from '../components/CiteModal';

import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaStar, FaRegStar } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { AiOutlineTag } from "react-icons/ai";
import { RiArrowDownSLine, RiDoubleQuotesL } from "react-icons/ri";

function CrossRef(props) {
    const {setItemsNum,offsetCrossRef,goToPage,itemsNum,passSearchResults,passAllBookmarks,passAddBookmark,passRemoveBookmark,passOpenListIds,passOpenCites,paginateCrossRef} = props;

    var tempTotalPages;
    const allItems = props.passSearchResults[3][1]['items']; // Массив всех статей
    const perPage = props.passSearchResults[3][1]['items-per-page']; // Статей на одной странице ???
    const totalResults = props.passSearchResults[3][1]['total-results']; // Сколько статей найдено

    const [fullDesc,setFullDesc] = useState({}); // В каких item открыто full desc. Index: true/false
    const [openedCites,setOpenedCites] = useState({}); // State текущего открытого модального окна с Citation formatter
    // const [totalPages,setTotalPages] = useState(); // Количество страниц в пагинации для ререндера

    /**
     * Pagination of search results CrossRef 
     * @returns {JSX.Element}
     */
    function pagination() {
        tempTotalPages = Math.floor(((totalResults / itemsNum)-itemsNum));
        if (tempTotalPages > 10000/itemsNum) {
            tempTotalPages = 10000/itemsNum;
        }
        var totalPages = tempTotalPages;
        var currentPage = (offsetCrossRef / itemsNum);

        return (
            <div className='search__top-pagination'>
                <div className='search__total'>
                    <span className='pagination'>Total found: {totalResults}</span>
                </div>

                <div className='search__current-total'>
                    
                    {offsetCrossRef === 0 ? 
                    <button
                        data-pagination='previous'
                        className='search__prev-link search__prev-link--inactive pagination'>
                        <FaChevronLeft />Previous
                    </button>
                    : 
                    <button
                        data-pagination='previous'
                        className='search__prev-link pagination pagination-active' onClick={(event) => paginateCrossRef(event)}>
                        <FaChevronLeft />Previous
                    </button>}

                    <div className='search__choose-page pagination pagination-active'>
                        <span className='search__current-page'>Page: {currentPage+1} of {totalPages}</span>
                        <div className='search__input-pagination'>Go to page:
                            <input id='paginate-input' placeholder='#' type='number'/>
                            <span className='search__send-numpage' onClick={() => goToPage()}>Go <FaChevronRight /></span>
                        </div>
                    </div>
                    
                    {(offsetCrossRef >= (10000 - itemsNum) || offsetCrossRef > ((totalResults / itemsNum)-itemsNum)) ?
                    <button
                        data-pagination='next'
                        className='search__next-link pagination search__prev-link--inactive'>
                        Next<FaChevronRight />
                    </button>
                    :                    
                    <button
                        data-pagination='next'
                        className='search__next-link pagination pagination-active' 
                        onClick={(event) => paginateCrossRef(event)}>
                        Next<FaChevronRight />
                    </button>}
                
                </div>
                {/* <span className='pagination'>Articles per page: {perPage}</span> */}
                <span className='search__per-page pagination pagination-active'>
                    <label htmlFor='per-page'>Articles per page:</label>
                    <select name='per-page' id='per-page' defaultValue={itemsNum} onChange={(event) => selectPerPage(event)}>
                        <option value='10'>10</option>
                        <option value='25'>25</option>
                        <option value='35'>35</option>
                        <option value='50'>50</option>
                    </select>
                </span>  
            </div>
        );
    }

    function selectPerPage(event) {
        var chosenPerPage = event.target.value;
        console.log(chosenPerPage);
        // setItemsNum(chosenPerPage);
    }

    /**
     * Title, publisher, date, format, type etc of the item
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function headerItem(item,index) {
        return (
            <React.Fragment>
                <h3 className='search-item__title'>
                    {item.title?.length > 0 ? item.title[0] : <span>No title provided</span>}
                </h3>

                <div className='search-item__author'>
                    {item.author?.length > 0 ? item.author.map((item,subindex) => {
                        return (
                            <span key={'names-'+subindex} className='search-item__names-author'>
                                {item.name ? <span key={"name-"+index+"-"+subindex}>{item.name}</span> : null}
                                {item.given ? <span key={"given-"+index+"-"+subindex}>{item.given}</span> : null}
                                {item.family ? <span key={"family-"+index+"-"+subindex}>{item.family}</span> : null}
                                {item.ORCID ? <span key={"orcid-"+index+"-"+subindex}>ORCID: {item.ORCID}</span> : null}
                            </span>
                        );
                        }) : "No information about the authors provided" 
                    }
                </div>

                <div className='search-item__publisher'>
                    <span>{item.publisher ? item.publisher : "No information about the publisher provided"}</span>

                    <span className='search-item__year'>
                        {item.published ? item.published['date-parts'][0][0] ? item.published['date-parts'][0][0] 
                        : "No publication date provided" : "No publication date provided"}
                    </span>
                    {item.resource.primary.URL ?
                        <span className='search-item__url'>
                            <a href={item.resource.primary.URL} target="_blank" rel="noopener noreferrer" className='link-out'>
                                Publication source<FaExternalLinkAlt />
                            </a>
                        </span>
                    : null}
                    {item.link ?
                        <span className='search-item__url'>
                            {item.link.map((subitem,subindex) => 
                                <a key={'links-'+subindex} href={subitem.URL} target="_blank" rel="noopener noreferrer" className='link-out'>
                                Link<FaExternalLinkAlt /> {subitem['content-type']}
                                </a>
                            )}
                        </span>
                    : null}

                    <div className='search-item__flags'>
                        {item.type ? <span className='tag'>{item.type}</span> : null}
                        {item.language ? <span className='tag'>{item.language}</span> : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    /**
     * Short description of the item
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function bodyItem(item,index) {
        var abstract,abstractFull;
        if (item.abstract && item.abstract !== '') {
            var cleanAbstract = item.abstract.replace(/<(.|\n)*?>/g, '');
            abstract = cleanAbstract.replace('[...]','');
            if (abstract.length > 700) {
                abstractFull = abstract;
                abstract = abstract.substring(0, 700)+"...";
            }
        } else {
            abstract = "No description provided";
        }
        return (
            <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>                     
                {fullDesc[index] ? 
                    <CSSTransition 
                    classNames="slide"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span>{abstractFull}</span>
                    </CSSTransition>
                : abstract}
            </div>
        );
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
                {(passAllBookmarks != null && passAllBookmarks.some(i => item.DOI == i.doi)) ?
                    <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => passRemoveBookmark(item.DOI)} >
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

                {item.abstract?.length  > 700 ? 
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
     * Identifiers at the buttom of the item (DOI,ISBN,ISSN) with opener via parent component
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function footerItem(item,index) {
        return(
            <div className='search-item__identifiers'>
                <span className='search-item__id-type'>DOI</span>
                <span className='search-item__id-number'>{item.DOI ? item.DOI : "No DOI provided"}</span>
                {(item.ISBN || item.ISSN) ? 
                    <button 
                        className='search-item__open-id-list light-open' 
                        onClick={(event) => passOpenListIds(index,event)}>
                            <span>Open full list</span><RiArrowDownSLine />
                    </button>
                : null}
                {(item.ISBN || item.ISSN) ?
                    <div id={'idents-' + index} className='search-item__list-idents'>
                        {item.ISBN ?
                            <p><span className='search-item__id-type'>ISBN</span>
                                <span className='search-item__id-number'>{item.ISBN}</span></p>
                        :null}
                        {item.ISSN ?
                            <p><span className='search-item__id-type'>ISSN</span>
                                <span className='search-item__id-number'>{item.ISSN}</span></p>
                        :null}
                    </div>
                : null}
            </div>
        );
    }

    /**
     * Subjects and tags at the bottom of the item
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
    function tagsItem(item,index) {
        return (
            item.subject ? item.subject.length > 0 ?
                <div id={'subjects-'+index} className='search-item__tags'>
                    {item.subject.map((item,subindex) => {
                        return (
                            <span className='sm-tag' key={"subject-"+index+"-"+subindex}>{item}</span>
                        );
                    })}
                </div>
            : null : null
        );
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
     * При нажатии инициализирует модальное окно Citation formatter
     * @param {*} index - Index of the item from array allItems
     */
    function InitCitation(index) {
        openedCites[index] ?
        setOpenedCites({})
        :
        setOpenedCites({[index]: true})
    }

    return (
        <div className='search__results'>

            {pagination()}

            {allItems.map((item,index) => 
                <div key={index} className='search-item block'>

                    {headerItem(item,index)}
                    {bodyItem(item,index)}
                    {buttonsItem(item,index)}
                    {footerItem(item,index)}
                    {tagsItem(item,index)}

                </div>
            )}
            
            {pagination()}

        </div>
    );
}

export default CrossRef;