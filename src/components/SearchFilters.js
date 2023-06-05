import React, { useEffect, useState, useRef } from 'react';
import { BsSearch } from "react-icons/bs";
import { AiOutlineFileSearch } from "react-icons/ai";

function SearchFilters(props) {
    const {
        textOutput,
        typeSearch,
        passSetTextOutput,
        passQueryStarted,
        passUpdateQuery,
        passSetTypeSearch,
        setFilterYear,
        setFilterAuthor,
        setFilterType,
        stopSearch
    } = props;

    let searchInputRef = React.useRef(); // Реф инпута отправки поискового запроса 

    // Last search
    const [lastSearch,setLastSearch] = useState({
        typeSearch:null,
        query:null,
        options:false
    }); 

    /**
     * Отправка поискового запроса из searchInputRef в state setTextOutput (в Search) для fetch
     */
    function searchInput() {
        passSetTextOutput(searchInputRef.current.value);
    }

    /**
     * Проверили если при активном input нажат Enter, то передали поисковой запрос в sendSearchQuery
     * @param {*} event 
     */
    function enterOnInput(event) {
        if (event.key === 'Enter') {
                sendSearchQuery();  
        }
    }
    
    /**
     * Проверка поискового запроса = не пустой, не равен прошлому запросу в этой базе
     */
    function sendSearchQuery() {
        if (textOutput !== '' && 
            ((lastSearch.typeSearch === typeSearch && lastSearch.query !== textOutput) || 
            (lastSearch.typeSearch !== typeSearch) || 
            (lastSearch.typeSearch === typeSearch && lastSearch.query === textOutput && lastSearch.options === false))) {
                var newSearch = {
                    typeSearch:typeSearch,
                    query:textOutput,
                    options:true
                }
                setLastSearch(newSearch);
                passUpdateQuery(); 
        } else {
            var searchNote = document.getElementById('input-notification');
            searchNote.classList.add('search__input-notification--active');
            setTimeout(() => {
                searchNote.classList.remove('search__input-notification--active');
            },3000);
        }
    }

    /**
     * Смена базы api поиска и обновление поисковой выдачи
     * @param {*} event 
     */ 
    function changeTypeSearch(event) {
        event.stopPropagation();
        var dataType = event.target.getAttribute('data-type');
        var allTypes = document.querySelectorAll('.search__btn-type');
        allTypes.forEach(item => {item.classList.remove('sm-btn-sec--active')});
        event.target.classList.add('sm-btn-sec--active');
        passSetTypeSearch(dataType);
    }

    /**
     * При нажатии открывается список фильтров
     * @param {*} event 
     */
    function openFilters(event) {
        document.querySelector('.search__all-options')?.classList.toggle('search__all-options--active');
        event.target.classList.toggle('btn-main--reverse');
        var settingsBtn = event.target.querySelector('.btn-main__title');
        if (settingsBtn.textContent === 'Open Options') {
            settingsBtn.textContent = 'Close Options'
        } else {
            settingsBtn.textContent = 'Open Options'
        }
    }

    /**
     * Check option date of article
     * @param {*} event 
     */
    function typeDate(event) {
        var inputValue = event.target.value;
        if (inputValue.length > 4) {
            var newValue = inputValue.substr(0,4);
            event.target.value = newValue;
        } else if (inputValue > 2022) {
            event.target.value = 2022;
        } else if (inputValue < 1600 && inputValue.length > 3) {
            event.target.value = 1600;
        }
        setFilterYear(event.target.value);
        setLastSearch({...lastSearch, options:false})
    }

    /**
     * Check option author of article
     * @param {*} event 
     */
    function typeAuthor(event) {
        var inputValue = event.target.value;
        event.target.value = inputValue.replace(/[0-9]/g, '');
        setFilterAuthor(event.target.value);
        setLastSearch({...lastSearch, options:false})
    }

    /**
     * Check option type of work
     * @param {*} event 
     */
    function typeWork(event) {
        setFilterType(event.target.value);
        setLastSearch({...lastSearch, options:false})
    }

    return (
        <div className='search__heading block'>
            <h2>Search by scientific articles and datasets</h2>

            {/* <div className='search__btn-desc'> */}

                <div className='search__btn-types'>

                    <button 
                    data-type='works' 
                    className='search__btn-type sm-btn-sec sm-btn-sec--active' 
                    onClick={(event) => changeTypeSearch(event)}>
                    Articles and Papers
                    </button>

                    <button 
                    data-type='sets' 
                    className='search__btn-type sm-btn-sec' 
                    onClick={(event) => changeTypeSearch(event)}>
                    Data Sets
                    </button>

                {/* </div> */}


                {typeSearch === 'works' ?
                    <div className='search__type-span'>
                    CrossRef Database: 138 million of records
                    </div>
                    :
                    <div className='search__type-span'>
                    DataCite Commons Database: 60 million of records
                    </div>
                }

                </div>

            {/* </div> */}

            <div className='search__request'>
                <div className='search__form'>
                    <input id='search-input' type="text" className='search__input' onKeyPress={(event) => enterOnInput(event)} onInput={searchInput} ref={searchInputRef}  placeholder="Type your search request..." />
                    <div id='input-notification' className='search__input-notification' >Please, change your search request. It has not to be empty or repeat your last request</div>
                    {!passQueryStarted ? 
                        <button type="button" onClick={sendSearchQuery} className='search__btn-search btn-main' >
                            <span className='btn-main__title'><BsSearch />
                            <span>Start Search</span></span>
                        </button> 
                        :
                        <button type="button" onClick={stopSearch} className='search__btn-search btn-main btn-main--inactive' >
                            <span className='btn-loader-container'><span className='btn-loader'></span></span>
                            <span>Stop Searching</span>
                        </button>
                    }
                    {typeSearch !== 'works' ? 
                        <button 
                        type="button" 
                        onClick={openFilters} 
                        className='search__btn-settings btn-main btn-main--reverse' 
                        >
                        <AiOutlineFileSearch /><span className='btn-main__title'>Close Options</span>
                        </button>
                    : ''
                    }
                </div>
            </div>
                
            {typeSearch !== 'works' ?
                <div className='search__options'>

                <div className='search__all-options search__all-options--active'>
                    <div className='search__inner-all-options'>
                    {/* <h3>Filters and Settings</h3> */}

                        {/* Date filter */}
                        <div className='search__option'>
                            <label className='search__option-label' htmlFor='publication_date'>
                                Publication date
                            </label>
                            <input 
                            id='publication_date' 
                            className='search__option-input publication_date' 
                            type="number"
                            onChange={typeDate}/>
                            <span className='search__option-span'>Format: yyyy</span>
                        </div>

                        {/* Author filter */}
                        
                        <div className='search__option'>
                            <label className='search__option-label' htmlFor='publication_author'>
                                Author
                            </label>
                            <input 
                            id='publication_author' 
                            className='search__option-input publication_author' 
                            type="text"
                            onChange={typeAuthor}
                            />
                            <span className='search__option-span'>Family name</span>
                        </div>

                        {/*Worktype filter */}
                        <div className='search__option'>
                            <label className='search__option-label' htmlFor='publication_type'>
                                Type
                            </label>
                            {typeSearch === 'works' ?
                                <select name="types" id="publication_type" className='search__option-input publication_type' 
                                onChange={typeWork}>
                                    <option defaultValue value='all'>All types</option>
                                    <option value='book'>Book</option>
                                    <option value='book-chapter'>Book Chapter</option>
                                    <option value='book-part'>Book Part</option>
                                    <option value='book-section'>Book Section</option>
                                    <option value='book-series'>Book Series</option>
                                    <option value='book-set'>Book Set</option>
                                    <option value='book-track'>Book Track</option>
                                    <option value='edited-book'>Edited Book</option>
                                    <option value='reference-book'>Reference Book</option>
                                    <option value='monograph'>Monograph</option>
                                    <option value='report'>Report</option>
                                    <option value='peer-review'>Peer Review</option>
                                    <option value='journal'>Journal</option>
                                    <option value='journal-article'>Journal Article</option>
                                    <option value='journal-volume'>Journal Volume</option>
                                    <option value='journal-issue'>Journal Issue</option>
                                    <option value='reference-entry'>Reference Entry</option>
                                    <option value='proceedings-article'>Proceedings Article</option>
                                    <option value='component'>Component</option>
                                    <option value='proceedings-series'>Proceedings Series</option>
                                    <option value='report-series'>Report Series</option>
                                    <option value='proceedings'>Proceedings</option>
                                    <option value='standard'>Standard</option>
                                    <option value='posted-content'>Posted Content</option>
                                    <option value='dissertation'>Dissertation</option>
                                    <option value='grant'>Grant</option>
                                    <option value='dataset'>Dataset</option>
                                    <option value='standard-series'>Standard Series</option>
                                    <option value='other'>Other</option>
                                </select>
                            :
                                <select name="types" id="publication_type" className='search__option-input publication_type' 
                                onChange={typeWork}>
                                    <option defaultValue value='all'>All types</option>
                                    <option value='Audiovisual'>Audiovisual</option>
                                    <option value='Book'>Book</option>
                                    <option value='BookChapter'>Book Chapter</option>
                                    <option value='Collection'>Collection</option>
                                    <option value='ComputationalNotebook'> Computational Notebook</option>
                                    <option value='ConferencePaper'>Conference Paper</option>
                                    <option value='ConferenceProceeding'>Conference Proceeding</option>
                                    <option value='DataPaper'>Data Paper</option>
                                    <option value='Dataset'>Dataset</option>
                                    <option value='Dissertation'>Dissertation</option>
                                    <option value='Event'>Event</option>
                                    <option value='Image'>Image</option>
                                    <option value='InteractiveResource'>Interactive Resource</option>
                                    <option value='Journal'>Journal</option>
                                    <option value='JournalArticle'>Journal Article</option>
                                    <option value='Model'>Model</option>
                                    <option value='OutputManagementPlan'>Output Management Plan</option>
                                    <option value='PeerReview'>Peer Review</option>
                                    <option value='PhysicalObject'>Physical Object</option>
                                    <option value='Preprint'>Preprint</option>
                                    <option value='Report'>Report</option>
                                    <option value='Service'>Service</option>
                                    <option value='Software'>Software</option>
                                    <option value='Sound'>Sound</option>
                                    <option value='Standard'>Standard</option>
                                    <option value='Text'>Text</option>
                                    <option value='Workflow'>Workflow</option>
                                    <option value='Other'>Other</option>
                                </select>
                        
                            }
                            <span className='search__option-span'>Select type</span>
                        </div>

                    </div>
                </div>

            </div>
            : ''
            }

        </div>
    );
}
export default SearchFilters;