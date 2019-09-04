const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const mailer = require('nodemailer')

var port =  2000 

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('<center><h1> Homepage </h1></center>')
})

app.get('/testcrypto', (req, res)=> {
    var hashPassword = crypto.createHmac('sha256', 'awayfromhome').update(req.query.password).digest('hex')
    console.log(hashPassword);
    res.send(`<h3>your encrypted Password is ${hashPassword}, and it's ${hashPassword.length} characters long</h3>`)
})

const { productsRouter,
        categoriesRouter,
        brandsRouter,
        UsersRouter } = require('./Router')

app.use('/products', productsRouter)
app.use('/categories', categoriesRouter)
app.use('/brands', brandsRouter)
app.use('/users', UsersRouter)

app.listen(port, ()=> console.log('API Aktif di port: ' + port));
