const csrf = require('csurf')

const csrfProtection = csrf({cookie : true})
const express = require('express')
const sentry = require('@sentry/browser')
const auth = require('../middleware/auth')

const router = express.Router()
const MemberController = require('../controller/memberController')

router.get('/login', csrfProtection, (req, res) => {
    res.render('member/login', { 
        title : '로그인', 
        csrfToken : req.csrfToken(),
        user_session : req.session
    })
})

router.get('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                throw new Error("로그아웃에 실패하였습니다.")
            }
        })
        res.send("<script>location.href='/';</script>")
    } catch (e) {
        sentry.captureEvent(e)
        res.send("<script>location.href='/';</script>")
    }
})

router.get('/register', csrfProtection, (req, res) => {
    res.render('member/register', { 
        title : '회원가입', 
        csrfToken : req.csrfToken(),
        user_session : req.session
    })
})

router.get('/mypage', auth.loginCheck, csrfProtection, (req, res) => {
    res.render("member/mypage", {
        title : '마이페이지',
        csrfToken : req.csrfToken(),
        user_session : req.session
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
        sentry.captureException(e);
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
        await member.registerProcess();
            
        res.send("<script>location.href='/';</script>")
    } catch (e) {
        sentry.captureException(e);
        res.send("<script>alert('"+e+"');location.href='/member/register';</script>")
    }
})

router.patch('/update', csrfProtection, async (req, res) => {
    try {
        if (!req.body.password || !req.body.nickname) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        const member = new MemberController({
            userId : req.session.user_id,
            password : req.body.password,
            nickname : req.body.nickname
        })
        await member.update()
        res.send("<script>alert('성공적으로 수정되었습니다.'); location.href='/';</script>")

    } catch (e) {
        sentry.captureException(e);
        res.send("<script>alert('"+e+"');location.href='/member/mypage';</script>")
    }
})
module.exports = router