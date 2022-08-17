import React, { useState, useContext } from 'react';
// import AuthContext from '../../AuthContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BiMessageSquareError,BiMessageSquareCheck } from "react-icons/bi";
import { AiFillEyeInvisible,AiFillEye } from "react-icons/ai";

function Reg(props) {
    const {changeRegCompleted,changeEmail,setOpenLogin} = props;
    const [emailError,setEmailError] = useState('empty');
    const [pswLength,setPswLength] = useState(false);
    const [pswDigit,setPswDigit] = useState(false);
    const [pswUpper,setPswUpper] = useState(false);
    const [pswEmpty,setPswEmpty] = useState(true);
    const [specSymbols,setSpecSymbols] = useState(false);
    const [nonlatin,setNonlatin] = useState(false);
    const [passwordShown,setPasswordShown] = useState(false);
    const [usedEmail,setUsedEmail] = useState(false);
    var sessionEmail,sessionPsw,valuePsw,regApi,email;

    // const {setIsUser} = useContext(AuthContext);

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
    function emailHandler(event) {
        clearTimeout(sessionEmail);
        sessionEmail = setTimeout(() => {
            if(!isValidEmail(event.target.value)) {
                setEmailError(true);
            } else {
                setEmailError('confirmed');
            }
        },800);
    }

    /**
     * Clean helper after new email input (after user enter used email)
     */
    function cleanUsedEmail() {
        setUsedEmail(false);
    }

    /**
     * Password validation
     * @param {*} event 
     */
    function pswHandler(event) {
        clearTimeout(sessionPsw);
        sessionPsw = setTimeout(() => {
            valuePsw = event.target.value;

            if(valuePsw.length > 0) {
                setPswEmpty(false);
            } else {
                setPswEmpty(true);
            } 

            if(valuePsw.length > 7) {
                setPswLength(true);
            } else {
                setPswLength(false);
            } 

            if(/\d/.test(valuePsw)) {
                setPswDigit(true);
            } else {
                setPswDigit(false);
            }

            if(/[A-Z]/.test(valuePsw)) {
                setPswUpper(true);
            } else {
                setPswUpper(false);
            }

            if(valuePsw.match(/[\\/\'\"><&]/)) {
                setSpecSymbols(true);
            } else {
                setSpecSymbols(false);
            }

            if(/[^\u0000-\u00ff]/.test(valuePsw)) {
                setNonlatin(true);
            } else {
                setNonlatin(false);
            }
            

        },800);
    }

    const Registration = event => {
        event.preventDefault();
        email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        regApi = 'https://kirilab.ru/science/reg.php';
        const queryReg = {
            "data": "registration",
            "password": password,
            "email": email
        };
        try {
            let response = fetch(regApi, {
                method: 'POST',
                cache: 'no-store',
                body: JSON.stringify(queryReg)
            })
            .then (response => response.text())
            .then (response => {
                if (response === 'email used' || response === 'no password') {
                    if (response === 'email used') {
                        setUsedEmail(true);
                    }
                    throw "Error"
                } else {
                    var token = response;
                    changeRegCompleted(token); // SetStatus of unfinished email verification and set cookies
                    changeEmail(email); 
                }
            });

        } catch(error) {
            errorSearch(error);
        }
    }

    /**
     * Error while registration
     * @param {*} error - Текст ошибки из updateQuery() на осн. status
     */
    function errorSearch(error) {
        console.error(error);
    }

    /**
     * Show or Hide Password in sign up form
     */
    function changePswView() {
        setPasswordShown(passwordShown => !passwordShown);
    }

    /**
     * Switch to Login from Sign Up
     */
    function MoveToLogin() {
        setOpenLogin(true);
    }

    return(
        <>
        <div className="modal-signin__heading">
                <h3>Create account</h3>
                <p>Join our free science search engine</p>
        </div>

        <div className="modal-signin__info">
            <form id="sign-in" className="modal-signin__form" onSubmit={Registration}>

                <label>Email</label>

                <div className="modal-signin__input-div">
                    <input 
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Type your email"
                        onChange={emailHandler}
                        onClick={cleanUsedEmail}
                    />

                    {(emailError === true || usedEmail === true) ?
                    
                    <CSSTransition 
                    classNames="ease"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span className="modal-signin__icon-help">
                            <BiMessageSquareError />
                        </span>
                    </CSSTransition>

                    : (emailError === 'confirmed' && usedEmail === false) ?
                    <CSSTransition 
                    classNames="ease"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span className="modal-signin__icon-help modal-signin__icon-help--green">
                            <BiMessageSquareCheck />
                        </span>
                    </CSSTransition>
                    : null}

                </div>
                
                <span className={'modal-signin__help-psw' + 
                (emailError === true ? ' modal-signin__help-psw--displayed' : '')}>
                    It seems that your email typed with mistake
                </span>

                <span className={'modal-signin__help-psw' + 
                (usedEmail === true ? ' modal-signin__help-psw--displayed' : '')}>
                    The email you entered is already registered
                </span>

                <label>Choose password</label>

                <div className="modal-signin__input-div">
                    <input
                        id="password"
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        placeholder="Type your password"
                        onChange={pswHandler}
                    />
                    <span className='modal-signin__view-psw' onClick={changePswView}>
                        {passwordShown ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                    {(!pswEmpty && (!pswLength || !pswDigit || !pswUpper || nonlatin || specSymbols)) ?
                    
                    <CSSTransition 
                    classNames="ease"
                    timeout={1100}
                    in={true}
                    appear={true}>
                        <span className="modal-signin__icon-help">
                            <BiMessageSquareError />
                        </span>
                    </CSSTransition>

                    : (!pswEmpty && (pswLength && pswDigit && pswUpper && !nonlatin && !specSymbols)) ?
                        <CSSTransition 
                        classNames="ease"
                        timeout={1100}
                        in={true}
                        appear={true}>
                            <span className="modal-signin__icon-help modal-signin__icon-help--green">
                                <BiMessageSquareCheck />
                            </span>
                        </CSSTransition>
                    : null}

                </div>

                <div 
                className={'modal-signin__help-group' + 
                (!pswEmpty ? ' modal-signin__help-group--displayed' : '')}>
                    
                    <span 
                    className={'modal-signin__help' + (pswLength ? ' modal-signin__help--green' : '')
                    }>
                        &#8226; Your password has to be at least 8 symbols
                    </span>

                    <span 
                    className={'modal-signin__help' + (pswDigit ? ' modal-signin__help--green' : '')
                    }>
                        &#8226; Please use at least one digit
                    </span>

                    <span 
                    className={'modal-signin__help' + (pswUpper ? ' modal-signin__help--green' : '')
                    }>
                        &#8226; Please use at least one uppercase symbol
                    </span>

                    <span 
                        className={'modal-signin__help' + (!specSymbols ? ' modal-signin__help--hidden' : '')}>
                            &#8226; Please do not use special characters: {"\" ' < > &"}
                    </span>

                    <span 
                        className={'modal-signin__help' + (!nonlatin ? ' modal-signin__help--hidden' : '')}>
                            &#8226; Please use only latin alphabet
                    </span>

                </div>

                {(emailError === true || emailError !== 'confirmed' || emailError === 'empty') || (!pswLength || !pswDigit || !pswUpper || specSymbols || nonlatin) ?             
                    <button
                    className="btn-main btn-sign-in btn-sign-in--inactive"
                    value="Creact Account"
                    >
                        Create account
                    </button>
                : 
                    <button
                    className="btn-main btn-sign-in"
                    type="submit" 
                    form="sign-in" 
                    value="Creact Account"
                    >
                        Create account
                    </button>
                }

                <div className="modal-signin__forget">
                    <a>
                        Forgot your password or email?
                    </a>
                    <a onClick={MoveToLogin}>
                        Already have an account?
                    </a>
                </div>

            </form>
        </div>
        </>
    );
}

export default Reg;