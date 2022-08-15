const env = require('dotenv').config()
const csrf = require('csurf')

const csrfProtection = csrf({cookie : true})
const express = require('express')
const { spawn } = require('child_process')

const router = express.Router()
const IndexController = require('../controller/indexController')

router.get('/', csrfProtection, async (req, res) => {
    try {
        const index = new IndexController({
            userId : req.session.user_id
        })
        const list = await index.getPlayList()
        res.render('index', {
            title : "홈",
            playlist: list,
            user_session : req.session,
            csrfToken : req.csrfToken()
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/push', async (req,res) => {
  	try {
    		const command = process.env.GITHOOK_COMMAND
    		const processStream = spawn('bash')
    		processStream.stdin.write(command)
    		processStream.stdin.end()

    		processStream.on('close', code => {
    			res.status(200).send({
    				success : true,
            code
    			})
    		})
  	} catch (e) {
    		res.status(200).send({
    			success:false,
          error : e.message
    		})
  	}

})
module.exports = router
