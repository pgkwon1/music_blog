module.exports = (sequelize, DataTypes) => {
    const music = sequelize.define('music', {

        title : {
            type : DataTypes.STRING(50),
            allowNull : true,
            unique : false
        },
        length : {
            type : DataTypes.STRING(50),
            allowNull : true,
            unique : false
        },
        singer : {
            type : DataTypes.STRING(50),
            allowNull : true,
            unique : false
        },
        youtube_link : {
            type : DataTypes.STRING(50),
            allowNull : true,
            unique : false
        },
        genre : {
            type : DataTypes.STRING(50),
            allowNull : true,
            unique : false
        },

    },
    {
        timestamp : true,
    })
    return music

}