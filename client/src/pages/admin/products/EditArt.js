import React, {useEffect, useRef, useState} from "react";
import buttonInner from "../../../helpers/buttonInner";
import config from "../../../helpers/config/config";

export default function EditArt ({selectedProduct, setSelectedProduct}) {

    const [priceState, setPriceState] = useState(false)
    const [priorityState, setPriorityState] = useState(false)
    const [nameState, setNameState] = useState(false)
    const [textState, setTextState] = useState(false)

    useEffect(() => {
        setPriceState(false)
        setPriorityState(false)
        setNameState(false)
        setTextState(false)
    }, [selectedProduct])

    const priceRef = useRef('')
    const priorityRef = useRef('')
    const nameRef = useRef('')
    const textRef = useRef('')

    async function uploadInput(body, link) {
        const response = await fetch(`${config.BACKEND}/${link}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();
        setSelectedProduct(json)
    }

    function buttonHandler(target) {
        switch (target) {
            case "price": {
                setPriceState(prev => !prev)
                if (priceState) {
                    let idArray = []
                    let link = 'setPrice'
                    selectedProduct.forEach(product => {
                        if (product.product_name !== parseInt(priceRef.current.value)) {
                            idArray.push(product.product_id)
                        }
                    })
                    const form_body = {
                        id: idArray,
                        price: priceRef.current.value,
                        art_no: selectedProduct[0].art_no
                    }
                    uploadInput(form_body, link)
                }
                break
            }
            case "priority": {
                setPriorityState(prev => !prev)
                if (priorityState) {
                    let idArray = []
                    let link = 'setPriority'
                    selectedProduct.forEach(product => {
                        if (product.product_name !== parseInt(priorityRef.current.value)) {
                            idArray.push(product.product_id)
                        }
                    })
                    const form_body = {
                        id: idArray,
                        priority: priorityRef.current.value,
                        art_no: selectedProduct[0].art_no
                    }
                    uploadInput(form_body, link)
                }
                break
            }
            case "name":
                setNameState(prev => !prev)
                if (nameState) {
                    let idArray = []
                    let link = 'setName'
                    selectedProduct.forEach(product => {
                        if (product.product_id !== parseInt(nameRef.current.value)) {
                            idArray.push(product.product_id)
                        }
                    })
                    const form_body = {
                        id: idArray,
                        name: nameRef.current.value,
                        art_no: selectedProduct[0].art_no
                    }
                    uploadInput(form_body, link)
                }
                break
            case "text":
                setTextState(prev => !prev)
                if (textState) {
                    let idArray = []
                    let link = 'setText'
                    selectedProduct.forEach(product => {
                        if (product.text !== parseInt(textRef.current.value)) {
                            idArray.push(product.product_id)
                        }
                    })
                    const form_body = {
                        id: idArray,
                        text: textRef.current.value,
                        art_no: selectedProduct[0].art_no
                    }
                    uploadInput(form_body, link)
                }
                break
        }
    }

    return (
        <div className="result">
            <h3>Артикул: <span>{selectedProduct[0].art_no}</span></h3>
            <div className="input-wrapper edit-price">
                <p>Цена:</p>
                <div>
                    {
                        priceState ?
                            <input ref={priceRef} type="number" className="price-input" defaultValue={selectedProduct[0].price}/> :
                            selectedProduct[0].price}
                </div>
                <button onClick={() => buttonHandler('price')} className="edit-button">{buttonInner(priceState)}</button>
            </div>

            <div className="input-wrapper edit-priority">
                <p>Приоритет:</p>
                <div>
                    {
                        priorityState ?
                            <input ref={priorityRef} type="number" className="priority-input" min={0} defaultValue={selectedProduct[0].priority}/> :
                            selectedProduct[0].priority
                    }
                </div>
                <button onClick={() => buttonHandler('priority')} className="edit-button">{buttonInner(priorityState)}</button>
            </div>
            <div className="input-wrapper edit-name">
                <p>Наименование: {nameState ? <input ref={nameRef} type="text" className="name-input" defaultValue={selectedProduct[0].product_name}/> : selectedProduct[0].product_name}</p>
                <button onClick={() => buttonHandler('name')} className="edit-button">{buttonInner(nameState)}</button>
            </div>
            <div className="input-wrapper edit-text">
                <p>Описание: {textState ? <input ref={textRef} type="text" className="text-input" defaultValue={selectedProduct[0].text}/> : selectedProduct[0].text}</p>
                <button onClick={() => buttonHandler('text')} className="edit-button">{buttonInner(textState)}</button>
            </div>
        </div>
    )
}