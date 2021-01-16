import Event from '../models/Event';
import User from "../models/User";
import config from '../auth.config';

const jwt = require('jsonwebtoken');

export const getEvents = async (req, res) => {
    try {
        // Get token from headers
        const token = req.headers["x-access-token"];

        // Decode JWT  with the SECRET phrase
        const decoded = jwt.verify( token, config.SECRET );
        req.userId = decoded.id;

        // Find user events 
        const events = await Event.findAll( {
            where : {
                user_id : req.userId
            }
        } );

        // If not exist then return a 404
        if( events == '' ) {
            return res.status(404).json( {
                message : "There are not events yet"
            } );
        }

        return res.status(200).json( {
            message : "Events",
            data : events
        } );

    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal Server Error"
        } );
    }

};

export const getEventById = async (req, res) => {
    // Get event_id from the params
    const { event_id } = req.params;

    try {
        // Get the event
        const event = await Event.findOne( {
            where : {
                user_id : req.userId,
                id : event_id
            }
        } );
        
        // If not exist then resturn a 404
        if( event == '' ) {
            return res.status(404).json( {
                message : "There are not events yet"
            } );
        }

        // If the event does not belongs to user
        if( !event ) {
            return res.status(404).json( {
                message : "Event does not exist in your schedule"
            } );
        }

        return res.status(200).json( {
            message : "Event",
            data : event
        } );
        
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};

export const createEvent = async (req, res) => {
    // Get info from the body
    const { title, description, location, start_date, end_date } = req.body;

    // Create date with class Date
    const get_start_date = new Date(start_date);
    const get_end_date = new Date(end_date);

    try {
        // If title, start date or end date are not provided, request their
        if( title == '' || start_date == '' || end_date == '' ) {
            return res.status(400).json( {
                message : "Data missing"
            } );
        }

        // Find all user events 
        const events = await Event.findAll( {
            where : {
                user_id : req.userId
            }
        } );

        // Loop all events for get the id
        const event = events.map( (id_obj) => {
            return id_obj.id;
        } );

        // Loop event and find the single event
        for( let i in event ) {
            const date_event = await Event.findOne( {
                where : {
                    id : event[i]
                }
            } );
            
            // Verify if the date exist and if exist or an event has the date does not create the new event
            if( (get_start_date >= date_event.start_date && get_start_date <= date_event.end_date) || (get_end_date <= date_event.end_date && get_end_date >= date_event.start_date) ) {
                return res.status(400).json( {
                    message : "Event not available at this time for you schedule"
                } );

            } else if( (get_start_date <= date_event.start_date) && (get_end_date >= date_event.end_date) ) {
                return res.status(400).json( {
                    message : "Event not available at this time for you schedule"
                } );

            } else {
                console.log("Date and time is available");

                // Create the new event
                const newEvent = await Event.create( {
                    title,
                    description,
                    location,
                    user_id : req.userId,
                    start_date,
                    end_date
                }, {
                    fields : [ 'title', 'description', 'location', 'user_id', 'start_date', 'end_date' ]
                } );

                return res.status(200).json( {
                    message : "New Event",
                    data : {}
                } );
            }
        }

    } catch (error) {
        console.log( error );
        return res.status(500).json( {
            message : "Something goes wrong"
        } );
    }
};

export const updateEvent = async (req, res) => {
    // Get info from the params and the body
    const { event_id } = req.params;
    const { title, description, location, start_date, end_date } = req.body;

    // Create date with class Date
    const get_start_date = new Date(start_date);
    const get_end_date = new Date(end_date);

    try {
        // If title, start date or end date are not provided, request their
        if( title == '' || start_date == '' || end_date == '' ) {
            return res.status(400).json( {
                message : "Data missing"
            } );
        }

        // Find the event with the id
        const event = await Event.findOne( {
            where : {
                id : event_id,
                user_id : req.userId
            }
        } );

        // If event not match
        if( !event ) {
            return res.status(404).json( {
                message : "No event found to update"
            } );
        }

        // Verify if the date exist and if exist or an event has the date does not create the new event
        if( (get_start_date >= event.start_date && get_start_date <= event.end_date) || (get_end_date <= event.end_date && get_end_date >= event.start_date) ) {
            return res.status(400).json( {
                message : "Event not available at this time for you schedule"
            } );

        } else if( (get_start_date <= event.start_date) && (get_end_date >= event.end_date) ) {
            return res.status(400).json( {
                message : "Event not available at this time for you schedule"
            } );

        } else {
            console.log("Date and time is available");
            
            // Update the event
            const updateEvent = await Event.update( {
                title,
                description,
                location,
                start_date,
                end_date
            }, {
                attributes : [ 'id', 'title', 'description', 'location', 'user_id', 'start_date', 'end_date' ],
                where : {
                    id : event_id,
                    user_id : req.userId
                }
            } );
        }

        // Find the event updated
        const updatedEvent = await Event.findOne( {
            where : {
                user_id : req.userId,
                id : event_id
            }
        } );

        return res.status(200).json( {
            message : "Event updated",
            data : updatedEvent
        } );

    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};

export const deleteEvent = async (req, res) => {
    // Get info from the params
    const { event_id } = req.params;

    try {
        // Find the event to delete
        const event = await Event.findOne( {
            where : {
                id : event_id,
                user_id : req.userId
            }
        } );
    
        // If event does not 
        if( !event ) {
            return res.status(404).json( {
                message : "No event found to delete "
            } );
        }

        // Delete the event
        const deleteEvent = await Event.destroy( {
            where : {
                id : event_id,
                user_id : req.userId
            }
        } );

        return res.status(201).json( {
            message : "Event deleted",
            data : deleteEvent
        } );

    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};