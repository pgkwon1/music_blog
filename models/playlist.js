module.exports = (sequelize, DataTypes) => {
    const playlist = sequelize.define('playlist', {

          id : {
              type : DataTypes.UUID,
              allowNull : false,
              unique : true,
              primaryKey : true,
              defaultValue : DataTypes.UUIDV4
          },
          user_id : {
            type : DataTypes.STRING(50),
            allowNull : false
          },
          title : {
            type : DataTypes.STRING(50),
            allowNull : false
          },
          like : {
            type : DataTypes.INTEGER,
            allowNull : true,
            defaultValue : 0
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