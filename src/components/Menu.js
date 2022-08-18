import { MenuData } from '../data/MenuData.js';
import { NavLink } from 'react-router-dom';
// import { useEffect } from 'react';

function Menu(props) {
    const {stateSidebar,SizeMain} = props;

    return (
        stateSidebar === 'collapsed' ? (
            <nav className="sm-menu">
                <ul className="sm-menu__list">
                    { MenuData.map((val,key) => {
                        return (
                            <li key={key} className={`${val.class} sm-menu__item`}>
                                <NavLink to={val.link} onClick={SizeMain}>
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
                            <li key={key} className={val.class} onClick={SizeMain}>
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