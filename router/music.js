var csrf = require('csurf')
var csrfProtection = csrf({cookie : true})
var musicController = require('../controller/musicController')

module.exports = (router) => {
    router.get('/create', csrfProtection, (req, res) => {
        res.render('music/create', { title : "등록", csrfToken : req.csrfToken() })
    })

    router.get('/:id', (req, res) => {
        
        res.redirect('/'+req.params.id)
    })

    router.post('/store', csrfProtection, async (req, res) => {
        let result = await musicController.createMusic(req.body)
        result === true ? res.redirect('/') : res.status(500).send("create failed")
    })
    return router
}