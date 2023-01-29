const {Client} = require('index.js');

// puts a new user into the database
const createNewUser = async (username, password) => {
    // console.log('this is our input from the get: ', username, password);
    try {
        const {rows: [user]} = await client.query(`
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING *
        ;
        `, [username, password]);
        console.log('new user here: ', user);
        return (user);
    } catch (error) {
        console.log('there was an error creating a new user: ', error);
        throw error;
    } 
};

module.exports={
    createNewUser,
    
}