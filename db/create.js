const { Client } = require('pg');
const { linkParse } = require('./parse.js')

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/rss-feed';
//either local host or a PORT when deploying
const client = new Client(DATABASE_URL)

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

// rebuild the database
const rebuildDatabase = async () => {
    try {
        console.log('dropping tables...')
        // drop the tables
        await client.query(`
        DROP TABLE IF EXISTS rss
        ;
        `);

        console.log('creating tables...')
        // create the tables
        await client.query(`
        CREATE TABLE IF NOT EXISTS rss (
            id SERIAL PRIMARY KEY,
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
        // 'https://ez.substack.com/feed',
        // 'https://www.garbageday.email/feed',
        // 'https://everythingisamazing.substack.com/feed',
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCw7FkXsC00lH2v2yB5LQoYA',
        'https://xkcd.com/rss.xml',    
    ]

    try {
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
rebuildDatabase();

module.exports = {
    buildDb, 
    rebuildDatabase, 
};
