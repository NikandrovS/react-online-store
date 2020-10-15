import React, {useState} from 'react';
import {useCart} from "../../contexts/CartContext";
import {Link} from "react-router-dom";
import config from "../../helpers/config/config";

const CartItem = ({product}) => {

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
        <div className="product">
            <div className="preview">
                <Link to={`product/${product.art_no}`}>
                    <img src={`${config.BACKEND}/img/${product.image}`} alt="product_preview"/>
                </Link>

                <Link to={`product/${product.art_no}`} className="info">
                    <div>
                        <p>{product.product_name}</p>
                        <p>размер: {product.size}</p>
                        <p>цвет: {product.color}</p>
                    </div>
                </Link>
            </div>
            <div className="calculation">
                <p>{product.price} руб.</p>
                <div className="count">
                    <button
                        onClick={() => increaseCount(product)}
                        disabled={buttonState}>
                        +
                    </button>
                    <p>{product.quantity}</p>
                    {
                        <button
                            onClick={() => decreaseCount(product)}
                            disabled={buttonState}>
                            &minus;
                        </button>
                    }
                </div>
                <p className="summ">{product.price * product.quantity} руб.</p>

                <button
                    onClick={() => removeProduct(product)}
                    className="removeButton">
                    &#10006;
                </button>
            </div>
        </div>
    );
}

export default CartItem;