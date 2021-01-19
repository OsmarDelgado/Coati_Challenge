// IMPORTS PACKAGES
import '@babel/polyfill';                               // Import Polyfill
import express from 'express';                          // Import Express
import cors from 'cors';                                // Import Cors
import morgan from 'morgan';                            // Import Morgan
import pkg from '../package.json';                      // Import as pkg the package.json
import { createRoles } from "./libs/initialSetup";      // Import for initial setup (Roles: Admin and User)
require('dotenv').config();                             // Config Enviroment variables 

// Import routes
import authRoutes from './routes/auth.routes';          // Import routes for auth (sign in and sign up)
import userRoutes from './routes/user.routes';          // Import routes for CRUD users (for Admin roles)
import eventRoutes from './routes/event.routes';        // Import routes for CRUD events (all users)

// Initialization
const app = express();
createRoles();                                          // Create Admin and User roles for the first run

app.set('pkg', pkg);                                    // Import data from package.json for get its information

// MIDDLEWARES
app.use( morgan('dev') );                               // Initial morgan
app.use( cors() );                                      // Initial cors
app.use( express.json() );                              // Config app for undestand json
app.use( express.urlencoded({ extended : false }) );    // For recive simple data 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// GET home
app.get('/', (req, res) => {
    res.json({                                          // Show in client the name, author, description and version from package.json (pkg)
        application : app.get('pkg').name,
        author : app.get('pkg').author,
        description : app.get('pkg').description,
        version : app.get('pkg').version
    });
});

export default app;
