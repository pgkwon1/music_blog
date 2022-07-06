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
        let index = 0
        if (play_list.length < 1) { 
            return false
        }

        for (let list of play_list) {
            let music = new musicController(list.user_id)
            let music_list = await music.getMusicList()
            if (music_list.length === 0) {
                continue
            }
            play_list[index].music_list = music_list
            if (index === 0) {
                //두번째 플레이리스트에 왜 첫음악 안들어가는지 수정하기
                console.log("test")
                play_list[index].first_music = music_list[0].youtube_link
            }
            index++
        }
        return play_list
    }

}

module.exports = playlistController