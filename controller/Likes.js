const { likes } = require('../models')

class likesController {
    constructor(data) {
        this.userId = data?.userId
        this.playlistId = data.playlistId
        this.delMode = data?.delMode
    }
    
    async getLike() {
        const likeInfo = await likes.findOne({
            where : {
                user_id : this.userId,
                playlist : this.playlistId
            }
        })

        if (likeInfo === null) {
            return false
        }
        return true
    }

    async like() {
        const likeResult = await likes.create({
            playlist : this.playlistId,
            user_id : this.userId
        })

        if (!likeResult.dataValues) {
            throw new Error("좋아요에 실패하였습니다.")
        }

        return true
    }

    async likeCancel() {
        const query = (this.delMode === "user")
        ? { user_id : this.userId, playlist : this.playlistId}
        : { playlist : this.playlistId }
        const likeResult = await likes.destroy({
            where : query
        })

        if (likeResult === 0) {
            throw new Error("좋아요 취소에 실패하였습니다.")
        }

        return true
    }
    
}

module.exports = likesController