require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const connectDB = require('./connect')

const app = express()

const PORT = process.env.PORT || 5000

const routes = require('./routes/index')

// for parsing body
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json())
app.use(cookieParser('secret_passcode'))
app.use(compression())

app.use(
    session({
        secret: 'secret_passcode',
        cookie: {
            maxAge: 4000000,
        },
        resave: false,
        saveUninitialized: false,
    })
)

app.set('view engine', 'ejs')

const publicDirectory = path.join(__dirname, '../public')
app.use(express.static(publicDirectory))

// router setup
app.use('/', routes)

// Database Connection and server listen...
connectDB()

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

const User = require('./models/User.js')
const { create } = require('domain')

const createUser = async (sch_id, name, password) => {
    try {
        let user = new User({
            sch_id,
            name,
            password,
        })

        await user.save()
    } catch (error) {
        console.log(error)
    }
}

// createUser("1815133","sameer", "12345678")
