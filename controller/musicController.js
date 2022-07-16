const { music } = require('../models')
const axios = require('axios')
const url = require('url')
const moment = require('moment')
const youtube_config = {
    api_key : 'AIzaSyDM69zApL_zPdXDBluYRr0kML6oC8qJESE',
}

class musicController {

    constructor(data) {
        this.user_id = data.user_id
        this.playlist = data.playlist
    }

    async getMusicList() {
        const music_list = await music.findAll({ 
            where : { 
                playlist : this.playlist 
            } 
        })
        return music_list
    }

    async createMusic(youtube_link) {
        let url_info = url.parse(youtube_link, true)
        if (url_info.hostname !== "www.youtube.com" || !url_info.query.v) {
            throw "올바른 URL이 아닙니다.";
        }
        const youtube_info = await this.getYoutubeInfo({ youtube_id : url_info.query.v })
        const result = await music.create({
            title : youtube_info.title,
            length : youtube_info.duration,
            youtube_link : url_info.query.v,
            playlist : this.playlist,
            user_id : this.user_id
        })
        if (result._options.isNewRecord === true) {
            return { 
                result : true,
                title : youtube_info.title,
                youtube_link : url_info.query.v
            }
        } else {
            throw "음악 등록에 실패하였습니다."
        }
        return result._options.isNewRecord       
    }
    async deleteMusic(index) {
        const result = await music.destroy({
            where : { 
                id : index, 
                playlist : this.playlist
            }
        })
        if (result === 0) {
            throw "삭제에 실패하였습니다."
        }
        return result
    }
    async getYoutubeInfo(req) {
      const { api_key } = youtube_config
      const result = await axios
      .get('https://www.googleapis.com/youtube/v3/videos/?id='+req.youtube_id+'&key='+api_key+'&part=snippet&part=contentDetails&part=status')
      
      if (result.data.pageInfo.totalResults > 0) {
          if (result.data.items[0].status.embeddable === false) {
              throw "외부에서 재생이 허용되지 않은 음악입니다."
          }
          let title = result.data.items[0].snippet.title
          let duration = result.data.items[0].contentDetails.duration
          duration = moment.duration(duration).asSeconds()
          return { title : title, duration : duration }
      } else {
          throw "올바른 URL이 아니거나 존재하지 않는 유튜브 링크 입니다."
      }
    }

}
module.exports = musicController