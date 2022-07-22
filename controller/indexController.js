/* eslint-disable require-await */
const PlaylistController = require('./playlistController')

class indexController {
    constructor() {
        
    }

    static async getPlayList() {
        const playlist = new PlaylistController()
        const list = playlist.getAllPlayList()
        return list
    }
}

module.exports = indexController