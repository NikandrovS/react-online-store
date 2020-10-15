import React, {useState} from 'react';
import {useCart} from "../CartContext";
import config from "../../helpers/config/config";

const MiniCartItem = ({product}) => {
    const { increase, decrease, removeProduct } = useCart();

    const [buttonState, setButtonState] = useState(false)

    function increaseCount(product) {
        setButtonState(true)
        increase(product)
        setTimeout(() => {setButtonState(false)}, 100)
    }
    function decreaseCount(product) {
        setButtonState(true)
        decrease(product)
        setTimeout(() => {setButtonState(false)}, 100)
    }

    return (
        <div className="miniCart-product">
            <a href={`/product/${product.art_no}`}>
                <img src={`${config.BACKEND}/img/${product.image}`} alt="product_preview"/>
            </a>
            <a href={`/product/${product.art_no}`} className="info">
                <div>
                    <p>{product.product_name}</p>
                    <p>размер: {product.size}</p>
                    <p>цвет: {product.color}</p>
                </div>
            </a>
            <div className="calculation">
                <div className="editCount">
                    <button
                        onClick={() => increaseCount(product)}
                        disabled={buttonState}>
                        +
                    </button>
                    <p>{product.quantity}</p>
                    {
                        product.quantity > 1 &&
                        <button
                            onClick={() => decreaseCount(product)}
                            disabled={buttonState}>
                            &minus;
                        </button>
                    }

                    {
                        product.quantity === 1 &&
                        <button
                            onClick={() => removeProduct(product)}>
                            &#10006;
                        </button>
                    }
                </div>
                <p className="summ">{product.price * product.quantity} руб.</p>
            </div>
        </div>
    )

}

export default MiniCartItem;
