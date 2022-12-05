const { Client } = require('pg');
const { linkParse } = require('./parse.js')

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/rss-feed';
//either local host or a PORT when deploying
const client = new Client(DATABASE_URL)

// item should be an object type
const addRssItemDatabase = async (item) => {
    console.log('did we get here?')
    await client.query(`
    INSERT INTO rss (url, title, date)
    VALUES ($1, $2, $3);
    `, [item.link, item.title, item.date])
};




// rebuild the database
const rebuildDatabase = async () => {
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
    // addRssItemDatabase({title: "lets try", link: "http://www.google.com", date: '1977'});
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
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCw7FkXsC00lH2v2yB5LQoYA',
        'https://xkcd.com/rss.xml',    
    ]

    FEED_LINKS.forEach(async (url) => {
        
        const parsedOurLinks = await linkParse(url)
        // console.log('whatDoWeHaveHere', parsedOurLinks);

        parsedOurLinks.forEach(async (rssObject) => {
            console.log('inside the parse, ', rssObject);
            await client.query(`
            INSERT INTO rss (url, title, date)
            VALUES ($1, $2, $3);
            `, [rssObject.link, rssObject.title, rssObject.date])
            });
    });
};


// start connection
client.connect().then(rebuildDatabase).then(buildDb).finally(() => client.end());

module.exports = {
    buildDb, 
    rebuildDatabase, 
};
