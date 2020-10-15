import React, {useEffect, useRef, useState} from "react";
import config from "../../../helpers/config/config";
import OrdersSearch from "./OrdersSearch";
import NewOrder from "./NewOrder";
import OrderList from "./OrderList";
import ActiveOrder from "./ActiveOrder";

export default function Orders () {

    const total = useRef(0)

    const [orderFilter, setOrderFilter] = useState('all')

    const [orders, setOrders] = useState([])
    const [activeOrder, setActiveOrder] = useState(false)
    const [activeOrderProducts, setOrderProducts] = useState([])
    const [mobileOrder, setMobileOrder] = useState(false);

    useEffect(() => {
        getOrders()
    }, [orderFilter])

    useEffect(() => {
        if (activeOrder) {
            getActiveOrderProducts()
        }
    }, [activeOrder])

    async function getActiveOrderProducts() {
        const response = await fetch(`${config.BACKEND}/getOrderProducts/?orderId=${activeOrder.order_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();

        //Get order total price
        total.current = 0
        json.forEach(elem => {
            total.current += elem.price * elem.quantity
        })

        setOrderProducts(json)
    }

    async function getSingleOrder(id) {
        const response = await fetch(`${config.BACKEND}/getOrder/${id}`)
        let json = await response.json();
        setOrder(json)

        if (window.innerWidth < 415) {
            setMobileOrder(true)
        }
    }

    async function getOrders() {
        const response = await fetch(`${config.BACKEND}/getAllOrders/?filter=${orderFilter}&length=${orders.length}`, {
            headers: {
                'Content-Type': 'application/json',
                'jwt': `${localStorage.getItem('jwt')}`
            }
        })
        let json = await response.json();

        setOrders(json)
        setOrder(json)
    }

    function setOrder(json) {
        //Set active order
        if (!activeOrder) {
            setActiveOrder(json[0])
        } else {
            let filter = json.filter(order => order.order_id === activeOrder.order_id)[0]
            if (filter !== undefined) {
                setActiveOrder(filter)
            } else {
                setActiveOrder(json[0])
            }
        }
    }

    return (
        <main>
            <OrdersSearch setOrder={setOrder} getSingleOrder={getSingleOrder} setMobileOrder={setMobileOrder}/>
            <div className={!mobileOrder ? "orders-wrapper mobile" : "orders-wrapper"}>
                <ul className="order-filter">
                    <li onClick={() => setOrderFilter('all')} className={orderFilter === "all" ? "all activeFilter" : "all"}>Все заказы</li>
                    <li onClick={() => setOrderFilter('new')} className={orderFilter === "new" ? "new activeFilter" : "new"}>Новые</li>
                    <li onClick={() => setOrderFilter('confirmed')} className={orderFilter === "confirmed" ? "confirmed activeFilter" : "confirmed"}>Подтвержденные</li>
                    <li onClick={() => setOrderFilter('shipped')} className={orderFilter === "shipped" ? "shipped activeFilter" : "shipped"}>Отправленные</li>
                    <li onClick={() => setOrderFilter('refund')} className={orderFilter === "refund" ? "refund activeFilter" : "refund"}>Возвраты</li>
                    <li onClick={() => setOrderFilter('deleted')} className={orderFilter === "deleted" ? "deleted activeFilter" : "deleted"}>Удаленные</li>
                    <li onClick={() => setOrderFilter('new-order')} className={orderFilter === "new-order" ? "new activeFilter" : "new"}><strong>&#43;</strong> Добавить заказ</li>
                </ul>
                {
                    orderFilter === 'new-order' ?
                        <NewOrder /> :
                        <div className="orders-container">
                            <OrderList orderFilter={orderFilter} orders={orders} setOrder={setActiveOrder} setOrders={setOrders} setMobileOrder={setMobileOrder}/>
                            <ActiveOrder
                                getSingleOrder={getSingleOrder}
                                orders={orders}
                                getOrders={getOrders}
                                total={total.current}
                                activeOrder={activeOrder}
                                activeOrderProducts={activeOrderProducts}
                                setMobileOrder={setMobileOrder}
                            />
                        </div>
                }
            </div>
        </main>
    )
}
