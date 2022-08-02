const { comments } = require('../models')

class CommentsController {
    constructor(data) {
        this.playlistId = data.playlistId
        this.userId = data?.userId
        this.delMode = data?.delMode
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
    
    async getCount() {
        const result = await comments.count({
            where : {
                playlist : this.playlistId
            }
        })
        return result
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

    async delete() {
        const query = (this.delMode === "user")
        ? { user_id : this.userId, playlist : this.playlistId}
        : { playlist : this.playlistId }
        const result = await comments.destroy({
            where : query
        })

        console.log(query)
    }

}

module.exports = CommentsController