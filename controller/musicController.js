//const musicModel = require('../models/music')

const { music } = require('../models')

const musicController = {

    /*'getMusicList' : async () => {
        try {
            var list = await musicModel.getMusicList()
            return list
        } catch (e) {
            console.log("controller")
            console.log(e)
        }
    }*/
    'getMusicList': async () => {
        try {
            //var music_list = await musicModel.getMusicList()
            var music_list = music.findAll({})
            return music_list
        } catch (e) {
            console.log(e)
        }
    },

    'createMusic': async (req) => {
        try {
                var result = music.create({
                    title : req.title,
                    length : req.length,
                    singer : req.singer,
                    youtube_link : req.youtube_link,
                    genre : req.genre,
                }).success({
                    
                })

            //var result = await musicModel.createMusic(req)
            return result
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = musicController