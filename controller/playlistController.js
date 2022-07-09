const { playlist } = require('../models')
const musicController = require('../controller/musicController')
class playlistController {
    constructor(user_id){
        this.user_id = user_id
    }

    async getPlayList() {
        let play_list, query
        (this.user_id) ? query = { where : { user_id : this.user_id } } : query = {}
        play_list = await playlist.findAll(query)
        if (play_list.length < 1) { 
            return false
        }
        let index = 0
        for (let list of play_list) {
            let music = new musicController({
                user_id : this.user_id,
                playlist : list.id
            })
            let music_list = await music.getMusicList()
            if (music_list.length === 0) {
                continue
            }
            play_list[index].music_list = music_list
            play_list[index].first_music = music_list[0].youtube_link
            index++
        }
        return play_list
    }

}

module.exports = playlistController