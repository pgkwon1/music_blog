/* eslint-disable require-await */
const PlaylistController = require('./playlistController')
const LikeController = require('./likesController')

class indexController {
    constructor(data) {
        this.userId = data?.userId
    }

    async getPlayList() {
        const playlist = new PlaylistController()
        const list = await playlist.getAllPlayList()
        
        if (this.userId) {
            for (let i=0; i < list.length; i++) {
                const like = new LikeController({
                    userId : this.userId,
                    playlistId : list[i].id
                })
                list[i].likeYn = await like.getLike()
            }
        }
        return list
    }
}

module.exports = indexController