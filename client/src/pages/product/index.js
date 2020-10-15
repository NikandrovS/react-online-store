import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import config from "../../helpers/config/config";
import ProductBody from "./ProductBody";
import Footer from "../../components/shared/footer";

export default function Product ({ art }) {

    const [item, setItem] = useState([])

    useEffect(() => {
        fetch(`${config.BACKEND}/getItemByArt/${art}`)
            .then(response => response.json())
            .then(response => setItem(response))
            .catch(err => console.error(err))
    }, [])

    return (
        <main className="product-container">
            <Link className="logo" to='/home'>TOP LINE</Link>
            { (item.length === 1) ? <ProductBody item={item}/> : <div className="notFound">Некорректная ссылка, вернитесь на главную страницу</div> }
            <Footer/>
        </main>

    )
}
