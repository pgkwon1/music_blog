
const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const layout = require('express-ejs-layouts')
const session = require('express-session')

const indexRouter = require('./router/index')
const musicRouter = require('./router/music')
const memberRouter = require('./router/member')
const playlistRouter = require('./router/playlist')
const commentRouter = require('./router/comment')

// const { sequelize } = require('./models')

// sequelize.sync()
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(session({
    secret : 'pgkwon1',
    resave : false,
    saveUninitialized : false,
    rolling : true,
    cookie: { secure: false, expires : 60 * 60 * 24 }
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.set('layout', 'layout')

app.use(layout)

app.use('/', indexRouter)
app.use('/member', memberRouter)
app.use('/music', musicRouter)
app.use('/playlist', playlistRouter)
app.use('/comment', commentRouter)

app.use((err, req, res) => {
    if (err.code === "EBADCSRFTOKEN") {
        res.status(500).send("비정상적인 접근입니다.")
    }
    return false
})

app.use((req, res, next) => {
    res.status(404)
    res.render("404", {
        title : 'PAGE NOT FOUND',
        layout : false
    })
    next()
}) 
app.listen(3000, () => {
    console.log("App Start")
})