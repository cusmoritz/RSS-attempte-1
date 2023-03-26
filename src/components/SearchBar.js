// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const SearchBar = ({links, user}) => {

    const [search, setSearch] = useState("");

    const searchPosts = async () => {
        console.log('this was search: ', search)
        // make the call to the api here to find a post with the search term
        // using the users id (user)
        // and the search term
    };

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        searchPosts();
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