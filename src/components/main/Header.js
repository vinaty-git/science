import { ReactComponent as Logo } from '../../icons/logo.svg';
import React, { useState, useContext } from 'react';
import AuthContext from '../../AuthContext';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Header(props) {
    const {setModalOpen,setOpenLogin} = props;
    const {isUser,setIsUser} = useContext(AuthContext);

    /**
     * Open window modal for registration
     */
    function OpenSignUp() {
        setModalOpen(true);
        setOpenLogin(false);
    }

    /**
     * Sign out on click and detele token
     */
    function OpenSignOut() {
        cookies.remove('_token2');
        setIsUser(false);
        setOpenLogin(false);
        setModalOpen(false);
    }

    /**
     * Open Login modal
     */
    function OpenLogin() {
        setOpenLogin(true);
        setModalOpen(true);
    }

    return(
        <div className="header">

            <div className="header__logo">
                <Logo />
                <h2>
                    Website name 
                </h2>
            </div>

            <div className="header__signin">
                {isUser === false ?
                    <>
                    <button className='btn-main btn-main--wide' onClick={OpenLogin}>Log in</button>
                    <button className='btn-main btn-main--wide' onClick={OpenSignUp}>Sign up</button>
                    </>
                :
                    <button className='btn-main btn-main--wide' onClick={OpenSignOut}>Logout</button>
                }
            </div>

        </div>
    );
}

export default Header;