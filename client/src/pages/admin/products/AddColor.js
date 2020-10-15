import React, {useRef, useState} from "react";
import config from "../../../helpers/config/config";

export default function AddColor ({setStatus}) {

    const newColorRef = useRef('');
    const [hex, setHex] = useState('');

    async function onSubmit(e) {
        e.preventDefault()

        const form_body = {
            color: newColorRef.current.value,
            hex: hex,
        }

        const response = await fetch(`${config.BACKEND}/newColor`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let json = await response.json();
        if (!json.error) {
            setStatus({state: "success", text: json.text})
        } else {
            setStatus({state: "error", text: json.error})
        }

        newColorRef.current.value = ""
        setTimeout(() => {setStatus({state: 'disable'})}, 3000)
    }

    function hexStyle() {
        return {background: hex}
    }

    return (
        <form className="new-color" method="post" onSubmit={onSubmit}>
            <h3>Добавить цвет:</h3>
            <div className="new-color-wrapper">
                <div className="color-inputs">
                    <input ref={newColorRef} type="text" placeholder="Цвет" required />
                    <input onChange={e => setHex(e.target.value)} maxLength={7} type="text" placeholder="#hex" required />
                </div>
                <div>
                    <a href="https://html-color-codes.info/colors-from-image/" target="blank">
                        <div className="hex-code" style={hexStyle()} />
                    </a>
                    <button type="submit" value="Добавить">Добавить</button>
                </div>
            </div>
        </form>
    )
}
