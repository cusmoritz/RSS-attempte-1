// server file
//require express
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWT_SECRET } = process.env;

// create an apiRouter
const apiRouter = express();

apiRouter.use(express.json());

apiRouter.use(cors());

// define port
const PORT = process.env.PORT || 3000;
// get our client so we can connect
const { client, getAllLinks, getAllPosts, getOnePostById, addLinktoTable, getPostsFromLinkId, parseNewLinkPosts, getPostsByDate, updateDb, deactivateLink, getActiveLinks, savePost, fetchSavedPosts, unsavePost } = require('../db/index.js');

const { createNewUser, fetchUser, verifyUser } = require('../db/users')

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

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

// add a new link to scrape the rss from
apiRouter.post('/api/newlink', async (request, response, next) => {
    try {
        // request.body is an object
        const {newLink} = request.body;
        const {userId} = request.body
        // console.log('this is request bodY: ', request.body);

        // we get a new link from the request and add it to the database
        const newLinkInDatabase = await addLinktoTable(newLink, userId);
        // console.log('this is the new link: ', newLinkInDatabase);

        // then we bother to get the posts and add them to the database 
        const newPostsMaybe = await parseNewLinkPosts(newLink.link, newLinkInDatabase[0].link_id);
        // console.log('did we get new posts? ', newPostsMaybe)
        response.send(newLinkInDatabase[0]);
    } catch (error) {
        console.log('there was an error in apiRouter/post/api/posts/new: ', error);
        throw error;
    }
});

// /api/links shows every link that has been 'subscsribed' to 
apiRouter.get('/api/manage/:userId', async (request, response, next) => {
    // console.log('here')
    try {
        // console.log('backend api', request.params);
        const {userId} = request.params;
        const activeLinks = await getActiveLinks(userId);
        // console.log('active links backend api', activeLinks)
        response.send(activeLinks);
    } catch (error) {
     console.log('there was an error in apiRouter/get/api/links: ', error);
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

// apiRouter.get(`/api/ten/${linkId}`, async (request, response, next) => {
//     try {
//         const {linkId} = request.params()
//         const tenPosts = await fetchTenPosts(linkId);
//         response.send(tenPosts);
//     } catch (error) {
//         throw error;
//     }
// })

// get one post from its ID
apiRouter.get('/api/posts/:postId', async (request, response, next) => {
    const { postId } = request.params;
    // console.log('postId: ', postId);
    try {
        const onePost = await getOnePostById(postId);
        // console.log('one post api side', onePost)
        response.send(onePost);
    } catch (error) {
        console.log('there was an error in apiRouter/get/api/posts/:postId: ', error);
        throw error;
    }
});

// POST call to save one blog post
apiRouter.post('/api/posts/saved/:postId', async (request, response, next) => {
    try {
        const postId = request.params;
        const {userId} = request.body;
        const savedPost = await savePost(postId, userId);
        response.send(savedPost);
    } catch (error) {
        console.log('there was an error trying to save a post');
        throw error;
    }
});

//POST call to remove one blog post
apiRouter.post('/api/posts/unsave/:postId', async (request, response, next) => {
    try {
        console.log('request body', request.body)
        const { postId } = request.params;
        const { userId } = request.body;
        console.log('user and post', userId, postId)
        const unSave = await unsavePost(postId, userId);
        console.log('this is unsaved post in api', unSave);
        response.send(unSave);
    } catch (error) {
        console.log('error unsaving a post in API');
        throw error;
    }
})

// this call gets all the users saved posts
apiRouter.get('/api/saved/:userId', async (request, response, next) => {
    try {
        const {userId} = request.params;
        const savedPosts = await fetchSavedPosts(userId);
        response.send(savedPosts);
    } catch (error) {
        console.log('there was an error fetching all the users saved posts')
        throw error;
    }
})

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
apiRouter.post('/api/login', async (request, response, next) => {
    try {
        const { username, password } = request.body;

        const userVerify = await verifyUser(username, password);
        console.log('user in api: ', userVerify);
        const id = userVerify.id;

        if (userVerify) {
            const token = jwt.sign(userVerify, JWT_SECRET);
            response.status(200).send({message: "You're logged in!", token, id})
        } else {
            response.status(400).send({
                error: "AuthenticationError",
                message: "You did not log in right. Please try again."
            });
        }
    } catch (error) {
        console.log('there was an error in router.get/login: ', error);
        throw new Error (error);
    }
});

apiRouter.get('/api/me', async (request, response, next) => {
    try {
        const auth = request.header('Authorization');
        const [, token] = auth.split(" ")
        const userCheck = jwt.verify(token, JWT_SECRET);
        response.send(userCheck);
        // send the token to /api/me in request
        // if there's a token
        // verify the token
        // token should include user id and stuff
        // send back the id to set state
    } catch (error) {
        
    }
})

//this function handles signing up and/or registering
apiRouter.post('/api/sign-up', async (request, response, next) => {
    try {
        // console.log('req body', request.body)
        const { username, password, email, firstName, lastName } = request.body;
        // console.log('new username? ', username);
        // console.log('new password? ', password);
        // check for dupe usernames
        const _user = await fetchUser(username);
        const _email = await fetchUserByEmail(email)
        if (_user) {
            // this should be error handling instead
            response.status(400).send({
                error: "UserNameTaken",
                message: "That username is already taken, try again."
            });
        } else if (_email) {
            response.status(400).send({
                error: "EmailTaken",
                message: "That email is already associated with a user. Please try a different email."
            });
        }
         else {
            const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
            // console.log('hashed pass?', hashedPass)
            const newUser = await createNewUser(username, hashedPass, email, firstName, lastName);
            // const returnUser = newUser.json();
            console.log('new user in api for real, ', newUser)
            const token = jwt.sign(newUser, JWT_SECRET);
            // console.log('we got a new user signed up: ', token);
            response.send({message: "You're signed up!", token, newUser});
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

apiRouter.post('/api/update', async (request, response, next) => {
    try {
        const newPosts = await updateDb();
        console.log('this is new posts: ', newPosts)
        response.send().status(200);
    } catch (error) {
        console.log('there was an error trying to update the posts in /api/update: ', error)
        throw error;
    }
});

// deactive link route
apiRouter.post('/api/deactivate/:linkId', async (request, response, next) => {
    try {
        // console.log('working in back end: ', request)
        const {linkId} = request.params;
        const deactivated = await deactivateLink(linkId);
        response.send(deactivated);
    } catch (error) {
        console.log('there was an error deactivating a link');
        throw error;
    }
})

client.connect();

apiRouter.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});