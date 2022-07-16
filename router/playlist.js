const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const csrfProtection = csrf({ cookie : true })
const playlistController = require('../controller/playlistController')

router.get('/', csrfProtection, async (req, res) => {
    try {
        const playList = new playlistController(req.session.user_id)
        let play_list = await playList.getPlayList()
        res.render('playlist/index', {
            title : '마이페이지',
            playlist : play_list,
            csrfToken : req.csrfToken(),
            user_session : req.session
        })
    } catch (e) {
        console.log("error"+ e)
    }
})

module.exports = router