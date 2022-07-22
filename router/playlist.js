const express = require('express')

const router = express.Router()
const csrf = require('csurf')

const csrfProtection = csrf({ cookie : true })
const PlaylistController = require('../controller/playlistController')

router.get('/', csrfProtection, async (req, res) => {
    try {
        const playlistController = new PlaylistController(req.session.user_id)
        const playList = await playlistController.getAllPlayList()
        res.render('playlist/index', {
            title : '마이페이지',
            playlist : playList,
            csrfToken : req.csrfToken(),
            user_session : req.session
        })
    } catch (e) {
        console.log("error : "+ e)
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
            playlistId : req.params.id
        })
        const userPlaylist = await playlistController.getPlayList()
        res.render('playlist/view', {
            title : userPlaylist.title,
            userPlaylist,
            user_session : req.session,
            csrfToken : req.csrfToken()
        })
    } catch (e) {
        res.send("<script>alert('"+e+"'); location.href='/playlist/'</script>")
    }
    
})

router.post('/store', csrfProtection, async(req,res) => {
    try {
        if (typeof req.body.title === "undefined" || req.body.music.length < 1) {
            throw new Error("비정상적인 접근입니다.")
        }
        const playList = new PlaylistController({
            user_id : req.session.user_id
        })
        await playList.create({
            title : req.body.title,
            musicList : req.body.music
        }) // 플레이리스트 생성

        res.send("<script>alert('플레이리스트 생성에 성공하였습니다.'); location.href='/playlist';</script>")
    } catch (e) {
        res.status(200).send({
            result : false,
            message : e
        })
    }


})

router.delete('/delete', csrfProtection, async(req, res) => {
    try {
        if (typeof req.body.playlist_id === "undefined" || typeof req.session.user_id === "undefined") {
            throw new Error("비정상적인 접근입니다.")
        }
        const playList = new PlaylistController({
            user_id : req.session.user_id,
            playlist_id : req.body.playlist_id
        })
        await playList.delete()
        res.status(200).send({
            result : true
        })
    } catch (e) {
        res.status(200).send({
            result : false,
            message : e
        })
    }
})
module.exports = router