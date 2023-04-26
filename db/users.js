const {client} = require('./index');
const bcrypt = require('bcrypt');

// puts a new user into the database
const createNewUser = async (username, password, email, firstName, lastName) => {
    try {
        const {rows: [user]} = await client.query(`
        INSERT INTO users (username, password, email, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        ;
        `, [username, password, email, firstName, lastName]);
        return (user);
    } catch (error) {
        throw new Error (error);
    } 
};

const fetchUserByUsername = async (username) => {
    try {
        const {rows: [user]} = await client.query(`
        SELECT username FROM users
        WHERE username=$1
        ;
        `, [username]);
        if (!user) {
            return {message: "You did not type a valid username. Please try again.", error: "ValidationError"}
        } else {
            return user;
        }
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
        return user;
    } catch (error) {
        throw error;
    }
}

const verifyUser = async(username, password) => {
    try {
        const {rows: [user]} = await client.query(`
        SELECT * FROM users
        WHERE username = $1
        ;    
        `, [username]);
        if (!user) {
            return {message: "You did not type a valid username. Please try again.", error: "ValidationError"}
        } else {
            const passCheck = await bcrypt.compare(password, user.password);
            if (passCheck === true){
                return user;
            } else {
                return {message: "That is the incorrect password! Please try again.", error: "ValidationError"}
            }
        }
    } catch (error) {
        throw new Error (error);
    }
}

module.exports={
    createNewUser,
    fetchUserByUsername,
    verifyUser,
    fetchUserByEmail,

}