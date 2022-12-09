// server file
//require express
const express = require('express');
// define port
const PORT = process.env.PORT || 3000;
// get our client so we can connect
const { client } = require('../db/index.js');
// get stuff from db/buildDb
const { buildDb, getAllLinks } = require('../db/create');

// create an apiRouter
const apiRouter = express();

apiRouter.use((request, response, next) => {
    console.log('here is our request body: ', request.body);
    next();
});

apiRouter.get('/api', async (request, response, next) => {
    await buildDb();
    const allLinks = getAllLinks();
    response.send(allLinks)
    next();
});

client.connect();

apiRouter.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});