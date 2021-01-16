import Sequelize from 'sequelize';
import { sequelize } from '../db/db';

// Define model for Roles
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
    }
    
}, {
    timestamps : true,
    tableName: 'Roles'
} );

export default Role;
