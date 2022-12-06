const { Client } = require('pg');
const { linkParse } = require('./parse.js')

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/rss-feed';
//either local host or a PORT when deploying
const client = new Client(DATABASE_URL);

// this is where we will run the links through the parser
// then after we parse them, send each 'item' to the database
const FEED_LINKS = [
    // 'https://feeds.arstechnica.com/arstechnica/staff-blogs', // works with parseURL
    // 'https://www.youtube.com/feeds/videos.xml?channel_id=UCN-v-Xn9S7oYk0X2v1jx1Qg', // works with parseURL
    // 'https://www.theverge.com/rss/index.xml', // works with parseURL
    // 'https://pluralistic.net/feed/', // works with parseURL
    // 'https://www.wired.com/feed/category/ideas/latest/rss', // works with parseURL
    // 'https://www.youtube.com/feeds/videos.xml?channel_id=UCZy67OUMYggYSGDyYAviFUg',
    // 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRHXUZ0BxbkU2MYZgsuFgkQ',
    {name: 'ed zitron', link: 'https://ez.substack.com/feed'},
    // 'https://www.garbageday.email/feed',
    {name: 'everything is amazing', link: 'https://everythingisamazing.substack.com/feed'},
    {name: 'stonemountain', link: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCw7FkXsC00lH2v2yB5LQoYA'},
    {name: 'xkcd', link: 'https://xkcd.com/rss.xml'},    
]

// item should be an object type
const addRssItemDatabase = async (item) => {
    try {
        console.log('did we get here?')
        await client.query(`
        INSERT INTO rss (url, title, date)
        VALUES ($1, $2, $3);
        `, [item.link, item.title, item.date])
    } catch (error) {
        console.log('there was an error inserting an item to the database: ', error);
        throw(error);
    }
};

// add links to database link table
const addLinktoTable = async (link) => {
    try {
        await client.query(`
        INSERT INTO rss_links (link_id, url)
        VALUES ($1, $2);
        `, [link.name, link.url]);
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
            user_id INTEGER
            );
        `);

        console.log('creating tables...')
        // create the tables
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss (
            id SERIAL PRIMARY KEY,
            link_name text REFERENCES rss_links(link_title),
            link_id INTEGER REFERENCES rss_links(link_id),
            content text,
            url text NOT NULL,
            title text NOT NULL,
            date DATE)
            ;
        `);

        await client.query(`
        INSERT INTO rss (content, url, title, date)
        VALUES($1, $2, $3, $4);
        `, [`'<img src="https://imgs.xkcd.com/comics/paper_title.png" title="CONFLICT OF INTEREST STATEMENT: The authors hope these results are correct because we all want to be cool people who are good at science." alt="CONFLICT OF INTEREST STATEMENT: The authors hope these results are correct because we all want to be cool people who are good at science." />'`, 'www.google.com', 'XKCD', '2022-11-28']);

    } catch (error) {
        console.log('there was an error rebuilding the database: ', error);
        throw (error);
    }
};

const buildDb = async () => {

    try {

        // build links table
        FEED_LINKS.forEach((link) => {
            console.log('links: ', link);
            addLinktoTable(link);
        })

        FEED_LINKS.forEach(async (url) => {
        
            const parsedLinks = await linkParse(url);
    
            parsedLinks.forEach(async (rssObject) => {
                addRssItemDatabase(rssObject)
            });
        });
    } catch (error) {
        console.log('there was an error building the database: ', error);
        throw (error);
    }
};

client.connect();
rebuildDatabase().then(buildDb);

module.exports = {
    buildDb, 
    rebuildDatabase, 
};
