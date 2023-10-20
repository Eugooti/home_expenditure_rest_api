const {DataTypes}=require('sequelize');
const sequelize=require('../Config/DbConfig/Db');

const ToDo=sequelize.define('ToDo',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    date:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    createdBy:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

ToDo.sync();

module.exports=ToDo;