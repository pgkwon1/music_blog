const express = require('express')
const csrf = require('csurf')
const CommentController = require('../controller/CommentsController')

const csrfProtection = csrf({cookie : true})
const router = express.Router()

router.post('/store', csrfProtection, async(req, res) => {
    try {
        if (!req.body.playlistId || !req.session.user_id || !req.body.comment) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        const Comment = new CommentController({
            playlistId : req.body.playlistId,
            userId : req.session.user_id
        })
        await Comment.store(req.body.comment)
        res.status(200).send({
            result : true
        })
    } catch (e) {
        res.status(200).send({
            result : false,
            message : e.message
        })
    }
})

module.exports = router