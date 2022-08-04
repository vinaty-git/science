import React from 'react';

import { FaExternalLinkAlt } from "react-icons/fa";

function CrossRefHeader(props) {
    const {item, index} = props;
    return (
        <React.Fragment>
            <h3 className='search-item__title'>
                {item.title?.length > 0 ? item.title[0] : <span>No title provided</span>}
            </h3>

            <div className='search-item__author'>
                {item.author?.length > 0 ? item.author.map((item,subindex) => {
                    return (
                        <span key={'names-'+subindex} className='search-item__names-author'>
                            {item.given && item.family ? (
                            <>
                                <span key={"name-" + index + "-" + subindex} className='search-item__name'>
                                    {subindex != 0 ? ', ' : null}
                                    {item.given}
                                </span>
                                <span key={"given-" + index + "-" + subindex} className='search-item__surname'>
                                    {item.family}
                                </span>
                                {item.ORCID ? 
                                    <span key={"orcid-"+index+"-"+subindex}>ORCID: {item.ORCID}</span> 
                                : null}
                            </>
                            ) : (
                            <>
                                {item.name ? 
                                    <span key={"name-"+index+"-"+subindex} className='search-item__name'>{item.name}</span> 
                                : null}
                                {item.family ? 
                                <span key={"family-"+index+"-"+subindex}>{item.family}</span> 
                                : null}
                                {item.ORCID ? 
                                    <span key={"orcid-"+index+"-"+subindex}>ORCID: {item.ORCID}</span> 
                                : null}
                            </>
                            )}

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
                {/* {item.link ?
                    <span className='search-item__url'>
                        {item.link.map((subitem,subindex) => 
                            <a key={'links-'+subindex} href={subitem.URL} target="_blank" rel="noopener noreferrer" className='link-out'>
                            Link<FaExternalLinkAlt /> {subitem['content-type']}
                            </a>
                        )}
                    </span>
                : null} */}

                <div className='search-item__flags'>
                    {item.type ? <span className='tag'>{item.type}</span> : null}
                    {item.language ? <span className='tag'>{item.language}</span> : null}
                </div>
            </div>
        </React.Fragment>
    );
}

export default CrossRefHeader;