import User from '../models/User';

export const getUsers = async (req, res) => {
    res.send("Get Users");
};

export const getUserById = async (req, res) => {
    res.send("Get User By Id");
};

export const createUser = async (req, res) => {
    res.send("Create User");
};

export const updateUser = async (req, res) => {
    res.send("Update User");
};

export const deleteUser = async (req, res) => {
    res.send("Delete User");
};