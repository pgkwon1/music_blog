var express = require('express')
var app = express()
var body_parser = require('body-parser')
var ejs = require('ejs')
var layout = require('express-ejs-layouts')
var router = require('./router/router')
const { sequelize } = require('./models')

//sequelize.sync()
app.use(express.static('public'))
app.use(body_parser.urlencoded({
    extended: true
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.set('layout', 'header')
app.use(layout)

app.use('/', router)

app.listen(3000, function () {
    console.log("App Start")
})