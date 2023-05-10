const { Client } = require('pg');
const { linkParse } = require('./parse.js');
const { createNewUser } = require('./users');
const {CONNECTION_STRING} = require('./index');

// const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/rss-feed' || 'postgres://rss_gwsf_user:q3I4OShcv76nONqD2gtNF7ahdIEp6nlt@dpg-ch4ss2ak728glsi2hv8g-a/rss_gwsf';

// //either local host or a PORT when deploying
const client = CONNECTION_STRING;

// this is where we will run the links through the parser
// then after we parse them, send each 'item' to the database
const FEED_LINKS = [
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
    {name: 'Citations Needed', link: 'https://feeds.libsyn.com/102225/rss'},
    {name: 'Baseball Doesnt Exist', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXjvsikVclbNRGRlzr8jTEg'},
    {name: "Jomboy Media", link: "https://www.youtube.com/feeds/videos.xml?channel_id=UCl9E4Zxa8CVr2LBLD0_TaNg"},
    {name: "Camping with Steve", link: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSnqXeK94-iNmwqGO__eJ5g"},
    {name: "The Verge Decoder", link: "https://www.theverge.com/rss/decoder-podcast-with-nilay-patel/index.xml"},
    {name: "The Verge Google", link: "https://www.theverge.com/rss/google/index.xml"},
    // {name: 'The Intercept', link: 'https://theintercept.com/feed/?lang=en'}
];

// const parseNewLinkPosts = async (link, linkId) => {
//     try {

//         const parsedPosts = await linkParse(link);
//         parsedPosts.forEach( async (post) => {
//             await addRssItemDatabase(post, linkId);
//         })
//     } catch (error) {
//         console.log('there was an error parsing the new link: ', error);
//         throw error;
//     }
// }

// item should be an object type
// const addRssItemDatabase = async (item, link_id) => {
//     try {
//         if(!item.content) {
//             // console.log('did we get here?: ', item, link_id);
//             await client.query(`
//             INSERT INTO rss (url, title, date, link_id)
//             VALUES ($1, $2, $3, $4)
//             ON CONFLICT (url) DO NOTHING
//             RETURNING *;
//             `, [item.link, item.title, item.date, link_id]);
//         } else {
//             await client.query(`
//             INSERT INTO rss (content, url, title, date, link_id)
//             VALUES ($1, $2, $3, $4, $5)
//             ON CONFLICT (url) DO NOTHING
//             RETURNING *;
//             `, [item.content, item.link, item.title, item.date, link_id]);
//         }
        
//     } catch (error) {
//         console.log('there was an error inserting an item to the database: ', error);
//         throw(error);
//     }
// };

// add links to database link table
// const addLinktoTable = async (link) => {
//     try {
//         const {rows: newLinksInTable} = await client.query(`
//         INSERT INTO rss_links (link_title, url)
//         VALUES ($1, $2)
//         RETURNING *
//         ;
//         `, [link.name, link.link]);
//         return newLinksInTable;
//     } catch (error) {
//         console.log('there was an error putting a link in the database: ', error);
//         throw (error)
//     }
// };

// rebuild the database
const rebuildDatabase = async () => {

    try {
        console.log('dropping tables...')
        // drop the tables
        await client.query(`
        DROP TABLE IF EXISTS user_saved;
        DROP TABLE IF EXISTS rss;
        DROP TABLE IF EXISTS user_links;
        DROP TABLE IF EXISTS rss_links;
        DROP TABLE IF EXISTS users;
        `);
        console.log('done dropping tables...')

        console.log('creating users...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password VARCHAR(255),
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT TRUE
        );
        `);

        // create the tables
        console.log('creating rss_links...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss_links (
            link_id SERIAL PRIMARY KEY,
            url TEXT NOT NULL
            );
        `);
            // user_id INTEGER REFERENCES users(user_id),

        console.log('creating rss...')
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

        console.log('creating users_saved...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS user_saved (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "users"(user_id) NOT NULL,
            post_id INTEGER REFERENCES "rss"(id) NOT NULL
        );
        `)

        console.log('creating users links...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS user_links (
            user_id INTEGER REFERENCES "users"(user_id) not null,
            link_id INTEGER REFERENCES "rss_links"(link_id) not null,
            link_title TEXT NOT NULL,
            active BOOLEAN DEFAULT TRUE,
            PRIMARY KEY (user_id, link_id)
        );
        `)
        console.log('done creating tables...');

        /* 
            users table:
                user_id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password VARCHAR(255),
                email VARCHAR(255) NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT TRUE

            rss_links:
                link_id serial primary key
                link_title text not null
                link_url text not null
                user_id integer references "users"(user_id) not null
            
            rss_posts:
                post_id serial primary key
                post_link_id integer not null references "rss_links"(link_id)
                post_url text not null
                post_title text
                post_content text

                if all the links go in unique,
                and all the posts go in unique
                that's fine, we just need to link the user to the link they have submitted
                and pull the associated posts for that link. the link and posts should have no user details, each user needs to see each link they have submitted and the posts associated with those links. 
                we can join / create a new table for each user, that keeps track of the links they are submitted with.
        */

    } catch (error) {
        console.log('there was an error rebuilding the database: ', error);
        throw (error);
    }
};

// get every link from the rss_links tabls
// const getAllLinks = async () => {
//     try {
//         // allLinks has: link_id, link_title, url
//         const {rows: allLinks} = await client.query(`
//         SELECT * FROM rss_links
//         ;
//         `);
//         return allLinks;
//     } catch (error) {
//         console.log('there was an error getting all links: ', error);
//         throw error;
//     }
// };

// const getOnePostById = async(postId) => {
//     try {
//         const onePost = await client.query(`
//         SELECT * from rss
//         WHERE id=$1;
//         `, [postId]);
//         return onePost.rows;
//     } catch (error) {
//         console.log('there was an error in getOnePostById: ', error);
//         throw error;
//     }
// }

// const getAllPosts = async () => {
//     try {
//         const allPosts = await client.query(`
//         SELECT * FROM rss;
//         `);
//         return allPosts;
//     } catch (error) {
//         console.log('there was an error inside getAllPosts: ', error);
//         throw error;
//     }
// };

// getPosts by Date works for any date in YYYY-MM-DD format
// const getPostsByDate = async (date) => { // has to be year-month-day format
//     try {
//         // const date = new Date(); // this is the instance the function runs
//         const {rows: postsByDate} = await client.query(`
//         SELECT * FROM rss
//         WHERE date=$1;
//         `, [date]);
//         return postsByDate;
//     } catch (error) {
//         console.log('there was an error in getPostsByDate: ', error);
//         throw error;
//     }
// };

// const getLinkFromIdNumber = async (link_id) => {
//     try {
//         const linkFromId = await client.query(`
//         SELECT * FROM rss_links
//         WHERE link_id=$1
//         ;
//         `, [link_id]);
//         return linkFromId;
//     } catch (error) {
//         console.log('there was an error getting a link from its id number: ', error);
//         throw (error);
//     }
// };

// get posts from an individual link id number (rss_links)
// const getPostsFromLinkId = async (link_id) => {
//     try {
//         const {rows: postsFromId} = await client.query(`
//         SELECT * FROM rss
//         WHERE link_id=$1
//         ;
//         `, [link_id]);
//         return postsFromId;
//     } catch (error) {
//         console.log('there was an error getting post by id number: ', error);
//         throw error;
//     }
// };

// const fetchUser = async (username) => {
//     try {
//         const {rows: [user]} = await client.query(`
//         SELECT * FROM users
//         WHERE username=$1
//         ;
//         `, [username]);
//         return user;
//     } catch (error) {
//         console.log('there was an error fetching a user: ', error);
//         throw error;
//     }
// };

// const buildDb = async () => {

//     try {

//         // build links table
//         FEED_LINKS.forEach( async (link) => {
//             const linksInTable = await addLinktoTable(link);
//             linksInTable.forEach( async(link) => {
//                 await parseNewLinkPosts(link.url, link.link_id);
//             })
//             });
//     } catch (error) {
//         console.log('there was an error building the database: ', error);
//         throw (error);
//     }
// };

// put all links in the database
    // fetch all links from the database,
        // parse each link through the parser, returning posts
            // send each post into the database, this time tied to the rss_link id

rebuildDatabase();

module.exports = { 
    rebuildDatabase, 
};
