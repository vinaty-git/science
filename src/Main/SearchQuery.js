import React, { useEffect, useState, useRef } from 'react';
import { Transition } from 'react-transition-group';

import jsonData from "../data/SearchAPI";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import { FiArrowUp } from "react-icons/fi";
import { FiArrowDown } from "react-icons/fi";

function SearchQuery() {

    // Refs links 

    let searchInputRef = React.useRef();

    let searchInputOut = React.createRef();

    // Переменная для суммирования описаний статьи и дальнейшего подсчета
    let abstractCombine = [];

    // State для показа полного описания статьи true - показать полное, false - короткое
    const [fullDesc,setFullDesc] = useState({});

    const [textOutput,setTextOutput] = useState("Hello");

    // const [buttonRef,setButtonRef] = useState("Show where it is cited");

    const [searchResults,setSearchResults] = useState([]);
    var entries = Object.entries(jsonData.data);
    // const API_URL = "https://api.test.datacite.org/dois?query=climate%20change";

    function updateQuery() {
        setSearchResults(entries);
    }

    // Кнопка открыть ссылки references
    const showRefLinks = (index,event) => {
        let reference = document.getElementById("refs-links-"+index);
        reference.classList.toggle("search-item__references--show");
        event.target.textContent == 'Hide list of cites' ? event.target.textContent = 'Show list of cites' : event.target.textContent = 'Hide list of cites'; 
    }

    function searchInput(event) {
        searchInputOut.current.innerHTML = searchInputRef.current.value;
        setTextOutput(searchInputRef.current.value);
    }

    // function btnFullDesc(item) {
    //     setFullDesc(open => ({
    //       ...open,
    //       [item]: !open[item],
    //     }));
    // }
    const btnFullDesc = (item) => () => {
        setFullDesc(fullDesc => ({
          ...fullDesc,
          [item]: !fullDesc[item],
        }));
      };

    function AddBookmark(props) {
            fetch('https://kirilab.ru/science/func.php', {
                method: 'POST',
                body: JSON.stringify(props)
            })
            .then(response => response.text())
            .then((response) => {
                console.log(response);
            });
    }

    return (
        <div className='search__query'>
            <div className='search__request block'>
                <form>
                    <input type="text" className='search__input' onInput={searchInput} ref={searchInputRef} defaultValue="Test" />
                    <button type="button" className='btn-main' onClick={updateQuery}>Search</button>
                    <p ref={searchInputOut}></p>
                    <h3>{textOutput}</h3>
                </form>
                
                <div>Number of results</div>
            </div>
            <div className='search__results'>
                {searchResults == ''
                ? <div>Nothing to declare</div> 
                : searchResults.map((item,index) => 
                    <div key={index} className='search-item block'>
                        {/* TITLE */}
                        <h3 className='search-item__title'>
                            {item[1].attributes.titles ? 
                                item[1].attributes.titles.length > 0 ? 
                                    item[1].attributes.titles[0].title 
                                    : <span>No title provided</span> 
                                : <span>No title provided</span>
                            }
                        </h3> 

                        {/* AUTHOR */}
                        <div className='search-item__author'>
                            {item[1].attributes.creators ?
                                item[1].attributes.creators.length > 0 ?
                                    item[1].attributes.creators.map((item,subindex) => {
                                        return (
                                            <span key={"author-"+index+"-"+subindex}>{item.name}</span>
                                        );
                                    })
                                : "No information about the authors provided"
                            : "No information about the authors provided" }
                        </div>
                        
                        {/* PUBLISHER */}
                        <div className='search-item__publisher'>
                            <span>
                                {item[1].attributes.publisher ? item[1].attributes.publisher : "No information about the publisher provided"}
                            </span>
                            <span className='search-item__year'>
                                {item[1].attributes.publicationYear ? item[1].attributes.publicationYear : "No publication date provided"}
                            </span>
                            {item[1].attributes.url ?
                            <span className='search-item__url'><a href={item[1].attributes.url} target="_blank" rel="noopener noreferrer">Publication source<FaExternalLinkAlt /></a></span>
                            : null}
                            {/*  LANG  AND TYPE */}
                            <div className='search-item__flags'>
                                {item[1].attributes.types ? item[1].attributes.types.resourceTypeGeneral ? <span className='tag'>{item[1].attributes.types.resourceTypeGeneral}</span> : null : null}
                                {item[1].attributes.language == null ? null : <span className='tag'>{item[1].attributes.language}</span>}
                            </div>
                        </div>


                        {/* ABSTRACT */}
                        <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>
                            
                            {item[1].attributes.descriptions ? item[1].attributes.descriptions.length > 0 ?
                            item[1].attributes.descriptions.map((item,subindex) => {
                                abstractCombine = (item.descriptionType + ": " + item.description)
                                return (
                                    <span key={"abstract-"+index+"-"+subindex}>
                                        {fullDesc[index] ? abstractCombine : abstractCombine.substring(0, 750)+"..." }
                                    </span>
                                )
                            })
                            : <span>No description provided</span> : <span>No description provided</span>}
                        </div>

                        {abstractCombine.length > 750 ? 
                            <button className='search-item__btn-abstract sm-btn' onClick={btnFullDesc(index)}>
                                {fullDesc[index] ? 
                                <span><FiArrowUp />Hide full description</span>
                                : <span><FiArrowDown />Show full description</span>}
                            </button>
                        : null}

                        {/* IDENTIFIERS */}
                        <div className='search-item__identifiers'>
                            <p>
                                <span className='search-item__id-type'>DOI</span>
                                <span className='search-item__id-number'>{item[1].attributes.doi ? item[1].attributes.doi : "No DOI provided"}</span>
                            </p>
                            {item[1].attributes.identifiers ? 
                                item[1].attributes.identifiers.map((item,subindex) => {
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
                                })
                            : "No identifiers provided"
                            }
                        </div>
                        
                        {/* RIGHTS */}
                        <div className='search-item__rights'>
                            {item[1].attributes.rightsList.length > 0 ? item[1].attributes.rightsList[0].rights : <p>No attribution provided. Please visit a publication source website.</p>}
                            {item[1].attributes.rightsList.length > 0 ? <a href={item[1].attributes.rightsList[0].rightsUri} target="_blank" rel="noopener noreferrer">About this attribution <FiExternalLink /></a> : null}
                        </div>
                        
                        {/* TAGS */}
                        {item[1].attributes.subjects ?
                            item[1].attributes.subjects.length > 0 ?
                            <div className='search-item__tags'>
                                {item[1].attributes.subjects.map((item,subindex) => {
                                    return (
                                        <span className='sm-tag' key={"subject-"+index+"-"+subindex}>{item.subject}</span>
                                    );
                                })}
                            </div>
                            : null
                        : null}

                        <div className='search-item__ref-container'>
                            {/* REFERENCES */}
                            {item[1].attributes.relatedIdentifiers ? item[1].attributes.relatedIdentifiers.length > 0 ? 
                            <span className='search-item__ref-button sm-btn' onClick={(event) => {showRefLinks(index,event)}} >Show list of cites</span> : <span className='search-item__ref-button--empty'></span> :<span className='search-item__ref-button--empty'></span>}  
                               
                            {/* ADD TO BOOKMARKS */}
                            <span className='search-item__btn-bookmark sm-btn' onClick={() => AddBookmark(item[1])} >Add to Bookmarks</span>


                            {/* CITE */}
                            <span className='search-item__cites-button sm-btn'>
                                <i><RiDoubleQuotesL /></i>
                                <span>Cite this work</span>
                            </span>

                        </div>
                        
                        {item[1].attributes.relatedIdentifiers ?
                                <div  id={"refs-links-"+index} className='search-item__references'>
                                    {item[1].attributes.relatedIdentifiers.map((item,subindex) => {
                                        return (
                                            <div className='search-item__ref-links' key={"ref-type-"+index+"-"+subindex} >
                                                <span>{item.relatedIdentifierType}</span>
                                                <span>{item.relatedIdentifier}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                : null}
                        
                    </div>
                    
                )}
            </div>
        </div>
    );
 
}
    
export default SearchQuery;