import User from '../models/User';
import Role from '../models/Role';
import UserRoles from '../models/UserRoles';
import config from '../auth.config';

const { Op } = require("sequelize");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export const signUp = async (req, res) => {
    const { username, first_name, last_name, email, password, roles } = req.body;

    try {
        const newUser = await User.create( {
            username,
            first_name,
            last_name,
            email,
            password : await bcrypt.hash(password, 10)
        }, {
            fields : [ 'username', 'first_name', 'last_name', 'email', 'password' ]
        } );

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

        const userRolesCreated = await UserRoles.findAll( {
            where : {
                user_id : newUser.id
            }
        } );

        const token = jwt.sign( { id : newUser.id }, config.SECRET, {
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

export const signIn = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findOne( {
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );

        if( !user ) return res.status(400).json( { message : "User not found" } );

        const matchPassword = await bcrypt.compare( password, user.password );

        if( !matchPassword ) return res.status(401).json( {message : "Password is incorrect", token : null} );

        const userRoles = await UserRoles.findAll( {
            where : {
                user_id : user.id
            }
        } );

        const token = jwt.sign( { id : user.id }, config.SECRET, {
            expiresIn : 1500    // 25 minutes
        } );

        res.json( {
            message : "Sign In",
            token
        } );

    } catch (error) {
        console.log(error);
        
        res.status(500).json( {
            message : "Internal Server Error",
            data : {}
        } );
    }
    
};