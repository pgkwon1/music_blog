const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const layout = require('express-ejs-layouts')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
const helmet = require('helmet')
const sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const favicon = require('serve-favicon')

const indexRouter = require('./router/index')
const musicRouter = require('./router/music')
const memberRouter = require('./router/member')
const playlistRouter = require('./router/playlist')
const commentRouter = require('./router/comment')
// const { sequelize } = require('./models')
// sequelize.sync(

sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new sentry.Integrations.Http({
            tracing: true
        }),
        new Tracing.Integrations.Express({
            app
        }),
    ],

    tracesSampleRate: 1.0,
});
app.use(sentry.Handlers.requestHandler())
app.use(sentry.Handlers.tracingHandler());

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}))

app.use(helmet.referrerPolicy({
    policy: 'strict-origin'
}))

const staticDir = (process.env.MODE === "DEV") ? "public" : "dist"
app.use(express.static(staticDir))
app.use(favicon(`${__dirname}/public/images/favicon.ico`))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(session({
    secret: 'pgkwon1',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
}))
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.set('layout', 'layout')

app.use(layout)

app.use('/', indexRouter)
app.use('/member/', memberRouter)
app.use('/music/', musicRouter)
app.use('/playlist/', playlistRouter)
app.use('/comment/', commentRouter)

app.use(sentry.Handlers.errorHandler())

app.use((req, res, next) => {
    res.status(404)
    res.render("404", {
        title: 'PAGE NOT FOUND',
        layout: false
    })
    next()
})
app.listen(3000, () => {
    console.log("App Start")
})