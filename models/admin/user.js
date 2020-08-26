// NAMESPACE 

require("dotenv").config();  
const { Sequelize  } = require('sequelize');
const sequelize = new Sequelize(process.env.CONNECTION_STRING);
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

// DECLARATION & DEFINITION

const User = sequelize.define('admin.user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name : {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobile_number: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        set: function (plainPassword) {
           // Remember to set the data value, otherwise it won't be validated
           this.setDataValue('salt', uuidv1());
           var securedHash = crypto.createHmac('sha256', this.salt)
           .update(plainPassword)
           .digest('hex');
           this.setDataValue('password', securedHash);
        }
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    is_universal_user: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_admin : {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    created_by: {
        type: Sequelize.STRING,
        allowNull: false
    },
    created_date: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW
    },
    modified_by: {
        type: Sequelize.STRING,
        allowNull: false
    },
    modified_date: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW
    }
}, 
// Table configuration
{
    timestamps: false,
    freezeTableName: true,
    tableName: 'user',
    schema: 'admin'
});

User.securePassword = function(plainPassword, salt) {
    if(!plainPassword || !salt) return "";

    try {
        return crypto.createHmac('sha256', salt)
        .update(plainPassword)
        .digest('hex');
    } catch (err) {
       return "";
    }
};

User.authenticatePassword = function(plainPassword, salt, dbPassword) {
    return User.securePassword(plainPassword, salt) == dbPassword;
};

module.exports = User;