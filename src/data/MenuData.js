import { BsSearch } from "react-icons/bs";
import { BsBook } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
import { BsHouse } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";

export const MenuData = [
    {
        title: "Main",
        icon: <BsHouse />,
        link: "/",
        class: "menu__item"
    },
    {
        title: "Search",
        icon: <BsSearch />,
        link: "/search",
        class: "menu__item"
    },
    {
        title: "Library",
        icon: <BsBook />,
        link: "/library",
        class: "menu__item"
    },
    // {
    //     title: "Text Editor",
    //     icon: <FiEdit />,
    //     link: "/editor",
    //     class: "menu__item" 
    // },
    // {
    //     title: "Storage",
    //     icon: <FiUploadCloud />,
    //     link: "/storage",
    //     class: "menu__item" 
    // }
    {
    title: "Settings",
    icon: <FiSettings />,
    link: "/settings",
    class: "menu__item" 
    },
]