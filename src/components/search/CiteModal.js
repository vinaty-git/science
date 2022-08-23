import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CiteStyles } from '../../data/DataCitesStyles.js';

import { GrClose } from "react-icons/gr";
import { BsQuestionCircle, BsArrowUp } from "react-icons/bs";
import { ImCopy } from "react-icons/im";
import { FaExternalLinkAlt } from "react-icons/fa";

function CiteModal(props) {
    const {item,index,InitCitation,typeSearch,Library} = props;
    let citeText = React.useRef(); // Реф для нахождения поля с текстом цитаты для копирования в буфер пользователя
    var loadStyle,doi,title;
    var regex = /(<([^>]+)>)/ig; // Удаляем html теги
    
    const [loadTag,setLoadTag] = useState('apa'); // State того, что нажато из списка стилей цитирования (тег)
    const [chosenStyle,setChosenStyle] = useState('apa'); // Стиль цитирования для API (полный)
    const [cite,setCite] = useState({}); // Стили цицитирования загруженные в генераторе цитирования 
    const [styleLoading, setStyleLoading] = useState(false); // Статус загрузки fetch стилей цитирования для показа загрузки
    const [errorCite,setErrorCite] = useState(null); // Стейт для ошибки при fecth стиля цитирования

    /**
     * При инициализации сбрасываем ошибки и передаем текущий style doi для загрузки
     */
    useEffect(() => {
        LoadCite(item);
        setErrorCite(null);
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
    },[]);

    /**
     * Изменение стейтов при нажатии на выбор стиля цитирования, записывается loadTag, из json берется loadSyle
     * @param {*} event - элемент по которому кликнули
     */
    function chooseStyle(event) {
        document.querySelectorAll('.cites__li-style').forEach(i => {
            i.classList.remove('cites__li-style--active');
        });
        event.target.classList.add('cites__li-style--active');
        setLoadTag(event.target.getAttribute('data-tag'));
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        setErrorCite(null);
        setStyleLoading(false);
    }
    
    /**
     * При изменении стейта loadTag (выбрали стиль) записывается chosenStyle. То есть полное наименование стиля для отправки в DOI
     */
     useEffect(() => {
        loadStyle = CiteStyles.find(el => el.tag === loadTag).style;
        setChosenStyle(loadStyle);
    },[loadTag]);

    /**
     * Закрыть модальное окно с цитатами
     */
     function HideCites() {
        document.body.classList.toggle('ovelaped');
        document.querySelector('.modal-bgn').classList.toggle('modal-bgn--hidden');
        InitCitation(index);
    }

    /**
     * Скопировать doi внизу модального окна
     * @param {*} event - элемент по которому произошел клик
     */ 
    function copyDoi(event) {
        navigator.clipboard.writeText(event.target.parentNode.querySelector('.cites__text-doi').textContent);
        var copiedDoiSpan = event.target.parentNode.querySelector('.doi-copied-span');
        copiedDoiSpan.classList.add('doi-copied-span--active');
        setTimeout(closeCopyDoi, 2000);
        function closeCopyDoi () {
            copiedDoiSpan.classList.remove('doi-copied-span--active');
        }
    }

    /**
     * При нажатии на кнопку Скопировать в буфер (копируем цитату в модальном окне)
     */
    function copyCite(index) {
        navigator.clipboard.writeText(citeText.current.textContent);
        var copiedSpan = document.getElementById('ccs-'+index);
        copiedSpan.classList.add('copied--active');
        setTimeout(closeCopySpan, 2000);
        function closeCopySpan() {
            copiedSpan.classList.remove('copied--active');
        }
    }

    /**
     * Кнопка fetch выбранный стиль цитирования с doi по api
     * @param {*} doi - doi идентификатор выбранной статьи для fetch в doi.org
     */
     function LoadCite(item) {
        if (Library === true) {
            doi = item.doi;
        } else {
            if (item.id) {
                doi = item.id;
            } else if (item.DOI) {
                doi = item.DOI;
            }

        }
        if (!cite[chosenStyle]) {
            setStyleLoading(true); // Включаем отображение анимации загрузки
            fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
                redirect: 'follow',
                headers: {
                    "Accept": `text/x-bibliography; style=${chosenStyle}`,
                }
            })
            .then(response => {
                if(response.status === 404) {
                    throw Error('The DOI was not found. It seems that there is no such publication in the DOI database.');
                } else if (response.status !== 200) {
                    throw Error(`Error: ${response.status}. There was a problem receiving a data from the DOI server. Please try again later or try to use a link below (https://citation.crosscite.org/).`);
                } 
                return response.text();
            })
            .then(response => {
                var cleanResponse = response.replace(regex, "");
                setCite({...cite, [chosenStyle]: cleanResponse});
                setStyleLoading(false); // Выключаем отображение анимации загрузки
                setErrorCite(null); // Стейт наличия ошибки при загрузке items null
            })
            .catch(err => {
                setErrorCite(err.message);
                if ((err.message === "Failed to fetch")) {
                    setErrorCite("The DOI server didn't response. Please try again later.");
                }
            });
        }
    }

    /**
     * Check and return title of the item
     * @returns {JSX.Element}
     */
    function citeTitle() {
        if (item.attributes) {
            item.attributes.titles?.length > 0 ? (
                title = item.attributes.titles[0].title
            ) : (
                title = 'No title provided'
            )
        } else if (item.title) {
            item.title?.length > 0 ? (
                title = item.title[0]
            ) : ( title = 'No title provided'
            )
        }
        return (
            <div className='cites__title'>
                <span className='cites__span-title'>
                    {Library ? item.title : <span>{title.replace(regex, "")}</span>}
                </span>
            </div>
        );
    }

    return (
        <>
            <div className='modal-bgn modal-bgn--hidden' onClick={() => HideCites()}></div>

            <div id={"cites-"+index} className='cites cites--active'>
                
                <div className='cites__heading'>
                    <h4>DOI Citation Formatter</h4>
                    <span className='cites__close' onClick={() => HideCites()}><GrClose /></span>
                </div>

                {citeTitle()}
            
                <div className='cites__box-styles'>

                    <ul className='cites__list-style'>   
                        {CiteStyles.map((st,subindex) => {
                            return (
                                <li 
                                    data-tag={`${st.tag}`} 
                                    className={`cites__li-style ${st.tag == loadTag ? 'cites__li-style--active' : 'cites__li-style--inactive'}`}
                                    key={subindex} 
                                    onClick={(event) => chooseStyle(event)}
                                >
                                    {st.title}
                                </li>
                            )
                        })}
                    </ul>
                    <button className={`cites__btn-reload sm-btn ${cite[chosenStyle] ? "cites__btn-reload--loaded" : ''}`} onClick={() => LoadCite(item)}>
                        {cite[chosenStyle] ? "Loaded" : !errorCite ? "Load citation" : "Reload"}
                    </button>
                    {(!cite[chosenStyle] && !styleLoading) ? 
                        <div className='cites__arrow'><BsArrowUp /></div> 
                    : null}
                </div>

                <div className='cites__style'>

                    <div className='cites__output'>
                        
                            <div>{styleLoading}</div>
                            {errorCite ? errorCite :
                                styleLoading ?  <div className='loader-container'><span className='loader'></span></div> 
                                    : cite[chosenStyle] ? 
                                        <CSSTransition 
                                        classNames="ease"
                                        timeout={1000}
                                        in={true}
                                        appear={true}>
                                            <div className='cites__cite' ref={citeText}>
                                                {cite[chosenStyle]}
                                            </div>
                                        </CSSTransition>
                                        : <div className='cites__action'>Please, press Load citation button to upload this citation style.</div>
                            }
                    </div>

                    <div className='cites__cont-copy'>
                        <span className='cites__desc-style'>
                            {CiteStyles.find(elem => elem.tag === loadTag).desc}
                        </span>
                        <a className='cites__about-style link-out-question' href={CiteStyles.find(elem => elem.tag == loadTag).link} target='_blank' rel='noopener noreferrer'><BsQuestionCircle />More details</a>
                        {(errorCite || styleLoading || !cite[chosenStyle]) ? null :
                            <button className='cites__btn-copy sm-btn sm-btn--sm' onClick={() => copyCite(index)}><span><ImCopy />Copy to Clipboard</span></button>
                        }   
                        <span id={`ccs-${index}`} className='copied'>This citation was copied</span>
                    </div>  

                </div>

                <div className='cites__ad-cont'>
                    <span className='cites__ad-text'>Need more styles of citation? Paste the article DOI to this link 
                        <a 
                            className='link-out-question' 
                            href='https://citation.crosscite.org/' 
                            target='_blank' rel='noopener noreferrer'>
                            crosscite.org<FaExternalLinkAlt />
                        </a>
                    </span>
                </div>

                <div className='cites__cont-doi'>
                    <div className='cites__cont-doi-inner'>
                        <span className='cites__h-doi'>DOI</span>
                        <span className='cites__text-doi'>
                            {item.DOI ? item.DOI : Library ? item.doi : item.id}
                        </span>
                        <span className='cites__copy-doi' onClick={(event) => copyDoi(event,index)}><ImCopy />Copy</span>
                        <span className='doi-copied-span'>DOI in your clipboard</span>
                    </div>
                </div>

            </div>
        </>
    );
}
export default CiteModal;