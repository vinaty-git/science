import React, { useEffect, useState, useRef } from 'react';

import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";

function CrossRef(passSearchResults) {

    function test() {
        fetch('https://kirilab.ru/')
            .then(response => response.json())
            .then(response => {
                console.log(response);
            });
    }
    test();

    const totalResults = passSearchResults.passSearchResults[3][1]['total-results']; // Сколько статей найдено
    const perPage = passSearchResults.passSearchResults[3][1]['items-per-page']; // Статей на одной странице
    const allItems = passSearchResults.passSearchResults[3][1]['items']; // Массив всех статей

    return (
        <div className='search__results'>

            {/* PAGINTAION */}
            <div className='search__top-pagination'>
                <div className='search__total'><span className='pagination'>Total results found: {totalResults}</span><span className='pagination'>Articles per page: {perPage}</span></div>
                <button className='search__prev-link pagination'><FaChevronLeft />Previous page</button>
                <button className='search__next-link pagination'>Next page<FaChevronRight /></button>
            </div>

            {/* MAP ITEMS */}
            {allItems.map((item,index) => 
                <div key={index} className='search-item block'>
                    {/* {console.log(item)}
                    {console.log(item.title[0])} */}

                    {/* TITLE */}
                    <h3 className='search-item__title'>
                        {(item.title && item.title.length > 0) ? item.title[0] : <span>No title provided</span>}
                    </h3>

                     {/* AUTHOR */}
                     <div className='search-item__author'>
                        {item.author ? item.author.length > 0 ?
                            item.author.map((item,subindex) => {
                                return (
                                    <span className='search-item__names-author'>
                                        {item.name ? <span key={"name-"+index+"-"+subindex}>{item.name}</span> : null}
                                        {item.given ? <span key={"given-"+index+"-"+subindex}>{item.given}</span> : null}
                                        {item.family ? <span key={"family-"+index+"-"+subindex}>{item.family}</span> : null}
                                        {item.ORCID ? <span key={"orcid-"+index+"-"+subindex}>ORCID: {item.ORCID}</span> : null}
                                    </span>
                                );
                            }) 
                            : "No information about the authors provided" : "No information about the authors provided" 
                        }
                    </div>

                    {/* PUBLISHER */}
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

                    {/*  LANG  AND TYPE */}
                        <div className='search-item__flags'>
                            {item.type ? <span className='tag'>{item.type}</span> : null}
                            {item.language ? <span className='tag'>{item.language}</span> : null}
                        </div>
                        
                    </div>


                    {item.DOI ? item.DOI : "DOI is not defined"}
                </div>
            )}

        </div>
    );
}

export default CrossRef;