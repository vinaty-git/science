import '../styles/index.scss';
import Header from '../components/main/Header';
import SearchFilters from '../components/SearchFilters';
import React, { useState, useContext } from 'react';
import AuthContext from '../AuthContext';
import mainBg from '../icons/bg-main.png';

function Main(props) {

const {setModalOpen,changeModalStatus} = props;
const {isUser} = useContext(AuthContext);

 return(
    <div className="main landing main--expanded">
        <img className='landing__bg' src={mainBg} />
        <Header 
            changeModalStatus={changeModalStatus}
            setModalOpen={setModalOpen}
        />

        <div className='main__search'>
        <SearchFilters
                        // textOutput={textOutput}
                        // typeSearch={typeSearch}
                        // passSetTextOutput={setTextOutput}
                        // passQueryStarted={queryStarted}
                        // passUpdateQuery={updateQuery}
                        // passSetTypeSearch={setTypeSearch}
        />

        </div>

        <div className='main__search'>
            Hero block

        </div>

        <div className='main__search'>
            Pluses

        </div>

    </div>
 );   
}

export default Main;