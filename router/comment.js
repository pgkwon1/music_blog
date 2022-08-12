const express = require('express')
const csrf = require('csurf')
const moment = require('moment')
const CommentController = require('../controller/CommentsController')

const csrfProtection = csrf({cookie : true})
const router = express.Router()

router.post('/store', csrfProtection, async(req, res) => {
    try {
        const { playlistId, comment } = req.body
        const { user_id, commentTime } = req.session
        const now = new moment().format()

        if (!playlistId || !user_id || !comment) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        if (commentTime && (now < commentTime)) {
            throw new Error("연속적으로 댓글을 입력하실수 없습니다. 잠시후에 다시 시도해주세요")
        }
        
        const Comment = new CommentController({
            playlistId,
            user_id
        })
        await Comment.store(req.body.comment)
        req.session.commentTime = new moment().add(3, 'minutes').format()
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