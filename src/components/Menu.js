import { MenuData } from '../data/MenuData.js';
import { NavLink } from 'react-router-dom';
// import { useEffect } from 'react';

function Menu(props) {
    const {stateSidebar,expandSidebar} = props;

    /**
     * Toggle Sidebar and main container width
     * @param {*} event 
     */
    function checkSidebar(event) {
        if (window.location.pathname === '/' && event.target.getAttribute('href') === '/') {
            expandSidebar(event);
        }
        if (window.location.pathname === '/' && event.target.getAttribute('href') !== '/') {
            expandSidebar(event);
        }
    }
    return (
        stateSidebar === 'collapsed' ? (
            <nav className="sm-menu">
                <ul className="sm-menu__list">
                    { MenuData.map((val,key) => {
                        return (
                            <li key={key} className={`${val.class} sm-menu__item`}>
                                <NavLink to={val.link} onClick={(event) => checkSidebar(event)}>
                                    {val.icon}<span className="sm-menu__title">{val.title}</span>
                                </NavLink>
                            </li>
                        )
                    })
                    }
                </ul>
            </nav>
        ) : (
            <nav className="menu">
                <ul className="menu__list">
                    { MenuData.map((val,key) => {
                        return (
                            <li key={key} className={val.class} onClick={(event) => checkSidebar(event)}>
                                <NavLink to={val.link}>{val.icon} <span className="menu__title">{val.title}</span></NavLink>
                            </li>
                        )
                    })
                    }
                </ul>
            </nav>
        )
    );
}

export default Menu;