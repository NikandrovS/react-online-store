import React, {useRef} from "react";
import config from "../../../helpers/config/config";

export default function AddTextile ({setStatus}) {

    const textileRef = useRef('');
    const compositionRef = useRef('');

    async function onSubmit(e) {
        e.preventDefault()

        const form_body = {
            textile: textileRef.current.value,
            composition: compositionRef.current.value,
        }

        const response = await fetch(`${config.BACKEND}/newTextile`, {
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

        textileRef.current.value = ""
        compositionRef.current.value = ""
        setTimeout(() => {setStatus({state: 'disable'})}, 3000)
    }


    return (
        <form className="new-color" method="post" onSubmit={onSubmit}>
            <h3>Добавить ткань:</h3>
            <div className="new-color-wrapper">
                <div className="color-inputs">
                    <input ref={textileRef} type="text" placeholder="Название ткани" required />
                    <input ref={compositionRef} type="text" placeholder="Состав" required />
                </div>
                <button type="submit" value="Добавить">Добавить</button>
            </div>
        </form>
    )
}
