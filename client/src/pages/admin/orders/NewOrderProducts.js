import React from "react";
import ProductSearch from "./ProductSearch";
import SizeList from "./SizeList";
import {sumItems} from "./NewOrder";

export default function NewOrderProducts ({ value }) {
    const { cart, total, add, remove, setSize, setPrice, setQuantity } = value
    return (
        <div>
            <ProductSearch add={add} />
            <ul className="product-list">
                {
                    cart.map((item, index) =>
                        <li key={index}>
                            <SizeList item={item} setSize={setSize}/>
                            <div>
                                &#215;<input className="count-div" type="number" min="0" onBlur={e => setQuantity({ id: index, quantity: e.target.value })} defaultValue="1"/>
                                <input className="price-div" type="number" min="0" onBlur={e => setPrice({ id: index, price: e.target.value })} defaultValue={item.price}/>RUB
                                <span className="remove" onClick={() => remove(item.product_id)}>&#10008;</span>
                            </div>
                        </li>)
                }
            </ul>
            {
                cart.length > 0 &&
                    <div>Итого {total}</div>
            }
        </div>
    )
}
