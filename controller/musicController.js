const { music } = require('../models')

const musicController = {

    'getMusicList': async () => {
        try {
            var music_list = await music.findAll({})
            return music_list
        } catch (e) {
            console.log(e)
        }
    },

    'createMusic': async (req) => {
        try {
            var result = await music.create({
                title : req.title,
                length : req.length,
                singer : req.singer,
                youtube_link : req.youtube_link,
                genre : req.genre,
            })
        return result._options.isNewRecord
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = musicController