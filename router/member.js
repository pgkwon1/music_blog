const csrf = require('csurf')

const csrfProtection = csrf({cookie : true})
const express = require('express')

const router = express.Router()
const MemberController = require('../controller/memberController')

router.get('/login', csrfProtection, async (req, res) => {
    res.render('member/login', { 
        title : '로그인', 
        csrfToken : req.csrfToken(),
        user_session : req.session
    })
})

router.get('/logout', async(req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw new Error("로그아웃에 실패하였습니다.")
        }
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

router.get('/mypage', csrfProtection, async(req, res) => {
    res.render("member/mypage", {
        title : '마이페이지',
        csrfToken : req.csrfToken()
    })
})

router.post('/login_process', csrfProtection, async (req, res) => {
    try {
        const member = new MemberController({
            userId : req.body.user_id,
            password : req.body.password
        })
        const result = await member.loginProcess()
        req.session.user_id = result.userId
        req.session.nickname = result.nickname
        req.session.is_login = true
        res.send("<script>location.href='/'</script>")
    } catch (e) {
        res.send("<script>alert('"+e+"');location.href='/member/login';</script>")
    }
})

router.post('/register_process', csrfProtection, async(req, res) => {
    try {
        const member = new MemberController({
            userId : req.body.user_id,
            password : String(req.body.password),
            nickname : req.body.nickname

        })
        await member.registerProcess()
            
        res.send("<script>location.href='/';</script>")
    } catch (e) {
        res.send("<script>alert('"+e+"');location.href='/member/register';</script>")
    }
})

module.exports = router