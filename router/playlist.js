const express = require('express')
const csrf = require('csurf')
const moment = require('moment')
const sentry = require('@sentry/browser')

const PlaylistController = require('../controller/playlistController')

const router = express.Router()

const csrfProtection = csrf({ cookie : true })


router.get('/', csrfProtection, async (req, res) => {
    try {
        const playlistController = new PlaylistController({
            userId : req.session.user_id
        })
        const playList = await playlistController.getAllPlayList()
        res.render('playlist/index', {
            title : '마이페이지',
            playlist : playList,
            csrfToken : req.csrfToken(),
            user_session : req.session
        })
    } catch (e) {
        sentry.captureException(e);
        res.send("<script>alert('"+e+"'); location.href='/'</script>")
    }
})

router.get('/create', csrfProtection, (req,res) => {
    res.render('playlist/create', {
        title : '플레이리스트 생성',
        csrfToken : req.csrfToken(),
        user_session : req.session
    })
})

router.get('/:id', csrfProtection, async(req, res) => {
    try {
        
        const playlistController = new PlaylistController({
            playlistId : req.params.id,
            userId : req.session.user_id || null
        })
        const userPlaylist = await playlistController.getPlayList()
        res.render('playlist/view', {
            title : userPlaylist.title,
            userPlaylist,
            user_session : req.session,
            csrfToken : req.csrfToken(),
            moment
        })
    } catch (e) {
        sentry.captureException(e);
        res.status(500).send("<script>alert('"+e+"'); location.href='/playlist/'</script>")
    }
    
})

router.post('/store', csrfProtection, async(req,res) => {
    try {
        req.body.music = req.body.music.filter(music => music !== '')
        if (typeof req.body.title === "undefined" || req.body.music.length < 1) {
            throw new Error("비정상적인 접근입니다.")
        }
        const playList = new PlaylistController({
            userId : req.session.user_id
        })
        await playList.create({
            title : req.body.title,
            musicList : req.body.music
        }) // 플레이리스트 생성

        res.send("<script>alert('플레이리스트 생성에 성공하였습니다.'); location.href='/playlist';</script>")
    } catch (e) {
        sentry.captureException(e);
        res.status(500).send(`<script>alert('${e.message}'); location.href='/playlist';</script>`)
    }


})

router.post('/like', csrfProtection, async(req, res) => {
    try {
        const playlistController = new PlaylistController({
            userId : req.session.user_id,
            playlistId : req.body.playlistIndex
        })
        const like = await playlistController.like()
        res.status(200).send({
            result : true,
            like
        })
    } catch (e) {
        sentry.captureException(e);

        res.status(200).send({
            result : false,
            message : e
        })
    }
})

router.delete('/delete', csrfProtection, async(req, res) => {
    try {
        if (typeof req.body.playlistId === "undefined" || typeof req.session.user_id === "undefined") {
            throw new Error("비정상적인 접근입니다.")
        }
        const playList = new PlaylistController({
            userId : req.session.user_id,
            playlistId : req.body.playlistId
        })
        await playList.delete()
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

router.patch('/update', csrfProtection, async(req,res) => {
    try {
        const { playlistId } = req.body
        if (playlistId === undefined) {
            throw new Error("올바르지 않은 접근입니다.")
        } 
        const playlist = new PlaylistController({
            playlistId,
            userId : req.session.user_id
        })
        await playlist.update(req.body.data)
        res.status(200).send({
            result : true
        })
    } catch (e) {
        sentry.captureException(e);
        res.status(500).send({
            result : false,
            message : e.message
        })
    }
})

module.exports = router