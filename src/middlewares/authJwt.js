import User from '../models/User';
import UserRoles from '../models/UserRoles';
import jwt from 'jsonwebtoken';
import config from '../auth.config';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if( !token ) return res.status(403).json( { message : "No token provided" } );

        const decoded = jwt.verify( token, config.SECRET );
        req.userId = decoded.id;

        const user = await User.findByPk( req.userId );

        if( !user ) return res.status(404).json( { message : "User not found" } );

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json( {
            message : "Internal server error"
        } );
    }
};

export const isAdmin = async (req, res, next) => {
    const user = await User.findByPk( req.userId );

    const roles = await UserRoles.findAll( {
        where : {
            user_id : user.id
        }
    } );

    for( let i in roles ){
        if( roles[i].role_id === 1 ){
            next();
            return;
        }
    }

    return res.status(403).json( {
        message : "You are not an Admin"
    } );
};

export const isUser = async (req, res, next) => {
    const user = await User.findByPk( req.userId );

    const roles = await UserRoles.findAll( {
        where : {
            user_id : user.id
        }
    } );

    for( let i in roles ){
        if( roles[i].role_id === 2 ){
            next();
            return;
        }
    }
    
    return res.status(403).json( {
        message : "You are not an User"
    } );
};