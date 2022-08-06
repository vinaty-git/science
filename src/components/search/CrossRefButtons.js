import React from 'react';
import CiteModal from './CiteModal';

import { FaStar, FaRegStar } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";

/**
 * Active buttons of each item: full desc, citation modal open, bookmark add/delete
 * @param {*} item - A data of one article
 * @param {*} index - Index of the item from array allItems
 * @returns {JSX.Element}
 */
function CrossRefButtons(props) {
    const {item,index,allBookmarks,RemoveBookmark,InitCitation,AddBookmark,openedCites,fullDesc,btnFullDesc} = props;
    
    return (
        <div className='search-item__ref-container'>
            {(allBookmarks != null && allBookmarks.some(i => item.DOI == i.doi)) ?
                <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => RemoveBookmark(item.DOI)} >
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

export default CrossRefButtons;