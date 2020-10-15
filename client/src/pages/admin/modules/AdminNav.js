import React from "react";
import {Link} from "react-router-dom";
import { useAdmin } from "../../../contexts/AdminContext";
import adminNavLinks from "../../../services/adminNavLinks";

export default function AdminNav () {
    const { user, logout } = useAdmin()

    return (
        <header>
            {
                window.innerWidth < 415 ?
                <div className="mobile-logo"><img src={require(`../../../assets/img/mobile-log.png`)} alt="mobile-logo"/></div> :
                <div className="logo">Top Line</div>
            }
            <ul className="admin-nav">
                { adminNavLinks.map((link, index) => (
                    <li key={index}>
                        <Link to={link.path}>{link.title}</Link>
                    </li>
                ))}
            </ul>
            <div className="userbar">
                <p>{user}</p>
                <span onClick={() => logout()}> logout</span>
            </div>
        </header>
    )
}
