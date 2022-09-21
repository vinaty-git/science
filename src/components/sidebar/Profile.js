import { ReactComponent as Avatar } from '../../icons/cap.svg';
import React, { useContext } from 'react';
import AuthContext from '../../AuthContext';
import { CSSTransition } from 'react-transition-group';

function Profile(props) {
    const {stateSidebar,changeModalStatus} = props;
    const {isUser} = useContext(AuthContext);

    /**
     * Open Sign Up onClick from Sidebar Collapsed
     * @param {*} event 
     */
    function openLogin(event) {
        changeModalStatus(event);
    }

    return (
        
        
            
        <CSSTransition 
        classNames="profiler"
        timeout={800}
        in={isUser}
        >
        <div 
            className={`profile ${stateSidebar === 'collapsed' ? 'sm-profile' : ''}`} 
        >    
            <div className='profile__container'
            data-modal='sign-up' 
            onClick={stateSidebar === 'collapsed' ? openLogin : undefined }
            >   
                <Avatar />
                {stateSidebar !== 'collapsed' ?

  
                    <>
                    <span className="profile__greeting">
                        Hello,
                    </span>
                    
                        {isUser ?
                            <div className="profile__name">
                                NameorEmailfromLocalStorageand@DB.com
                            </div> 
                        :
                            <div className="profile__name">
                                Guest User
                                <span className="profile__span">
                                        Sign Up to save your bookmarks
                                </span>
                            </div>
                        }
                        
                    </>
                : 
                <a className="profile__sm-name">
                    Guest User
                </a>
                }
            </div>
            {!isUser ?

                <div className='profile__optlog'>
                    <button
                    data-modal='login'
                    className='btn sm-btn profile__link-login'
                    onClick={openLogin}
                    >
                    Login
                    </button>
                    
                    <button 
                    data-modal='sign-up' 
                    className='btn sm-btn profile__link-signup'
                    onClick={openLogin}
                    >
                    Sign Up
                    </button>
                </div>
                
            : null}
        </div>
        </CSSTransition>
    );
}

export default Profile;