import React from "react";
import {Link} from "react-router-dom";
import {useCart} from "../../contexts/CartContext";
import CartProducts from "./CartProducts";
import UserForm from "./UserForm";
import Footer from "../../components/shared/footer";

export default function Cart () {
    const cart = useCart()

    const { total, cartItems, checkout } = useCart();

    return (
        <main className="cart-container">
            <Link className="logo" to='/home'>TOP LINE</Link>
            {
                cartItems.length > 0 ?
                <div className="cart-body">
                    <div className="cart-head">
                        <p className="head-tag">Корзина</p>
                        <p className="clearButton" onClick={() => cart.clearCart()} >Очистить корзину</p>
                    </div>
                    <div className="title">
                        <p className="preview-title">Продукт</p>
                        <div className="calculation-title">
                            <p>Цена</p>
                            <p>Количество</p>
                            <p>Сумма</p>
                        </div>
                    </div>
                    <CartProducts/>
                </div> :
                (checkout !== false) ?
                <div className="emptyCart">
                    <h3>Ваш заказ оформлен!</h3>
                    <p>Номер заказа #{'' + checkout}</p>
                    <p>Мы свяжемся с вами в ближайшее время для подтверждения заказа</p>
                </div> :
                <div className="emptyCart">
                    Корзина пуста
                </div>
            }
            {
                cartItems.length > 0 &&
                <div className="submit">
                    <div className="total">
                        <p>Общая стоимость заказа:</p>
                        <p>Итого: {total} руб.</p>
                    </div>
                    <UserForm />
                </div>
            }

            <Footer />
        </main>
    )
}
