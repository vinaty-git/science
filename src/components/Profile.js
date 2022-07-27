function Profile() {
    return (
        <div className="profile">
            <img className="profile__image" src="images/avatar.png" />
            <a className="profile__name">
                Harry Potter
            </a>
            <span className="profile__email">
                harry.potter@academia.uk.com
            </span>
        </div>
    );
}

export default Profile;