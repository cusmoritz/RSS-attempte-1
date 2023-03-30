// import everything
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { searchPosts } from '../api';

const SearchBar = ({links, user}) => {

    const [search, setSearch] = useState("");
    const [results, setResults] = useState();
    const [display, setDisplay] = useState();

    const userSearchPosts = async () => {
        console.log('this was search: ', search);
        const searchResults = await searchPosts(search, user);
        console.log('search results front: ', searchResults)
        // this might be an array if i did it right
        // make the call to the api here to find a post with the search term
        // using the users id (user)
        // and the search term
        setResults(searchResults);
        setNested();
        return searchResults;
    };

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        if (search !== "") {
            userSearchPosts();
        }
    }

    const setNested = () => {
        for (let i=0;i<results.length; i++) {
            setDisplay(results[i]);
        }
        console.log('display', display);
    }


    return (
        <div className="search-container">
            <form onSubmit={(event) => event.preventDefault()}>
                <input 
                    placeholder="Search posts" 
                    value={search} 
                    onChange={(event) => handleSearch(event.target.value) }></input>
            </form>
            {!display
            ? null
            : display.map((post) => {
                console.log('posts????', post)
                return(
                    <div className="search-results-container">
                        <div key={post.id} className="one-result">{post.title}</div>
                    </div>
                )
            })
            }
        </div>

    )
}

export default SearchBar;