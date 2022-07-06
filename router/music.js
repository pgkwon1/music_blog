var csrf = require('csurf')
var csrfProtection = csrf({cookie : true})
var musicController = require('../controller/musicController')

module.exports = (router) => {
    router.get('/music/create', csrfProtection, (req, res) => {
        if (req.session.is_login !== true) res.redirect('/member/login')
        res.render('music/create', { title : "등록", csrfToken : req.csrfToken(), user_session : req.session })
    })

    router.post('/music/store', csrfProtection, async (req, res) => {
        try {
            const music = new musicController()
            let result = await music.createMusic(req.body)
            result === true ? res.redirect('/') : res.status(500).send("create failed")
        } catch (e) {
            res.send("<script>alert('"+e+"'); location.href='/music/create';</script>")
        }
    })
    return router
}