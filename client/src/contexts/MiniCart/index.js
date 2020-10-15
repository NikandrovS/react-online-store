import React from "react";
import {Link} from "react-router-dom";
import {useCart} from "../CartContext";
import MiniCartProducts from "./MiniCartProducts";

export default function Cart () {
    const cart = useCart()
    const { total, cartItems, toggleState } = useCart();

    return (
        <div className="cart-wrapper">
            <div className="cart">
                <img src={require(`../../assets/icons/bag.svg`)} className="cart-icon" alt="cart" onClick={() => toggleState()} />
                {
                    cart.itemCount > 0 ? <p className="count">{cart.itemCount}</p> : null
                }
                <div className={cart.active ? "miniCart-container active" : "miniCart-container"}>
                    <div className="head">
                        <p>Ваши товары</p>
                        <span onClick={() => toggleState(false)}>X</span>
                    </div>
                    {
                        cartItems.length > 0 ?
                            <div>
                                <MiniCartProducts />
                                <div className="totalPrice">
                                    <p>Заказ на сумму</p>
                                    <p>{parseInt(total)} руб.</p>
                                </div>
                                <Link to="/cart" className="redirectButton" onClick={() => toggleState(false)}>Перейти в корзину</Link>
                            </div>:
                            <p className="emptyCart">Корзина пуста...</p>
                    }
                </div>
            </div>
        </div>
    )
}
