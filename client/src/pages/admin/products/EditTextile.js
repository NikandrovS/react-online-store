import React, {useState} from "react";
import config from "../../../helpers/config/config";
import TextileOption from "./TextileOption";

export default function EditTextile ({ setStatus }) {

    const [textileOption, setTextileOption] = useState(0)
    const [editedTextile, setEditedTextile] = useState([])

    const [textile, setTextile] = useState('');
    const [composition, setComposition] = useState('');

    const [textileActive, setTextileActive] = useState(false);
    const [compositionActive, setCompositionActive] = useState(false);

    function getEditedTextile(e) {
        e.preventDefault()
        if (textileOption > 0) {
            fetch(`${config.BACKEND}/getEditTextile/${textileOption}`)
                .then(response => response.json())
                .then(response => {
                    setEditedTextile(response)
                    setTextile(response[0].textile)
                    setComposition(response[0].composition)
                })
                .catch(err => console.error(err))
        }
    }

    async function saveChanges(e) {
        e.preventDefault()
        const form_body = {
            id: editedTextile[0].textile_id,
            textile: textile,
            composition: composition,
        }

        const response = await fetch(`${config.BACKEND}/editTextile`, {
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
        setEditedTextile([])
        setTimeout(() => {setStatus({state: 'disable'})}, 3000)
    }

    return (
        <form className="new-color">
            <h3>Редактировать ткань:</h3>
            {
                editedTextile.length === 0 ?
                    <div className="edit-textile-wrapper">
                        <TextileOption setTextileOption={setTextileOption}/>
                        <button className="find-button" onClick={getEditedTextile}>Найти</button>
                    </div> :
                    <div className="edit-textile-wrapper">
                        <div className="textile-info">
                            {
                                !textileActive ?
                                    <p>Ткань: <span onClick={() => setTextileActive(true)}>{textile ? textile : editedTextile[0].textile}</span></p> :
                                    <div className="edit-state">
                                        <input type="text" defaultValue={textile} onChange={e => setTextile(e.target.value)}/>
                                        <button onClick={() => setTextileActive(false)}>&#10003;</button>
                                    </div>
                            }
                            {
                                !compositionActive ?
                                    <p>Состав: <span onClick={() => setCompositionActive(true)}>{composition}</span></p> :
                                    <div className="edit-state">
                                        <input type="text" defaultValue={composition} onChange={e => setComposition(e.target.value)}/>
                                        <button onClick={() => setCompositionActive(false)}>&#10003;</button>
                                    </div>
                            }
                        </div>
                        <button type="submit" onClick={saveChanges}>Сохранить</button>
                    </div>
            }
        </form>
    )
}
