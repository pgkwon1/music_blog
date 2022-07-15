const csrf = require('csurf')
const csrfProtection = csrf({cookie : true})
const memberController = require('../controller/memberController')
const playlistController = require('../controller/playlistController')
const express = require('express')
const router = express.Router()

router.get('/login', csrfProtection, async (req, res) => {
    res.render('member/login', { 
        title : '로그인', 
        csrfToken : req.csrfToken(),
        user_session : req.session
    })
})

router.get('/logout', async(req, res) => {
    req.session.destroy((err) => {
        res.send("<script>location.href='/';</script>")
    })
})

router.get('/register', csrfProtection, async(req, res) => {
    res.render('member/register', { 
        title : '회원가입', 
        csrfToken : req.csrfToken(),
        user_session : req.session
    })
})
    
router.post('/login_process', csrfProtection, async (req, res) => {
    try {
        const member = new memberController()
        let result = await member.loginProcess(req.body.user_id, req.body.password)
        req.session.user_id = result.user_id
        req.session.nickname = result.nickname
        req.session.is_login = true
        res.send("<script>location.href='/'</script>")
    } catch (e) {
        res.send("<script>alert('"+e+"');location.href='/member/login';</script>")
    }
})

router.post('/register_process', csrfProtection, async(req, res) => {
    try {
        const member = new memberController()
        let result = await member.registerProcess({
            user_id : req.body.user_id,
            password : String(req.body.password),
            nickname : req.body.nickname
        })
            
        res.send("<script>location.href='/';</script>")
    } catch (e) {
        res.send("<script>alert('"+e+"');location.href='/member/register';</script>")
    }
})

module.exports = router