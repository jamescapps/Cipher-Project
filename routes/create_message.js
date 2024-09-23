const router = require('express').Router()
const bcrypt = require('bcrypt')
const Message = require('../models/message.model')
const crypto = require('crypto')
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

encrypt = (input) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
    let encrypted = cipher.update(input)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), key: key}
}

router.route('/add').post((req, res) => {
    const { message } = req.body
    const { password1 } = req.body
    const { password2 } = req.body
    const encryptedMessage = encrypt(message)

    if (!message) {
        res.json('Please enter a message')
    }

    if (!password1 || !password2) {
        res.json('Please supply a password')
    }

    if (password1 !== password2) {
        res.removeListener('Make sure passwords match.')
    }

    const newMessage = new Message({
        message: [{
            iv: encryptedMessage.iv,
            encryptedData: encryptedMessage.encryptedData,
            key: encryptedMessage.key
        }],
        password: password2,
    })

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newMessage.password, salt, (err, hash) => {
            newMessage.password = hash
            newMessage.save()
                .then(() => res.json('Your message data is: '+ newMessage.message[0].encryptedData))
                .catch(err => res.status(400).json('Error: ' + err))
        })
    })
         
    
})

module.exports = router