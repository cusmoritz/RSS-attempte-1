const { Client } = require('pg');
const { linkParse } = require('./parse.js')

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
];

// item should be an object type
const addRssItemDatabase = async (item, link_id) => {
    try {
        // console.log('did we get here?: ', item, link_id);
        await client.query(`
        INSERT INTO rss (url, title, date, link_id)
        VALUES ($1, $2, $3, $4);
        `, [item.link, item.title, item.date, link_id]);
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
        RETURNING *
        ;
        `, [link.name, link.link]);
        // console.log('newLinksInTable: ', newLinksInTable);
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
        `);

        // table for links
        console.log('creating links table...')
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss_links (
            link_id SERIAL PRIMARY KEY,
            link_title TEXT NOT NULL,
            url TEXT NOT NULL,
            active BOOLEAN DEFAULT TRUE
            );
        `);
        // user_id INTEGER
        // link_name text REFERENCES rss_links(link_title),
        // link_id INTEGER REFERENCES rss_links(link_id),

        console.log('creating tables...')
        // create the tables
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss (
            id SERIAL PRIMARY KEY,
            content TEXT,
            link_id INTEGER REFERENCES rss_links(link_id),
            url TEXT NOT NULL,
            title TEXT NOT NULL,
            date DATE
            );
        `);

        console.log('done creating tables...');

        await client.query(`
        INSERT INTO rss (content, url, title, date)
        VALUES($1, $2, $3, $4);
        `, [`'<img src="https://imgs.xkcd.com/comics/paper_title.png" title="CONFLICT OF INTEREST STATEMENT: The authors hope these results are correct because we all want to be cool people who are good at science." alt="CONFLICT OF INTEREST STATEMENT: The authors hope these results are correct because we all want to be cool people who are good at science." />'`, 'www.google.com', 'XKCD', '2022-11-28']);

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
        console.log('ALL THE LINKS: ', allLinks);
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
        console.log('we got a link from its id: ', linkFromId);
        return linkFromId;
    } catch (error) {
        console.log('there was an error getting a link from its id number: ', error);
        throw (error);
    }
}

// get posts from an individual link id number (rss_links)
const getPostsFromLinkId = async (link_id) => {
    try {
        const {rows: postsFromId} = await client.query(`
        SELECT * FROM rss
        WHERE link_id=$1
        ;
        `, [link_id]);
        console.log('should be 4 posts: ', postsFromId);
        return postsFromId;
    } catch (error) {
        console.log('there was an error getting post by id number: ', error);
        throw error;
    }
};


const buildDb = async () => {

    try {

        // build links table
        console.log('putting links in rss_links...')
        FEED_LINKS.forEach( async (link) => {
            const linksInTable = await addLinktoTable(link);
                console.log('getting each url and finding posts...')
                linksInTable.forEach( async (linkInTable) => {
                    console.log('getting all posts for each url...')
                    const allPosts = await linkParse(linkInTable.url);
                    console.log('putting each individual post in the rss table...');
                    // console.log('link in table: ', linkInTable)
                    allPosts.forEach(async (individualPost) => {
                        await addRssItemDatabase(individualPost, linkInTable.link_id);
                    })
                })
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
rebuildDatabase().then(buildDb);

module.exports = {
    buildDb, 
    rebuildDatabase, 
};
