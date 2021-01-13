import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller';

const router = Router();

// Get all Users
router.get( '/', userCtrl.getUsers );

// Get User By Id
router.get( '/:user_id', userCtrl.getUserById );

// Create User
router.post( '/', userCtrl.createUser );

// Update User By Id
router.put( '/:user_id', userCtrl.updateUser );

// Delete User By Id
router.delete( '/:user_id', userCtrl.deleteUser );

export default router;