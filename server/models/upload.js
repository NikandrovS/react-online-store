const BusBoy = require('busboy')
const path = require('path')
const util = require('util')
const fs = require('fs')
const database = require('./query');

module.exports = {
    transfer(ctx, options){
        const data = {}
        return new Promise(async function(resolve, reject){
            const uploadPath = options.uploadPath
            const allowedExtName = options.allowedExtName
            const imgId = options.imgId
            const imgName = options.imgName

            if(!fs.existsSync(uploadPath)){
                const mkdir = util.promisify(fs.mkdir)
                await mkdir(uploadPath).catch((error) => {
                    data.state = 'ERROR'
                    reject(error)
                })
            }

            const busboy = new BusBoy({headers:ctx.req.headers})
            busboy.on("file", function(fieldname, file, filename){
                let extname = path.extname(filename).substr(1)
                if( !allowedExtName.includes(extname) ){
                    data.state = "UPLOAD UNALLOWED FILE"
                    file.resume()
                    reject(data)
                }else{
                    async function upload() {
                        await database.uploadNewImage(imgName + '.' + extname, imgId)
                    }
                    upload()
                    file.pipe(fs.createWriteStream(uploadPath + '/' + imgName + '.' + extname))
                    file.on("data", function (chunk) {
                        data.state = `GET ${chunk.length} bytes`
                    })
                    file.on("end", function () {
                        data.state = "UPLOAD FINISHED"
                        data[fieldname] = uploadPath + '/' + imgName + '.' + extname
                    })
                }
            })
            busboy.on("filed", function (fieldname, value){
                data[fieldname] = value
            })
            busboy.on('error', function (error) {
                data.state = "ERROR"
                reject(error)
            })
            busboy.on('finish', function ( ) {
                data.state = "FORM DONE"
                resolve(data)
            })

            ctx.req.pipe(busboy)
        })
    }
}