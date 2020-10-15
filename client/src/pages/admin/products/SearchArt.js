import React, {useRef, useState} from "react";
import config from "../../../helpers/config/config";
import EditArt from "./EditArt";
import StatusDiv from "../../../components/shared/StatusDiv";

export default function SearchArt () {

    const [selectedProduct, setSelectedProduct] = useState([])
    const [status, setStatus] = useState({})

    const artRef = useRef('')

    async function getProduct(e) {
        e.preventDefault();

        const form_body = {
            art_no: artRef.current.value,
        }
        const response = await fetch(`${config.BACKEND}/getEditArt`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();
        setSelectedProduct(json)
        if (json.length === 0) {
            setStatus({state: "error", text: "Артикул не найден"})
            setTimeout(() => {setStatus({state: 'disable'})}, 3000)
        }
    }

    return (
        <div className="search-art">
            <StatusDiv status={status}/>
            <h3>Поиск артикула:</h3>
            <form onSubmit={getProduct}>
                <input ref={artRef} type="text" placeholder="Артикул"/>
                <button>Найти</button>
            </form>
            {
                selectedProduct.length > 0 &&
                <EditArt selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
            }
        </div>
    )
}