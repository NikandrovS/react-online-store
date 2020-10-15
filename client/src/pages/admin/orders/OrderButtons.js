import React, {useRef, useState} from "react";
import config from "../../../helpers/config/config";
import deliveryTypes from "../../../services/deliveryTypes";

export default function OrderButtons ({ activeOrder, orders, getOrders, getSingleOrder }) {
    const [trackState, setTrackState] = useState(false);
    const [invoiceState, setInvoiceState] = useState(false);
    const trackRef = useRef();

    async function changeStatus(id, status) {
        const form_body = {
            status: status
        }

        await fetch(`${config.BACKEND}/changeOrderStatus/${id}`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json',
                'jwt': `${localStorage.getItem('jwt')}`
            }
        })

        let filter = orders.filter(order => order.order_id === activeOrder.order_id)[0]
        if (filter) {
            getOrders()
        } else {
            getSingleOrder(id)
        }
    }

    function setTracknumber() {
        setTrackState(false)
        const form_body = {
            receiverEmail: activeOrder.email,
            order: activeOrder.order_id,
            tracknumber: trackRef.current.value,
            delivery: deliveryParse("shorty"),
            trackLink: deliveryParse("trackLink")
        }

        fetch(`${config.BACKEND}/setOrderTracknumber/${activeOrder.order_id}`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json',
                'jwt': `${localStorage.getItem('jwt')}`
            }
        })

        changeStatus(activeOrder.order_id, "shipped")
    }
    function newInvoice() {
        setInvoiceState(false)
        const form_body = {
            id: activeOrder.order_id,
            tracknumber: trackRef.current.value
        }

        fetch(`${config.BACKEND}/newInvoice`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json',
                'jwt': `${localStorage.getItem('jwt')}`
            }
        })

        getSingleOrder(activeOrder.order_id)
    }

    function deliveryParse(key) {
        let parsedType
        if (key === 'shorty') {
            parsedType = deliveryTypes.filter(delivery => delivery.id === activeOrder.delivery_type)[0]
            return parsedType.shorty
        } else if (key === 'trackLink') {
            parsedType = deliveryTypes.filter(delivery => delivery.id === activeOrder.delivery_type)[0]
            return parsedType.trackLink
        }
    }

    return (
        <div className="button-block">
            {   !trackState &&
                !invoiceState  ?
                <div>
                    {
                        activeOrder.status === 'new' &&
                        <button className="confirmed" onClick={() => changeStatus(activeOrder.order_id, "confirmed")}>В обработку</button>
                    }
                    {
                        (activeOrder.status === 'confirmed') &&
                        <button className="invoice" onClick={() => setInvoiceState(true)}>Номер накладной</button>
                    }
                    {
                        (activeOrder.status === 'confirmed') &&
                        <button className="shipped" onClick={() => setTrackState(true)}>Отправлен</button>
                    }
                    {
                        (activeOrder.status === 'shipped') &&
                        <button className="refund" onClick={() => changeStatus(activeOrder.order_id, "refund")}>Возврат</button>
                    }
                    {
                        (activeOrder.status !== 'deleted') &&
                        <button className="deleted" onClick={() => changeStatus(activeOrder.order_id, "deleted")}>Удалить</button>
                    }
                    {
                        (activeOrder.status === 'deleted') &&
                        <button onClick={() => changeStatus(activeOrder.order_id, "confirmed")}>Восстановить</button>
                    }
                </div> :
                <div>
                    <span>Тип доставки: {deliveryParse("shorty")}. Трекномер: </span>
                    <input ref={trackRef} autoFocus type="text"/>
                    <button className="shipped" onClick={() =>
                        trackState ?
                            setTracknumber() :
                            newInvoice()
                    }>Подтвердить</button>
                    <button className="refund" onClick={() =>
                        trackState ?
                            setTrackState(false) :
                            setInvoiceState(false)
                    }>Отмена</button>
                </div>
            }
        </div>

    )
}
