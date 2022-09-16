const express = require('express')

const router = express.Router()
const csrf = require('csurf')
const sentry = require('@sentry/browser')

const csrfProtection = csrf({cookie : true})
const Music = require('../controller/Music')

router.post('/store', csrfProtection, async (req, res) => {
    try {
        const music = new Music({
            userId : req.session.user_id,
            playlistId : req.body.playlistId
        })
        const result = await music.createMusic(req.body.query)
        res.status(200).send({ 
            result : true, 
            youtube_link : result.youtube_link,
            title : result.title
        })
    } catch (e) {
        sentry.captureException(e);
        res.status(200).send({ 
            result : false, 
            message : e.message 
        })
    }
})

router.post('/searchByTitle', csrfProtection, async(req,res) => {

    try {
        const { query, playlistId } = req.body
        const userId = req.session.user_id
        if (!query || !playlistId || !userId) {
            throw new Error("올바르지 않은 접근입니다.")
        }

        const data = await Music.getYoutubeInfoByTitle(req.body.query)
        res.status(200).send({
            result : true,
            data
        })
    } catch (e) {
        sentry.captureEvent(e)
        res.status(500).send({
            result : false,
            message : "검색에 실패하였습니다 관리자에게 문의해주세요."
        })
    }
})
router.delete('/delete', csrfProtection, async (req, res) => {
    try {
        const { musicId, playlistId } = req.body
        const userId = req.session.user_id
        if (!musicId || !playlistId || !userId) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        const music = new Music({
            userId,
            playlistId 
        })
        await music.deleteMusic(musicId)
        res.status(200).send({ 
            result : true 
        })
    } catch (e) {
        sentry.captureException(e);
        res.status(200).send({ 
            result : false, 
            message : e.message 
        })
    }
})

module.exports = router