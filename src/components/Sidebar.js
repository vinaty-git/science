import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import SideLogo from './sidebar/SideLogo';
import Profile from './sidebar/Profile';
import Menu from '../components/Menu';
// import AuthContext from '../App';
import { CSSTransition } from 'react-transition-group'
import Cookies from 'universal-cookie';
import { BsArrowsAngleExpand, BsArrowsCollapse } from "react-icons/bs";
import AuthContext from '../AuthContext';

const cookies = new Cookies();
function Sidebar(props) {
    const {stateSidebar,setStateSidebar,changeModalStatus} = props;
    const {isUser,setIsUser} = useContext(AuthContext);

    const location = useLocation();
    var currentLocation = location.pathname;

    /**
     * Change size of Sidebar and Main content block
     * @param {*} event 
     */
    function SizeMain(event) {
        event.stopPropagation(event);
        document.querySelector('.sidebar__container').classList.add('sidebar--loading');
            var newSidebarState = (stateSidebar === 'expanded' ? 'collapsed' : 'expanded');
            localStorage.setItem('sidebar', newSidebarState);
            setStateSidebar(newSidebarState);
        setTimeout(() => {
            document.querySelector('.sidebar__container').classList.remove('sidebar--loading');
        },150);
    } 

    // Delete me
    function Debugger() {
        if (isUser === true) {
            cookies.remove('_token2');
            setIsUser(false); // Change state in AuthContext
        } else {
            cookies.remove('_token2');
            cookies.set('_token2', 'test', {expires: new Date(Date.now()+2592000)});
            setIsUser(true); // Change state in AuthContext
        }
    }

    return (
            <div id='sidebar' className={`sidebar${stateSidebar !== 'collapsed' ? ' sidebar--expanded' : ''}`}>
                <div className='sidebar__container'>

                    <SideLogo 
                        stateSidebar={stateSidebar}
                    />

                    <div className="debugger">
                        <p>{isUser ? 'Logged in' : 'NOT Loged in'}</p>
                        <button onClick={Debugger}>Login/Logut</button>
                    </div>

                    <Profile 
                        stateSidebar={stateSidebar}
                        changeModalStatus={changeModalStatus}
                    />

                    <Menu 
                        stateSidebar={stateSidebar}
                        SizeMain={SizeMain}
                    />

                    <span className='sidebar__opener' onClick={SizeMain}>
                        {stateSidebar === 'collapsed' ? (
                            <BsArrowsAngleExpand />
                        ) : (<>Collapse Sidebar<BsArrowsCollapse /></>)
                        }
                    </span>
                    
                </div>
            </div>
    );
}
export default Sidebar;