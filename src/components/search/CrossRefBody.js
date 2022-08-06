import React from 'react';
import { CSSTransition } from 'react-transition-group';

function CrossRefBody(props) {
    const {item, index, fullDesc} = props;
    var abstract,abstractFull;
        if (item.abstract && (item.abstract !== '')) {
            var cleanAbstract = item.abstract.replace(/<(.|\n)*?>/g, '');
            // var quoteabstract = cleanAbstract.replace('u20191111', '\u2019');
            abstract = cleanAbstract.replace('[...]','');
            if (abstract.length > 700) {
                abstractFull = abstract;
                abstract = abstract.substring(0, 700)+"...";
            }
        } else {
            abstract = "No description provided";
        }
        return (
            <div className={fullDesc[index] ? 'search-item__abstract search-item__abstract--full' : 'search-item__abstract search-item__abstract--short'}>                     
                {fullDesc[index] ? 
                    <CSSTransition 
                    classNames="slide"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span >{abstractFull}</span>
                    </CSSTransition>
                : abstract}
            </div>
        );
}

export default CrossRefBody;