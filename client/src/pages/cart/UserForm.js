import React, {useRef, useState} from "react";
import config from "../../helpers/config/config";
import {useCart} from "../../contexts/CartContext";
import DeliveryList from "../../components/shared/DeliveryList";

export default function UserForm () {
    const { total, cartItems, handleCheckout } = useCart();
    const [error, setError] = useState(false);

    // user info inputs
    const [delivery, setDelivery] = useState('');
    const [currentUser, setCurrentUser] = useState('Customer');

    const nameRef = useRef('');
    const phoneRef = useRef('');
    const emailRef = useRef('');
    const cityRef = useRef('');

    const addressRef = useRef('');
    const regionRef = useRef('');
    const postcodeRef = useRef('');
    const meetRef = useRef('');

    const commentRef = useRef('');


    async function newOrder(e) {
        e.preventDefault();

        const form_body = {
            delivery_type: delivery,
            name: nameRef.current.value,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            address: addressRef.current.value,
            city: cityRef.current.value,
            region: regionRef.current.value,
            postcode: postcodeRef.current.value,
            meet: meetRef.current.value,
            user: currentUser,
            user_note: commentRef.current.value,
        }

        const response = await fetch(`${config.BACKEND}/newOrderCustomer`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let orderId = await response.json();
        if (!orderId.error) {
            cartItems.forEach(cartItem => {
                const orderItem = {
                    order_id: orderId,
                    product_id: cartItem.id,
                    price: cartItem.price,
                    quantity: cartItem.quantity,
                    size: cartItem.size,
                }
                orderItemUpload(orderItem)
            })
            handleCheckout(orderId)
        } else {
            setError(orderId.error)
        }
    }

    async function orderItemUpload(orderItem) {
       const response = await fetch(`${config.BACKEND}/newOrderItem`, {
            method: 'POST',
            body: JSON.stringify(orderItem),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let json = await response.json();
        if (json.error) {
            console.log(json.error)
        }
    }

    return (
        <div>
            {
                !error ?
                    <form action="#" onSubmit={newOrder} className="order-details">
                        <div className="deliveryChoice">
                            <p className="head-tag">Выберите доставку</p>
                            <DeliveryList props={{total, setDelivery}}/>
                        </div>
                        <div className="userForm">
                            <p className="head-tag">Заполните ваши данные</p>
                            <div className="form-wrapper">
                                <div className="form-column">
                                    <input ref={nameRef} type="text" placeholder="ФИО*" required/>
                                    <input ref={phoneRef} type="tel" placeholder="Телефон*" required/>
                                    <input ref={emailRef} type="email" placeholder="Email*" required/>
                                    <input ref={cityRef} type="text" placeholder="Город*" required/>
                                </div>
                                <div className="form-column">
                                    <input ref={addressRef} type="text" placeholder="Улица, номер дома и квартиры*" required/>
                                    <input ref={regionRef} type="text" placeholder="Регион/Область"/>
                                    <input ref={postcodeRef} type="number" placeholder="Индекс*" required/>
                                    <input ref={meetRef} type="text" placeholder="Поделитесь, откуда Вы о нас узнали"/>
                                </div>
                                <div className="form-column">
                                    <textarea ref={commentRef} name="comment" id="textarea" cols="20" rows="4" maxLength="300" placeholder="Ваш комментарий к заказу" />
                                    <button type={"submit"} className="submitButton">Оформить заказ</button>
                                </div>
                            </div>
                        </div>
                    </form> : <div className="display-error">{error}</div>
            }
        </div>
    )
}
