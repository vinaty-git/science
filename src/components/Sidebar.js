import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import SideLogo from './sidebar/SideLogo';
import Profile from './sidebar/Profile';
import Menu from '../components/Menu';
import AuthContext from '../App';
import { CSSTransition } from 'react-transition-group'

import { BsArrowsAngleExpand, BsArrowsCollapse } from "react-icons/bs";

function Sidebar(props) {
    const {stateSidebar,setStateSidebar} = props;
    const isLoggedIn = useContext(AuthContext);

    const location = useLocation();
    var currentLocation = location.pathname;

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

    return (
            <div id='sidebar' className={`sidebar${stateSidebar === 'collapsed' ? '' : ' sidebar--expanded'}`}>
                <div className='sidebar__container'>

                    <SideLogo 
                        stateSidebar={stateSidebar}
                    />

                    <Profile 
                        stateSidebar={stateSidebar}
                    />

                    <Menu 
                        stateSidebar={stateSidebar}
                        SizeMain={SizeMain}
                    />

                    <span className='sidebar__opener' onClick={SizeMain}>
                        {stateSidebar === 'collapsed' ? (
                            <BsArrowsAngleExpand />
                        ) : (<span>Collapse Sidebar<BsArrowsCollapse /></span>)
                        }
                    </span>
                    
                </div>
            </div>
    );
}
export default Sidebar;