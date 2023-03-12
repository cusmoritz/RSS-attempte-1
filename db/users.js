const {client} = require('./index');
const bcrypt = require('bcrypt');

// puts a new user into the database
const createNewUser = async (username, password, email, firstName, lastName) => {
    // console.log('this is our input from the get: ', username, password);
    try {
        const {rows: [user]} = await client.query(`
        INSERT INTO users (username, password, email, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        ;
        `, [username, password, email, firstName, lastName]);
        console.log('new user here: ', user);
        return (user);
    } catch (error) {
        throw new Error (error);
    } 
};

const fetchUserByUsername = async (username) => {
    try {
        // console.log('username? :', username)
        const {rows: [user]} = await client.query(`
        SELECT username FROM users
        WHERE username=$1
        ;
        `, [username]);
        // console.log('user in fetchUser', user)
        return user;
    } catch (error) {
        console.log('there was an error fetching a user: ', error);
        throw error;
    }
};

const fetchUserByEmail = async(email) => {
    try {
        const {rows: [user]} = await client.query(`
        SELECT email FROM users
        WHERE email=$1
        ;
        `, [email]);
        // console.log('user in fetchUser', user)
        return user;
    } catch (error) {
        throw error;
    }
}

const verifyUser = async(username, password) => {
    try {
        console.log('username, password', username, password);
        const {rows: [user]} = await client.query(`
        SELECT * FROM users
        WHERE username = $1
        ;    
        `, [username]);
        console.log('user in Verify user', user);
        const passCheck = await bcrypt.compare(password, user.password);
        console.log('passCheck', passCheck)
        if (passCheck === true){
            return user;
        } else {
            throw new Error ("Incorrect password");
        }
    } catch (error) {
        throw new Error (error);
    }
}

// const fetchUserWithPassword = async(username, password) => {
//     try {
//         const {rows: [user]} = await client.query(`
//         SELECT username, password from users
//         WHERE username = $1
//         ;
//         `, [username]);

//     } catch (error) {
//         throw new Error (error)
//     }
// }

module.exports={
    createNewUser,
    fetchUserByUsername,
    verifyUser,
    fetchUserByEmail,

}