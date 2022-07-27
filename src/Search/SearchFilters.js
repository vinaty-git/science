import React, { useEffect, useState, useRef } from 'react';
import { BsSearch } from "react-icons/bs";
import { AiOutlineFileSearch } from "react-icons/ai";

function SearchFilters({passSetTextOutput,passQueryStarted,passUpdateQuery,passSetTypeSearch}) {
    
    let searchInputRef = React.useRef(); // Реф инпута отправки поискового запроса 

    // Отправка поискового запроса
    function searchInput() {
        passSetTextOutput(searchInputRef.current.value);
    }

    // Функция смены базы api поиска 
    function changeTypeSearch(event) {
        event.stopPropagation();
        var dataType = event.target.getAttribute('data-type');
        var allTypes = document.querySelectorAll('.search__btn-type');
        allTypes.forEach(item => {item.classList.remove('sm-btn-sec--active')});
        event.target.classList.add('sm-btn-sec--active');
        passSetTypeSearch(dataType);
    }

    // При нажатии открывается список фильтров
    function openFilters(event) {
        document.querySelector('.search__all-filters').classList.toggle('search__all-filters--active');
        event.target.classList.toggle('btn-main--reverse');
    }

    return (
        <div className='search__heading block'>
            <h2>Search by scientific articles and datasets</h2>
            <div className='search__request'>
                <form className='search__form'>
                    <input type="text" className='search__input' onInput={searchInput} ref={searchInputRef}  placeholder="Type your search request..." />
                    {!passQueryStarted ? 
                        <button type="button" onClick={passUpdateQuery} className='btn-main' >
                            <span className='btn-main__title'><BsSearch />Search</span>
                        </button> 
                        :
                        <button type="button" className='btn-main btn-main--inactive' >
                            <span className='btn-loader-container'><span className='btn-loader'></span></span>Searching
                        </button>
                    }
                    <button type="button" onClick={openFilters} className='btn-main btn-main--reverse' >
                        <span className='btn-main__title'><AiOutlineFileSearch />Advanced search</span>
                    </button>
                </form>
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