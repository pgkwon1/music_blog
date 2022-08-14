module.exports = (sequelize, DataTypes) => {
    const member = sequelize.define('member', {
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