const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DbConfig/Db'); // Assuming you have already created the Sequelize instance

// Define the User model/table
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    access:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    activeState:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Set the default value to true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }

});

// Sync the model with the database
User.sync();

module.exports = User;
