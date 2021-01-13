import Event from '../models/Event';

export const getEvents = async (req, res) => {
    res.send("Get Events");
};

export const getEventByUser = async (req, res) => {
    res.send("Get Event By User");
};

export const createEvent = async (req, res) => {
    res.send("Create Event");
};

export const updateEvent = async (req, res) => {
    res.send("Update Event");
};

export const deleteEvent = async (req, res) => {
    res.send("Delete Event");
};