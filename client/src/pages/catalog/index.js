import React from "react";
import {Link} from "react-router-dom";

import RenderCatalog from "./RenderCatalog";
import Footer from "../../components/shared/footer";
import {useMenu} from "../../contexts/MenuContext";

export default function Catalog () {

    const {menuState, windowWidth, setPage} = useMenu();
    const displayStyle = menuState && windowWidth < 480 ? {display: "none"} : null

    return (
        <main className="catalog-container" style={displayStyle}>
            <Link className="logo" to='/home' onClick={() => setPage(0)}>TOP LINE</Link>
            <RenderCatalog />
            <Footer/>
        </main>
    )
}
