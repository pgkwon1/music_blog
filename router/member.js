const csrf = require('csurf')
const csrfProtection = csrf({cookie : true})
const memberController = require('../controller/memberController')
const playlistController = require('../controller/playlistController')

module.exports = (router) => {
    router.get('/member/login', csrfProtection, async (req, res) => {
        res.render('member/login', { 
            title : '로그인', 
            csrfToken : req.csrfToken(),
            user_session : req.session
        })
    })
    router.get('/member/logout', async(req, res) => {
        req.session.destroy((err) => {
            res.send("<script>location.href='/';</script>")
        })
    })
    router.get('/member/register', csrfProtection, async(req, res) => {
        res.render('member/register', { 
            title : '회원가입', 
            csrfToken : req.csrfToken(),
            user_session : req.session
        })
    })

    router.get('/member/mypage', csrfProtection, async (req, res) => {
        try {
            const playList = new playlistController('pgkwon1')
            let play_list = await playList.getPlayList()
            res.render('member/mypage', {
                title : '마이페이지',
                playlist : play_list,
                csrfToken : req.csrfToken(),
                user_session : req.session
            })
        } catch (e) {
            console.log("error"+ e)
        }
    })
    
    router.post('/member/login_process', csrfProtection, async (req, res) => {
        try {
            const member = new memberController()
            const result = await member.loginProcess(req.body.user_id, req.body.password)
            req.session.user_id = result.user_id
            req.session.nickname = result.nickname
            req.session.is_login = true
            res.send("<script>location.href='/'</script>")
        } catch (e) {
            res.send("<script>alert('"+e+"');location.href='/member/login';</script>")
        }
    })
    router.post('/member/register_process', csrfProtection, async(req, res) => {
        try {
            const member = new memberController()
            var result = await member.registerProcess({
                user_id : req.body.user_id,
                password : String(req.body.password),
                nickname : req.body.nickname
            })
            res.send("<script>location.href='/';</script>")
        } catch (e) {
            res.send("<script>alert('"+e+"');location.href='/member/register';</script>")
        }
    })
    return router
}