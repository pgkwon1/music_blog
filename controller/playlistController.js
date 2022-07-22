const { playlist } = require('../models')
const MusicController = require("./musicController")

class playlistController {

    constructor(data){
        this.userId = data?.userId
        this.playlistId = data?.playlistId
    }

    async getAllPlayList() {
        let musicList
        const query = (typeof this.userId !== "undefined" ) ? { where : { user_id : this.userId } } : {}
        const userPlaylist = await playlist.findAll(query)
        if (userPlaylist.length < 1) { 
            return false
        }
        let index = 0
        for (const list of userPlaylist) {
            const music = new MusicController({
                user_id : this.userId,
                playlist : list.id
            })
            musicList = await music.getMusicList()
            if (musicList.length === 0) {
                index++
                continue
            }
            userPlaylist[index].musicList = musicList
            userPlaylist[index].firstMusic = musicList[0].youtube_link
            userPlaylist[index].firstThumbnail = musicList[0].thumbnail
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
        if (typeof userPlaylist === "undefined") {
            throw new Error("존재하지 않는 플레이리스트 입니다.")
        }
        const music = new MusicController({
            playlist : userPlaylist.id
        })
        const musicList = await music.getMusicList()
        if (musicList.length === 0) {
            return false
        }
        userPlaylist.musicList = musicList
        userPlaylist.firstMusic = musicList[0].youtube_link
        userPlaylist.firstThumbnail = musicList[0].thumbnail

        return userPlaylist
        
    }

    async create(data) {
        const result = await playlist.create({
            user_id : this.userId,
            title : data.title,
        })
        const music = new MusicController({
            user_id : this.userId,
            playlist : result.dataValues.id
        })
        data.musicList = data.musicList.filter(music => music != '')
        for (let i=0; i < data.musicList.length; i++) {
            await music.createMusic(data.musicList[i])
        }
        if (result.dataValues) {
            return result.dataValues
        }
        throw new Error("플레이리스트 생성에 실패하였습니다.")
    }

    async delete() {
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
}

module.exports = playlistController