import React, {useRef, useState} from "react";
import config from "../../../helpers/config/config";
import EditProduct from "./EditProduct";
import ColorOption from "./ColorOption";

export default function SearchProduct () {

    const [selectedProduct, setSelectedProduct] = useState([])
    const [colorOption, setColorOption] = useState(0)

    const artRef = useRef('')

    async function getProduct(e) {
        e.preventDefault();

        const form_body = {
            art_no: artRef.current.value,
            color: colorOption
        }
        if (colorOption > 0) {
            const response = await fetch(`${config.BACKEND}/getEditProduct`, {
                method: 'POST',
                body: JSON.stringify(form_body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let json = await response.json();

            if (json.length === 1 ) {
                setSelectedProduct(json)
            } else if (json.length === 0) {
                setSelectedProduct([])
                alert("Товары не найдены")
            } else {
                console.log("Произошла ошибка!")
            }
        }
    }

    return (
        <div className="search-product">
            <h3>Поиск изделия:</h3>
            <form onSubmit={getProduct} className="search-product-form">
                <input ref={artRef} type="text" placeholder="Артикул"/>
                <ColorOption setColorOption={setColorOption} />
                <button>Найти</button>
            </form>
            {
                selectedProduct.length > 0 &&
                <EditProduct selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
            }
        </div>
    )
}