import Sequelize from 'sequelize';
import { sequelize } from '../db/db';
import User from './User'

const Event = sequelize.define( 'event', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    title : {
        type : Sequelize.STRING,
        allowNull: false,
    },
    description : {
        type : Sequelize.STRING,
    },
    start_date : {
        type : Sequelize.DATE,
        allowNull: false,
    },
    end_date : {
        type : Sequelize.DATE,
        allowNull: false,
    },
    location : {
        type : Sequelize.STRING,
    },
    user_id : {
        type : Sequelize.INTEGER,
        allowNull: false,
    },
    
}, {
    timestamps : true,
    tableName: 'event'
} );

Event.belongsTo( User, { foreignKey : 'user_id', sourceKey : 'id' } );
User.hasMany( Event, { foreignKey : 'user_id', sourceKey : 'id' } );

export default Event;
