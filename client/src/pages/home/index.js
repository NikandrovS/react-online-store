import React from "react";
import {Link} from "react-router-dom";
import TrendingItems from "./TrendingItems";
import Footer from "../../components/shared/footer";
import {useMenu} from "../../contexts/MenuContext";

export default function Home () {
    const {menuState, windowWidth} = useMenu();

    const displayStyle = menuState && windowWidth < 480 ? {display: "none"} : null

    const imageBackground = {backgroundImage: `url("${require(`../../assets/img/interior.jpg`)}")`}
    const style = windowWidth > 900 ? {...imageBackground} : imageBackground;

    return (
        <main className="home-container" style={displayStyle}>
            <Link className="logo" to='/home'>TOP LINE</Link>
            <TrendingItems />
            <article className="about-us" style={style}>
                <div className="wrapper">
                    <div className="content">
                        <h3>Магазин в<br/> Санкт-Петербурге</h3>
                        <p>Вы можете примерить любое изделие в нашем офлайн магазине</p>
                        <Link to="/contacts" className="link">Подробнее &#8594;</Link>
                    </div>
                </div>
            </article>
            <section className="instagram">
                <div className="head">
                    <h3>Instagram</h3>
                    <a href="https://www.instagram.com/mytopline/" target="_blank" className="link">@mytopline</a>
                </div>
                <div className="instagram container">
                    <a href="https://www.instagram.com/mytopline/" target="_blank"><img src={require(`../../assets/img/inst/IMG_0202.png`)} alt="Одежда" /></a>
                    <a href="https://www.instagram.com/mytopline/" target="_blank"><img src={require(`../../assets/img/inst/IMG_0203.png`)} alt="Одежда" /></a>
                    <a href="https://www.instagram.com/mytopline/" target="_blank"><img src={require(`../../assets/img/inst/IMG_0204.png`)} alt="Одежда" /></a>
                    <a href="https://www.instagram.com/mytopline/" target="_blank"><img src={require(`../../assets/img/inst/IMG_0205.png`)} alt="Одежда" /></a>
                </div>
            </section>
            <Footer/>
        </main>
    )
}
