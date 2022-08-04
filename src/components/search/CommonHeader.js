import React, { useState } from "react";
import { CSSTransition } from 'react-transition-group';
import CiteModal from './CiteModal';

import { FaChevronLeft,FaChevronRight,FaExternalLinkAlt,FaStar,FaRegStar } from "react-icons/fa";
import { FiArrowUp, FiArrowDown,FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL,RiArrowDownSLine } from "react-icons/ri";
import { AiOutlineTag } from "react-icons/ai";

/**
 * Title, publisher, date, format, type etc of the item
 * @param {*} item 
 * @param {*} index 
 * @returns {JSX.Element}
 */
 function CommonHeader(item, index) {
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
export default CommonHeader;