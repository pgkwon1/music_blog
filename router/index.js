const csrf = require('csurf')

const csrfProtection = csrf({cookie : true})
const express = require('express')

const router = express.Router()
const IndexController = require('../controller/indexController')

router.get('/', csrfProtection, async (req, res) => {
    try {
        const index = new IndexController({
            userId : req.session.user_id
        })
        const list = await index.getPlayList()
        res.render('index', {
            title : "홈",
            playlist: list,
            user_session : req.session,
            csrfToken : req.csrfToken()
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router