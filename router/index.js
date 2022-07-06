const indexController = require('../controller/indexController')
const csrf = require('csurf')
const csrfProtection = csrf({cookie : true})

module.exports = (router) => {
    router.get('/', csrfProtection, async (req, res) => {
        let index = new indexController()
        let list = await index.getPlayList()
        res.render('index', {
            title : "홈",
            playlist: list,
            user_session : req.session
        })
    })
    return router
}