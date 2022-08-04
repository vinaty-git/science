import React, { useState } from "react";
import CommonHeader from '../components/search/CommonHeader';
import CommonBody from '../components/search/CommonBody';
import CommonButtons from '../components/search/CommonButtons';
import CommonFooter from '../components/search/CommonFooter';

import { FaChevronLeft,FaChevronRight } from "react-icons/fa";

function CommonData(props) {
    const {
        searchResults,
        allBookmarks,
        RemoveBookmark,
        AddBookmark,
        prevLinks,
        nextLinks,
        prevPage,
        nextPage
    } = props;

    // var abstractCombine = []; // Переменная для суммирования описаний статьи и дальнейшего подсчета знаков

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

    return (
    <div className="search__results">
        {pagination()}

        {allItems.map((item, index) => (
        <div key={index} className="search-item block">

            <CommonHeader 
                index={index}
                item={item}    
            />

            <CommonBody 
                index={index}
                item={item}
                fullDesc={fullDesc} 
            />

            <CommonButtons
                index={index}
                item={item}
                fullDesc={fullDesc}
                RemoveBookmark={RemoveBookmark}
                AddBookmark={AddBookmark}
                openedCites={openedCites}
                InitCitation={InitCitation}
                btnFullDesc={btnFullDesc}
            />

            <CommonFooter
                item={item}
                index={index}
            />

        </div>
        ))}
    </div>
    );
}
export default CommonData;
