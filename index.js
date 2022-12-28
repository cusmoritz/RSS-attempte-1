// Use the dotenv package, to create environment variables
const env = require('dotenv');

// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000
const PORT = process.env.PORT || 3001;

// Import express, and create a server
const express = require('express');
const server = express();

// Require morgan and body-parser middleware
const morgan = require('morgan');

// Have the server use morgan with setting 'dev'
server.use('/', morgan('dev'));

// Import cors 
// Have the server use cors()
const cors = require('cors');
server.use(cors());

// Have the server use bodyParser.json()
const bodyParser = require('body-parser');
server.use(bodyParser.json());

                        // Have the server use your api router with prefix '/api'
                        // const { apiRouter } = require('./api/index')
                        // server.use('/api', apiRouter);

// Import the client from your db/index.js
const { client } = require('./db/index');
client.connect();

// Create custom 404 handler that sets the status code to 404.

// // Create custom error handling that sets the status code to 500
// // and returns the error as an object

                        // apiRouter.use((error, request, response, next) => {
                        //     response.status(500);
                        //     response.send('this is a 500 error.');
                        // });

                        // apiRouter.use((request, response, next) => {
                        //     response.status(404);
                        //     response.send("this is made up and an error");
                        // });

// Start the server listening on port PORT
// On success, connect to the database
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});
