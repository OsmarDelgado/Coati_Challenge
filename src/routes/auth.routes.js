import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';

const router = Router();

// Sign Up
router.post('/signup', authCtrl.signUp);

// Sign In
router.post('/signin', authCtrl.signIn);

export default router;