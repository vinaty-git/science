import '../styles/index.scss';
import Header from '../components/main/Header';
import React, { useState, useContext } from 'react';
import AuthContext from '../AuthContext';
import mainBg from '../icons/bg-main.png';

function Main(props) {

const {setModalOpen,setOpenLogin} = props;
const {isUser} = useContext(AuthContext);

 return(
    <div className="main landing main--expanded">
        <img className='landing__bg' src={mainBg} />
        <Header 
            setModalOpen={setModalOpen}
            setOpenLogin={setOpenLogin}
        />

        <div className='main__search'>
            Search
            {isUser}

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