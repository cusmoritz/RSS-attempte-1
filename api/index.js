// server file
//require express
const express = require('express');
const cors = require('cors')

// create an apiRouter
const apiRouter = express();

apiRouter.use(express.json());

apiRouter.use(cors());

// define port
const PORT = process.env.PORT || 3000;
// get our client so we can connect
const { client, getAllLinks, getAllPosts, getOnePostById, addLinktoTable, getPostsFromLinkId, parseNewLinkPosts, getPostsByDate, fetchUser, createNewUser, updateDb } = require('../db/index.js');

const bcrypt = require('bcrypt');
const SALTY_ROUNDS = 10;

// get the parser
const { linkParse } = require('../db/parse');

apiRouter.use((request, response, next) => {
    console.log('request.method: ', request.method);
    console.log('request.url: ', request.url);
    // response.send('Hello!');
    next();
});

// /api/posts returns all the posts, currently
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

// /links/:linkId returns posts from that specific link
apiRouter.get('/api/links/:linkId', async (request, response, next) => {
    try {
        const { linkId } = request.params;
        const postFromLink = await getPostsFromLinkId(linkId);
        //should we error catch here in case there's not a link to the id? 
        /*
        postFromLink.forEach((link) => {
            if (link.link_id != linkId) {
                throw new "There is no link with that id."
            }
        })
        */
        response.send(postFromLink);
    } catch (error) {
        console.log('there was an error in apiRouter/get/api/links/:linkId: ', error);
        throw error;
    }
})

// /api/links shows every link that has been 'subscsribed' to 
apiRouter.get('/api/links', async (request, response, next) => {
    try {
        const allLinks = await getAllLinks();
        response.send(allLinks);
    } catch (error) {
     console.log('there was an error in apiRouter/get/api/links: ', error);
     throw error;   
    }

});

// add a new link to scrape the rss from
apiRouter.post('/api/links/new', async (request, response, next) => {
    try {
        // request.body is an object
        const newLink = request.body;

        // we get a new link from the request and add it to the database
        const newLinkInDatabase = await addLinktoTable(newLink);
        console.log('this is the new link: ', newLinkInDatabase);

        // then we bother to get the posts and add them to the database 
        await parseNewLinkPosts(newLink.link, newLinkInDatabase[0].link_id);

        response.send(newLinkInDatabase[0]);
    } catch (error) {
        console.log('there was an error in apiRouter/post/api/posts/new: ', error);
        throw error;
    }
});

// get one post from its ID
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

// /today returns every post that was posted on 'todays date'
apiRouter.get('/api/today', async (request, response, next) => {
    try {
        // build the day
        const now = new Date();
        const nowYear = now.getFullYear();
        // console.log('year: ', todayYear);
        const nowMonth = now.getMonth() + 1;
        // console.log('month: ', todayMonth);
        const nowDay = now.getDate();
        // build string for database call
        const inputDate = `${nowYear}-${nowMonth}-${nowDay}`
        // console.log('our input datE: ', inputDate)
        const postsToday = await getPostsByDate(inputDate);
        console.log('postsToday: ', postsToday)
        response.send(postsToday);
    } catch (error) {
        console.log('there was an error in apiRouter/get/today: ', error);
        throw error;
    }
});

// apiRouter.get('/jjjj', async (request, response, next) => {
//     try {
//         const now = new Date();
//         const nowYear = now.getFullYear();
//         // console.log('year: ', todayYear);
//         const nowMonth = now.getMonth() + 1;
//         // console.log('month: ', todayMonth);
//         const nowDay = now.getDate();
//         const inputDate = `${nowYear}-${nowMonth}-${nowDay}`
//         console.log('our input datE: ', inputDate)
//         const postsToday = await getPostsByDate(inputDate);
//         console.log('postsToday: ', postsToday)
//         response.send(postsToday);
//     } catch (error) {
//         console.log('there was a jjjjjjjjjj');
//         throw error;
//     }
// })

// this function handles our logins

apiRouter.get('/api/login', async (request, response, next) => {
    // console.log('request body: ', request.body);
    try {
        // assuming our logins are in the form of an object
        const { username, password } = request.body;

        const user = await fetchUser(username);

        // check the typed password against the stored (db) hashed password
        const passwordCheck = await bcrypt.compareSync(password, user.password)
        // console.log('password check here: ', passwordCheck)

        if (passwordCheck) {
            response.send({message: 'login successful!', user}).status(200);
        } else {
            response.send('You must type the right password').status(401);
        }
    } catch (error) {
        console.log('there was an error in router.get/login: ', error);
        throw error;
    }
});

apiRouter.post('/api/sign-up', async (request, response, next) => {
    try {
        const { username, password } = request.body;
        console.log('new username? ', username);
        console.log('new password? ', password);
        // check for dupe usernames
        const _user = await fetchUser(username);
        if (_user) {
            // this should be error handling instead
            response.send({message: "That username is already taken, try again."});
        } else {
            const hashedPass = await bcrypt.hashSync(password, SALTY_ROUNDS);
            // console.log('hashed pass?', hashedPass)
            const newUser = await createNewUser(username, hashedPass);
            console.log('we got a new user signed up: ', newUser)
            response.send({message: "You're signed up!", newUser});
        }

    } catch (error) {
        console.log('there was an error in apiRouter/post/sign-up: ', error);
        throw (error);
    }
});

// /api currently returns all the links that have been 'subscribed' to
apiRouter.get('/api', async (request, response, next) => {
    // console.log('here we got the request: ', request);
    try {
        // console.log('why arent we in here');
        // await buildDb();
        const allLinks = await getAllLinks();
        response.send(allLinks).status(200);
        // send is sinternally using JSON.Stringify
    } catch (error) {
        console.log('there was an error running apiRouter/get/api: ', error);
        throw error;
    }
});

apiRouter.get('/api/update', async (request, response, next) => {
    try {
        const newPosts = await updateDb();
        response.send(newPosts).status(200);
    } catch (error) {
        console.log('there was an error trying to update the posts in /api/update: ', error)
        throw error;
    }
});

client.connect();

apiRouter.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});