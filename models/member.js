module.exports = (sequelize, DataTypes) => {
    const member = sequelize.define('member', {

        user_id : {
            type : DataTypes.STRING(50),
            allowNull : false,
            unique : true
        },
        
        password : {
            type : DataTypes.STRING(255),
            allowNull : false,
            unique : false
        },

        nickname : {
            type : DataTypes.STRING(50),
            allowNull : false,
            unique : true
        },
        salt : {
            type : DataTypes.STRING(70),
            allowNull : false,
        }
    },
    {timestamp : true})
    return member;
}