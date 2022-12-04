// doing it one level up to stop getting those problems

const { buildDb, rebuildDatabase } = require('./db/create.js');


rebuildDatabase();

buildDb();



