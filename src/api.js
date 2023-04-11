// this is the folder that will make our api calls

// import { client } from "../db";

const BASE_URL = 'http://localhost:3000'; // wherever the db is hosted

// export const getAPILinks = async(token) => {
//     try {
//         const response = await fetch(`${BASE_URL}/api/links`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }}).then(result => result.json())

//         //   console.log('response in api', response)
//         return response;
//     } catch (error) {
//         console.log('there was an error fetching all links: ' , error);
//         throw error;
//     }
// };

// export const callAPIForLinks = async() => {
//     try {
//         const links = await fetch(`${BASE_URL}/api/links`)
//         const paresedLinks = await links.json();
//         // console.log('we got the links in api')
//         return paresedLinks;
//     } catch (error) {
//         console.log('there was an error getting all the links from the API: ', error);
//         throw error;
//     }
// }

export const getAllLinksByUserId = async(userId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/manage/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const everyUserLink = await response.json();
        return everyUserLink;
    } catch (error) {
        throw error;
    }
}

export const getActiveLinksByUserId = async(userId, token) => {
    try {
        const links = await fetch(`${BASE_URL}/api/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const userLinks = await links.json();
        return userLinks;
    } catch (error) {
        throw new Error (error);
    }
}

export const updatePosts = async() => {
    try {
        const newPosts = await fetch(`${BASE_URL}/api/update`, {
            method: "POST"
        });
        alert('Posts updated!')
    } catch (error) {
        console.log('there was an error updating the posts in src/api: ', error);
        throw error;
    }
}

export const getTodaysPosts = async() => {
    try {
        const response = await fetch(`${BASE_URL}/api/today`);
        const todaysPosts = await response.json();
        return todaysPosts;
    } catch (error) {
        console.log('there was a problem getting todays posts in src/api: ', error);
        throw error;
    }
};

export const saveAPost = async(postId, userId) => {
    try {
        const result = await fetch(`${BASE_URL}/api/posts/saved/${postId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
            })
        });
        const savedPost = result.json();
        return savedPost;
    } catch (error) {
        console.log('there was an error in user api trying to save a post');
        throw error;
    }
}

export const unsavePost = async (postId, userId) => {
    // 'api/posts/unsave/:postId'
    try {
        const result = await fetch(`${BASE_URL}/api/posts/unsave/${postId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
            }),
        });
        const unsavedPost = await result.json();
        return unsavedPost;
    } catch (error) {
        console.log('error in user api');
        throw error;
    }
}

export const fetchOnePost = async(postId) => {
    try {
        const result = await fetch(`${BASE_URL}/api/posts/${postId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const saved = await result.json();
        return saved;
    } catch (error) {
        throw error;
    }
}

export const fetchSaved = async(userId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/saved/${userId}`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const savedPosts = response.json();
        return savedPosts;
    } catch (error) {
        console.log('there was an error fetching saved posts user side', error);
        throw error;
    }
}

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
export const createNewLink = async(linkURL, linkName, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/newlink`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "newLink": {
                    "link": linkURL,
                    "name": linkName 
                },
                "userId": userId
            })
        });
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

export const reactivateLink = async(linkId) => {
    try {
        const response = fetch(`${BASE_URL}/api/reactivate/${linkId}`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const userRegister = async(username, password, email, firstName, lastName) => {
    try {
        const result = await fetch(`${BASE_URL}/api/sign-up`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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
            localStorage.setItem("token", newUser.token);
            return newUser;
        }
    } catch (error) {
        console.log('there was an error registering a new user in src/api: ', error);
        throw error;
    }
}

// /api/login
export const userLogin = async (username, password) => {
    try {
        const result = await fetch(`${BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        if (result.message) {
            throw result.error;
        } else {
            const userLoggedIn = await result.json();
            return userLoggedIn;
        }
    } catch (error) {
        throw new Error (error);
    }
}

export const userCheck = async (token) => {
    try {
        const isThereUser = await fetch(`${BASE_URL}/api/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const user = isThereUser.json();
        return user;
    } catch (error) {
        throw error;
    }
}

export const searchPosts = async (term, user) => {
    try {
        const result = await fetch(`${BASE_URL}/api/search/${term}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'user': `${user}`
            }
        });
        const searchResults = await result.json();
        return searchResults;
    } catch (error) {
        throw error;
    }
}