import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import config from "../../helpers/config/config";
import {useMenu} from "../../contexts/MenuContext";

function TrendingItems() {
    const [items, setItems] = useState([])
    const { setPage } = useMenu()

    useEffect(() => {
        fetch(`${config.BACKEND}/recommendedItems`)
            .then(response => response.json())
            .then((data) => setItems(data))
            .catch(err => console.error(err))
    }, [])

    function renderPromoItem ({product_id, art_no, product_name, price, image_name}) {
        return (
            <Link key={product_id} to={`/product/${art_no}`} className="item" >
                <img src={`${config.BACKEND}/img/${image_name}`} alt="product_image"/>
                <p>{product_name}</p>
                <p className="link">
                    {price} <span className="currRub">&#8381;</span><span className="buyArrow">  &ensp;I&ensp; Купить &#8594;</span>
                </p>
            </Link>
        )
    }

    return(
            <section className="trendingItems">
                <div className="head">
                    <h3>Популярные товары</h3>
                    <Link to='/catalog' className="link" onClick={() => setPage(1)}><span className="arrow">В каталог&nbsp;&#8594;</span></Link>
                </div>
                <div className="trendingItems body">
                    {items.map(renderPromoItem)}
                </div>
            </section>
        )
}

export default TrendingItems;
