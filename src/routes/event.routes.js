import { Router } from 'express';
import * as eventCtrl from '../controllers/event.controller';

const router = Router();

// Get all Users
router.get( '/', eventCtrl.getEvents );

// Get User By Id
router.get( '/:user_id', eventCtrl.getEventByUser );

// Create User
router.post( '/', eventCtrl.createEvent );

// Update User By Id
router.put( '/:event_id', eventCtrl.updateEvent );

// Delete User By Id
router.delete( '/:event_id', eventCtrl.deleteEvent );

export default router;