import Sequelize from 'sequelize';
import { sequelize } from '../db/db';
import User from './User';
import Role from './Role';

// Define model for UserROles
const UserRoles = sequelize.define( 'userroles', {
    user_id : {
        type : Sequelize.INTEGER,
        allowNull: false,
    },
    role_id : {
        type : Sequelize.INTEGER,
        allowNull: false,
    },
    
}, {
    timestamps : true,
    tableName: 'UserRoles'
} );

// Define associarions
User.belongsToMany(Role, { through: UserRoles, foreignKey: 'role_id' });
Role.belongsToMany(User, { through: UserRoles, foreignKey: 'user_id' });

export default UserRoles;
