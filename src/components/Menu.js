import { MenuData } from '../data/MenuData.js';
import { NavLink } from 'react-router-dom';

function Menu() {
    return (
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
    );
}

export default Menu;