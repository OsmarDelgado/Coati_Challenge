import User from '../models/User';
import Role from '../models/Role';
import UserRoles from '../models/UserRoles';
import config from '../auth.config';

const { Op } = require("sequelize");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function for Sign Up
export const signUp = async (req, res) => {
    // Get info from the request body
    const { username, first_name, last_name, email, password, roles } = req.body;

    try {
        // Create new User
        const newUser = await User.create( {
            username,
            first_name,
            last_name,
            email,
            password : await bcrypt.hash(password, 10)
        }, {
            fields : [ 'username', 'first_name', 'last_name', 'email', 'password' ]
        } );

        // Verify if roles had provided and if not in the new User put User Role
        if( roles ) {
            const roles_id = roles.map( (id_obj) => { return id_obj.id } );

            for(let i in roles_id) {
                const newUserRoles = await UserRoles.create( {
                    user_id : newUser.id,
                    role_id : roles_id[i]
                } );
            }

        } else {
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

        // Search the UserRole in the new User
        const userRolesCreated = await UserRoles.findAll( {
            where : {
                user_id : newUser.id
            }
        } );

        // Create JWT for the new User, expired in 25 minutes
        const token = jwt.sign( { id : newUser.id }, config.SECRET, {
            algorithm: 'HS256',
            expiresIn : 1500    // 25 minutes
        } );
    
        return res.status(200).json( {
            message : "User created succesfuly",
            data : {
                newUser,
                userRoles : userRolesCreated,
                token
            }
        } );

    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};

export const signIn = async (req, res) => {
    // Get info from request body
    const { username, email, password } = req.body;

    try {
        // Find user where username or email
        const user = await User.findOne( {
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );

        // If user is not found response with 400
        if( !user ) return res.status(400).json( { message : "User not found" } );

        // If user is found, compare password provided with password in the db
        const matchPassword = await bcrypt.compare( password, user.password );

        // If password does not match then response 401
        if( !matchPassword ) return res.status(401).json( {message : "Password is incorrect", token : null} );

        // Find the roles for user
        const userRoles = await UserRoles.findAll( {
            where : {
                user_id : user.id
            }
        } );

        // Create JWT for the new User, expired in 25 minutes 
        const token = jwt.sign( { id : user.id }, config.SECRET, {
            algorithm: 'HS256',
            expiresIn : 1500    // 25 minutes
        } );

        return res.json( {
            message : "Sign In",
            token
        } );

    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
    
};

export const signOut = async (req, res) => {
    res.send("Sign Out");
};