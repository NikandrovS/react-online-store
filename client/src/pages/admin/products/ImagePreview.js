import React from "react";

export default function ImagePreview ({ previewImg, setPreviewImg, selectedFiles, setSelectedFiles, uploadingFiles, uploadedFiles }) {

    function fileHandler(e) {
        setSelectedFiles(Array.from(e.target.files))

        let array = []
        for(let i = 0; i < e.target.files.length; i++) {
            array.push({ name: e.target.files[i].name, path: URL.createObjectURL(e.target.files[i]) })
        }
        setPreviewImg(array)
    }

    function removeImg(name, path) {
        let previewRemover = previewImg.filter(image => image.path !== path)
        setPreviewImg(previewRemover)

        let fileRemover = selectedFiles.filter(image => image.name !== name)
        setSelectedFiles(fileRemover)
    }

    return (
        <div className="preview-wrapper">
            <div className="head">
                <label htmlFor="imgUploader">{selectedFiles.length === 0 ? "Загрузить изображения" : "Выбрано " + selectedFiles.length + " фото" }</label>
                <input style={{display: "none"}} type="file" accept=".jpg, .jpeg, .png" multiple id="imgUploader" onChange={fileHandler}/>
                {
                    uploadingFiles !== uploadedFiles &&
                    <p>{uploadedFiles} / {uploadingFiles}</p>
                }
            </div>

            <div className="images">
                <label htmlFor="imgUploader"><img src={require(`../../../assets/icons/add.svg`)} className='add-icon' alt="add-image"/></label>
                {
                    previewImg.length > 0 &&
                    previewImg.map((img, index) => (
                        <img
                            src={img.path}
                            key={index}
                            className="img-preview"
                            alt="upload-img-preview"
                            onClick={() => removeImg(img.name, img.path)}
                        />))
                }
            </div>
        </div>
    )
}
