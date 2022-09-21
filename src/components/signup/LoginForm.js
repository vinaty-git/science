import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { AiFillEyeInvisible,AiFillEye } from "react-icons/ai";
import { BiMessageSquareError } from "react-icons/bi";

function LoginForm(props) {
    const {loginCompleted,changeModalStatus} = props;
    const [passwordShown,setPasswordShown] = useState(false);
    const [emailLogged,setEmailLogged] = useState(false);
    const [emailValid,setEmailValid] = useState(false);
    const [passwordLogged,setPasswordLogged] = useState(false);
    const [noUserFound, setNoUserFound] = useState(false);
    const [wrongPsw,setWrongPsw] = useState(false);
    var sessionEmail,sessionPsw;

    /**
     * Show or Hide Password in sign up form
     */
    function changePswView() {
        setPasswordShown(passwordShown => !passwordShown);
    }

    /**
     * Validate email regex
     * @param {*} email 
     * @returns 
     */
    function isValidEmail(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    /**
     * Validate email input
     * @param {*} event 
     */
    function emailHandlerLogin(event) {
        setNoUserFound(false);
        clearTimeout(sessionEmail);
        sessionEmail = setTimeout(() => {
            if(!isValidEmail(event.target.value)) {
                setEmailValid(false);
            } else {
                setEmailValid(true);
            }
            
            if (event.target.value.length > 0) {
                setEmailLogged(true);
            } else {
                setEmailLogged(false);
            }
        },800);
    }

    /**
     * Password validation
     * @param {*} event 
     */
     function pswHandler(event) {
        setWrongPsw(false);
        clearTimeout(sessionPsw);
        sessionPsw = setTimeout(() => {
            if(event.target.value.length > 0) {
                setPasswordLogged(true);
            } else {
                setPasswordLogged(false);
            } 
        },1100);
    }

    function Login(event) {
        event.preventDefault();
        var email = document.getElementById('email-login').value;
        var password = document.getElementById('psw-login').value;
        var regApi = 'https://kirilab.ru/science/reg.php';
        const queryLogin = {
            "data": "login",
            "password": password,
            "email": email
        };
        fetch(regApi, {
            method: 'POST',
            cache: 'no-store',
            body: JSON.stringify(queryLogin)
        })
        .then(response => {
            if (!response.ok || response.status > 399 ) {
                throw new Error("There was a problem with the server connection");
            }
            return response.text();
        })
        .then(response => {
            if (response === 'no email or psw') {
                throw "no email or psw"
            } else if (response === 'no user') {
                setNoUserFound(true);
            } else if (response === 'psw wrong') {
                setWrongPsw(true);
            } else if (response.length > 100 && response.length < 160 ) {
                var token = response;
                loginCompleted(token);
            } else {
                throw "unexpected error"
            }
        })
        .catch(err => {
            console.error(err);
        })
    }

    return(
        <>
        <div className="modal-signin__heading">
            <h3>Log in your account</h3>
            {/* <p>Join our free science search engine</p> */}
        </div>
        <div className="modal-signin__info">
            <form id="log-in" className="modal-signin__form" onSubmit={Login} >

                <label>Email</label>
                <div className="modal-signin__input-div">
                    <input 
                        id="email-login"
                        type="email"
                        name="email"
                        placeholder="Type your email"
                        onChange={emailHandlerLogin}
                    />
                    {(!emailValid && emailLogged) || noUserFound === true ?
                        <CSSTransition 
                        classNames="ease"
                        timeout={1100}
                        in={true}
                        appear={true}>
                            <span className="modal-signin__icon-help">
                                <BiMessageSquareError />
                            </span>
                        </CSSTransition>
                    : null }

                </div>

                <CSSTransition 
                    classNames="ease"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <>
                            <span className={'modal-signin__help-psw' + 
                            ((emailValid === false && emailLogged === true) ? ' modal-signin__help-psw--displayed' : '')}>
                                It seems that your email typed with mistake
                            </span>

                            <span className={'modal-signin__help-psw' + 
                            (noUserFound === true ? ' modal-signin__help-psw--displayed' : '')}>
                                There is no user registered with that email address.
                            </span>
                        </>
                </CSSTransition>

                <label>Password</label>
                <div className="modal-signin__input-div">
                    <input
                        id="psw-login"
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        placeholder="Type your password"
                        onChange={pswHandler}
                    />
                    {wrongPsw === true ?
                        <CSSTransition 
                        classNames="ease"
                        timeout={1100}
                        in={true}
                        appear={true}>
                            <span className="modal-signin__icon-help">
                                <BiMessageSquareError />
                            </span>
                        </CSSTransition>
                    : null }
                    <span className='modal-signin__view-psw' onClick={changePswView}>
                        {passwordShown ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                </div>
                <CSSTransition 
                    classNames="ease"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span className={'modal-signin__help-psw' + 
                        (wrongPsw ? ' modal-signin__help-psw--displayed' : '')}>
                            You have entered wrong password
                        </span>
                </CSSTransition>

                {(emailLogged && emailValid && passwordLogged) ?             
                    <button
                    className="btn-main btn-sign-in btn-sign-in"
                    type="submit" 
                    form="log-in" 
                    value="Log in"

                    >
                        Log in
                    </button>
                : 
                    <button
                    className="btn-main btn-sign-in btn-sign-in--inactive"
                    value="Log in"
                    >
                        Log in
                    </button>
                }

                <div className="modal-signin__forget">
                    <a data-modal='forgot' onClick={changeModalStatus}>
                        Forgot your password?
                    </a>
                    <a data-modal='sign-up' onClick={changeModalStatus}>
                        Do not have an account yet?
                    </a>
                </div>
            </form>
        </div>
        </>
    );
}

export default LoginForm;