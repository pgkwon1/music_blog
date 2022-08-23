
const express = require('express')

const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const layout = require('express-ejs-layouts')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
const helmet = require('helmet')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const indexRouter = require('./router/index')
const musicRouter = require('./router/music')
const memberRouter = require('./router/member')
const playlistRouter = require('./router/playlist')
const commentRouter = require('./router/comment')
// const { sequelize } = require('./models')
// sequelize.sync(

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Tracing.Integrations.Express({ app }),
        ],
      
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      });
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler());

app.use(helmet({
    contentSecurityPolicy : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}))

app.use(helmet.referrerPolicy({ policy: 'strict-origin' }))

const staticDir = (process.env.MODE === "DEV") ? "public" : "dist"
app.use(express.static(staticDir))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(session({
    secret : 'pgkwon1',
    resave : false,
    saveUninitialized : true,
    rolling : true,
    cookie: { maxAge : 600000 }
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

app.use(Sentry.Handlers.errorHandler())

app.use((req, res, next) => {
    res.status(404)
    res.render("404", {
        title : 'PAGE NOT FOUND',
        layout : false
    })
    next()
})
server.listen(3000, () => {
    console.log("App Start")
})