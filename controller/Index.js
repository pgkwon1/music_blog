/* eslint-disable require-await */
const Playlist = require('./Playlist')
const Like = require('./Likes')

class Index {
    constructor(data) {
        this.userId = data?.userId
    }

    async getPlayList() {
        const playlist = new Playlist()
        const list = await playlist.getAllPlayList()
        
        if (this.userId) {
            for (let i=0; i < list.length; i++) {
                const like = new Like({
                    userId : this.userId,
                    playlistId : list[i].id
                })
                list[i].likeYn = await like.getLike()
            }
        }
        return list
    }
}

module.exports = Index