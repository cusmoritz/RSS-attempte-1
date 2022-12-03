// get client for postgres
const {Client} = require('pg');
// use process.env or postgres
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/rss-feed';
//either local host or a PORT when deploying
const client = new Client(DATABASE_URL)








module.exports = {
    client,

}