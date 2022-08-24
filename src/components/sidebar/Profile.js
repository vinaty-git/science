import { ReactComponent as Avatar } from '../../icons/cap.svg';

function Profile(props) {
    const {stateSidebar} = props;
    
    return (
        // {stateSidebar === 'collapsed' ? (
        <div className={`profile ${stateSidebar === 'collapsed' ? 'sm-profile' : ''}`}>
            {/* <img className="profile__image" src="images/avatar.png" /> */}
            <Avatar />
            <a className="profile__name">
                Guest <br />User
            </a>
            <span className="profile__email">
                harry.potter@academia.uk.com
            </span>
        </div>
    );
}

export default Profile;