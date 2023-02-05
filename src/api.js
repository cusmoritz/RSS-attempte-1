// this is the folder that will make our api calls

const BASE_URL = 'http://localhost:3000'; // wherever the db is hosted

export const getAPILinks = async(token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/links`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }}).then(result => result.json())

        //   console.log('response in api', response)
        return response;
    } catch (error) {
        console.log('there was an error fetching all links: ' , error);
        throw error;
    }
};

export const callAPIForLinks = async() => {
    try {
        const links = await fetch(`${BASE_URL}/api/links`)
        const paresedLinks = await links.json();
        // console.log('we got the links in api')
        return paresedLinks;
    } catch (error) {
        console.log('there was an error getting all the links from the API: ', error);
        throw error;
    }
}

export const updatePosts = async() => {
    try {
        const newPosts = await fetch(`${BASE_URL}/api/update`, {
            method: "POST"
        });
        const letsAddEm = await newPosts.json();
        console.log('lets add em: ', letsAddEm)
        // return how many posts we updated?
        alert('Posts updated!')
    } catch (error) {
        console.log('there was an error updating the posts in src/api: ', error);
        throw error;
    }
}

export const getTodaysPosts = async() => {
    try {
        const response = await fetch(`${BASE_URL}/api/today`);
        // console.log('response in api', response)
        const todaysPosts = await response.json();
        // console.log('todays posts in src/api: ', todaysPosts);
        return todaysPosts;
    } catch (error) {
        console.log('there was a problem getting todays posts in src/api: ', error);
        throw error;
    }
};

export const getPostsForLink = async(linkId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/links/${linkId}`);
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.log('there was an error fetching posts for each link: ', error);
        throw error;
    }
};

// '/api/links/new'
export const createNewLink = async(linkURL, linkName) => {
    try {
        const response = await fetch(`${BASE_URL}/api/newlink`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": linkName,
                "link": linkURL
            })
        });
        // console.log('we are trying to add a link: ', response);
        const newLink = response.json();
        return newLink;
    } catch (error) {
        console.log('there was an error creating a new link: ', error);
        throw error;
    }
}

// api/deactivate/:linkId
export const deactivateLink = async(linkId) => {
    try {
        // console.log('working in front end: ', linkId)
        const response = fetch(`${BASE_URL}/api/deactivate/${linkId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.log('there was an error deactivating a link in src/api: ', error);
        throw error;
    }
}

export const checkUserName = async(username) => {
    try {
        const result = await fetch(`${BASE_URL}/api`)
    } catch (error) {
        throw new Error('That username is already taken, try again.');
    }
}

export const userRegister = async(username, password, email, firstName, lastName) => {
    try {
        const result = await fetch(`${BASE_URL}/api/sign-up`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:username,
                password:password,
                email:email,
                firstName:firstName,
                lastName:lastName
            })
        });
        if (result.error) {
            return error;
        } else {
            const newUser = await result.json();
            console.log('new user in front end', newUser)
            return newUser;
        }
    } catch (error) {
        console.log('there was an error registering a new user in src/api: ', error);
        throw error;
    }
}