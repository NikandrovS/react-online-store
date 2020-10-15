import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import config from "../../helpers/config/config";

function RenderCatalog() {
    const [items, setItems] = useState([])
    const [colors, setColors] = useState([])
    const [filter, setFilter] = useState("1.%")
    const [sort, setSort] = useState("priority")

    useEffect(() => {
        fetch(`${config.BACKEND}/catalog/?filter=${filter}&sort=${sort}`)
            .then(response => response.json())
            .then((response) => setItems(response))
            .catch(err => console.error(err))

        fetch(`${config.BACKEND}/getItemsColors`)
            .then(response => response.json())
            .then(response => setColors(response))
            .catch(err => console.error(err))
    }, [filter, sort])

    function styleHex(hex) {
        return {background: hex}
    }

    function getColor(art_no) {
        let match = colors.filter(item => item.art_no === art_no)
        return (
            <div className="available-colors">
                {match.map(({hex, color, product_id}) => (
                    <span style={styleHex(hex)} title={color} key={product_id}/>
                ))}
            </div>
        )
    }

    function styles(image_name) {
        if (image_name === null) {
            image_name = 'IMG_0000'
        }
        return {backgroundImage: `url(${config.BACKEND}/img/${image_name})`}
    }

     function renderPromoItem ({product_id, art_no, product_name, price, image_name}) {
        return (
            <Link to={`/product/${art_no}`} className="item" style={styles(image_name)} key={product_id}>
                <div className="product-info">
                    <p>
                        {product_name}
                        <span className="item-price">{price} &#8381;</span>
                    </p>
                    {getColor(art_no)}
                </div>
                <div className="mobilePrice">
                    <span>{product_name}</span>
                    <span>{price}<span className="currRub">&#8381;</span></span>
                </div>
            </Link>
        )
     }

    function sortSwitch() {
        switch (sort) {
            case "priority":
                return "Рекомендуем"
            case "upPrice":
                return "Цена по возрастанию"
            case "downPrice":
                return "Цена по убыванию"
            case "new":
                return "Новинки"
            default:
                return "Рекомендуем"
        }
    }

    return(
            <section>
                <ul className="filter">
                    <li onClick={() => setFilter('1.%')}>Все</li>
                    <li onClick={() => setFilter('1.3.%')}>Платья</li>
                    <li onClick={() => setFilter('1.4.%')}>Костюмы</li>
                    <li onClick={() => setFilter('1.2.%')}>Брюки / Юбки</li>
                    <li onClick={() => setFilter('1.6.%')}>Боди</li>
                    <li onClick={() => setFilter('1.7.%')}>Купальники</li>
                    <li onClick={() => setFilter('1.1.%')}>Топы / Футболки</li>
                </ul>
                <div className="sort">
                    <div>
                        <p>Сортировка: <span className="sort-span">{sortSwitch()}</span></p>
                        <img src={require(`../../assets/icons/up-chevron.svg`)} alt="list-arrow"/>
                    </div>
                    <ul className="submenu">
                        <li onClick={() => setSort("priority")}>Рекомендуем</li>
                        <li onClick={() => setSort("upPrice")}>Цена по возрастанию</li>
                        <li onClick={() => setSort("downPrice")}>Цена по убыванию</li>
                        <li onClick={() => setSort("new")}>Новинки</li>
                    </ul>
                </div>
                <div className="catalog-wrapper">
                    {items.map(renderPromoItem)}
                </div>
            </section>
        )
}

export default RenderCatalog;
