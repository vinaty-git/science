import React from "react";
import { CSSTransition } from 'react-transition-group';

/**
     * Short/Full description of the item
     * @param {*} item - A data of one article
     * @param {*} index - Index of the item from array allItems
     * @returns {JSX.Element}
     */
 function CommonBody(props) {
    const {item,index,fullDesc} = props;
    var abstractCombine;
    var regex = /(<([^>]+)>)/ig; // Удаляем html теги из поисковой выдачи
    
    return (
        <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>                 
            {item.attributes.descriptions?.length > 0 ?
            item.attributes.descriptions.map((item,subindex) => {
                abstractCombine = (item.descriptionType + ": " + item.description).replace(regex, "");
                // var cleanAbstractCombine = abstractCombine.replace(/u2019/g, '\u2019');
                return (
                    <span key={"abstract-"+index+"-"+subindex}>
                        {fullDesc[index] ? 
                        <CSSTransition 
                        classNames="slide"
                        timeout={1100}
                        in={true}
                        appear={true}>
                            <React.Fragment><span>{abstractCombine}</span></React.Fragment>
                        </CSSTransition>
                        : abstractCombine.substring(0, 700)+"..." }
                    </span>
                )
            })
            : <span>No description provided</span>}
        </div>
    );
}

export default CommonBody;