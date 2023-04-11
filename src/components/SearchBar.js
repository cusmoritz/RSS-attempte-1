// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { searchPosts } from '../api';
import { Link } from 'react-router-dom';
import { saveAPost, fetchPostsByDate } from '../api';

const SearchBar = ({links, user}) => {

    const [search, setSearch] = useState("");
    const [display, setDisplay] = useState([]);
    const [dateSearch, setDateSearch] = useState(Number);
    const [dateResults, setDateResults] = useState([]);

    const userSearchPosts = async () => {
        const searchResults = await searchPosts(search, user);
        setDisplay([]); // usestate for rendering
        for (let i=0;i<searchResults.length; i++) { // arr of arr
            for (let j=0; j<searchResults[i].length; j++){ // inside nested arr
                setDisplay((previous) => [...previous, searchResults[i][j]]) // for each object, add it to the display arr
            }
        }
        return searchResults;
    };

    const handleDateSearch = async () => {
        const returnPosts = await fetchPostsByDate(dateSearch, user);
        setDateResults([]);
        for (let i=0;i<returnPosts.length; i++) { // arr of arr
            for (let j=0; j<returnPosts[i].length; j++){ // inside nested arr
                setDateResults((previous) => [...previous, returnPosts[i][j]]) // for each object, add it to the display arr
            }
        }
        console.log('return posts? ', returnPosts);
        return returnPosts;
    }

    const handleSave = async (postId) => {
        const post = await saveAPost(postId, user);
        return post;
    }

    useEffect(() => {
        if (search !== "") {
            userSearchPosts(search)
        } else {
            setDisplay([])
        }
    }, [search])

    return (
        <div className="container search-bar">
            <form onSubmit={(event) => event.preventDefault()}>
                <input 
                    className="search-field"
                    placeholder="Search post titles" 
                    value={search} 
                    onChange={(event) => setSearch(event.target.value) }></input>
            </form>
            <form className="date-search-form" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="date-search">Search for posts by date: </label>
                <input 
                    className="date-search" 
                    type="date" 
                    value={dateSearch} 
                    onChange={(event) => setDateSearch(event.target.value)}></input>
                <button onClick={handleDateSearch}>Search</button>
                <p>{dateSearch}</p>
            </form>
            {!display
            ? (
                null
                // <div className="search-container">
                //     <div>
                //         <div className="search-results-container">
                //             <p className="one-result">No search results!</p>
                //         </div> 
                //     </div>   
                // </div>
            )
            : (
              <div className="search-container">
                {display.map((post) => {
                    return (
                        <div className="search-results-container" key={post.id}>
                            <p className="one-result"><a href={post.url} target="_blank">{post.title}</a></p>
                            <button onClick={() => handleSave(post.id)}>Save post</button>
                        </div>
                    )
                })}
              </div>  
              
            ) 
            }
            {!dateResults
            ? (
                null
                // <div className="search-container">
                //     <div>
                //         <div className="search-results-container">
                //             <p className="one-result">No search results!</p>
                //         </div> 
                //     </div>   
                // </div>
            )
            : (
              <div className="search-container">
                {dateResults.map((post) => {
                    return (
                        <div className="search-results-container" key={post.id}>
                            <p className="one-result"><a href={post.url} target="_blank">{post.title}</a></p>
                            <button onClick={() => handleSave(post.id)}>Save post</button>
                        </div>
                    )
                })}
              </div>  
              
            ) 
            }
        </div>

    )
}

export default SearchBar;