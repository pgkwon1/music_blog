const env = require('dotenv').config()
const axios = require('axios')
const url = require('url')
const moment = require('moment')
const sequelize = require('sequelize')
const { music } = require('../models')

class Music {

    constructor(data) {
        this.userId = data?.userId
        this.playlist = data.playlistId
    }

    async getMusicList() {
            // order by ISNULL(order_num), order_num asc
        const musicList = await music.findAll({
            where: {
                playlist: this.playlist
            },
            order : [
                [sequelize.fn('isnull', sequelize.col('order_num'))],
                ['order_num', 'ASC'],
            ]
        })
        console.log(musicList)
        return musicList
    }

    async createMusic(query) {

        const urlInfo = url.parse(query, true)
        if ((urlInfo.hostname !== "www.youtube.com" && urlInfo.hostname !== "youtube.com") || !urlInfo.query.v) {
            throw new Error("올바른 URL이 아닙니다.");
        }
        const youtubeInfo = await Music.getYoutubeInfo({
            youtube_id: urlInfo.query.v
        })
        const result = await music.create({
            title: youtubeInfo.title,
            length: youtubeInfo.duration,
            youtube_link: urlInfo?.query.v,
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

    async updateMusic(updateData, id) {
        const result = await music.update(
            updateData,
            {
                where: {
                    id,
                    playlist: this.playlist
                }
            }
        )
        if (result[0] === 0) {
            throw new Error("수정에 실패하였습니다.")
        }
        return result

    }

    async deleteMusic(musicId) {
        const result = await music.destroy({
            where: {
                id: musicId,
                playlist: this.playlist,
                user_id : this.userId
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

    static async getYoutubeInfo(req) {
        const apiKey = process.env.YOUTUBE_API_KEY
        const result = await axios
            .get(`https://www.googleapis.com/youtube/v3/videos/?id=${req.youtube_id}&key=${apiKey}&part=snippet&part=contentDetails&part=status`)
        const { data } = result
        if (data.pageInfo.totalResults > 0) {
            const { snippet, contentDetails, status } = data.items[0]
            if (status.embeddable === false) {
                throw new Error("외부에서 재생이 허용되지 않은 음악이 포함되어 있습니다.")
            }
            const { title, thumbnails } = snippet
            let { duration } = contentDetails
            let thumbnail = thumbnails.standard?.url ||
            thumbnails.high?.url ||
            thumbnails.medium?.url ||
            thumbnails.default?.url
            thumbnail = thumbnail.replace("/vi/", "/vi_webp/").replace(".jpg", ".webp")
            duration = moment.duration(duration).asSeconds()
            return {
                title,
                duration,
                thumbnail
            }
        }
        throw new Error("올바른 URL이 아니거나 존재하지 않는 유튜브 링크 입니다.")
    }

    static async getYoutubeInfoByTitle(title) {
        const apiKey = process.env.YOUTUBE_API_KEY
        title = encodeURI(title)
        const result = await axios
            .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&q=${title}&safeSearch=strict`)
        const { data } = result
        if (data.pageInfo.totalResults > 0) {
            return data.items
        }
        throw new Error("검색결과가 존재하지 않습니다.")
    }
}
module.exports = Music