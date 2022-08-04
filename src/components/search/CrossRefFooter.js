import React from 'react';

import { RiArrowDownSLine } from "react-icons/ri";

/**
 * Identifiers at the buttom of the item (DOI,ISBN,ISSN) with opener via parent component
 * @param {*} item - A data of one article
 * @param {*} index - Index of the item from array allItems
 * @returns {JSX.Element}
 */
function CrossRefFooter(props) {
    const {item,index} = props;

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

    return(
        <>
        <div className='search-item__identifiers'>
            <span className='search-item__id-type'>DOI</span>
            <span className='search-item__id-number'>{item.DOI ? item.DOI : "No DOI provided"}</span>
            {(item.ISBN || item.ISSN) ? 
                <button 
                    className='search-item__open-id-list light-open' 
                    onClick={(event) => openListIds(index,event)}>
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
        
        {item.subject ? item.subject.length > 0 ?
            <div id={'subjects-'+index} className='search-item__tags'>
                {item.subject.map((item,subindex) => {
                    return (
                        <span className='sm-tag' key={"subject-"+index+"-"+subindex}>{item}</span>
                    );
                })}
            </div>
        : null : null}
        
        </>
    );
}
export default CrossRefFooter;