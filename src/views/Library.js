import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import '../styles/library.scss';
import CrossRefHeader from '../components/search/CrossRefHeader';
import CrossRefBody from '../components/search/CrossRefBody';
import CrossRefButtons from '../components/search/CrossRefButtons';
import CrossRefFooter from '../components/search/CrossRefFooter';

import CommonHeader from '../components/search/CommonHeader';
import CommonBody from '../components/search/CommonBody';
import CommonButtons from '../components/search/CommonButtons';
import CommonFooter from '../components/search/CommonFooter';

function Library() {
    const [listBookmarks,setListBookmarks] = useState();
    const [allBookmarks, setAllBookmarks] = useState([]); // State закладок добавленных пользователем получаемых из БД
    const [loading, setLoading] = useState(true);
    const [fullDesc,setFullDesc] = useState({}); // В каких item открыто full desc. Index: true/false
    const [openedCites,setOpenedCites] = useState({}); // State текущего открытого модального окна с Citation formatter
    const [typeOutcome, setTypeOutcome] = useState(''); // State для определения базы по которой ищем ПОСЛЕ запуска
    const [currentLibrary,setCurrentLibrary] = useState('works');

    let firstInit = React.useRef(true);
    var userId = 2; // Temporary user id 

    /**
     * Кнопка добавления статьи в закладки пользователя и отправки в БД
     * @param {*} props - идентификатор добавляемой статьи
     */
    function AddBookmark(props) {
        var typeDb = typeOutcome;
        const queryAddBookmark = {
            "data": "addBookmark",
            "id": 2,
            "bookmark": props,
            "database": typeDb
        };
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(queryAddBookmark)
        })
        .then(response => response.json())
        .then((response) => {
            if (response == false) {
                console.log("This work or set is already in Bookmark");
            } else {
                setAllBookmarks(response);
            }
        });
    }
    
    /**
     * Кнопка удаления закладки из БД 
     * @param {*} props - идентификатор удаляемой статьи
     */
    function RemoveBookmark(props,event) {
        var thisItem = event.target.parentNode.parentNode;
        thisItem.classList.add('search__item-container--hidden');

        thisItem.addEventListener("transitionend",() => {
            setTimeout(() => {
                thisItem.classList.add('search__item-container--removed');
            },500);
        })
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

    /**
     * При нажатии инициализирует модальное окно Citation formatter
     * @param {*} index - Index of the item from array allItems
     */
        function InitCitation(index) {
        openedCites[index] ?
        setOpenedCites({})
        :
        setOpenedCites({[index]: true})
    }

    /**
     * При нажатии запоминает какой item имеет открытое полное описание
     * @param {*} index - Index of the item from array allItems
     * @returns 
     */
    function btnFullDesc(index) {
    setFullDesc(fullDesc => ({
        ...fullDesc,[index]: !fullDesc[index]
    }));
    }

    /**
     * Запрос в БД, получаем массив объектов из json items, type. 0 = works, 1 = sets
     */
    useEffect(() => {
        function GetBookmarks() {
            setLoading(true);
            const bookmarkLibrary = {
                "data": "bookmarkLibrary",
                "id": userId
            };
            fetch('https://kirilab.ru/science/func.php', {
                method: 'POST',
                body: JSON.stringify(bookmarkLibrary)
            })
            .then(response => response.json())
            .then(response => {
                var temp = JSON.stringify(response);
                var temp2 = temp.replace(/u2019/g, '\u2019');
                var temp3 = JSON.parse(temp2);
                setListBookmarks(temp3);
                var tempArray = [];
                response.forEach(item => {
                    tempArray.push({'doi':item.doi});
                });
                console.log(tempArray);
                setAllBookmarks(tempArray);
            })
        }
        GetBookmarks();
        console.log(listBookmarks);
    },[])
    
    /**
     * If listBookmarks loaded -> disable loading
     */
    useEffect(() => {
        if (firstInit.current === true) {
            firstInit.current = false;
        } else {
            setLoading(false);
        }
    },[listBookmarks]);

    function changeLibrary(event) {
        event.stopPropagation();
        var dataType = event.target.getAttribute('data-type');
        var allTypes = document.querySelectorAll('.search__btn-type');
        allTypes.forEach(item => {item.classList.remove('sm-btn-sec--active')});
        event.target.classList.add('sm-btn-sec--active');
        setCurrentLibrary(dataType);
    }

    /**
     * Catch errors and store in DB while loop bookmarks
     * @param {*} tempItem 
     */
    function errorLog(tempItem,error_doi,error_text) {
        const errorHandler = {
            "data": "errorHandler",
            "id": userId,
            "location": "Library",
            "error_doi": error_doi,
            "error": tempItem,
            "error_text": error_text,
        };
        fetch('https://kirilab.ru/science/func.php', {
            method: 'POST',
            body: JSON.stringify(errorHandler)
        })
    }

    /**
     * Выводим массив закладок пользователя Works (CrossRef)
     * @returns {JSX.Element}
     */
    function WorksBookmarks() {
        return(
            <>
            {!loading ? (
            <div className="library__items">
                {listBookmarks != null ? listBookmarks.map((preitem,index) => {
                    if (preitem.type == 0) {
                        var tempItem = preitem.json.replace(/'/g,'\'');
                        try {
                            var item = JSON.parse(tempItem);
                        }
                        catch (e) {
                            var error_text = e.message;
                            var error_doi = preitem.doi;
                            errorLog(tempItem,error_doi,error_text);
                            return false;
                        }
                        return(
                        <div key={index} className='search__item-container'>
                            <div key={index} className='search-item block'>

                                <CrossRefHeader 
                                item={item}
                                index={index}
                                />
                                <CrossRefBody 
                                item={item}
                                index={index}
                                fullDesc={fullDesc}
                                />
                                <CrossRefButtons 
                                item={item}
                                index={index}
                                fullDesc={fullDesc}
                                allBookmarks={allBookmarks}
                                RemoveBookmark={RemoveBookmark}
                                InitCitation={InitCitation}
                                AddBookmark={AddBookmark}
                                openedCites={openedCites}
                                btnFullDesc={btnFullDesc}
                                />
                                <CrossRefFooter
                                item={item}
                                index={index}
                                />

                            </div>
                        </div>
                        );
                    }
                }): null}
            </div>
            ) : (
            <Spinner />
            )}
            </>
        );
    }

    function SetsBookmarks() {
        return (
            <>
            {!loading ? (
            <div className="library__items">
                {listBookmarks != null ? listBookmarks.map((preitem,index) => {
                    if (preitem.type == 1) {
                        var tempItem = preitem.json.replace(/'/g,'\'');
                        try {
                            var item = JSON.parse(tempItem);
                        }
                        catch (e) {
                            var error_text = e.message;
                            var error_doi = preitem.json.id;
                            errorLog(tempItem,error_doi,error_text);
                            console.log("ERROR IN PARSE" + e);
                            return false;
                        }
                        return(
                        <div key={index} className='search__item-container'>
                            <div className='search-item block'>
                                <CommonHeader 
                                    index={index}
                                    item={item}    
                                />
                                <CommonBody 
                                    index={index}
                                    item={item}
                                    fullDesc={fullDesc}
                                />
                                <CommonButtons
                                    index={index}
                                    item={item}
                                    fullDesc={fullDesc}
                                    allBookmarks={allBookmarks}
                                    RemoveBookmark={RemoveBookmark}
                                    AddBookmark={AddBookmark}
                                    openedCites={openedCites}
                                    InitCitation={InitCitation}
                                    btnFullDesc={btnFullDesc}
                                />
                                <CommonFooter
                                    item={item}
                                    index={index}
                                />
                            </div>
                        </div>
                        );
                    }
                }) : null }
            </div>
            ) : (
            <Spinner />
            )}
            </>
        );
    }

 return(
    <div className="main library">
        <div className="library__heading block">
            <h2>Library</h2>
            <p>In the library section stored all you bookmarks. You can add new bookmarks in the Search section.</p>
            <div>
                <h4>Switcher</h4>
                <div className='search__btn-types'>
                    <button data-type='works' className='search__btn-type sm-btn-sec sm-btn-sec--active' onClick={(event) => changeLibrary(event)}>Works</button>
                    <button  data-type='sets' className='search__btn-type sm-btn-sec' onClick={(event) => changeLibrary(event)}>Sets</button>
                </div>
            </div>
        </div>
            {currentLibrary === 'works' ? (
                WorksBookmarks()
            ) : (
                SetsBookmarks()
            )}
    </div>
 );   
}

export default Library;