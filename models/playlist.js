module.exports = (sequelize, DataTypes) => {
    const playlist = sequelize.define('playlist', {

           id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            autoIncrement : true,
            primaryKey : true
          },
          user_id : {
            type : DataTypes.STRING(50),
            allowNull : false
          },
          title : {
            type : DataTypes.STRING(50),
            allowNull : false
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
          }
    
    },
    {
        timestamp : true,
    })
    return playlist

}