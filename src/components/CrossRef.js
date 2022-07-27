import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";

function CrossRef(passSearchResults,passFullDesc) {
    const allItems = passSearchResults.passSearchResults[3][1]['items']; // Массив всех статей
    const perPage = passSearchResults.passSearchResults[3][1]['items-per-page']; // Статей на одной странице
    const totalResults = passSearchResults.passSearchResults[3][1]['total-results']; // Сколько статей найдено

    console.log(allItems);
    /**
     * Pagination of search results CrossRef 
     * @returns {JSX.Element}
     */
    function pagination() {
        console.log("Pagintaion initialized");
        return (
            <div className='search__top-pagination'>
                <div className='search__total'>
                    <span className='pagination'>Total results found: {totalResults}</span>
                    <span className='pagination'>Articles per page: {perPage}</span>
                </div>
                <button className='search__prev-link pagination'><FaChevronLeft />Previous page</button>
                <button className='search__next-link pagination'>Next page<FaChevronRight /></button>
            </div>
        );
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
                abstract = abstract.substring(0, 700)+"...";
                abstractFull = abstract;
            }
        } else {
            abstract = "No description provided";
        }
        return (
            <div className={passFullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>                     
                {passFullDesc[index] ? abstractFull : abstract}
            </div>
        );
    }


    return (
        <div className='search__results'>

            {pagination()}

            {allItems.map((item,index) => 
                <div key={index} className='search-item block'>

                    {headerItem(item,index)}
                    {bodyItem(item,index)}
                    {item.DOI ? item.DOI : "DOI is not defined"}
                </div>
            )}

        </div>
    );
}

export default CrossRef;