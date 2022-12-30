// this is the folder that will make our api calls

const BASE_URL = 'http://localhost:3000'; // wherever the db is hosted

// export const getNotLoggedInLinks = async => {
//     try {
//         const response = await fetch(`${BASE_URL}/api/today`);

//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }.then(result => result.json())
          
//     } catch (error) {
//         console.log('there was an error in getting notLoggedInLinks: ', error);
//         throw error;
//     }
// }

export const getAPILinks = async(token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/links`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }}).then(result => result.json())

          console.log('response in api', response)
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
        console.log('we got the links in api')
        return paresedLinks;
    } catch (error) {
        console.log('there was an error getting all the links from the API: ', error);
        throw error;
    }
}

export const updatePosts = async() => {
    try {
        const newPosts = await fetch(`${BASE_URL}/api/update`);
        const letsAddEm = await JSON.stringify(newPosts);
        console.log('we got some new ones? :', letsAddEm);
        if (letsAddEm.length < 1){
            return;
        }else {
            return letsAddEm;
        }
    } catch (error) {
        console.log('there was an error updating the posts in src/api: ', error);
        throw error;
    }
}