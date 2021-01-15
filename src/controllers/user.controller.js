import User from '../models/User';
import Role from '../models/Role';
import UserRoles from '../models/UserRoles';
import config from '../auth.config';

const { Op } = require("sequelize");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export const getUsers = async (req, res) => {
    // res.send("Get Users");
    try {
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

        if( users == '' ) {
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
    // res.send("Get User By Id");
    const { user_id } = req.params;

    const userRoles = await UserRoles.findAll( {
        attributes : [ 'id', 'username', 'first_name', 'last_name', 'email', 'auth_token' ]
    }, {
        where : {
            user_id
        }
    } );

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
    // res.send("Create User");
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
    // res.send("Update User");
    const { username, first_name, last_name, email, password, roles } = req.body;

    try {
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

        const updatedUser = await User.findOne( {
            attributes : [ 'username', 'first_name', 'last_name', 'email', 'auth_token' ]
        }, {
            where : {
                [Op.or] : {
                    username,
                    email
                }
            }
        } );

        console.log(updatedUser);

        res.status(200).json( {
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
    // res.send("Delete User");
    const { username, email } = req.body;

    try {
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