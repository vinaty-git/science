import React, { useEffect, useState, useRef } from 'react';
import { BsSearch } from "react-icons/bs";

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

    return (
        <div className='search__heading block'>
            <div className='search__request'>
                <form>
                    <input type="text" className='search__input' onInput={searchInput} ref={searchInputRef}  defaultValue="Type your search request..." />
                    {!passQueryStarted ? 
                        <button type="button" onClick={passUpdateQuery}className='btn-main' >
                            <BsSearch />Search
                        </button> 
                        :
                        <button type="button" className='btn-main--inactive' >
                            <span>O</span>Searching
                        </button>
                    }
                </form>
            </div>
            <div className='search__filters'>
                <button data-type='works' className='search__btn-type sm-btn-sec' onClick={(event) => changeTypeSearch(event)}>Works</button>
                <button data-type='sets' className='search__btn-type sm-btn-sec sm-btn-sec--active' onClick={(event) => changeTypeSearch(event)}>Data Sets</button>
            </div>
        </div>
    );
}
export default SearchFilters;