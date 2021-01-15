import Event from '../models/Event';
import User from "../models/User";
import config from '../auth.config';

const jwt = require('jsonwebtoken');

export const getEvents = async (req, res) => {
    // res.send("Get Events");
    try {
        const token = req.headers["x-access-token"];

        const decoded = jwt.verify( token, config.SECRET );
        req.userId = decoded.id;

        const events = await Event.findAll( {
            where : {
                user_id : req.userId
            }
        } );

        if( events == '' ) {
            return res.status(404).json( {
                message : "There are not events yet"
            } );
        }

        res.status(200).json( {
            message : "Events",
            data : events
        } );

    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message : "Internal Server Error"
        } );
    }

};

export const getEventById = async (req, res) => {
    // res.send("Get Event By User");
    const { event_id } = req.params;
    try {
        const event = await Event.findOne( {
            where : {
                user_id : req.userId,
                id : event_id
            }
        } );

        if( event == '' ) {
            return res.status(404).json( {
                message : "There are not events yet"
            } );
        }

        if( !event ) {
            return res.status(404).json( {
                message : "Event does not exist in your schedule"
            } );
        }

        res.status(200).json( {
            message : "Event",
            data : event
        } );
        
    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};

export const createEvent = async (req, res) => {
    // res.send("Create Event");
    const { title, description, location, start_date, end_date } = req.body;

    const get_start_date = new Date(start_date);
    const get_end_date = new Date(end_date);

    try {
        if( title == '' || start_date == '' || end_date == '' ) {
            return res.status(400).json( {
                message : "Data missing"
            } );
        }

        const events = await Event.findAll( {
            where : {
                user_id : req.userId
            }
        } );

        const event = events.map( (id_obj) => {
            return id_obj.id;
        } );

        for( let i in event ) {
            const date_event = await Event.findOne( {
                where : {
                    id : event[i]
                }
            } );
            
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
    // res.send("Update Event");
    const { event_id } = req.params;
    const { title, description, location, start_date, end_date } = req.body;

    const get_start_date = new Date(start_date);
    const get_end_date = new Date(end_date);

    try {
        if( title == '' || start_date == '' || end_date == '' ) {
            return res.status(400).json( {
                message : "Data missing"
            } );
        }

        const event = await Event.findOne( {
            where : {
                id : event_id,
                user_id : req.userId
            }
        } );

        if( !event ) {
            return res.status(404).json( {
                message : "No event found to update"
            } );
        }

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

        const updatedEvent = await Event.findOne( {
            where : {
                user_id : req.userId,
                id : event_id
            }
        } );

        console.log( updatedEvent );

        res.status(200).json( {
            message : "Event updated",
            data : updatedEvent
        } );

    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};

export const deleteEvent = async (req, res) => {
    // res.send("Delete Event");
    const { event_id } = req.params;

    try {
        const event = await Event.findOne( {
            where : {
                id : event_id,
                user_id : req.userId
            }
        } );
    
        if( !event ) {
            return res.status(404).json( {
                message : "No event found to delete "
            } );
        }

        const deleteEvent = await Event.destroy( {
            where : {
                id : event_id,
                user_id : req.userId
            }
        } );

        res.status(201).json( {
            message : "Event deleted",
            data : deleteEvent
        } );

    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message : "Internal Server Error"
        } );
    }
};