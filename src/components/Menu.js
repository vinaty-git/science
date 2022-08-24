import { MenuData } from '../data/MenuData.js';
import { NavLink } from 'react-router-dom';
// import { useEffect } from 'react';

function Menu(props) {
    const {stateSidebar} = props;

    return (
        stateSidebar === 'collapsed' ? (
            <nav className="sm-menu">
                    { MenuData.map((val,key) => {
                        return (
                                <NavLink className={`${val.class} sm-menu__item`} key={key} to={val.link}>
                                    {val.icon}
                                    <span className="sm-menu__title">{val.title}</span>
                                </NavLink>
                        )
                    })}
            </nav>
        ) : (
            <nav className="menu">
                <ul className="menu__list">
                    { MenuData.map((val,key) => {
                        return (
                            <li key={key} className={val.class}>
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