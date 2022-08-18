import React, { useState, useContext } from 'react';
import Cookies from 'universal-cookie';
import RegCompleted from './RegCompleted';
import Reg from './Reg';
import LoginForm from './LoginForm';
import ForgotPsw from './ForgotPsw';
import Restored from './Restored';
import AuthContext from '../../AuthContext';

import signinImage from '../../icons/library-signin.png';
import { GrClose } from "react-icons/gr";

function SignUp(props) {
    const {setModalOpen,modalStatus,changeModalStatus} = props;
    const [email,setEmail] = useState();
    const [noUser,setNoUser] = useState(false); // If no user found during password restore
    const cookies = new Cookies();
    const {isUser,setIsUser,emailConfirmed,setEmailConfirmed} = useContext(AuthContext);
    var mailApi;

    /**
     * Email changer when sign up. Pass value to RegCompleted. Send email verification.
     */
    function changeEmail(email) {
        setEmail(email); // Email to the page of verification of the email RegCompleted.js
        mailApi = 'https://kirilab.ru/science/mailer.php';
        const queryMail = {
            "data": "email-confirm",
            "email": email
        }
        fetch(mailApi, {
            method: 'POST',
            cache: 'no-store',
            body: JSON.stringify(queryMail)
        })
        .then(response => {
            if (!response.ok || response.status > 399 ) {
                throw new Error("There was a problem with the server connection");
            }
            return response.text();
        })
        .then(response => {
            console.log(response);
        });
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
        setEmail();
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

                {(isUser && 'confirm') ? 
                    <RegCompleted 
                    email={email}
                    />
                : modalStatus === 'login' ?
                    <LoginForm 
                    loginCompleted={loginCompleted}
                    changeModalStatus={changeModalStatus}
                    />
                : modalStatus === 'forgot' ?
                    <ForgotPsw 
                    changeModalStatus={changeModalStatus}
                    setEmail={setEmail}
                    setNoUser={setNoUser}
                    />
                : modalStatus === 'sign-up' ?
                    <Reg
                    changeEmail={changeEmail}
                    changeRegCompleted={changeRegCompleted}
                    changeModalStatus={changeModalStatus}
                    />
                : modalStatus === 'restored' ?
                    <Restored 
                    email={email}
                    noUser={noUser}
                    setNoUser={setNoUser}
                    changeModalStatus={changeModalStatus}
                    />
                : null}

            </div>
        </div>
    );
}

export default SignUp;