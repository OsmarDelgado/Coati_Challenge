import Sequelize from 'sequelize';
import { sequelize } from '../db/db';

const Role = sequelize.define( 'role', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    name : {
        type : Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    user_id : {
        type : Sequelize.STRING,
        allowNull: false,
    },
    
}, {
    timestamps : true,
    tableName: 'role'
} );

export default Role;
