import React, { useState, useContext } from 'react';
import Cookies from 'universal-cookie';
import RegCompleted from './RegCompleted';
import Reg from './Reg';
import LoginForm from './LoginForm';
import AuthContext from '../../AuthContext';

import signinImage from '../../icons/library-signin.png';
import { GrClose } from "react-icons/gr";

function SignUp(props) {
    const {setModalOpen,openLogin,setOpenLogin} = props;
    const [regCompleted,setRegCompleted] = useState(false);
    const [email,setEmail] = useState();
    const cookies = new Cookies();
    const {isUser,setIsUser,emailConfirmed,setEmailConfirmed} = useContext(AuthContext);

    /**
     * Email changer when sign up. Pass value to RegCompleted
     */
    function changeEmail(email) {
        setEmail(email); // Email to the page of verification of the email RegCompleted.js
    }

    /**
     * Change status of modal after registration is finished and set cookies token
     */
    function changeRegCompleted (token) {
        cookies.set('_token2', token, {expires: new Date(Date.now()+2592000)});
        setEmailConfirmed(false); // Email is not confirmed
        setIsUser(true); // Change state in AuthContext
    }

    /**
     * Change status of modal after login and set cookies token
     */
    function loginCompleted (token) {
        cookies.remove('_token2');
        cookies.set('_token2', token, {expires: new Date(Date.now()+2592000)});
        setIsUser(true); // Change state in AuthContext
        setModalOpen(false);
    }


    /**
     * Hide modal Sign In/Sign Up
     */
    function HideSignUp() {
        setModalOpen(false);
        setOpenLogin(false);
    }

    return (
        <div className="modal-signin">

            <div className="modal-signin__image">
                <img src={signinImage} />
            </div>

            <div className="modal-signin__content">

                <span className='modal-signin__close' onClick={() => HideSignUp()}>
                    <GrClose />
                </span>

                {(!emailConfirmed && isUser && !openLogin) ? 
                    <RegCompleted 
                    email={email}
                    />
                : openLogin ?
                    <LoginForm 
                    setOpenLogin={setOpenLogin}
                    loginCompleted={loginCompleted}
                    />
                :
                    <Reg
                    changeEmail={changeEmail}
                    changeRegCompleted={changeRegCompleted}
                    setOpenLogin={setOpenLogin}
                    />
                }

            </div>
        </div>
    );
}

export default SignUp;