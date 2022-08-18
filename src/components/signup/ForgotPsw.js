
import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { BiMessageSquareError } from "react-icons/bi";

function ForgotPsw(props) {
    const {changeModalStatus,setEmail,setNoUser} = props;
    const [emailLogged,setEmailLogged] = useState(false);
    const [emailValid,setEmailValid] = useState(false);
    const [noUserFound, setNoUserFound] = useState(false);

    const inputElem = useRef();
    var sessionEmail,email;

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
    function emailHandlerRestore(event) {
        setNoUserFound(false);
        clearTimeout(sessionEmail);
        sessionEmail = setTimeout(() => {

            if (event.target.value.length > 0 ) {
                setEmailLogged(true);
            } else {
                setEmailLogged(false);
            }

            if(!isValidEmail(event.target.value)) {
                setEmailValid(false);
            } else {
                setEmailValid(true);
            }

        },200);
    }

    /**
     * Restore password sending a link
     */
    function RestorePsw(event) {
        event.preventDefault();
        var restoreApi = 'https://kirilab.ru/science/mailer.php';
        email = inputElem.current.value;
        const queryRestore = {
            "data": "restore",
            "email": email
        };
        fetch(restoreApi, {
            method: 'POST',
            cache: 'no-store',
            body: JSON.stringify(queryRestore)
        })
        .then(response => {
            if (!response.ok || response.status > 399 ) {
                throw new Error("There was a problem with the server connection");
            }
            return response.text();
        })
        .then(response => {
            if (response === 'no user') {
                setNoUser(true);
            }
            changeModalStatus(event); // Change modal view to the final screen
        })
        .catch(err => {
            console.error(err);
        })
        setEmail(email); // Transfer email provided to the final screen
    }


    return(
        <>  
            <div className="modal-signin__heading">
                <h3>Restore password</h3>
                <p>Enter your email to restore access</p>
            </div>

            <form data-modal='restored' id="restore-psw" className="modal-signin__form" onSubmit={RestorePsw}>

                <label>Email</label>

                <div className="modal-signin__input-div">
                    <input 
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Type your email"
                        onChange={emailHandlerRestore}
                        ref={inputElem}
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

                {emailValid && emailLogged ?             
                    <button
                    className="btn-main btn-sign-in btn-sign-in"
                    type="submit" 
                    form="restore-psw" 
                    value="Restore password"
                    >
                    Restore password
                    </button>
                : 
                    <button
                    className="btn-main btn-sign-in btn-sign-in--inactive"
                    value="Restore password"
                    >
                    Restore password
                    </button>
                }

            </form>
        </>
    );
}

export default ForgotPsw;