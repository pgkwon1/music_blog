module.exports = (sequelize, DataTypes) => {
  const likes = sequelize.define('likes', {
      id : {
          type : DataTypes.UUID,
          allowNull : false,
          unique : true,
          primaryKey : true,
          defaultValue : DataTypes.UUIDV4
       },
      user_id : {
          type : DataTypes.STRING(50),
          allowNull : false,
          unique : true
      },
      
      playlist : {
          type : DataTypes.INTEGER,
          allowNull : false,
          unique : false
      },
    },
  {timestamp : true})
  return likes;
}