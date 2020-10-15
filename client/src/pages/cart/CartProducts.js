import React from 'react';
import {useCart} from "../../contexts/CartContext";
import CartItem from './CartItem';

const CartProducts = () => {

    const { cartItems } = useCart();

    return (
        <div className="estimation-wrapper">
            {
                cartItems.map((product, index) =>  <CartItem key={index} product={product}/>)
            }
        </div>
    );
}

export default CartProducts;
