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
        passSetTypeSearch
    } = props;

    let searchInputRef = React.useRef(); // Реф инпута отправки поискового запроса 

    // Последний успешный поиск
    const [lastSearch,setLastSearch] = useState({
        typeSearch:null,
        query:null
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
            (lastSearch.typeSearch !== typeSearch))) {
                var newSearch = {
                    typeSearch:typeSearch,
                    query:textOutput
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
        document.querySelector('.search__all-filters').classList.toggle('search__all-filters--active');
        event.target.classList.toggle('btn-main--reverse');
    }

    return (
        <div className='search__heading block'>
            <h2>Search by scientific articles and datasets</h2>
            <div className='search__request'>
                <div className='search__form'>
                    <input id='search-input' type="text" className='search__input' onKeyPress={(event) => enterOnInput(event)} onInput={searchInput} ref={searchInputRef}  placeholder="Type your search request..." />
                    <div id='input-notification' className='search__input-notification' >Please, change your search request. It has not to be empty or repeat your last request</div>
                    {!passQueryStarted ? 
                        <button type="button" onClick={sendSearchQuery} className='search__btn-search btn-main' >
                            <span className='btn-main__title'><BsSearch />
                            <span>Search</span></span>
                        </button> 
                        :
                        <button type="button" className='search__btn-search btn-main btn-main--inactive' >
                            <span className='btn-loader-container'><span className='btn-loader'></span></span>
                            <span>Searching</span>
                        </button>
                    }
                    <button type="button" onClick={openFilters} className='btn-main btn-main--reverse' >
                        <span className='btn-main__title'><AiOutlineFileSearch />Advanced search</span>
                    </button>
                </div>
            </div>
            <div className='search__filters'>
                <div className='search__btn-types'>
                    <button data-type='works' className='search__btn-type sm-btn-sec' onClick={(event) => changeTypeSearch(event)}>Works</button>
                    <button data-type='sets' className='search__btn-type sm-btn-sec sm-btn-sec--active' onClick={(event) => changeTypeSearch(event)}>Data Sets</button>
                </div>
                <div className='search__all-filters'>
                    <div className='search__inner-all-filters'>
                    Тут будут фильтры с вариантами по источнику апи
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SearchFilters;