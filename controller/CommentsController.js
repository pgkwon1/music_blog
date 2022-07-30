const { comments } = require('../models')

class CommentsController {
    constructor(data) {
        this.playlistId = data.playlistId
        this.userId = data?.userId
    }
    
    async getCommentList() {
        if (!this.playlistId) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        const commentList = await comments.findAll({
            where : { 
                playlist : this.playlistId 
            }
        })
        return commentList
    }

    async store(comment) {
        const result = await comments.create({
            user_id : this.userId,
            playlist : this.playlistId,
            comment
        })

        if (result._options.isNewRecord === false) {
            throw new Error("코멘트 등록에 실패하였습니다.")
        }
        return true
        
    }

}

module.exports = CommentsController