import Sequelize from 'sequelize';
import { sequelize } from '../db/db';
import Role from './Role';

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
    },
    role_id : {
        type : Sequelize.INTEGER,
        allowNull: false,
    },
    
}, {
    timestamps : true,
    tableName: 'user'
} );

User.belongsToMany(Role, { through: UserRoles, foreignKey: 'role_id' });
Role.belongsToMany(User, { through: UserRoles, foreignKey: 'user_id' });

export default User;
