// IMPORTS PACKAGES
import '@babel/polyfill';
import express from 'express';              // Import Express
import morgan from 'morgan';                // Import Morgan
import pkg from '../package.json';          // Import as pkg the package.json

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';

// Initialization
const app = express();

app.set('pkg', pkg);                        // Import data from package.json for get its information

// MIDDLEWARES
app.use( morgan('dev') );
app.use( express.json() );
app.use( express.urlencoded({ extended : false }) );

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
