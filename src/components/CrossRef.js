import React, { useState } from 'react';

import CrossRefHeader from './search/CrossRefHeader';
import CrossRefBody from '../components/search/CrossRefBody';
import CrossRefButtons from '../components/search/CrossRefButtons';
import CrossRefFooter from '../components/search/CrossRefFooter';

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function CrossRef(props) {
    const {
        setItemsNum,
        offsetCrossRef,
        goToPage,
        itemsNum,
        searchResults,
        allBookmarks,
        AddBookmark,
        RemoveBookmark,
        paginateCrossRef
    } = props;

    var tempTotalPages;
    const allItems = props.searchResults[3][1]['items']; // Массив всех статей
    const totalResults = props.searchResults[3][1]['total-results']; // Сколько статей найдено

    const [fullDesc,setFullDesc] = useState({}); // В каких item открыто full desc. Index: true/false
    const [openedCites,setOpenedCites] = useState({}); // State текущего открытого модального окна с Citation formatter

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
                        className='search__prev-link pagination' onClick={(event) => paginateCrossRef(event)}>
                        <FaChevronLeft />Previous
                    </button>}

                    <div className='search__choose-page pagination'>
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
                        className='search__next-link pagination' 
                        onClick={(event) => paginateCrossRef(event)}>
                        Next<FaChevronRight />
                    </button>}
                
                </div>

                <span className='search__per-page pagination'>
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

    /**
     * При выборе в пагинации кол-во страниц к показу меняем state itemsNum
     * @param {*} event 
     */
    function selectPerPage(event) {
        var chosenPerPage = event.target.value;
        setItemsNum(chosenPerPage);
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

                    <CrossRefHeader 
                        item={item}
                        index={index}
                    />

                    <CrossRefBody
                        item={item}
                        index={index}
                        fullDesc={fullDesc}
                    />

                    <CrossRefButtons 
                        item={item}
                        index={index}
                        fullDesc={fullDesc}
                        allBookmarks={allBookmarks}
                        RemoveBookmark={RemoveBookmark}
                        InitCitation={InitCitation}
                        AddBookmark={AddBookmark}
                        openedCites={openedCites}
                        btnFullDesc={btnFullDesc}
                    />

                    <CrossRefFooter
                        item={item}
                        index={index}
                    />

                </div>
            )}
            
            {pagination()}

        </div>
    );
}

export default CrossRef;