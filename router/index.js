const csrf = require('csurf')

const csrfProtection = csrf({cookie : true})
const express = require('express')

const router = express.Router()
const indexController = require('../controller/indexController')

router.get('/', csrfProtection, async (req, res) => {
    const list = await indexController.getPlayList()
    res.render('index', {
        title : "홈",
        playlist: list,
        user_session : req.session,
        csrfToken : req.csrfToken()
    })
})

module.exports = router