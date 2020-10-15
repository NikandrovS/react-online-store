import React, {useState} from "react";
import config from "../../../helpers/config/config";
import ColorOption from "./ColorOption";

export default function EditColor ({ setStatus }) {

    const [colorOption, setColorOption] = useState(0)
    const [editedColor, setEditedColor] = useState([])

    const [hex, setHex] = useState('');
    const [color, setColor] = useState('');

    const [colorActive, setColorActive] = useState(false);
    const [hexActive, setHexActive] = useState(false);

    function getEditedColor(e) {
        e.preventDefault()
        if (colorOption > 0) {
            fetch(`${config.BACKEND}/getEditColor/${colorOption}`)
                .then(response => response.json())
                .then(response => {
                    setEditedColor(response)
                    setColor(response[0].color)
                    setHex(response[0].hex)
                })
                .catch(err => console.error(err))
        }
    }

    async function saveChanges(e) {
        e.preventDefault()
        const form_body = {
            id: editedColor[0].color_id,
            color: color,
            hex: hex,
        }

        const response = await fetch(`${config.BACKEND}/editColor`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let json = await response.json();
        if (!json.error) {
            setStatus({state: "success", text: json.text})
            setEditedColor([])
        } else {
            setStatus({state: "error", text: json.error})
        }
        setTimeout(() => {setStatus({state: 'disable'})}, 3000)
    }

    function hexStyle() {
        return {background: hex}
    }

    return (
        <form className="new-color">
            <h3>Редактировать цвет:</h3>
            {
                editedColor.length === 0 ?
                <div className="edit-color-wrapper">
                    <ColorOption setColorOption={setColorOption}/>
                    <button className="find-button" onClick={getEditedColor}>Найти</button>
                </div> :
                <div className="edit-color-wrapper">
                    <div className="color-info">
                        {
                            !colorActive ?
                            <p>Цвет: <span onClick={() => setColorActive(true)}>{color ? color : editedColor[0].color}</span></p> :
                            <div className="edit-state">
                                <input type="text" defaultValue={color} onChange={e => setColor(e.target.value)}/>
                                <button onClick={() => setColorActive(false)}>&#10003;</button>
                            </div>
                        }
                        {
                            !hexActive ?
                            <p>Hex: <span onClick={() => setHexActive(true)}>{hex}</span></p> :
                            <div className="edit-state">
                                <input type="text" onChange={e => setHex(e.target.value)} maxLength={7}/>
                                <button onClick={() => setHexActive(false)}>&#10003;</button>
                            </div>
                        }
                    </div>
                    <a href="https://html-color-codes.info/colors-from-image/" target="blank">
                        <div className="hex-code" style={hexStyle()} />
                    </a>
                    <button onClick={saveChanges}>Сохранить</button>
                </div>
            }
        </form>
    )
}
