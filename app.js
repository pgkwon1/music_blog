var express = require('express')
var app = express()
var body_parser = require('body-parser')
var cookieParser = require('cookie-parser')
var ejs = require('ejs')
var layout = require('express-ejs-layouts')
var router = express.Router()

var index_router = require('./router/router')(router)
var music_router = require('./router/music')(router)
var member_router = require('./router/member')(router)
const { sequelize } = require('./models')

//sequelize.sync()
app.use(express.static('public'))
app.use(cookieParser())
app.use(body_parser.urlencoded({
    extended: true
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.set('layout', 'header')
app.use(layout)

app.use('/', index_router)
app.use('/member', member_router)
app.use('/music', music_router)

app.listen(3000, function () {
    console.log("App Start")
})