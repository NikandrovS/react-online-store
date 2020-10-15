import React, {useEffect, useState} from "react";
import config from "../../../helpers/config/config";

export default function ProductSearch ({ add }) {

    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])
    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
        const form_body = {
            search: search
        }
        if (search.length > 2) {
            fetch(`${config.BACKEND}/productsSearch`, {
                method: 'POST',
                body: JSON.stringify(form_body),
                headers: {
                    'Content-Type': 'application/json',
                    'jwt': `${localStorage.getItem('jwt')}`
                }
            })
                .then(response => response.json())
                .then(response => {setResult(response); setDropdown(true)})
                .catch(err => console.error(err))
        } else {
            setDropdown(false)
        }
    }, [search])

    return (
        <div className="product-search">
            <span>&#x271A;</span><input type="text" placeholder="Введите название или артикул" onChange={e => setSearch(e.target.value)}/>
            <ul className={result.length > 0 && search !== '' && dropdown ? "search-rows open" : "search-rows"}>
                {
                    result && search !== '' && dropdown &&
                    result.map((item, index) =>
                        <li key={index} onClick={() => {add(item); setDropdown(false)}}>{item.art_no} {item.product_name}, {item.color}</li>)
                }
            </ul>
        </div>
    )
}