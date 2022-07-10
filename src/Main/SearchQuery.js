import React, { useEffect, useState } from 'react';
import jsonData from "../data/SearchAPI";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";

function SearchQuery() {
    const refLinks = React.useRef(null);
    let searchInputRef = React.useRef();
    let searchInputOut = React.createRef();
    let uniIdItem = '';

    const [textOutput,setTextOutput] = useState("Hello");
    // const [buttonRef,setButtonRef] = useState("Show where it is cited");

    const [searchResults,setSearchResults] = useState([]);
    var entries = Object.entries(jsonData.data);
    // const API_URL = "https://api.test.datacite.org/dois?query=climate%20change";

    function updateQuery() {
        setSearchResults(entries);
    }

    function showRefLinks(event) {
        // let chRefs = document.getElementById('refs-' + arg);
        // chRefs.classList.add('search-item__references--show');
        var currentRefClick = event.target.parentNode.querySelector('.search-item__references');
        console.log(currentRefClick);
        // console.log(currentRefClick);
        currentRefClick.classList.toggle('search-item__references--show');
        // setButtonRef("Hide the list of cites");
        // event.target.textContent = "Hide list of cites";
        event.target.textContent == 'Hide list of cites' ? event.target.textContent = 'Show list of cites' : event.target.textContent = 'Hide list of cites'; 
    }

    function searchInput(event) {
        console.log(event.target.value);
        console.log(searchInputRef.current.value);
        searchInputOut.current.innerHTML = searchInputRef.current.value;
        setTextOutput(searchInputRef.current.value);
    }

    

    // Создадим новый массив для отправки fetch в php
    const [bookmark,setBookmark] = useState([]);

    function AddBookmark(props) {

        var titlesBrk = props.attributes.titles;
        var creatorsBrk = props.attributes.creators;
        var publisherBrk = props.attributes.publisher;
        var fileTypeBrk = props.attributes.types.resourceTypeGeneral;
        var langBrk = props.attributes.types.resourceTypeGeneral;
        var abstrBrk = props.attributes.descriptions;
        var identsBrk = props.attributes.identifiers;
        var rightsBrk = props.attributes.rightsList;
        var subjectsBrk = props.attributes.subjects;
        var arrBookmark = new Array(titlesBrk,creatorsBrk,publisherBrk,fileTypeBrk,langBrk,abstrBrk,identsBrk,rightsBrk,subjectsBrk);

        setBookmark([...bookmark, arrBookmark]);

        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            // headers : { 
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/json'
            // },
            body: JSON.stringify(bookmark)
            // body: bookmark
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
                    <div key={"item-"+index} className='search-item block'>
                        
                        {uniIdItem = item[1].id.substr(item[1].id.length - 7, item[1].id.length)}
                        {/* TITLE */}
                        <h3 className='search-item__title'>
                            {item[1].attributes.titles.length > 0 ? item[1].attributes.titles[0].title : <span>No title provided</span>}
                        </h3> 

                        {/* AUTHOR */}
                        <div className='search-item__author'>
                            {item[1].attributes.creators.map((item,index) => {
                                return (
                                    <span key={"author-"+index+uniIdItem}>{item.name}</span>
                                );
                            })}
                        </div>
                        
                        {/* PUBLISHER */}
                        <div className='search-item__publisher'>
                            <span>{item[1].attributes.publisher}</span>
                            <span className='search-item__year'>{item[1].attributes.publicationYear}</span>
                            {item[1].attributes.url ?
                            <span className='search-item__url'><a href={item[1].attributes.url} target="_blank" rel="noopener noreferrer">Publication source<FaExternalLinkAlt /></a></span>
                            : null}
                            {/*  LANG  AND TYPE */}
                            <div className='search-item__flags'>
                                {item[1].attributes.types.resourceTypeGeneral ? <span className='tag'>{item[1].attributes.types.resourceTypeGeneral}</span> : null}
                                {item[1].attributes.language == null ? null : <span className='tag'>{item[1].attributes.language}</span>}
                            </div>
                        </div>


                        {/* ABSTRACT */}
                        <div className='search-item__abstract'>
                            {item[1].attributes.descriptions.length > 0 ?
                            item[1].attributes.descriptions.map((item,index) => {
                                return (
                                    <p key={"abstract-"+index+uniIdItem}><span>{item.descriptionType}:</span><span>{item.description}</span></p>
                                );
                            })
                            : <span>No description provided</span>}
                        </div>
                        
                        {/* IDENTIFIERS */}
                        <div className='search-item__identifiers'>
                            {item[1].attributes.identifiers.map((item,index) => {
                                return (
                                    <p>
                                        <span className='search-item__id-type' key={"id-type-"+index+uniIdItem}>
                                            {item.identifierType}
                                        </span>
                                        <span className='search-item__id-number' key={"id-number-"+index+uniIdItem}>{item.identifier}</span>
                                    </p>
                                );
                            })}
                        </div>

                        {/* <div>{item[1].attributes.registered}</div> */}
                        {/* RIGHTS */}
                        <div className='search-item__rights'>
                            {item[1].attributes.rightsList.length > 0 ? item[1].attributes.rightsList[0].rights : <p>No attribution provided. Please visit a publication source website.</p>}
                            {item[1].attributes.rightsList.length > 0 ? <a href={item[1].attributes.rightsList[0].rightsUri} target="_blank" rel="noopener noreferrer">About this attribution <FiExternalLink /></a> :null}
                        </div>
                        
                        {/* TAGS */}
                        {item[1].attributes?.subjects ?
                            item[1].attributes.subjects.length > 0 ?
                            <div className='search-item__tags'>
                                {item[1].attributes.subjects.map((item,index) => {
                                    return (
                                        <span className='sm-tag' key={"subject-"+index+uniIdItem}>{item.subject}</span>
                                    );
                                })}
                            </div>
                            : null
                        : <p>No tags</p>}

                        <div className='search-item__ref-container'>
                            {/* REFERENCES */}
                            {item[1].attributes.relatedIdentifiers.length > 0 ? 
                            <span className='search-item__ref-button sm-btn' ref={refLinks}  onClick={showRefLinks} >Show list of cites</span> : null}  
                                    
                            {item[1].attributes?.relatedIdentifiers ?
                                <div  id={'refs-'+uniIdItem} className='search-item__references'>
                                    {/* {item[1].attributes.relatedIdentifiers.length > 0 ? <button onClick={() => showRefLinks(uniIdItem)} >Show where it is cited</button> : null}   */}
                                    {item[1].attributes.relatedIdentifiers.map((item,index) => {
                                        return (
                                            <div className='search-item__ref-links'>
                                                <span key={"ref-type-"+index+uniIdItem}>{item.relatedIdentifierType}</span>
                                                <span key={"ref-id-"+index+uniIdItem}>{item.relatedIdentifier}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                : null}

                            {/* ADD TO BOOKMARKS */}
                            <span className='sm-btn' onClick={() => AddBookmark(item[1])} >Add to Bookmarks</span>


                            {/* CITE */}
                            <span className='search-item__cites-button sm-btn'>
                                <i><RiDoubleQuotesL /></i>
                                <span>Cite this work</span>
                            </span>
                        </div>
                    </div>
                    
                )}
            </div>
        </div>
    );
 
}
    
export default SearchQuery;