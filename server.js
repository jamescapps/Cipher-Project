require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.frameguard({ action: 'sameorigin' }))
app.use(helmet.dnsPrefetchControl())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(helmet.noSniff())
app.use(helmet.xssFilter())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
/*app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
}))*/
  
app.use(cors());
app.use(bodyParser.json())

mongoose.set('useCreateIndex', true)

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
//mongoose.connect('mongodb://localhost/cipher_project', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
  console.log("Connected to database!")
})

const createMessageRouter = require('./routes/create_message')
const decodeMessageRouter = require('./routes/decode_message')
const shareMessageRouter = require('./routes/share_message')

app.use('/create_message', createMessageRouter)
app.use('/decode_message', decodeMessageRouter)
app.use('/share_message', shareMessageRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, '/client/public')));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
  });
}

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT)
})
