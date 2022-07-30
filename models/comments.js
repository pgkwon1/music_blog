const { Sequelize } = require(".")

module.exports = (Sequelize, DataTypes) => {
    const comments = Sequelize.define('comments', {
        user_id : {
          type : DataTypes.STRING(50),
          allowNull : false
        },
        playlist : {
          type : DataTypes.INTEGER,
          allowNull : false
        },
        comment : {
          type : DataTypes.TEXT,
          allowNull : false
        }

    }, { timestamp : true })
    return comments
}