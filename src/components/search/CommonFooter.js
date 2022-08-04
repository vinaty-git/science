import React from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";

/**
 * Identifiers at the buttom of the item (DOI,ISBN,ISSN) with opener via parent component
 * @param {*} item - A data of one article
 * @param {*} index - Index of the item from array allItems
 * @returns {JSX.Element}
 */
 function CommonFooter(props) {
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
            <span className='search-item__id-number'>{item.attributes.doi ? item.attributes.doi : "No DOI provided"}</span>
            {item.attributes.identifiers?.length !== 0 ? 
                <button 
                    className='search-item__open-id-list light-open' 
                    onClick={(event) => openListIds(index,event)}>
                    <span>Open full list</span><RiArrowDownSLine />
                </button> 
            : null}
                        
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

export default CommonFooter;