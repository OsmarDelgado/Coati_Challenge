import Sequelize from 'sequelize';
import { sequelize } from '../db/db';

const User = sequelize.define( 'user', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    username : {
        type : Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    first_name : {
        type : Sequelize.STRING,
        allowNull: false,
    },
    last_name : {
        type : Sequelize.STRING,
        allowNull: false,
    },
    email : {
        type : Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password : {
        type : Sequelize.STRING,
        allowNull: false,
    }
    
}, {
    timestamps : true,
    tableName: 'Users'
} );

export default User;
