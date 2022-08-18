import React, {useState} from "react";
import { CgArrowLongLeft } from "react-icons/cg";
function Restored(props) {
    const {email,noUser,setNoUser,changeModalStatus} = props;

    function restorePswAgain(event) {
        setNoUser(false);
        changeModalStatus(event);
    }

    return (
        <>
        
            {noUser === false ?
                <div className="modal-signin__heading">
                    <h3>Almost done, please check your email</h3>
                    <p>A password restore link has been sent to the email address you provided:</p>
                    <span className="modal-signin__completed">{email}</span>
                </div>
            : 

                <div className="modal-signin__heading">
                    <h3>The user was not found</h3>
                    <p>Unfortunately, we have not found your email in our database. Email address you have provided:</p>
                    <span className="modal-signin__completed">{email}</span>
                    <div className="modal-signin__back">
                        <button
                        data-modal='forgot'
                        className="btn-main btn-sign-in"
                        value="Return to the previous page"
                        onClick={restorePswAgain}
                        >
                        <CgArrowLongLeft /> Back to password recovery
                        </button>
                    </div>
                </div>
            }
        
        </>
    );
}

export default Restored;