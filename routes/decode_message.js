const router = require('express').Router()
const bcrypt = require('bcrypt')
const Message = require('../models/message.model')
const crypto = require('crypto')

decrypt = (input) => {
    let iv = Buffer.from(input.iv, 'hex')
    let encryptedInput = Buffer.from(input.encryptedData, 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(input.key.buffer), iv)
    let decrypted = decipher.update(encryptedInput)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
}

router.route('/decode').post((req, res) => {
    const { message } = req.body
    const { password } = req.body
    const value = {}

    Message.find({'message.encryptedData': message}).then(result => {
        if (result.length === 0) {
            res.json('Message not found.')
        }
  
        bcrypt.compare(password, result[0].password).then((data) => {
            if(!data) {
                res.json('Incorrect Password')
            }

            value.iv = result[0].message[0].iv
            value.encryptedData = result[0].message[0].encryptedData
            value.key = result[0].message[0].key

            res.json(decrypt(value))

            //Self destruct
            Message.remove({'message.encryptedData': message}).then(success => {
                if (success) {
                    console.log('Message was deleted')
                }
            })
        })
    })
})

module.exports = router