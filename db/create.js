const {client} = require('./index.js')

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

// start connection
client.connect();

rebuildDatabase().then(() => {
    console.log('bye bye!')
    client.end();
});
