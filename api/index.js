// server file
//require express
const express = require('express');
// define port
const PORT = process.env.PORT || 3000;
// get our client so we can connect
const { client } = require('../db/index.js');
// get stuff from db/buildDb
const { buildDb, getAllLinks, getAllPosts, getOnePostById } = require('../db/create');

// create an apiRouter
const apiRouter = express();

apiRouter.use((request, response, next) => {
    // console.log('here is our request body: ', request.body);
    // response.send('Hello!');
    next();
});

apiRouter.get('/api/posts', async (request, response, next) => {
    try {
        // await buildDb();
        const allPosts = await getAllPosts();
        response.send(allPosts);
    } catch (error) {
        console.log('there was an error in apiRouter/get/api/posts: ', error);
        throw error;
    }
});

apiRouter.get('/api/links', async (request, response, next) => {
    try {
        const allLinks = await getAllLinks();
        response.send(allLinks);
    } catch (error) {
     console.log('there was an error in apiRouter/get/api/links: ', error);
     throw error;   
    }

})

// add a new link to scrape the rss from
apiRouter.post('/api/links/new', async (request, response, next) => {
    try {
        const postInformation = await request.body;
        console.log('this is the request body: ', postInformation);
    } catch (error) {
        console.log('there was an error in apiRouter/post/api/posts/new: ', error);
        throw error;
    }
});

// get one post
apiRouter.get('/api/posts/:postId', async (request, response, next) => {
    const { postId } = request.params;
    console.log('postId: ', postId);
    try {
        const onePost = await getOnePostById(postId);
        response.send(onePost);
    } catch (error) {
        console.log('there was an error in apiRouter/get/api/posts/:postId: ', error);
        throw error;
    }
});

apiRouter.get('/api', async (request, response, next) => {
    // console.log('here we got the request: ', request);
    try {
        // console.log('why arent we in here');
        await buildDb();
        const allLinks = await getAllLinks();
        response.send(allLinks).status(200);
    } catch (error) {
        console.log('there was an error running apiRouter/get/api: ', error);
        throw error;
    }
});



client.connect();

apiRouter.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});