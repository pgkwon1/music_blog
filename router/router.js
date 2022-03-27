var musicController = require('../controller/musicController')
var csrf = require('csurf')
var csrfProtection = csrf({cookie : true})

module.exports = (router) => {
    router.get('/', csrfProtection, async (req, res) => {
        let list = await musicController.getMusicList()
        res.render('index', {
            title : "홈",
            list: list
        })
    })
    return router
}