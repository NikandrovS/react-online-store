import React from "react";
import {Link} from "react-router-dom";
import {useMenu} from "../../contexts/MenuContext";

export default function Footer () {

    const {setPage} = useMenu();

    return (
        <footer>
            <div className="column">
                <Link className="logo" to='/home' onClick={() => setPage(0)}>TOP LINE</Link>
            </div>
            <div className="column footer-info">
                <h5>Инфо</h5>
                <p>Все изображения представлены</p>
                <a href="https://www.instagram.com/mytopline/" target="_blank">@mytopline</a>
                <div className="social">
                    <a href="https://www.instagram.com/mytopline/" target="_blank">IG.</a>
                    <a href="https://vk.com/toplnru" target="_blank">VK.</a>
                    <a href="https://ru-ru.facebook.com/TOP-LINE-262973217658637/" target="_blank">FB.</a>
                </div>
            </div>
            <div className="column footer-menu">
                <h5>Меню</h5>
                <Link to='/catalog'>Магазин</Link>
                <Link to='/about'>О бренде</Link>
                <Link to='/contacts'>Контакты</Link>
            </div>
        </footer>
    )
}
