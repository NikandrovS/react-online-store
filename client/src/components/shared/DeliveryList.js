import React from "react";
import deliveryTypes from "../../services/deliveryTypes";

export default function DeliveryList (prop) {

    let total = prop.props.total
    let setDelivery = prop.props.setDelivery

    return (
        <ul>
            {deliveryTypes.map((delivery, index) =>
                <li key={index}>
                    <input onClick={() => setDelivery(delivery.id)} name="delivery" type="radio" id={`check${delivery.id}`} required/>
                    <label htmlFor={`check${delivery.id}`}>{delivery.description}
                        <span>{total < 15000 ? `${delivery.price} руб.` : "0 руб."}</span>
                    </label>
                </li>
            )}
        </ul>
    )
}

