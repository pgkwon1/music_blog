const express = require('express')
const app = express()
const body_parser = require('body-parser')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const layout = require('express-ejs-layouts')
const session = require('express-session')

const router = express.Router()

const index_router = require('./router/index')(router)
const music_router = require('./router/music')(router)
const member_router = require('./router/member')(router)
const { sequelize } = require('./models')

//sequelize.sync()
app.use(express.static('public'))
app.use(cookieParser())
app.use(body_parser.urlencoded({
    extended: true
}))
app.use(session({
    secret : 'pgkwon1',
    resave : false,
    saveUninitialized : false,
    rolling : true,
    cookie: { secure: false, expires : 60 * 60 * 24 }
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.set('layout', 'header')
app.use(layout)

app.use('/', index_router)
app.use('/member', member_router)
app.use('/music', music_router)

app.use((req, res, next) => {
    res.status(404)
    res.render("404", {
        title : 'PAGE NOT FOUND',
        layout : false
    })
    next()
}) 
app.listen(3000, function () {
    console.log("App Start")
})