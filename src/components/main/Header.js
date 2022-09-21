// import { ReactComponent as Logo } from '../../icons/logo.svg';
import React, { useState, useContext } from 'react';
import AuthContext from '../../AuthContext';
import Logo from '../../icons/logo-tree.png';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Header(props) {
    const {setModalOpen,changeModalStatus} = props;
    const {isUser,setIsUser} = useContext(AuthContext);

    /**
     * Sign out on click and detele token
     */
    function OpenSignOut(event) {
        cookies.remove('_token2');
        changeModalStatus(event);
        setIsUser(false);
        setModalOpen(false);
    }

    return(
        <div className="header">

            <div className="header__signin">
                {isUser === false ?
                    <>
                    <button data-modal='login' className='btn-main btn-main--wide btn-main--outline' onClick={changeModalStatus}>Log in</button>
                    <button data-modal='sign-up' className='btn-main btn-main--wide btn-main--outline' onClick={changeModalStatus}>Sign up</button>
                    </>
                :
                    <button className='btn-main btn-main--wide btn-main--outline' onClick={OpenSignOut}>Logout</button>
                }
            </div>

        </div>
    );
}

export default Header;