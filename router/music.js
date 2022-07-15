const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const csrfProtection = csrf({cookie : true})
const musicController = require('../controller/musicController')

router.post('/store', csrfProtection, async (req, res) => {
    try {
        const music = new musicController({
            user_id : req.session.user_id,
            playlist : req.body.playlist
        })
        let result = await music.createMusic(req.body.youtube_link)
        res.status(200).send({ 
            result : true, 
            youtube_link : result.youtube_link,
            title : result.title
        })
    } catch (e) {
        console.log(e)
        res.status(200).send({ result : false, message : e })
    }
})

router.post('/delete', csrfProtection, async (req, res) => {
    try {
        let index = req.body.index
        let playlist = req.body.playlist
        if (!index || !playlist) {
            throw "올바르지 않은 접근입니다."
        }
        const music = new musicController({
            user_id : req.session.user_id,
            playlist : playlist
        })
        let result = await music.deleteMusic(index)
        res.status(200).send({ result : true })
    } catch (e) {
        console.log(e)
        res.status(200).send({ result : false, message : e })
    }
})

module.exports = router