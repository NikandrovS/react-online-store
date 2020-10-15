import React, {useEffect, useState} from "react";
import config from "../../../helpers/config/config";

export default function TextileOption ({ setTextileOption }) {

    const [textile, setTextile] = useState([])
    const [activeTextile, setActiveTextile] = useState('Выбрать материал')
    const [activeComposition, setActiveComposition] = useState('')
    const [dropdown, setDropdown] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                let response = await fetch(`${config.BACKEND}/materials`, {
                    signal: abortController.signal
                })
                if (response.ok) {
                    let json = await response.json();
                    setTextile(json)
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
    }, [])


    const styleHide = {
        display: 'none'
    };
    const styleShow = {
        display: 'block'
    };

    function onClick(textile_id, textile, composition) {
        setTextileOption(textile_id)
        setActiveTextile(textile)
        setActiveComposition(composition)
        setDropdown(prev => !prev)
    }

    return (
        <div>
            <p onClick={() => setDropdown(prev => !prev)} className="setChoice">{activeTextile} {activeComposition && activeComposition}</p>
            <ul className="dropdown">
                {
                    textile.map((item, index) => <li key={index} style={dropdown ? styleShow : styleHide} onClick={() => onClick(item.textile_id, item.textile, item.composition)}>{item.textile}, {item.composition}</li>)
                }
            </ul>
        </div>
    )
}
