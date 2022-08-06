import React from "react";
import CiteModal from './CiteModal';

import { FaStar,FaRegStar } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import { AiOutlineTag } from "react-icons/ai";

/**
 * Active buttons of each item: full desc, citation modal open, bookmark add/delete
 * @param {*} item - A data of one article
 * @param {*} index - Index of the item from array allItems
 * @returns {JSX.Element}
 */
 function CommonButtons(props) {
    const {
        item,
        index,
        allBookmarks,
        fullDesc,
        RemoveBookmark,
        AddBookmark,
        openedCites,
        InitCitation,
        btnFullDesc
    } = props;

    var abstractCombine = [];
    item.attributes.descriptions?.length > 0 ? (
        item.attributes.descriptions.map((item,subindex) => {
            abstractCombine = (item.descriptionType + ": " + item.description)
        })
    ) : ( abstractCombine = []);
    
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

    return (
        <div className='search-item__ref-container'>
            {(allBookmarks != null && allBookmarks.some(i => item.id == i.doi)) ?
                <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => RemoveBookmark(item.id)} >
                    <span><FaStar />Delete Bookmark</span>
                </button>
                : 
                <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item)} >
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

export default CommonButtons;