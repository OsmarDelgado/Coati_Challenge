import { Router } from 'express';
import * as eventCtrl from '../controllers/event.controller';
import { authJwt } from "../middlewares";

const router = Router();

// Get all Users
router.get( '/', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.getEvents );

// Get User By Id
router.get( '/:user_id', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.getEventByUser );

// Create User
router.post( '/', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.createEvent );

// Update User By Id
router.put( '/:event_id', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.updateEvent );

// Delete User By Id
router.delete( '/:event_id', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.deleteEvent );

export default router;