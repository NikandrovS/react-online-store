import React, {useEffect, useState} from "react";
import config from "../../../helpers/config/config";

export default function ColorOption ({ setColorOption }) {

    const [colors, setColors] = useState([])
    const [activeColor, setActiveColor] = useState('Цвет')
    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                let response = await fetch(`${config.BACKEND}/colors`, {
                    signal: abortController.signal
                })
                if (response.ok) {
                    let json = await response.json();
                    setColors(json)
                } else {
                    alert("Ошибка HTTP: " + response.status);
                }
            } catch (e) {
                if (!abortController.signal.aborted) {
                    console.error(e)
                }
            }
        };
        fetchData();

        return () => {
            abortController.abort();
        };
    }, [setColorOption])

    const styleHide = {
        display: 'none'
    };
    const styleShow = {
        display: 'block'
    };

    function onClick(color_id, color) {
        setColorOption(color_id)
        setActiveColor(color)
        setDropdown(prev => !prev)
    }

    return (
        <div className="color-option">
            <p onClick={() => setDropdown(prev => !prev)} className="setChoice">{activeColor}</p>
            <ul className="dropdown">
                {
                    colors.map((item, index) => <li key={index} style={dropdown ? styleShow : styleHide} onClick={() => onClick(item.color_id, item.color)}>{item.color}</li>)
                }
            </ul>
        </div>
    )
}
