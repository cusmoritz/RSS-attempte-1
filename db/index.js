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
            await client.query(`
            INSERT INTO rss (content, url, title, date, link_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (url) DO NOTHING
            `, [item.content, item.link, item.title, item.date, link_id]);
        } else {
            await client.query(`
            INSERT INTO rss (url, title, date, link_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (url) DO NOTHING
            ;
            `, [item.link, item.title, item.date, link_id]);
        }
    } catch (error) {
        console.log('there was an error inserting an item to the database: ', error);
        throw(error);
    }
};

// updates the user_links table with a userId, new url, and users' url_name
const updateUserLinks = async (user, url, url_name) => {
    try {
        await client.query(`
        INSERT INTO user_links (user_id, link_id, link_title)
        VALUES ($1, $2, $3)
        RETURNING *
        ;
        `, [user, url, url_name])
    } catch (error) {
        throw error;
    }
}

// checks to see if the link a user submits is already in the database
const linkChecker = async (link_url) => {
    try {
        const {rows: [linkExists]} = await client.query(`
        SELECT * FROM rss_links
        WHERE url=$1
        ;
        `,[link_url]);
        if (linkExists) {

            return {id: linkExists.link_id, true: true};
        } else {
            console.log('the link doesnt exist in db')
            return;
        }
    } catch (error) {
        throw error;
    }
}

// adds a new link to the rss_links table with a url
const addLinktoTable = async (link) => {
    try {
        const {rows: newLinksInTable} = await client.query(`
        INSERT INTO rss_links (url)
        VALUES ($1)
        RETURNING *
        ;
        `, [link.link]);
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
        return allLinks;
    } catch (error) {
        console.log('there was an error getting all links: ', error);
        throw error;
    }
};

// fetches a link from rss_links that matches an id number
const getLinkFromIdNumber = async (link_id) => {
    try {
        const linkFromId = await client.query(`
        SELECT * FROM rss_links
        WHERE link_id=$1
        ;
        `, [link_id]);
        return linkFromId;
    } catch (error) {
        console.log('there was an error getting a link from its id number: ', error);
        throw (error);
    }
};

// gets every post from rss table
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

// old method, fetched urls from rss_links per user
// const getActiveLinks = async(userId) => {
//     try {
//         const {rows: activeLinks} = await client.query(`
//         SELECT * FROM rss_links
//         WHERE active = TRUE AND user_id = $1
//         ;
//         `, [userId]);
//         return activeLinks;
//     } catch (error) {
//         console.log('there was an error getting active links: ', error);
//         throw error;
//     }
// };

// fetches linkes from user_links that are marked as active
const getActiveUserLinks = async(userId) => {
    try {
        const {rows: activeUserLinks} = await client.query(`
            SELECT rss_links.link_id, rss_links.url, user_links.link_title
            FROM rss_links
            LEFT JOIN user_links
            ON user_links.link_id = rss_links.link_id 
            WHERE user_links.user_id = $1 AND active = true
            ;
        `, [userId]);
        console.log('these are active user links: ', activeUserLinks);
        return activeUserLinks;
    } catch (error) {
        throw error;
    }
}

// fetches all user links from user_links table that match user id
const fetchAllUserLinks = async (userId) => {
    try {
        const {rows: allUserLinks} = await client.query(`
        SELECT rss_links.link_id, rss_links.url, user_links.link_title, user_links.active
        FROM rss_links
        LEFT JOIN user_links
        ON user_links.link_id = rss_links.link_id WHERE user_links.user_id = $1
        ;
        `, [userId]);
        console.log('all user links in db', allUserLinks)
        return allUserLinks;
    } catch (error) {
        throw error;
    }
}

// fetches one post from rss table with a post id
const getOnePostById = async(postId) => {
    try {
        const {rows: [onePost]} = await client.query(`
        SELECT * from rss
        WHERE id=$1;
        `, [postId]);
        return onePost;
    } catch (error) {
        console.log('there was an error in getOnePostById: ', error);
        throw error;
    }
};

// getPosts by Date works for any date in YYYY-MM-DD format
const getPostsByDate = async (date, user) => { // has to be year-month-day format
    try {

        const userLinks = await getActiveUserLinks(user);

        let todayResults = [];

        for (let i = 0; i < userLinks.length; i++) {
            const {rows: todaySearchResults} = await client.query(`
            SELECT * FROM rss
            WHERE date=$1 AND link_id = ${userLinks[i].link_id}
            ORDER BY date DESC
            ;
            `, [date]);
            if (todaySearchResults.length > 0) {
                todayResults.push(todaySearchResults);
            }
        }

        // const {rows: postsByDate} = await client.query(`
        // SELECT * FROM rss
        // WHERE date=$1
        // ORDER BY date DESC
        // ;`, [date]);
        // SORT BY column_name DESC
        return todayResults;
    } catch (error) {
        console.log('there was an error in getPostsByDate: ', error);
        throw error;
    }
};

// fetches posts in rss table that match a rss_links id
const getPostsFromLinkId = async (link_id) => {
    try {
        const {rows: postsFromId} = await client.query(`
        SELECT * from rss
        WHERE link_id=$1
        ORDER BY date DESC
        ;
        `, [link_id]);
        return postsFromId;
    } catch (error) {
        console.log('there was an error getting post by id number: ', error);
        throw error;
    }
};

// notes in function
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

// updates user_links to set an rss_links id as deactivated (user no longer wants to see it)
const deactivateLink = async(linkId, userId) => {
    try {
        const {rows: link} = client.query(`
        UPDATE user_links
        SET active = false
        WHERE link_id = $1 AND user_id = $2
        RETURNING *
        ;
        `, [linkId, userId]);
        return link;
    } catch (error) {
        console.log('there was an error deactivating a link in the database: ', error);
        throw error;
    }
};

// updates user_links to set an rss_links id as active (user wishes to see posts for that link)
const reactivateLink = async(linkId, userId) => {
    console.log('reactivating!')
    try {
        const {rows: link} = await client.query(`
        UPDATE user_links
        SET active = TRUE
        WHERE link_id = $1 AND user_id = $2
        RETURNING *
        `, [linkId, userId]);
        return link;
    } catch (error) {
        throw error;
    }
}

// updates user_saved table with a post using postId and userId
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

// removes a post from user_saved table
const unsavePost = async (postId, userId) => {
    try {
        const {rows: [result]} = await client.query(`
        DELETE FROM user_saved
        WHERE post_id = $1 AND user_id = $2
        RETURNING *
        ;  
        `, [postId, userId]);
        return result;
    } catch (error) {
        throw error;
    }
}

// joins user_saved posts to rss ids
const fetchSavedPosts = async (userId) => {
    try {
        const {rows: savedPosts} = await client.query(`
        SELECT user_saved.*, rss.content, rss.url, rss.title, rss.date FROM user_saved
        JOIN rss ON rss.id = user_saved.post_id
        WHERE user_id = $1
        ;
        `, [userId]);
        return savedPosts;
    } catch (error) {
        throw error;
    }
};

const searchPosts = async (term, user) => {
    try {

        // will be an array of links [{}, {}, {}, {} ...]
        const userLinks = await getActiveUserLinks(user);
        console.log('userLinks db: ', userLinks);

        let individualResults = []

        for (let i = 0; i < userLinks.length; i++) {
            const {rows: databaseResults} = await client.query(`
            SELECT * FROM rss
            WHERE title LIKE ('%${term}%') AND link_id = ${userLinks[i].link_id}
            ;
            `);
            if (databaseResults.length > 0) {
                individualResults.push(databaseResults);
            }
        }
        return individualResults;
    } catch (error) {
        console.log('there was an error searching for posts')
        throw error;
    }
}

const searchPostsByDate = async (date, user) => {

    try {
    // arr of links for each user
    const userLinks = await getActiveLinks(user);

    let dateResults = [];

    for (let i = 0; i < userLinks.length; i++) {
        const {rows: dateSearchResults} = await client.query(`
        SELECT * FROM rss
        WHERE date=$1 AND link_id = ${userLinks[i].link_id}
        ;
        `, [date]);
        if (dateSearchResults.length > 0) {
            dateResults.push(dateSearchResults);
        }
    }
    return dateResults;
    } catch (error) {
        console.log('there was a database error searching by date: ', error);
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
    // getActiveLinks,
    savePost,
    fetchSavedPosts,
    unsavePost,
    fetchAllUserLinks,
    reactivateLink,
    searchPosts,
    searchPostsByDate,
    linkChecker,
    updateUserLinks,
    getActiveUserLinks,

}

