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
const { client, getAllLinks, getAllPosts, getOnePostById, addLinktoTable, getPostsFromLinkId, parseNewLinkPosts, getPostsByDate, updateDb, deactivateLink, getActiveLinks, savePost, fetchSavedPosts, unsavePost, fetchAllUserLinks, reactivateLink, searchPosts, searchPostsByDate, linkChecker, updateUserLinks, getActiveUserLinks} = require('../db/index.js');

const { createNewUser, fetchUserByUsername, verifyUser, fetchUserByEmail, } = require('../db/users')

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
        const {newLink} = request.body;
        const {userId} = request.body
        console.log('new link', newLink)
        // linkChecker
        const checkLink = await linkChecker(newLink.link);

        // false means link DOES NOT exist
        if (!checkLink) {
            // we get a new link from the request and add it to the database
            const newLinkInDatabase = await addLinktoTable(newLink, userId);
            console.log('new link in database', newLinkInDatabase)
            // then we bother to get the posts and add them to the database 
            const newPostsMaybe = await parseNewLinkPosts(newLink.link, newLinkInDatabase[0].link_id);
            await updateUserLinks(userId, newLinkInDatabase[0].link_id, newLink.name);
            response.send(newLinkInDatabase[0]);
        } else {
            console.log('the link DOES exist (in api)')
            console.log(checkLink)
            console.log('check link', checkLink)
            // this is the link EXISTING
            const newUserLink = await updateUserLinks(userId, checkLink.id, newLink.name);
            response.send(newUserLink);
        }
    } catch (error) {
        console.log('there was an error in apiRouter.POST api/newlink: ', error);
        throw error;
    }
});

// /api/manage shows every link that has been 'subscsribed' to 
apiRouter.get('/api/manage/:userId', async (request, response, next) => {
    try {
        const {userId} = request.params;
        const allUserLinks = await fetchAllUserLinks(userId);
        console.log('all user links in api? ', allUserLinks)
        response.send(allUserLinks);
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
        response.send(postFromLink);
    } catch (error) {
        console.log('there was an error in apiRouter/get/api/links/:linkId: ', error);
        throw error;
    }
})

// get one post from its ID
apiRouter.get('/api/posts/:postId', async (request, response, next) => {
    const { postId } = request.params;
    try {
        const onePost = await getOnePostById(postId);
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
        const { postId } = request.params;
        const { userId } = request.body;
        const unSave = await unsavePost(postId, userId);
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
apiRouter.get('/api/today/:user', async (request, response, next) => {
    try {
        const {user} = request.params;
        // build the day
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const nowDay = now.getDate();
        // build string for database call
        const inputDate = `${nowYear}-${nowMonth}-${nowDay}`
        const postsToday = await getPostsByDate(inputDate, user);
        const newArr = postsToday.flat();
        response.send(newArr);
    } catch (error) {
        console.log('there was an error in apiRouter/get/today: ', error);
        throw error;
    }
});

// this function handles our logins
apiRouter.post('/api/login', async (request, response, next) => {
    try {
        const { username, password } = request.body;

        const userVerify = await verifyUser(username, password);
        const id = userVerify.user_id;

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
    } catch (error) {
        throw error;
    }
})

apiRouter.get('/api/search/:term', async (request, response, next) => {
    try {
        const {term} = request.params;
        const {user} = request.headers;
        const findingPosts = await searchPosts(term, user);
        response.send(findingPosts);
    } catch (error) {
        throw error;
    }
})

// fetch all active links for the user
apiRouter.get('/api/:userId', async(request, response, next) => {
    try {
        const {userId} = request.params;
        const allUserLinks = await getActiveUserLinks(userId);
        console.log('active user links in api', allUserLinks)
        response.send(allUserLinks);
    } catch (error) {
        throw error;
    }
});

// fetch(`${BASE_URL}/api/${date}/${user}`
apiRouter.get('/api/:date/:user', async(request, response, next) => {
    try {
        const {date} = request.params;
        const {user} = request.params;
        console.log('date and user backend api, ', date, user);
        const datePosts = await searchPostsByDate(date, user);
        response.send(datePosts);
    } catch (error) {
        console.log('there was an error searching by date: ', error);
        throw error;
    }
})

//this function handles signing up and/or registering
apiRouter.post('/api/sign-up', async (request, response, next) => {
    try {
        const { username, password, email, firstName, lastName } = request.body;
        const _user = await fetchUserByUsername(username);
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
            const hashedEmail = await bcrypt.hash(email, SALT_ROUNDS);
            const newUser = await createNewUser(username, hashedPass, hashedEmail, firstName, lastName);
            const token = jwt.sign(newUser, JWT_SECRET);
            response.send({message: "You're signed up!", token, newUser});
        }
    } catch (error) {
        console.log('there was an error in apiRouter/post/sign-up: ', error);
        throw (error);
    }
});

// /api currently returns all the links that have been 'subscribed' to
apiRouter.get('/api', async (request, response, next) => {
    try {
        const allLinks = await getAllLinks();
        response.send(allLinks).status(200);
    } catch (error) {
        console.log('there was an error running apiRouter/get/api: ', error);
        throw error;
    }
});

apiRouter.post('/api/update', async (request, response, next) => {
    try {
        const newPosts = await updateDb();
        response.send(newPosts).status(200);
    } catch (error) {
        console.log('there was an error trying to update the posts in /api/update: ', error)
        throw error;
    }
});

// deactive link route
apiRouter.post('/api/deactivate/:linkId', async (request, response, next) => {
    try {
        const {linkId} = request.params;
        const {user} = request.body;
        console.log('user and link in api', user, linkId)
        const deactivated = await deactivateLink(linkId, user);
        response.send(deactivated);
    } catch (error) {
        console.log('there was an error deactivating a link');
        throw error;
    }
});

// reactivate a link
// `${BASE_URL}/api/reactivate/${linkId}`
apiRouter.post('/api/reactivate/:linkId', async (request, response, next) => {
    try {
        const {linkId} = request.params;
        const {userId} = request.body;
        const reactivated = await reactivateLink(linkId, userId);
        response.send(reactivated);
    } catch (error) {
        throw error;
    }
})

client.connect();

apiRouter.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});