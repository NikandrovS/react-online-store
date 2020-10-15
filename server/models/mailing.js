require('dotenv').config()
const nodemailerSendgrid = require('nodemailer-sendgrid');
const nodemailer = require('nodemailer')
const Email = require('email-templates');
const path = require('path')

const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_SECRET
    })
)

const email = new Email({
    message: {
        from: process.env.SENDER
    },
    send: true,
    transport,
    juiceResources: {
        preserveImportant: true,
        webResources: {
            relativeTo: path.resolve(__dirname, '..', 'emails')
        }
    },
    preview: false
})

module.exports.sendTrack = function (receiver, order, delivery, tracknumber, link) {

    let defaultTemplate = 'order-sent'
    if (delivery === "Russian Post") {
        defaultTemplate = 'order-sent-eng'
    }

    email.send({
        template: defaultTemplate,
        message: {
            to: receiver
        },
        locals: {
            order: order,
            delivery: delivery,
            track: tracknumber,
            link: link,
        }
    })
}
