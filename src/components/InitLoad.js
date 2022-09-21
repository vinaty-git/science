import React from 'react';
import Logo from './../icons/logo-tree.png';

function InitLoad() {
    return(
        <div className='search__container-initload'>
            <img src={Logo} />
            <h2>Scholar</h2>
            <p>Science search engine</p>
        </div>
    );
}

export default InitLoad;