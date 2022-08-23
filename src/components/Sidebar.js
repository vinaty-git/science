import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../components/Profile';
import Menu from '../components/Menu';
import AuthContext from '../App';
import { CSSTransition } from 'react-transition-group'

import { ReactComponent as Logo } from '../icons/logo.svg';
import { ReactComponent as SmLogo } from '../icons/sm-logo.svg';
import { BsArrowsAngleExpand, BsArrowsCollapse } from "react-icons/bs";

function Sidebar(props) {
    const {stateSidebar,setStateSidebar} = props;
    const isLoggedIn = useContext(AuthContext);

    const location = useLocation();
    var currentLocation = location.pathname;

    function SizeMain(event) {

        event.stopPropagation();
        document.querySelector('.sidebar__container').classList.add('sidebar--loading');

        if (event.target.getAttribute('data') === 'toggle-sidebar') {
            // setTimeout(() => {
            setStateSidebar(stateSidebar === 'expanded' ? 'collapsed' : 'expanded');
            // },50);
        } else {

            // Switch from main to main is blocked
            if (currentLocation === '/' && event.target.getAttribute('href') === '/') {
                event.preventDefault();
                
            // Switch from main to any other will expand sidebar
            } else if (currentLocation === '/' && event.target.getAttribute('href') !== '/') {
                // setTimeout(() => {
                    setStateSidebar('expanded');
                // },50);

            // Switch from any other to main will collapse sidebar
            } else if (currentLocation !== '/' && event.target.getAttribute('href') === '/') {
                // setTimeout(() => {
                    setStateSidebar('collapsed');
                // },50);
            }
        }
        setTimeout(() => {
            document.querySelector('.sidebar__container').classList.remove('sidebar--loading');
        },150);
    } 

    return (
        
        stateSidebar === 'collapsed' ? (
            <div id='sidebar' className='sidebar'>
                <div className='sidebar__container'>
                    <div className="sm-logo">
                        <SmLogo />
                        <div className="sm-logo__text">
                            <h1>Scholar</h1>
                        </div>
                    </div>
                    <Menu 
                        stateSidebar={stateSidebar}
                        SizeMain={SizeMain}
                    />

                    
                    <span data='toggle-sidebar' className='sidebar__opener' onClick={SizeMain}>
                        <BsArrowsAngleExpand />
                    </span>
                    
                </div>
            </div>
        ) : (
        // <div className={`'sidebar' ${window.location.pathname === '/' ? 'sidebar--collapsed' : 'sidebar--expanded' }`}>
        <div id='sidebar' className='sidebar sidebar--expanded'>
            <div className='sidebar__container'>
                <div className="logo">
                    <Logo />
                    <div className="logo__text">
                        <h1>Scholar</h1>
                        <p>Description of website</p>
                    </div>
                </div>

                <Profile />

                <Menu 
                    stateSidebar={stateSidebar}
                    SizeMain={SizeMain}
                />
                
                <span data='toggle-sidebar' className='sidebar__opener' onClick={SizeMain}>
                        Collapse Sidebar<BsArrowsCollapse />
                </span>
            </div>
        </div>
        )
    );
}
export default Sidebar;