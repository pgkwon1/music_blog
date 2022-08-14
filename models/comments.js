const { Sequelize } = require(".")

module.exports = (Sequelize, DataTypes) => {
    const comments = Sequelize.define('comments', {
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