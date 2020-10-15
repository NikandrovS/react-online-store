import React, {useEffect, useState} from "react";
import config from "../../../helpers/config/config";

export default function CreatedInvoice ({ activeOrder }) {

    const [invoice, setInvoice] = useState([]);
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        setWarning(false)
        setInvoice([])
        fetch(`${config.BACKEND}/getInvoice/${activeOrder.order_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'jwt': `${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(response => response.length > 0 && filter(response))
    }, [activeOrder])

    async function filter(response) {
        for(let i = 0; i < response.length; i++) {
            if (response[i].type === "changes") {
                setWarning(true)
                continue
            }
            if (response[i].type === "invoice-created") {
                setInvoice(response[i].action)
                break
            }
        }
    }

    return (
        invoice.length > 0 &&
            <p className="created-invoice">Накладная для отправки: {invoice}
                {
                    warning && <span className="warning-icon" title="В заказ были внесены изменения">&#9888;</span>
                }
            </p>
    )
}
