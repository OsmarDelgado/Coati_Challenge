import User from '../models/User';
import Role from '../models/Role';

const { Op } = require("sequelize");

export const verifyUserExist = async (req, res, next) => {
    const { username, email } = req.body;

    try {
        const user_email = await User.findOne( {
            where : {
                email
            }
        } );

        const user_username = await User.findOne( {
            where : {
                username
            }
        } );
    
        if( user_username != null ) return res.status(400).json( {
            message : "User already exist",
        } );
        if( user_email != null ) return res.status(400).json( {
            message : "Email already exist"
        } );
    
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal server error"
        } );
    }
    next();
};

export const verifyRoleExist = async (req, res, next) => {
    const { roles } = req.body;
    
    if( roles ) {
        const roles_id = roles.map( (id_obj) => { return id_obj.id } );

        try {
            for(let i in roles_id) {
                const role = await Role.findOne( {
                    where : {
                        id : roles_id[i]
                    }
                } );
                // console.log(role.id);
                if( role == null ) {
                    return res.status(400).json( {
                        message : `Role ${ roles_id[i] } does not exist`
                    } );
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json( {
                message : "Internal server error"
            } );
        }
    }
    next();
};