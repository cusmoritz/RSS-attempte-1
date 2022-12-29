// Require the Client constructor from the pg package
const { Client, Pool } = require('pg');
// Create a constant, CONNECTION_STRING, from either process.env.DATABASE_URL or postgres://localhost:5432/phenomena-dev
const CONNECTION_STRING = process.env.DATABASE_URL || "postgres://localhost:5432/rss-feed";
// Create the client using new Client(CONNECTION_STRING)

const client = new Client(CONNECTION_STRING);

module.exports = {
    client, 
}