import React from 'react';
import {useCart} from "../CartContext";

import MiniCartItem from './MiniCartItem';

const MiniCartProducts = () => {

    const { cartItems } = useCart();

    return (
        <div className="miniCart-wrapper">
            {
                cartItems.map((product, index) =>  <MiniCartItem key={index} product={product}/>)
            }
        </div>
    );
}

export default MiniCartProducts;
