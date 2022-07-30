const env = require('dotenv').config()
const axios = require('axios')
const url = require('url')
const moment = require('moment')
const { music } = require('../models')

class musicController {

    constructor(data) {
        this.userId = data?.userId
        this.playlist = data.playlistId
    }

    async getMusicList() {
        const musicList = await music.findAll({
            where: {
                playlist: this.playlist
            }
        })
        return musicList
    }

    async createMusic(youtubeLink) {
        const urlInfo = url.parse(youtubeLink, true)
        if (urlInfo.hostname !== "www.youtube.com" || !urlInfo.query.v) {
            throw new Error("올바른 URL이 아닙니다.");
        }
        const youtubeInfo = await this.getYoutubeInfo({
            youtube_id: urlInfo.query.v
        })
        const result = await music.create({
            title: youtubeInfo.title,
            length: youtubeInfo.duration,
            youtube_link: urlInfo.query.v,
            playlist: this.playlist,
            user_id: this.userId,
            thumbnail: youtubeInfo.thumbnail
        })
        if (result._options.isNewRecord === true) {
            return {
                result: true,
                title: youtubeInfo.title,
                youtubeLink: urlInfo.query.v
            }
        }
        throw new Error("음악 등록에 실패하였습니다.")
    }

    async deleteMusic(musicId) {
        const result = await music.destroy({
            where: {
                id: musicId,
                playlist: this.playlist
            }
        })
        if (result === 0) {
            throw new Error("삭제에 실패하였습니다.")
        }
        return result
    }

    async deletePlaylistMusic() {
        const result = await music.destroy({
            where: {
                playlist: this.playlist
            }
        })
        if (result === 0) {
            throw new Error("삭제에 실패하였습니다.")
        }
        return result
    }

    async getYoutubeInfo(req) {
        const apiKey = process.env.YOUTUBE_API_KEY
        const result = await axios
            .get('https://www.googleapis.com/youtube/v3/videos/?id=' + req.youtube_id + '&key=' + apiKey + '&part=snippet&part=contentDetails&part=status')

        if (result.data.pageInfo.totalResults > 0) {
            if (result.data.items[0].status.embeddable === false) {
                throw new Error("외부에서 재생이 허용되지 않은 음악입니다.")
            }
            const {title} = result.data.items[0].snippet
            let {duration} = result.data.items[0].contentDetails
            const thumbnailsList = result.data.items[0].snippet.thumbnails
            const thumbnail = thumbnailsList.standard?.url ||
                thumbnailsList.medium?.url ||
                thumbnailsList.high?.url ||
                thumbnailsList.default?.url
            duration = moment.duration(duration).asSeconds()
            return {
                title,
                duration,
                thumbnail
            }
        }
        throw new Error("올바른 URL이 아니거나 존재하지 않는 유튜브 링크 입니다.")
    }

}
module.exports = musicController