import User from '../models/User';
import Role from '../models/Role';
import UserRoles from '../models/UserRoles';
import config from '../auth.config';

const { Op } = require("sequelize");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export const getUsers = async (req, res) => {
    try {
        // Find all users
        const users = await User.findAll( {
            attributes : [ 'id', 'username', 'first_name', 'last_name', 'email', 'auth_token' ]
        } );

        // for( let i in users) {
        //     const userRoles = await UserRoles.findAll( {
        //         where : {
        //             user_id : users[i].id
        //         }
        //     } );
        //     console.log(userRoles.role_id);
        // }

        // If not exists users return a 404
        if( !users ) {
            res.status(404).json( {
                message : "There are not Users yet"
            } );
        }

        res.status(200).json( {
            message : "Users",
            data : {
                users,
                roles : ""
            }
        } );

    } catch (error) {
        console.log( error );
        res.status(500).json( {
            message : "Internal Server Error",
            data : {}
        } );
    }
};

export const getUserById = async (req, res) => {
    // Get user_id from the params
    const { user_id } = req.params;

    // Get all UserRoles belongs the User
    const userRoles = await UserRoles.findAll( {
        attributes : [ 'id', 'username', 'first_name', 'last_name', 'email', 'auth_token' ]
    }, {
        where : {
            user_id
        }
    } );

    // Find the single user
    const user = await User.findOne( {
        where : {
            id : user_id
        }
    } );
    
    if( user != null ) {
        res.status(200).json( {
            message : "User",
            data : {
                user,
                roles : userRoles
            }
        } );
    } else {
        res.status(404).json( {
            message : "User does not exist",
            data : {}
        } );
    }
};

export const createUser = async (req, res) => {
    // Get info from the body
    const { username, first_name, last_name, email, password, roles } = req.body;

    try {
        // Create the new user
        const newUser = await User.create( {
            username,
            first_name,
            last_name,
            email,
            password : await bcrypt.hash(password, 10)
        }, {
            fields : [ 'username', 'first_name', 'last_name', 'email', 'password' ]
        } );

        // Verify if the roles were provider from the body
        if( roles ) {
            // Loop for get the id for the role
            const roles_id = roles.map( (id_obj) => { return id_obj.id } );

            // Create and assign the role to the user in the table UserRoles
            for(let i in roles_id) {
                const newUserRoles = await UserRoles.create( {
                    user_id : newUser.id,
                    role_id : roles_id[i]
                } );
            }

        } else {
            // If not roles provider then assign the role User to the new User
            const role = await Role.findOne( {
                where : {
                    name : "User"
                }
            } );
            const newUserRole = await UserRoles.create( {
                user_id : newUser.id,
                role_id : role.id
            } );
        }

        // Verify the roles for the new User
        const userRolesCreated = await UserRoles.findAll( {
            where : {
                user_id : newUser.id
            }
        } );

        // Generate the JWT
        const token = jwt.sign( { id : newUser.id }, config.SECRET, {
            algorithm: 'HS256',
            expiresIn : 1500    // 25 minutes
        } );
    
        res.status(200).json( {
            message : "User created succesfuly",
            data : {
                newUser,
                userRoles : userRolesCreated,
                token
            }
        } );

    } catch (error) {
        console.log(error);

        res.status(500).json( {
            message : "Internal Server Error",
            data : {}
        } );
    }
};

export const updateUser = async (req, res) => {
    // Get info from body
    const { username, first_name, last_name, email, password, roles } = req.body;

    try {
        // Search the user with its username and/ or email
        const user = await User.findOne( {
            attributes : [ 'username', 'email' ]
        }, {
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );

        if( !user ) {
            return res.status(404).json( {
                message : "User not found"
            } );
        }

        // Update the user if exist
        const updateUser = await User.update( {
            username,
            first_name,
            last_name,
            email
        }, {
            attributes : [ 'username', 'first_name', 'last_name', 'email' ],
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );

        // const updatedUser = await User.findOne( {
        //     attributes : [ 'username', 'first_name', 'last_name', 'email', 'auth_token' ]
        // }, {
        //     where : {
        //         [Op.or] : {
        //             username,
        //             email
        //         }
        //     }
        // } );

        // console.log(updatedUser);

        res.status(204).json( {
            message : "User updated",
            data : updatedUser
        } );

    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};

export const deleteUser = async (req, res) => {
    // Get info from body
    const { username, email } = req.body;

    try {
        // Find the user
        const user = await User.findOne( {
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );

        if( !user ) {    
            return res.status(404).json( {
                message : "User is not valid",
                data : {}
            } );   
        }

        // Delete user
        const deleteUser = await User.destroy( {
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );
        
        res.status(201).json( {
            message : "User deleted",
            data : deleteUser
        } );

    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};