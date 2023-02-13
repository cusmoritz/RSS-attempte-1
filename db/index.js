// Require the Client constructor from the pg package
const { Client } = require('pg');

//nabs the parser from the other file
const { linkParse } = require('./parse.js');

const CONNECTION_STRING = process.env.DATABASE_URL || "postgres://localhost:5432/rss-feed";
// Create the client using new Client(CONNECTION_STRING)

const client = new Client(CONNECTION_STRING);

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
};

// item should be an object type
const addRssItemDatabase = async (item, link_id) => {
    try {
        if(item.content) { 
            console.log('did we get here?: ', item, link_id);
            await client.query(`
            INSERT INTO rss (content, url, title, date, link_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (url) DO NOTHING;
            `, [item.content, item.link, item.title, item.date, link_id]);
        } else {
            await client.query(`
            INSERT INTO rss (url, title, date, link_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (url) DO NOTHING
            RETURNING *;
            `, [item.link, item.title, item.date, link_id]);
        }
    } catch (error) {
        console.log('there was an error inserting an item to the database: ', error);
        throw(error);
    }
};

// add links to database link table
const addLinktoTable = async (link, userId) => {
    // console.log('what are we working with again: ', link);
    try {
        const {rows: newLinksInTable} = await client.query(`
        INSERT INTO rss_links (link_title, url, user_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (url) DO NOTHING
        RETURNING *
        ;
        `, [link.name, link.link, userId]);
        // console.log('this is returned in the database function: ', newLinksInTable)
        return newLinksInTable;
    } catch (error) {
        console.log('there was an error putting a link in the database: ', error);
        throw (error)
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

const getActiveLinks = async(userId) => {
    try {
        const {rows: activeLinks} = await client.query(`
        SELECT * FROM rss_links
        WHERE active = TRUE AND user_id = $1
        ;
        `, [userId]);
        return activeLinks;
    } catch (error) {
        console.log('there was an error getting active links: ', error);
        throw error;
    }
}

const getOnePostById = async(postId) => {
    try {
        const {rows: [onePost]} = await client.query(`
        SELECT * from rss
        WHERE id=$1;
        `, [postId]);
        // console.log('here we got one post: ', onePost);
        return onePost;
    } catch (error) {
        console.log('there was an error in getOnePostById: ', error);
        throw error;
    }
};

// getPosts by Date works for any date in YYYY-MM-DD format
const getPostsByDate = async (date) => { // has to be year-month-day format
    try {
        // const date = new Date(); // this is the instance the function runs
        const {rows: postsByDate} = await client.query(`
        SELECT * FROM rss
        WHERE date=$1
        ORDER BY date DESC
        ;`, [date]);
        // SORT BY column_name DESC
        return postsByDate;
    } catch (error) {
        console.log('there was an error in getPostsByDate: ', error);
        throw error;
    }
};

// get posts from an individual link id number (rss_links)
const getPostsFromLinkId = async (link_id) => {
    try {
        const {rows: postsFromId} = await client.query(`
        SELECT * from rss
        WHERE link_id=$1
        ORDER BY date DESC
        ;
        `, [link_id]);
        // console.log('should be 4 posts: ', postsFromId);
        return postsFromId;
    } catch (error) {
        console.log('there was an error getting post by id number: ', error);
        throw error;
    }
};

const updateDb = async () => {
    try {
        // gets all the links from the database
        const links = await getAllLinks()
        links.forEach(async (link) => {
            // parses every link to get posts
            const newParsedPosts = await parseNewLinkPosts(link.url, link.link_id);
            if (!newParsedPosts) {
                return;
            } else {
                newParsedPosts.forEach(async (post) => {
                    // puts new posts into database
                    const newPosts = await addRssItemDatabase(post);
                    return newPosts;
                })
            }
        })
    } catch (error) {
        console.log('there was an error updating the database: ', error);
        throw error;
    }
};

const deactivateLink = async(linkId) => {
    try {
        // console.log('working in database: ', linkId)
        const {rows: link} = client.query(`
        UPDATE rss_links
        SET active = FALSE
        WHERE link_id = $1
        RETURNING *
        ;
        `, [linkId]);
        return link;
    } catch (error) {
        console.log('there was an error deactivating a link in the database: ', error);
        throw error;
    }
}

const savePost = async(postId, userId) => {
    try {
    const {rows: [savedPost]} = await client.query(`
        INSERT INTO user_saved (post_id, user_id)
        VALUES ($1, $2)
        RETURNING *
        ;
        `, [postId.postId, userId]);
    return savedPost;
    } catch (error) {
        throw error;
    }
}

const fetchSavedPosts = async (userId) => {
    try {
        const {rows: savedPosts} = await client.query(`
        SELECT * FROM user_saved
        WHERE user_id = $1
        ;
        `, [userId]);
        // const allSavedPosts = await Promise.all(getOnePostById(savedPosts.post_id));
        return savedPosts;
    } catch (error) {
        throw error;
    }
}

// client.connect();

module.exports = {
    client,
    parseNewLinkPosts,
    addRssItemDatabase,
    addLinktoTable,
    getAllLinks,
    getLinkFromIdNumber,
    getAllPosts,
    getOnePostById,
    getPostsByDate,
    getPostsFromLinkId,
    updateDb,
    deactivateLink,
    getActiveLinks,
    savePost,
    fetchSavedPosts,

}

