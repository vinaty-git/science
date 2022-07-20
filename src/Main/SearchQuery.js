import React, { useEffect, useState, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { CiteStyles } from '../Cites/DataCitesStyles.js';

import jsonData from "../data/SearchAPI";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiDoubleQuotesL } from "react-icons/ri";
import { FiArrowUp } from "react-icons/fi";
import { FiArrowDown } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FiLink2 } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { ImCopy } from "react-icons/im";
import { BsQuestionCircle } from "react-icons/bs";
import { BsArrowUp } from "react-icons/bs";

function SearchQuery() {

    // Refs links 

    let searchInputRef = React.useRef();

    let searchInputOut = React.createRef();

    // Переменная для суммирования описаний статьи и дальнейшего подсчета
    let abstractCombine = [];

    // State для показа полного описания статьи true - показать полное, false - короткое
    const [fullDesc,setFullDesc] = useState({});

    const [textOutput,setTextOutput] = useState("Hello");

    const [btnLinks,setBtnLinks] = useState({});

    // Поисковая выдача записывается в этот state
    const [searchResults,setSearchResults] = useState([]);
    var entries = Object.entries(jsonData.data);

    // const API_URL = "https://api.test.datacite.org/dois?query=climate%20change";
    const [allBookmarks, setAllBookmarks] = useState([]);

    // Стили цицитирования 
    const [cite,setCite] = useState({});
    var loadStyle;
    const [loadTag,setLoadTag] = useState('apa'); // State того, что нажато из списка стилей цитирования
    const [chosenStyle,setChosenStyle] = useState('apa'); // Стиль цитирования для API полный
    const [styleLoading, setStyleLoading] = useState(false); // Статус загрузки fetch стилей цитирования

    //  Получение данных из БД о наличии bookmarks для User id 1
    useEffect(() => {
        function CheckBookmarks() {
            const queryCheckBookmarks = {
                "data": "bookmarkQuery",
                "id": 2
            };
            fetch('https://kirilab.ru/science/func.php', {
                method: 'POST',
                body: JSON.stringify(queryCheckBookmarks)
            })
            .then(response => response.json())
            .then(response => {
                setAllBookmarks(response);
                // console.log(response);
            });
        }
        CheckBookmarks();
    }, []);

    function updateQuery() {
        setSearchResults(entries);
    }

    // Кнопка открыть ссылки references
    const showRefLinks = (index,event) => {
        let reference = document.getElementById("refs-links-"+index);
        reference.classList.toggle("search-item__references--show");
        event.target.classList.toggle('sm-btn-sec--active');
        setBtnLinks(btnLinks => ({
            ...btnLinks,[index]:!btnLinks[index]
        }));
    }

    function searchInput(event) {
        searchInputOut.current.innerHTML = searchInputRef.current.value;
        setTextOutput(searchInputRef.current.value);
    }

    const btnFullDesc = (index) => () => {
        setFullDesc(fullDesc => ({
          ...fullDesc,[index]: !fullDesc[index]
        }));
      };

    function AddBookmark(props) {
        const queryAddBookmark = {
            "data": "addBookmark",
            "id": 2,
            "bookmark": props
        };
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryAddBookmark)
        })
        .then(response => response.json())
        .then((response) => {
            if (response == false) {
                console.log("answer alredy exist");
            } else {
                setAllBookmarks(response);
            }
        });
    }

    function RemoveBookmark(props) {
        const queryRemoveBookmark = {
            "data": "removeBookmark",
            "id": 2,
            "doi": props
        }
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryRemoveBookmark)
        })
        .then(response => response.json())
        .then((response) => {
            setAllBookmarks(response);
        });
    }

    // ГЕНЕРАТОР ЦИТАТ 

    function OpenCites(index,doi) {
        var citePopup = document.getElementById("cites-"+index);
        citePopup.classList.toggle('cites--hidden');
        citePopup.classList.toggle('cites--active');
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
        LoadCite(doi);
    }

    function HideCites() {
        var openedPopup = document.querySelector('.cites--active');
        openedPopup.classList.toggle('cites--hidden');
        openedPopup.classList.toggle('cites--active');
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
    }

    function LoadCite(doi) {
        setStyleLoading(true);
        fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
            headers: {
                // PARSE DOI СРАВНИТЬ C CROSS SITE
                // "Accept": "text/html;q=0.3, application/rdf+xml;q=1, application/vnd.citationstyles.csl+json;q=0.5; style=apa",
                "Accept": `text/x-bibliography; style=${chosenStyle}`,
            }
        })
        .then(response => response.text())
        .then(response => {
            setCite({...cite, [chosenStyle]: response});
        });
    }
    useEffect(() => {
        setStyleLoading(false);
    },[cite]);

    function chooseStyle(event) {
        document.querySelectorAll('.cites__li-style').forEach(i => {
            i.classList.remove('cites__li-style--active');
        });
        event.target.classList.add('cites__li-style--active');
        setLoadTag(event.target.getAttribute('data-tag'));
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        
    }
    
    useEffect(() => {
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        setChosenStyle(loadStyle);
    },[loadTag]);

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
                <div className='modal-bgn modal-bgn--hidden' onClick={() => HideCites()}></div>
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
                            <span className='search-item__url'><a href={item[1].attributes.url} target="_blank" rel="noopener noreferrer" className='link-out'>Publication source<FaExternalLinkAlt /></a></span>
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
                                        {fullDesc[index] ? abstractCombine : abstractCombine.substring(0, 650)+"..." }
                                    </span>
                                )
                            })
                            : <span>No description provided</span> : <span>No description provided</span>}
                        </div>
                        

                        <div className='search-item__ref-container'>  
                            {/* ADD TO BOOKMARKS */}

                            {allBookmarks != null ?
                                allBookmarks.some(i => item[1].id == i.doi) ?
                                <button className='search-item__btn-bookmark sm-btn sm-btn-sec--active' onClick={() => RemoveBookmark(item[1].id)} >
                                    <span><FaStar />Delete Bookmark</span>
                                </button>
                                : 
                                <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item[1])} >
                                    <span><FaRegStar />Add Bookmark</span>
                                </button>
                            :  
                            <button className='search-item__btn-bookmark sm-btn sm-btn-sec' onClick={() => AddBookmark(item[1])} >
                                <span><FaRegStar />Add Bookmark</span>
                            </button>}

                            {/* CITE */}
                            <button className='search-item__cites-button sm-btn sm-btn-sec' onClick={() => OpenCites(index,item[1].id)}>
                                <span><RiDoubleQuotesL />Cite this work</span>
                            </button>

                            {/* REFERENCES */}
                            {item[1].attributes.relatedIdentifiers ? item[1].attributes.relatedIdentifiers.length > 0 ? 
                            <button className='search-item__ref-button sm-btn sm-btn-sec' onClick={(event) => {showRefLinks(index,event)}} >
                                {btnLinks[index] ?
                                <span><FiLink2 /> Close cite list<span className='search-item__refs-counter'>{item[1].attributes.relatedIdentifiers.length}</span></span>
                                : <span><FiLink2 /> Open cite list<span className='search-item__refs-counter'>{item[1].attributes.relatedIdentifiers.length}</span></span>
                                }
                                
                            </button> : null : null }  

                            {/* FULL DESC */}
                            {abstractCombine.length > 650 ? 
                                <button className='search-item__btn-abstract sm-btn sm-btn-sec' onClick={btnFullDesc(index)}>
                                    {fullDesc[index] ? 
                                    <span><FiArrowUp />Hide full description</span>
                                    : <span><FiArrowDown />Show full description</span>}
                                </button>
                            : null}
                            
                        </div>
                        
                        {/* CITATION POPUP MODAL */}
                        <div id={"cites-"+index} className='cites cites--hidden'>

                            <div className='cites__heading'>
                                <h4>Citation Generator</h4>
                                <span className='cites__close' onClick={() => HideCites()}><GrClose /></span>
                            </div>
                            
                            <div className='cites__choose-style'>    

                                <span className='cites__subheading'>Choose style of citation</span>

                                <div className='cites__box-styles'>

                                    <ul className='cites__list-style'>   
                                        {CiteStyles.map((st,subindex) => {
                                            return (
                                                <li data-tag={`${st.tag}`} className={`cites__li-style ${st.default ? 'cites__li-style--active' : 'cites__li-style--inactive'}`} key={subindex} onClick={(event) => chooseStyle(event)}>
                                                    {st.title}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <button className={`cites__btn-reload sm-btn ${cite[chosenStyle] ? "cites__btn-reload--loaded" : ''}`} onClick={() => LoadCite(item[1].id)}>
                                        {cite[chosenStyle] ? "Loaded" : "Load citation" }
                                    </button>
                                    {(!cite[chosenStyle] && !styleLoading) ? <div className='cites__arrow'><BsArrowUp /></div> : null}
                                </div>
                            </div>

                            <div className='cites__style'>

                                <div className='cites__output'>

                                        {styleLoading ?  <div className='loader-container'><span className='loader'></span></div> 
                                            : cite[chosenStyle] ? 
                                                <CSSTransition 
                                                classNames="ease"
                                                timeout={1000}
                                                in={true}
                                                appear={true}>
                                                    <div className='cites__cite'>{cite[chosenStyle]}</div>
                                                </CSSTransition>
                                                : <div className='cites__action'>Please, press Load citation button to upload this citation style.</div>
                                        }

                                </div>

                                <div className='cites__cont-copy'>
                                    <span>
                                        {CiteStyles.find(elem => elem.tag === loadTag).desc}
                                    </span>
                                    <a className='cites__about-style link-out-question'><BsQuestionCircle />More details</a>
                                    <button className='cites__btn-copy sm-btn sm-btn--sm'><ImCopy /> Copy Citation to Clipboard</button>
                                </div>             
                            </div>

                            <div>
                                Need more styles of citation? Paste the article DOI to this link https://citation.crosscite.org/
                            </div>

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
                        
                    </div>
                    
                )}
            </div>
        </div>
    );
 
}
    
export default SearchQuery;