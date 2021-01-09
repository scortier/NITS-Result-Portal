require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const flash = require('connect-flash')
const connectDB = require('./connect')

const app = express()
app.use(express.json())

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

app.use(
    session({
        secret: 'secret',
        cookie: {
            maxAge: 4000000,
        },
        resave: false,
        saveUninitialized: false,
    })
)
app.use(flash())

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash()
    next()
})

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

const createUser = async (sch_id, name, password, email, cgpa) => {
    try {
        let user = new User({
            sch_id,
            name,
            email,
            cgpa,
            password,
        })

        await user.save()
    } catch (error) {
        console.log(error)
    }
}

// createUser('1912048', 'Gaurav Das', 'password', 'gauravdas014@gmail.com', '8')

// createUser("1815133","sameer", "12345678")
