var express = require('express')
var router = express.Router()
var musicController = require('../controller/musicController')
var csrf = require('csurf')
var csrfProtection = csrf({cookie : true})

/*router.get('/', async (req, res) => {
    let list =  await musicController.getMusicList()
    res.render('index', { list : list } )
})
*/

router.get('/', csrfProtection, async (req, res) => {
    let list = await musicController.getMusicList()
    res.render('index', {
        title : "홈",
        list: list
    })
})

router.get('/music/create', csrfProtection, (req, res) => {
    res.render('music/create', { title : "등록", csrfToken : req.csrfToken() })
})

router.get('/music/:id', (req, res) => {
    
    res.redirect('/'+req.params.id)
})

router.post('/music/store', csrfProtection, async (req, res) => {
    let result = await musicController.createMusic(req.body)
    console.log(result)
    if (result === true) {
        res.redirect('/')
    }
})
/* 기존에 무한로딩 되던거 
router.get('/', (req, res) => {  
    res.render('/music', '', musicController.getMusicList)
}) 
*/
module.exports = router