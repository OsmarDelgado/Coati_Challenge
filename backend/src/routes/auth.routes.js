import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';

import { verifySignUp } from "../middlewares";

// Initialize router
const router = Router();

// Sign Up
router.post('/signup', [ verifySignUp.verifyUserExist, verifySignUp.verifyRoleExist ], authCtrl.signUp);

// Sign In
router.post('/signin', authCtrl.signIn);

// Sign Out
router.post('/signout', authCtrl.signOut);

export default router;