import React, {useEffect, useState} from "react";
import config from "../../../helpers/config/config";

export default function OrdersSearch ({ getSingleOrder }) {

    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])
    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
        const form_body = {
            search: search
        }

        if (search) {
            fetch(`${config.BACKEND}/ordersSearch`, {
                method: 'POST',
                body: JSON.stringify(form_body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {setResult(response); setDropdown(true)})
                .catch(err => console.error(err))
        }
    }, [search])

    return (
        <div className="search">
            <input type="text" onChange={e => setSearch(e.target.value)}/>
            <ul className={result.length > 0 && search !== '' && dropdown ? "search-rows open" : "search-rows"}>
                {
                    result && search !== '' && dropdown &&
                    result.map((order, index) =>
                        <li key={index} className={order.status} onClick={() => {getSingleOrder(order.order_id); setDropdown(false)}}>
                            {order.order_id} {order.name} {order.phone}
                        </li>)
                }
            </ul>
        </div>
    )
}