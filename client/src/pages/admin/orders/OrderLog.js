import React, {useEffect, useState} from "react";
import config from "../../../helpers/config/config";
import getDate from "../../../helpers/getDate";

export default function OrderLog ( { id, activeOrder } ) {

    const [history, setHistory] = useState([])

    useEffect(() => {
        fetch(`${config.BACKEND}/ordersLogs/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'jwt': `${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(response => setHistory(response))
    }, [id, activeOrder])

    return (
        history.length > 0 &&
        <div className="order-logs">
            <h5>История выполнения заказа</h5>
            <table>
                <tbody>
                {
                    history.map(log =>
                        <tr key={log.log_id}>
                            <td className="date-column">{getDate(log.date)}</td>
                            <td>{log.actor}<span className={log.type === 'email-sent' ? "action-text email" : "action-text"}>{log.action}</span></td>
                        </tr>)
                }
                </tbody>
            </table>
        </div>
    )
}
