var csrf = require('csurf')
var csrfProtection = csrf({cookie : true})

module.exports = (router) => {
    router.get('/member/login', (req, res) => {
        res.send("test")
    })
    return router
}