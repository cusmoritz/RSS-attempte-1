// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { searchPosts } from '../api';
import { Link } from 'react-router-dom';

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

    // useEffect(() => {
        // if (search !== "") {
        //     setSearch(search)
        // }
    //     setSearch(search)
    // }, search)

    const setNested = () => {
        for (let i=0;i<results.length; i++) {
            setDisplay(results[i]);
        }
        console.log('display', display);
    }


    return (
        <div className="container">
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
                    <div className="search-container">
                        <div className="search-results-container">
                            <p key={post.id} className="one-result"><a href={post.url} target="_blank">{post.title}</a></p>
                            <button>Save post</button>
                        </div>
                    </div>
                )
            })
            }
        </div>

    )
}

export default SearchBar;