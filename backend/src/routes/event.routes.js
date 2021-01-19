import { Router } from 'express';
import * as eventCtrl from '../controllers/event.controller';
import { authJwt } from "../middlewares";

// Initialize router
const router = Router();

// Get all Events
router.get( '/', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.getEvents );

// Get Events by Id
router.get( '/:event_id', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.getEventById );

// Create Event
router.post( '/', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.createEvent );

// Update Event By Id
router.put( '/:event_id', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.updateEvent );

// Delete Event By Id
router.delete( '/:event_id', [ authJwt.verifyToken, authJwt.isUser ], eventCtrl.deleteEvent );

export default router;