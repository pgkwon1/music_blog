const { playlist } = require('../models')
const MusicController = require("./musicController")
const LikesController = require('./likesController')
const CommentsController = require('./CommentsController')

class playlistController {

    constructor(data){
        this.userId = data?.userId
        this.playlistId = data?.playlistId
    }

    async getAllPlayList() {
        const query = (typeof this.userId !== "undefined" ) ? { 
            where : { 
                user_id : this.userId 
            } 
        } : {}
        const userPlaylist = await playlist.findAll(query)
        if (userPlaylist.length < 1) { 
            return false
        }
        let index = 0
        for await (const list of userPlaylist) {
            const music = new MusicController({
                userId : this.userId,
                playlistId : list.id
            })
            const musicList = await music.getMusicList()
            if (musicList.length > 0) {
                userPlaylist[index].musicList = musicList
                userPlaylist[index].firstMusic = musicList[0].youtube_link
                userPlaylist[index].firstThumbnail = musicList[0].thumbnail
            }
            if (this.userId) {
                const like = new LikesController({
                    userId : this.userId,
                    playlistId : list.id
                })
                userPlaylist[index].likeYn = await like.getLike()
            }
            const comment = new CommentsController({
                playlistId : list.id

            })
            userPlaylist[index].commentCount = await comment.getCount()

            index++
        }
        return userPlaylist
    }
    
    async getPlayList() {
        const userPlaylist = await playlist.findOne({
            where : { 
                id : this.playlistId
            }
        })
        if (userPlaylist === null) {
            throw new Error("존재하지 않는 플레이리스트 입니다.")
        }
        const music = new MusicController({
            playlistId : userPlaylist.id
        })
        const comments = new CommentsController({
            userId : this.userId,
            playlistId : this.playlistId
        })

        const musicList = await music.getMusicList()
        const commentList = await comments.getCommentList()
        if (musicList.length > 0) {
            userPlaylist.musicList = musicList
            userPlaylist.firstMusic = musicList[0].youtube_link
            userPlaylist.firstThumbnail = musicList[0].thumbnail
        }
        if (this.userId) {
            const like = new LikesController({
                userId : this.userId,
                playlistId : this.playlistId
            })
    
            userPlaylist.likeYn = await like.getLike()
        } else {
            userPlaylist.likeYn = false
        }
        userPlaylist.commentList = commentList
        userPlaylist.commentCount = commentList.length

        return userPlaylist
        
    }

    async create(data) {
        const result = await playlist.create({
            user_id : this.userId,
            title : data.title,
        })
        const music = new MusicController({
            userId : this.userId,
            playlistId : result.dataValues.id
        })
        data.musicList = data.musicList.filter(music => music != '')
        for await (const test of data.musicList) {
            await music.createMusic(test)
        }
        if (result.dataValues) {
            return result.dataValues
        }
        throw new Error("플레이리스트 생성에 실패하였습니다.")
    }

    async update(data) {
        const result = await playlist.update(
            data,
            {
                where : { 
                    user_id : this.userId, 
                    id : this.playlistId
                }
            }
        )
        if (result[0] !== 1) {
            throw new Error("수정에 실패하였습니다.")
        }
        return true
    }

    async delete() {
        const playlistInfo = await playlist.findOne({
            where : { 
                id : this.playlistId,
                user_id : this.userId
            }
        })
        if (playlistInfo.length < 1) {
            throw new Error("올바르지 않은 접근입니다.")
        }
        const music = new MusicController({
            playlistId : this.playlistId
        })    
        const musicList = await music.getMusicList()
        if (musicList.length > 0) {
            await music.deletePlaylistMusic()
        }
        if (playlistInfo.dataValues.like > 0) {
            const like = new LikesController({
                playlistId : this.playlistId,
                delMode : "all"
            })
            await like.likeCancel()
        }
        const comment = new CommentsController({
            playlistId : this.playlistId,
            delMode : "all"
        })
        const commentCount = await comment.getCount()
        if (commentCount > 0) {
            await comment.delete()
        }
        const result = await playlist.destroy({
            where : { 
                id : this.playlistId,
                user_id : this.userId
            }
        })
        if (result === false) {
            throw new Error("삭제에 실패하였습니다.")
        }
        return true
    }

    async like() {
        let likeYn = false
        const userPlaylist = await playlist.findOne({ where : { id : this.playlistId }})
        if (userPlaylist === null) {
            throw new Error("존재하지 않는 플레이리스트 입니다.")
        }
        const likesController = new LikesController({
            userId : this.userId,
            playlistId : this.playlistId,
            delMode : "user"
        })
        const likeInfo = await likesController.getLike()
        if (likeInfo === false) { // 좋아요 추가
            likeYn = true
            await likesController.like()
            await userPlaylist.increment('like', { by : 1 } )
        } else { // 좋아요 취소
            likeYn = false
            await likesController.likeCancel()
            await userPlaylist.decrement('like', { by : 1 } )
        }
        return likeYn
    }
}

module.exports = playlistController