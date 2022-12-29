// this is the folder that will make our api calls

const BASE_URL = 'http://localhost:3001'; // wherever the db is hosted

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