import React, {useEffect, useRef, useState} from "react";
import config from "../../../helpers/config/config";
import buttonInner from "../../../helpers/buttonInner";
import ColorOption from "./ColorOption";
import TextileOption from "./TextileOption";

export default function EditProduct ({selectedProduct, setSelectedProduct}) {

    const [artState, setArtState] = useState(false)
    const [colorState, setColorState] = useState(false)
    const [availableState, setAvailableState] = useState(false)
    const [textileState, setTextileState] = useState(false)


    useEffect(() => {
        setArtState(false)
        setColorState(false)
        setAvailableState(false)
        setTextileState(false)
    }, [selectedProduct])

    const [availableOption, setAvailableOption] = useState('')
    const [colorOption, setColorOption] = useState(0)
    const [textileOption, setTextileOption] = useState(0)
    const artRef = useRef('')

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
            case "art": {
                setArtState(prev => !prev)
                if (artState) {
                    let link = 'setArt'

                    const form_body = {
                        id: selectedProduct[0].product_id,
                        color: selectedProduct[0].color_id,
                        art_no: artRef.current.value
                    }
                    uploadInput(form_body, link)
                }
                break
            }
            case "color": {
                setColorState(prev => !prev)
                if (colorState && colorOption > 0) {
                    let link = 'setColor'

                    const form_body = {
                        id: selectedProduct[0].product_id,
                        color: colorOption,
                        art_no: selectedProduct[0].art_no
                    }
                    uploadInput(form_body, link)
                }
                break
            }
            case "available": {
                setAvailableState(prev => !prev)
                if (availableState && availableOption !== '') {
                    let link = 'setAvailable'

                    const form_body = {
                        id: selectedProduct[0].product_id,
                        color: selectedProduct[0].color_id,
                        art_no: selectedProduct[0].art_no,
                        status: availableOption
                    }
                    uploadInput(form_body, link)
                }
                break
            }
            // case "priority": {
            //     setPriorityState(prev => !prev)
            //     if (priorityState) {
            //         let link = 'setPriority'
            //
            //         const form_body = {
            //             id: selectedProduct[0].product_id,
            //             color: selectedProduct[0].color_id,
            //             art_no: selectedProduct[0].art_no,
            //             priority: priorityRef.current.value
            //         }
            //         uploadInput(form_body, link)
            //     }
            //     break
            // }
            case "textile": {
                setTextileState(prev => !prev)
                if (textileState && textileOption > 0) {
                    let link = 'setTextile'

                    const form_body = {
                        id: selectedProduct[0].product_id,
                        color: selectedProduct[0].color_id,
                        art_no: selectedProduct[0].art_no,
                        textile: textileOption
                    }
                    uploadInput(form_body, link)
                }
                break
            }
        }
    }

    return (
        <div className="result">
            <h3>Продукт: </h3>
            <p>id: {selectedProduct[0].product_id}</p>
            <div className="input-wrapper art-div">
                <p>Артикул:</p>
                <div>
                    {
                        artState ?
                            <input ref={artRef} type="text" defaultValue={selectedProduct[0].art_no}/> :
                            selectedProduct[0].art_no
                    }
                </div>
                <button onClick={() => buttonHandler('art')} className="edit-button">{buttonInner(artState)}</button>
            </div>
            <div className="input-wrapper color-div">
                <p>Цвет:</p>
                {
                    colorState ?
                        <ColorOption setColorOption={setColorOption} /> :
                        <p>{selectedProduct[0].color}</p>
                }
                <button onClick={() => buttonHandler('color')} className="edit-button">{buttonInner(colorState)}</button>
            </div>
            <div className="input-wrapper available-div">
                <p>Доступен к пошиву:</p>
                    {
                        availableState ?
                            <div>
                                <div className="wrapper">
                                    <span>Да</span>
                                    <input type="radio" name="available" onClick={() => setAvailableOption('yes')} />
                                </div>
                                <div className="wrapper">
                                    <span>Нет</span>
                                    <input type="radio" name="available" onClick={() => setAvailableOption('no')} />
                                </div>
                            </div> :
                            selectedProduct[0].is_available === 'no' ? 'Нет' : 'Да'
                    }
                <button onClick={() => buttonHandler('available')} className="edit-button">{buttonInner(availableState)}</button>
            </div>
            <div className="input-wrapper textile-div">
                <p>Ткань:</p>
                <div>
                    {
                        textileState ?
                            <TextileOption setTextileOption={setTextileOption} /> :
                            <p>{selectedProduct[0].textile}, {selectedProduct[0].composition}</p>
                    }
                </div>
                <button onClick={() => buttonHandler('textile')} className="edit-button">{buttonInner(textileState)}</button>
            </div>
        </div>
    )
}