import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSaved, fetchOnePost } from "../api";

const SavedPosts = () => {
    const {userId} = useParams();
    const [savedPosts, setSavedPosts] = useState([])

    let postArray = [];

    const getSavedPosts = async () => {
        const gettingPosts = await fetchSaved(userId)
        setSavedPosts(gettingPosts)
        return;
    }

    useEffect(() => {
        getSavedPosts();
    },[])

    console.log('saved posts? ', savedPosts)

    return (
        <div className="container">
            {savedPosts 
            ? savedPosts.map((post) => {
                return(
                    <div className="post-container">
                    <p>Saved post #{savedPosts.length} {post.id}</p>
                    <h4>{post.title}</h4>
                    {post.content ? <p>{post.content}</p> : null}
                    <p><a>{post.url}</a></p>
                    <button>Unsave this post.</button>
                    </div>

                )
            }) 
            : 
            <p>You haven't added any feeds yet!</p> }
        </div>
    )
}

export default SavedPosts;