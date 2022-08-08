// import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Profile from '../components/Profile';
import Menu from '../components/Menu';

import { ReactComponent as Logo } from '../icons/logo.svg';
import { ReactComponent as SmLogo } from '../icons/sm-logo.svg';
import { BsArrowsAngleExpand } from "react-icons/bs";

function Sidebar(props) {
    const {SizeMain} = props;
    const [stateSidebar,setStateSidebar] = useState('');
    useEffect(() => {
        if (window.location.pathname === '/') {
            setStateSidebar('collapsed');
        } else {
            setStateSidebar('expanded');
        }
    },[]);

    /**
     * Toggle width of Sidebar and Main container depeding on page type
     * @param {*} event 
     */
    function expandSidebar(event) {
        event.stopPropagation();
        event.target.parentNode.classList.add('sidebar--loading');
        setTimeout(() => {
            event.target.parentNode.classList.remove('sidebar--loading');
            setStateSidebar(stateSidebar === 'expanded' ? 'collapsed' : 'expanded');
        },200);
        SizeMain();
    }

    return (
        stateSidebar === 'collapsed' ? (
            <div id='sidebar' className='sidebar sidebar--collapsed'>
                <div className='sidebar__container'>
                    <span className='sidebar__opener' onClick={(event) => expandSidebar(event)}>
                        <BsArrowsAngleExpand />
                    </span>
                    <div className="sm-logo">
                        <SmLogo />
                        <div className="sm-logo__text">
                            <h1>Scholar</h1>
                        </div>
                    </div>

                    <Menu 
                        stateSidebar={stateSidebar}
                        expandSidebar={expandSidebar}
                    />
                </div>
            </div>
        ) : (
        // <div className={`'sidebar' ${window.location.pathname === '/' ? 'sidebar--collapsed' : 'sidebar--expanded' }`}>
        <div id='sidebar' className='sidebar sidebar--expanded'>
            <div className='sidebar__container'>
                <span className='sidebar__opener' onClick={(event) => expandSidebar(event)}>
                        <BsArrowsAngleExpand />
                    </span>
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
                    expandSidebar={expandSidebar}
                />
            </div>
        </div>
        )
    );
}
export default Sidebar;