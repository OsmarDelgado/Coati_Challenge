import User from '../models/User';
import Role from '../models/Role';

const { Op } = require("sequelize");        // Import for Operators from Sequelize

// Verify if the User exist
export const verifyUserExist = async (req, res, next) => {
    // Get username and/or email from request body
    const { username, email } = req.body;

    try {
        // Search user email if it was provided
        const user_email = await User.findOne( {
            where : {
                email
            }
        } );

        // Search user username if it was provided
        const user_username = await User.findOne( {
            where : {
                username
            }
        } );
    
        // If username is not null return User already exist
        if( user_username != null ) return res.status(400).json( {
            message : "User already exist",
        } );
        // If email is not null return User already exist
        if( user_email != null ) return res.status(400).json( {
            message : "Email already exist"
        } );
    
    } catch (error) {       // If an error ocurred return and error in the server
        console.log(error);
        return res.status(500).json( {
            message : "Internal server error"
        } );
    }
    next();
};

// Verify if the Role exist
export const verifyRoleExist = async (req, res, next) => {
    // Get role or roles from request body
    const { roles } = req.body;
    
    if( roles ) {
        // Loop in the provided roles
        const roles_id = roles.map( (id_obj) => { return id_obj.id } );

        try {
            // Loop for find all roles
            for(let i in roles_id) {
                const role = await Role.findOne( {
                    where : {
                        id : roles_id[i]
                    }
                } );

                // If no role exist send a message
                if( role == null ) {
                    return res.status(400).json( {
                        message : `Role ${ roles_id[i] } does not exist`
                    } );
                }
            }

        } catch (error) {       // If an error ocurred return and error in the server
            console.log(error);
            return res.status(500).json( {
                message : "Internal server error"
            } );
        }
    }
    next();
};