import React, {useRef, useState} from "react";
import config from "../../../helpers/config/config";
import StatusDiv from "../../../components/shared/StatusDiv";
import ColorOption from "./ColorOption";
import ImagePreview from "./ImagePreview";
import AddColor from "./AddColor"
import AddTextile from "./AddTextile";
import EditColor from "./EditColor";
import EditTextile from "./EditTextile";

export default function AddProduct () {

    const [status, setStatus] = useState({state: 'disable'});
    const [colorOption, setColorOption] = useState(0)

    const [selectedFiles, setSelectedFiles] = useState([])
    const [previewImg, setPreviewImg] = useState([])

    const [uploadingFiles, setUploadingFiles] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState(0)

    const artRef = useRef('');
    const nameRef = useRef('');
    const priceRef = useRef('');

    function uploadFiles(id) {
        setUploadedFiles(0)
        setUploadingFiles(selectedFiles.length)
        for (let image in selectedFiles) {
            if (selectedFiles[image].size) {
                if (selectedFiles[image].type === "image/jpeg" || selectedFiles[image].type === "image/png") {
                    const fd = new FormData()
                    fd.append('image', selectedFiles[image], image.name)

                    fetch(`${config.BACKEND}/productImage/${id}`, {
                        method: 'POST',
                        body: fd})
                        .then(() => setUploadedFiles(prev => ++prev))

                    if (parseInt(image) === selectedFiles.length-1) {
                        setPreviewImg([])
                        setSelectedFiles([])
                        setStatus({state: "success", text: `Изображения успешно загружены: ${selectedFiles.length} шт.`})
                        setTimeout(() => {setStatus({state: 'disable'})}, 3000)
                    }
                } else {
                    setStatus({state: "error", text: `Некорректный файл ${selectedFiles[image].name}`})
                    setTimeout(() => {setStatus({state: 'disable'})}, 3000)
                }
            }
        }
    }

    async function onSubmit(e) {
        e.preventDefault()

        if (selectedFiles.length > 0) {
            const form_body = {
                art_no: artRef.current.value,
                product_name: nameRef.current.value,
                color_id: colorOption,
                price: priceRef.current.value
            }

            const response = await fetch(`${config.BACKEND}/newProduct`, {
                method: 'POST',
                body: JSON.stringify(form_body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            let json = await response.json();
            if (!json.error) {
                uploadFiles(json.created_id)
            } else {
                setStatus({state: "error", text: json.error})
            }

            artRef.current.value = ""
            nameRef.current.value = ""
            priceRef.current.value = ""
        } else {
            setStatus({state: "error", text: "Необходимо загрузить изображения"})
            setTimeout(() => {setStatus({state: 'disable'})}, 3000)
        }

    }

    return (
        <div className="add-product">
            <StatusDiv status={status}/>
            <form onSubmit={onSubmit} className="new-product">
                <h3>Добавить изделие:</h3>
                <div className="add-product-form">
                    <input ref={artRef} className="input-art" type="text" placeholder="Артикул" required />
                    <input ref={nameRef} className="input-name" type="text" placeholder="Наименование" required />
                    <ColorOption setColorOption={setColorOption} />
                </div>
                <div className="add-product-image">
                    <ImagePreview
                        previewImg={previewImg}
                        setPreviewImg={setPreviewImg}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        uploadingFiles={uploadingFiles}
                        uploadedFiles={uploadedFiles}
                    />
                    <div className="submit-div">
                        <input ref={priceRef} className="input-price" type="number" min='0' placeholder="Цена" required />
                        <button type="submit" value="Добавить">Добавить</button>
                    </div>
                </div>
            </form>
            <div className="create-div">
                <AddColor setStatus={setStatus} />
                <EditColor setStatus={setStatus} />
            </div>
            <div className="create-div">
                <AddTextile setStatus={setStatus} />
                <EditTextile setStatus={setStatus} />
            </div>
        </div>
    )
}