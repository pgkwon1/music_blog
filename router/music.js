const express = require('express')

const router = express.Router()
const csrf = require('csurf')

const csrfProtection = csrf({cookie : true})
const MusicController = require('../controller/musicController')

router.post('/store', csrfProtection, async (req, res) => {
    try {
        const music = new MusicController({
            userId : req.session.user_id,
            playlist : req.body.playlist
        })
        const result = await music.createMusic(req.body.youtube_link)
        res.status(200).send({ 
            result : true, 
            youtube_link : result.youtube_link,
            title : result.title
        })
    } catch (e) {
        res.status(200).send({ result : false, message : e.message })
    }
})

router.delete('/delete', csrfProtection, async (req, res) => {
    try {
        const { index, playlist } = req.body
        if (!index || !playlist) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        const music = new MusicController({
            user_id : req.session.user_id,
            playlist
        })
        await music.deleteMusic(index)
        res.status(200).send({ result : true })
    } catch (e) {
        res.status(200).send({ result : false, message : e })
    }
})

module.exports = router