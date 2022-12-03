// get client for postgres
const {Client} = require('pg');
//either local host or a PORT when deploying
const client = new Client('postgres://localhost:5432/rss-feed')


// rebuild the database
rebuildDatabase = async () => {
    
    // drop the tables
    await client.query(`
    DROP TABLE IF EXISTS rss
    ;
    `);

    // create the tables
    await client.query(`
    CREATE TABLE IF NOT EXISTS rss (
        id SERIAL PRIMARY KEY,
        "website-name" text NOT NULL,
        url text NOT NULL,
        title text NOT NULL,
        date INTEGER NOT NULL)
        ;
    `)
};

// start connection
client.connect();

rebuildDatabase().then(() => {
    client.end();
});
