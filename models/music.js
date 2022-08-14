module.exports = (sequelize, DataTypes) => {
    const music = sequelize.define('music', {
        id : {
            type : DataTypes.UUID,
            allowNull : false,
            unique : true,
            primaryKey : true,
            defaultValue : DataTypes.UUIDV4
        },
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
        youtube_link : {
            type : DataTypes.STRING(50),
            allowNull : true,
            unique : false
        },
        user_id : {
            type : DataTypes.STRING(30),
            allowNull : true,
            unique : false
        },
        playlist : {
            type : DataTypes.INTEGER,
            allowNull : true,
            unique : false
        },
        thumbnail : {
            type : DataTypes.STRING(100),
            allowNull : true,
            unique : false
        }
    },
    {
        timestamp : true,
    })
    return music

}