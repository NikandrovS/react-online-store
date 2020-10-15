import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import config from "../../../helpers/config/config";
import deliveryTypes from "../../../services/deliveryTypes";
import getDate from "../../../helpers/getDate";
import getTrackInfo from "../../../helpers/getTrackInfo";
import OrderButtons from "./OrderButtons";
import TrackStatus from "./TrackStatus";
import CreatedInvoice from "./CreatedInvoice";
import OrderLog from "./OrderLog";

export default function ActiveOrder ({ getSingleOrder, orders, getOrders, total, activeOrder, activeOrderProducts, setMobileOrder }) {

    const [status, setStatus] = useState({});

    useEffect(() => {
        setStatus('')
    }, [activeOrder])

    function deliveryParse() {
        let parsedType = deliveryTypes.filter(delivery => delivery.id === activeOrder.delivery_type)[0]
        return parsedType.description
    }

    function trackHandler() {
        if (activeOrder.tracknumber !== "null") {
            setStatus({status: 'loading...'})
            getTrackInfo(activeOrder.delivery_type, activeOrder.tracknumber)
                .then(response => setStatus(response))
        }
    }
    const windowWidth = window.innerWidth;

    return (
            activeOrder ?
                <div className="active-order">
                    <div className="order-status">
                        {
                            windowWidth < 416 &&
                            <h5 onClick={() => setMobileOrder(false)}>&#10229;</h5>
                        }
                        <h1>#{activeOrder.order_id}</h1>
                        <h4 className={`status ${activeOrder.status}`}>{activeOrder.status}</h4>
                        <span className="date">{getDate(activeOrder.date, "weekOfDay")}</span>
                    </div>
                    <OrderButtons activeOrder={activeOrder} orders={orders} getOrders={getOrders} getSingleOrder={getSingleOrder}/>
                    <div className="user-info-wrapper">
                        <img className='user-pic' src={require("../../../assets/icons/user.svg")} alt="user-pic"/>
                        <div className="user-info">
                            <h5 className="user-name">{activeOrder.name}</h5>
                            <span>{activeOrder.phone}</span>
                            <span>{activeOrder.email}</span>
                        </div>
                    </div>
                    {
                        activeOrder.user_note && <div className="order-comment user-comment">{activeOrder.user_note}</div>
                    }
                    {
                        activeOrder.admin_note && <div className="order-comment admin-comment">{activeOrder.admin_note}</div>
                    }
                    <div className="order-delivery">
                        <p>Доставка</p>
                        <p>{deliveryParse()}</p>
                        <p>{activeOrder.address}</p>
                        <p>{activeOrder.city}</p>
                        <p>{activeOrder.region}</p>
                        <p>{activeOrder.postcode}</p>
                        {
                            activeOrder.tracknumber !== null &&
                            <TrackStatus activeOrder={activeOrder} status={status} trackHandler={ trackHandler }/>
                        }
                        {
                            activeOrder.status === 'confirmed' && <CreatedInvoice activeOrder={activeOrder} />
                        }
                    </div>
                    <ul>
                        <li className="order-items-header">
                            <div>
                                <p className="quantity">Кол-во</p>
                                <p className="price">Цена</p>
                            </div>
                        </li>
                        {activeOrderProducts.map((item, index) =>
                            <li key={index} className={item.quantity > 1 ? "order-product attention" : "order-product"} >
                                <div className="product-description">
                                    <img src={`${config.BACKEND}/img/${item.image_name}`} alt="product-preview"/>
                                    <Link to={`/product/${item.art_no}`} target="blank">
                                        <p>{item.product_name} ({item.art_no}) ({item.color}, {item.size})</p>
                                    </Link>
                                </div>
                                <div className="product-price">
                                    <span className="quantity">{item.quantity}</span>
                                    <span className="price">{item.price} &#8381;</span>
                                </div>
                            </li>
                        )}
                        <li className="order-items-footer">
                            <div>
                                <p>Итого</p>
                                <h4 className="price">{total} &#8381;</h4>
                            </div>
                        </li>
                    </ul>
                    <OrderLog id={activeOrder.order_id} activeOrder={activeOrder}/>
                </div> : <div>Заказов еще нет :(</div>
    )
}
