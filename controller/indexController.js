const playlist_controller = require('../controller/playlistController')

class indexController {
    constructor() {
        
    }

    async getPlayList() {
        let playlist = new playlist_controller()
        let list = playlist.getPlayList()
        return list
    }
}

module.exports = indexController