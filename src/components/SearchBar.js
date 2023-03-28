// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { searchPosts } from '../api';

const SearchBar = ({links, user}) => {

    const [search, setSearch] = useState("");

    const userSearchPosts = async () => {
        console.log('this was search: ', search);
        const searchResults = await searchPosts(search, user);
        // console.log('search results front: ', searchResults)
        // this might be an array if i did it right
        // make the call to the api here to find a post with the search term
        // using the users id (user)
        // and the search term
        
    };

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        userSearchPosts();
    }

    return (
        <div className="search-container">
            <form onSubmit={(event) => event.preventDefault()}>
                <input 
                    placeholder="Search posts" 
                    value={search} 
                    onChange={(event) => handleSearch(event.target.value) }></input>
            </form>
        </div>

    )
}

export default SearchBar;