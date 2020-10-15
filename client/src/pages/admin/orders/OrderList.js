import React from "react";
import getDate from "../../../helpers/getDate"
import config from "../../../helpers/config/config";

export default function OrderList ({orderFilter, orders, setOrder, setOrders, setMobileOrder}) {

    function getMoreOrders() {
        let lastOrder = orders[orders.length-1].order_id
        fetch(`${config.BACKEND}/getMoreOrders/${lastOrder}/?filter=${orderFilter}`)
            .then(response => response.json())
            .then(response => setOrders(orders.concat(response)))
            .catch(err => console.error(err))
    }

    function onClick(order) {
        setOrder(order)

        const windowWidth = window.innerWidth;
        if (windowWidth < 415) {
            setMobileOrder(true)
        }
    }

    return (
        <ul className="orders-list">
            { orders.map((order, index) =>
                <li key={index} onClick={() => onClick(order)} >
                    <span className={order.status}>#{order.order_id}</span>
                    <span className="customerName">{order.name}</span>
                    <span className="date">{getDate(order.date)}</span>
                </li>
            )}
            {orders.length !== 0 && <li onClick={getMoreOrders}><span>Показать еще...</span></li>}
        </ul>
    )
}
