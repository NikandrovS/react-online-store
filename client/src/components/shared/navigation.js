import React from "react";
import {Link} from "react-router-dom";
import {useMenu} from "../../contexts/MenuContext";

export default function Navigation (links) {
    const navLinks = links.props
    const {menuState, toggle, windowWidth, activePage, setPage} = useMenu()

    return (
        <nav className="site-navigation">
            <button className="menuButton" style={menuState ? {position: "fixed"} : null } onClick={toggle}>
                &#8803;
            </button>
            {
                menuState &&
                <ul>
                    { navLinks.map((link, index) => (
                        <li key={index} onClick={windowWidth < 480 ? toggle : null}>
                            <Link
                                to={link.path}
                                onClick={() => setPage(index)}
                                className={activePage === index ? "navLink active" : "navLink"}>
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            }
        </nav>)
}
