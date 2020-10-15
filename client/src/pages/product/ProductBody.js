import React, {useEffect, useState} from "react";
import ImageGallery from 'react-image-gallery';
import {useCart} from '../../contexts/CartContext'
import config from "../../helpers/config/config";

function ProductBody({item}) {
    const cart = useCart()
    let product = item[0]

    const [images, setImages] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [textile, setTextile] = useState({
        name: product.textile,
        composition: product.composition
    })

    const [colorChoice, setColorChoice] = useState({color: "Выберите цвет"})
    const [sizeChoice, setSizeChoice] = useState("Выберите размер")

    const [choiceIsActive, setChoiceIsActive] = useState(false)
    const [choiceIsActiveSize, setChoiceIsActiveSize] = useState(false)

    const [buttonState, setButtonState] = useState(false)

    const pictures = []

    useEffect(() => {
        fetch(`${config.BACKEND}/getImagesById/${product.art_no}`)
            .then(response => response.json())
            .then(response => setImages(response))
            .catch(err => console.error(err))
        fetch(`${config.BACKEND}/getItemColors/${product.art_no}`)
            .then(response => response.json())
            .then(response => setColors(response))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetch(`${config.BACKEND}/getItemSizes/${colorChoice.product_id}`)
            .then(response => response.json())
            .then(response => {
                setSizes(response)
                if (response.length > 0) {
                    setTextile({name: response[0].textile, composition: response[0].composition})
                }
            })
            .catch(err => console.error(err))
    }, [colorChoice])

    const isInCart = (product, sizes, sizeChoice) => {

        if (sizes.length === 1) {
            return !!cart.cartItems.find(item => item.id === sizes[0].product_id && item.size === sizeChoice)
        }

        return  !!cart.cartItems.find(item => item.id === product.product_id);
    }

    prepareGallery()
    function prepareGallery() {
        images.forEach(element => {
            pictures.push({
                original: `${config.BACKEND}/img/${element.image_name}`,
                thumbnail: `${config.BACKEND}/img/${element.image_name}`,
            })
        })
    }

    function arrowIcon(which) {
        return (
            <img className={ which ? 'arrow-active' : 'arrow'} src={require(`../../assets/icons/down-arrow.svg`)} alt="arrow"/>)
    }

    function clickHandler(each) {
        setColorChoice({color: each.color, product_id: each.product_id})
        setSizeChoice("Выберите размер")
    }
    function dom() {
        let list = document.getElementsByClassName('available')
        if (list.length === 0) {
            return true
        }
    }

    function renderAvailableSizes({stock_xxs, stock_xs, stock_s, stock_m, stock_l, store_xxs, store_xs, store_s, store_m, store_l, is_available}) {

        return (
            <ul key={1} className={ choiceIsActiveSize ? 'setSize-list active' : 'setSize-list'} id="size-list">
                <li
                    className={is_available === 'yes' || (stock_xxs + store_xxs) > 0 ? 'available' : 'notAvailable'}
                     onClick={() => (setSizeChoice("XXS"))}>XXS</li>
                <li
                    className={is_available === 'yes' || (stock_xs + store_xs) > 0 ? 'available' : 'notAvailable'}
                     onClick={() => (setSizeChoice("XS"))}>XS</li>
                <li
                    className={is_available === 'yes' || (stock_s + store_s) > 0 ? 'available' : 'notAvailable'}
                     onClick={() => (setSizeChoice("S"))}>S</li>
                <li
                    className={is_available === 'yes' || (stock_m + store_m) > 0 ? 'available' : 'notAvailable'}
                     onClick={() => (setSizeChoice("M"))}>M</li>
                <li
                    className={is_available === 'yes' || (stock_l + store_l) > 0 ? 'available' : 'notAvailable'}
                     onClick={() => (setSizeChoice("L"))}>L</li>
                {dom() && <li>Нет в налчии</li>}
            </ul>

        )
    }

    function add(id, color, size, art_no, price, product_name, image) {
        setButtonState(true)
        let quantity = 1
        cart.addProduct({id, color, size, art_no, price, product_name, image, quantity})
        cart.toggleState(true)
        setTimeout(() => {setButtonState(false)}, 1000)
        setTimeout(() => {cart.active && cart.toggleState(false)}, 3000)
    }
    function increase(id, color, size, art_no, price, product_name, image) {
        setButtonState(true)
        cart.increase({id, color, size, art_no, price, product_name, image})
        setTimeout(() => {setButtonState(false)}, 1000)
    }

    return(
        <div className="product-wrapper">
            <ImageGallery
                items={pictures}
                thumbnailPosition={'bottom'}
                autoPlay={true}
                slideInterval={5000}
                showBullets={true}
                showThumbnails={true}
                // showThumbnails={false}
                showPlayButton={false}
                showFullscreenButton={false}
            />
            <div className="product-info">
                <div className="head">
                    <h2>{product.product_name}</h2>
                    <p className="art_no">Арт: {product.art_no}</p>
                </div>
                <p className="price">{product.price} <span className="currRub">&#8381;</span> &ensp;</p>
                <div className="setWrapper">
                    <div className="setColor" onClick={() => setChoiceIsActive(!choiceIsActive)}>
                        <div className="setColor-head">
                            <p>{colorChoice.color}</p>
                            {arrowIcon(choiceIsActive)}
                        </div>
                        <ul className={ choiceIsActive ? 'setColor-list active' : 'setColor-list'}>
                            {colors.map((each, index) =>
                                <li key={index} onClick={() => clickHandler(each)}>
                                    {each.color}
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={sizes.length === 0 ? 'setSize' : 'setSize loaded'} onClick={() => setChoiceIsActiveSize (!choiceIsActiveSize)}>
                        <div className="setSize-head">
                            <p>{sizeChoice}</p>
                            {arrowIcon(choiceIsActiveSize)}
                        </div>
                        {sizes.map(renderAvailableSizes)}
                    </div>
                </div>
                <div className="button-block">

                    {
                        isInCart(product, sizes, sizeChoice) &&
                        <button
                            onClick={() => (sizes.length === 1 && sizeChoice !== "Выберите размер")
                                ? increase(sizes[0].product_id, sizes[0].color, sizeChoice, product.art_no, product.price, product.product_name, product.image_name)
                                : null}
                                disabled={buttonState}>Добавить еще</button>
                    }
                    {
                        !isInCart(product, sizes, sizeChoice) &&
                        <button onClick={() => (sizes.length === 1 && sizeChoice !== "Выберите размер")
                                    ? add(sizes[0].product_id, sizes[0].color, sizeChoice, product.art_no, product.price, product.product_name, product.image_name)
                                    : null}
                                    disabled={buttonState}>Добавить в корзину</button>
                    }

                </div>
                <h5 className="description">{product.text}</h5>
                {
                    textile.name !== 'null' && textile.composition !== 'null' ?
                        <div>
                            <h5>Состав:</h5>
                            <p>{textile.name}, {textile.composition}</p>
                        </div>: null

                }
                <h5>Уход:</h5>
                <p>&ndash;&nbsp;стирать при 30-40 С, используя деликатное моющие средство.</p>
                <p>&ndash;&nbsp;утюжить изделие в режиме "деликатный".</p>
            </div>
        </div>
    )
}

export default ProductBody;
