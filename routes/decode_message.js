const router = require('express').Router()
const bcrypt = require('bcrypt')
const Message = require('../models/message.model')
const crypto = require('crypto')

//Need to add self-destruct.

decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'hex')
    let encryptedText = Buffer.from(text.encryptedData, 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(text.key.buffer), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

router.route('/decode').post((req, res) => {
    const { message } = req.body
    const { password } = req.body
    const value = {}

    Message.find({'message.encryptedData': message}).then(result => {
        if (result.length > 0) {
           bcrypt.compare(password, result[0].password).then((data) => {
                if (data) {
                    value.iv = result[0].message[0].iv
                    value.encryptedData = result[0].message[0].encryptedData
                    value.key = result[0].message[0].key
                    res.json(decrypt(value))
                }
                if(!data) {
                    res.json('Incorrect Password')
                }
            })
        } else {
            res.json('Message not found')
        }
    })

})

module.exports = router