const { Client } = require('pg');
const { linkParse } = require('./parse.js')
// const {FEED_LINKS, fakeUsers } = require('../scr/seed');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/rss-feed';
//either local host or a PORT when deploying
const client = new Client(DATABASE_URL);

// this is where we will run the links through the parser
// then after we parse them, send each 'item' to the database
const FEED_LINKS = [
    {name: 'Ars Technica', link: 'https://feeds.arstechnica.com/arstechnica/staff-blogs'}, // works with parseURL
    {name: 'StoneMountain64', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCN-v-Xn9S7oYk0X2v1jx1Qg'}, // works with parseURL
    {name: 'The Verge', link: 'https://www.theverge.com/rss/index.xml'}, // works with parseURL
    {name: 'Corey Doctrow', link: 'https://pluralistic.net/feed/'}, // works with parseURL
    {name: 'WIRED Latest Ideas', link: 'https://www.wired.com/feed/category/ideas/latest/rss'}, // works with parseURL
    {name: 'Vail Daily', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCZy67OUMYggYSGDyYAviFUg'},
    {name: 'SpiffingBrit', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRHXUZ0BxbkU2MYZgsuFgkQ'},
    {name: 'ed zitron', link: 'https://ez.substack.com/feed'},
    {name: 'Garbage Day', link: 'https://www.garbageday.email/feed'},
    {name: 'everything is amazing', link: 'https://everythingisamazing.substack.com/feed'},
    {name: 'JackFrags', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCw7FkXsC00lH2v2yB5LQoYA'},
    {name: 'xkcd', link: 'https://xkcd.com/rss.xml'},    
    {name: 'New Means', link: 'https://newmeans.substack.com/feed'},
    // {name: 'The Intercept', link: 'https://theintercept.com/feed/?lang=en'}
];

const fakeUsers = [
    {username: 'johnCReilley', password: 'StepBrothers'},
    {username: 'FamousAmos', password: 'ItsC00kieTime'},
    {username: 'Andrew', password: 'AndrewTime!!'},
    {username: 'Noah', password: 'Ark,TheHarald'},
    {username: 'Seamore', password: 'UnderTheBleachers'}
]

const parseNewLinkPosts = async (link, linkId) => {
    try {

        const parsedPosts = await linkParse(link);
        // console.log('this is the parsed post: ', parsedPosts)
        parsedPosts.forEach( async (post) => {
            await addRssItemDatabase(post, linkId);
        })
    } catch (error) {
        console.log('there was an error parsing the new link: ', error);
        throw error;
    }
}

// item should be an object type
const addRssItemDatabase = async (item, link_id) => {
    try {
        console.log('item: ', item, link_id)
        if(!item.content) {
            // console.log('did we get here?: ', item, link_id);
            await client.query(`
            INSERT INTO rss (url, title, date, link_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (url) DO NOTHING
            RETURNING *;
            `, [item.link, item.title, item.date, link_id]);
        } else {
            await client.query(`
            INSERT INTO rss (content, url, title, date, link_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (url) DO NOTHING
            RETURNING *;
            `, [item.content, item.link, item.title, item.date, link_id]);
        }
        
    } catch (error) {
        console.log('there was an error inserting an item to the database: ', error);
        throw(error);
    }
};

// add links to database link table
const addLinktoTable = async (link) => {
    // console.log('what are we working with again: ', link);
    try {
        const {rows: newLinksInTable} = await client.query(`
        INSERT INTO rss_links (link_title, url)
        VALUES ($1, $2)
        ON CONFLICT (url) DO NOTHING
        RETURNING *
        ;
        `, [link.name, link.link]);

        return newLinksInTable;
    } catch (error) {
        console.log('there was an error putting a link in the database: ', error);
        throw (error)
    }
};

// rebuild the database
const rebuildDatabase = async () => {

    try {
        console.log('dropping tables...')
        // drop the tables
        await client.query(`
        DROP TABLE IF EXISTS rss;
        DROP TABLE IF EXISTS rss_links;
        DROP TABLE IF EXISTS users;
        `);

        // table for links
        console.log('creating links table...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss_links (
            link_id SERIAL PRIMARY KEY,
            link_title TEXT NOT NULL,
            url TEXT UNIQUE NOT NULL,
            active BOOLEAN DEFAULT TRUE
            );
        `);

        console.log('creating tables...')
        // create the tables
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss (
            id SERIAL PRIMARY KEY,
            content TEXT,
            link_id INTEGER REFERENCES rss_links(link_id),
            url TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            date DATE,
            saved BOOLEAN DEFAULT FALSE
            );
        `);

        console.log('creating users table...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password VARCHAR(255),
            active BOOLEAN DEFAULT TRUE
        );
        `);
        console.log('done creating tables...');

    } catch (error) {
        console.log('there was an error rebuilding the database: ', error);
        throw (error);
    }
};

// get every link from the rss_links tabls
const getAllLinks = async () => {
    try {
        // allLinks has: link_id, link_title, url
        const {rows: allLinks} = await client.query(`
        SELECT * FROM rss_links
        ;
        `);
        // console.log('ALL THE LINKS: ', allLinks);
        return allLinks;
    } catch (error) {
        console.log('there was an error getting all links: ', error);
        throw error;
    }
};

const getOnePostById = async(postId) => {
    try {
        const onePost = await client.query(`
        SELECT * from rss
        WHERE id=$1;
        `, [postId]);
        // console.log('here we got one post: ', onePost);
        return onePost.rows;
    } catch (error) {
        console.log('there was an error in getOnePostById: ', error);
        throw error;
    }
}

const getAllPosts = async () => {
    try {
        const allPosts = await client.query(`
        SELECT * FROM rss;
        `);
        return allPosts;
    } catch (error) {
        console.log('there was an error inside getAllPosts: ', error);
        throw error;
    }
};

// getPosts by Date works for any date in YYYY-MM-DD format
const getPostsByDate = async (date) => { // has to be year-month-day format
    try {
        // const date = new Date(); // this is the instance the function runs
        const {rows: postsByDate} = await client.query(`
        SELECT * FROM rss
        WHERE date=$1;
        `, [date]);
        return postsByDate;
    } catch (error) {
        console.log('there was an error in getPostsByDate: ', error);
        throw error;
    }
};

const getLinkFromIdNumber = async (link_id) => {
    try {
        const linkFromId = await client.query(`
        SELECT * FROM rss_links
        WHERE link_id=$1
        ;
        `, [link_id]);
        // console.log('we got a link from its id: ', linkFromId);
        return linkFromId;
    } catch (error) {
        console.log('there was an error getting a link from its id number: ', error);
        throw (error);
    }
};

// get posts from an individual link id number (rss_links)
const getPostsFromLinkId = async (link_id) => {
    try {
        const {rows: postsFromId} = await client.query(`
        SELECT * FROM rss
        WHERE link_id=$1
        ;
        `, [link_id]);
        // console.log('should be 4 posts: ', postsFromId);
        return postsFromId;
    } catch (error) {
        console.log('there was an error getting post by id number: ', error);
        throw error;
    }
};

// puts a new user into the database
// const createNewUser = async (username, password) => {
//     // console.log('this is our input from the get: ', username, password);
//     try {
//         const {rows: [user]} = await client.query(`
//         INSERT INTO users (username, password)
//         VALUES ($1, $2)
//         RETURNING *
//         ;
//         `, [username, password]);
//         console.log('new user here: ', user);
//         return (user);
//     } catch (error) {
//         console.log('there was an error creating a new user: ', error);
//         throw error;
//     } 
// };

const fetchUser = async (username) => {
    try {
        // console.log('username? :', username)
        const {rows: [user]} = await client.query(`
        SELECT * FROM users
        WHERE username=$1
        ;
        `, [username]);
        // console.log('user in fetchUser', user)
        return user;
    } catch (error) {
        console.log('there was an error fetching a user: ', error);
        throw error;
    }
};

const buildDb = async () => {

    try {

        // build links table
        // console.log('putting links in rss_links...')
        FEED_LINKS.forEach( async (link) => {
            const linksInTable = await addLinktoTable(link);
            // console.log('linksInTable: ', linksInTable);
            linksInTable.forEach( async(link) => {
                await parseNewLinkPosts(link.url, link.link_id);
            })
            });
        fakeUsers.forEach( async (user) => {
            await createNewUser(user.username, user.password);
        })
        
    } catch (error) {
        console.log('there was an error building the database: ', error);
        throw (error);
    }
};

// put all links in the database
    // fetch all links from the database,
        // parse each link through the parser, returning posts
            // send each post into the database, this time tied to the rss_link id

client.connect();

module.exports = {
    buildDb, 
    rebuildDatabase, 
    getPostsFromLinkId,
    getLinkFromIdNumber,
    getAllLinks,
    addLinktoTable,
    addRssItemDatabase,
    getAllPosts,
    getOnePostById,
    parseNewLinkPosts,
    getPostsByDate,
    fetchUser,
    createNewUser,

};
