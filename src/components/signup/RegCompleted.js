
function RegCompleted(props) {
    const {email} = props;
    return (
        <div className="modal-signin__heading">
            <h3>Almost done, please confirm your email</h3>
            <p>An email has been sent to the email address you provided:</p>
            <span className="modal-signin__completed">{email}</span>
        </div>
    );
}

export default RegCompleted;