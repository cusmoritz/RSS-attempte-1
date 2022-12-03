const {client} = require('./index.js')
const { linkParse } = require('./parse.js')

// rebuild the database
rebuildDatabase = async () => {
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
        "website-name" text NOT NULL,
        url text NOT NULL,
        title text NOT NULL,
        publish_date INTEGER NOT NULL)
        ;
    `)
};

const buildDb = () => {
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
        // 'https://www.youtube.com/feeds/videos.xml?channel_id=UCw7FkXsC00lH2v2yB5LQoYA',
        'https://xkcd.com/rss.xml',

    
    ]

    FEED_LINKS.forEach(async (url) => {
        
        const whatDoWeHaveHere = await linkParse(url)
        console.log(whatDoWeHaveHere);
    });
    
};

// start connection
client.connect();

rebuildDatabase().then(() => {
    console.log('bye bye!')
    buildDb();
    client.end();
});


