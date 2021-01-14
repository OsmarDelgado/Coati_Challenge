import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller';
import { authJwt, verifySignUp } from "../middlewares";

const router = Router();

// Get all Users
router.get( '/', [ authJwt.verifyToken, authJwt.isAdmin ], userCtrl.getUsers );

// Get User By Id
router.get( '/:user_id', [ authJwt.verifyToken, authJwt.isAdmin ], userCtrl.getUserById );

// Create User
router.post( '/', [ authJwt.verifyToken, authJwt.isAdmin, verifySignUp.verifyRoleExist ], userCtrl.createUser );

// Update User By Id
router.put( '/:user_id', [ authJwt.verifyToken, authJwt.isAdmin ], userCtrl.updateUser );

// Delete User By Id
router.delete( '/:user_id', [ authJwt.verifyToken, authJwt.isAdmin ], userCtrl.deleteUser );

export default router;