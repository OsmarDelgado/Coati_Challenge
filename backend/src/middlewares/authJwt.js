import User from '../models/User';
import UserRoles from '../models/UserRoles';
import jwt from 'jsonwebtoken';
import config from '../auth.config';

// Config verifyToken function
export const verifyToken = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers["x-access-token"];

        // Verify if token exist or if it provided
        if( !token ) return res.status(403).json( { message : "No token provided" } );

        // Decode JWT  with the SECRET phrase
        const decoded = jwt.verify( token, config.SECRET );
        req.userId = decoded.id;

        // Get User with its PK
        const user = await User.findByPk( req.userId );

        // If User does not exist resturn 404
        if( !user ) return res.status(404).json( { message : "User not found" } );

        // Continue
        next();

    } catch (error) {               // If token expired return an unathorized
        res.status(401).json( {
            message : "Token has expired, sign in again, please"
        } );
    }
};

// Verify if the user is Admin
export const isAdmin = async (req, res, next) => {
    // Get User by PK
    const user = await User.findByPk( req.userId );

    // Verify is User has roles
    const roles = await UserRoles.findAll( {
        where : {
            user_id : user.id
        }
    } );

    // Verify if User is admin, if it is continue
    for( let i in roles ){
        if( roles[i].role_id === 1 ){
            next();
            return;
        }
    }

    // If not Admin return 403 (Forbidden)
    return res.status(403).json( {
        message : "You are not an Admin"
    } );
};

// Verify if the user is Normal User
export const isUser = async (req, res, next) => {
    // Get User by PK
    const user = await User.findByPk( req.userId );

    // Verify is User has roles
    const roles = await UserRoles.findAll( {
        where : {
            user_id : user.id
        }
    } );

    // Verify if User is user, if it is continue
    for( let i in roles ){
        if( roles[i].role_id === 2 ){
            next();
            return;
        }
    }
    
    // If not User return 403 (Forbidden)
    return res.status(403).json( {
        message : "You are not an User"
    } );
};