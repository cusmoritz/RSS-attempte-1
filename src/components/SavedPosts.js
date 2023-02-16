import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSaved, fetchOnePost } from "../api";

const SavedPosts = () => {
    const {userId} = useParams();
    const [savedPosts, setSavedPosts] = useState([])

    const getSavedPosts = async () => {
        const gettingPosts = await fetchSaved(userId)
        setSavedPosts(gettingPosts)
        return;
    }

    const handleUnsave = () => {
        console.log('you are unsaving a post.')
    }

    useEffect(() => {
        getSavedPosts();
    },[])

    return (
        <div className="container">
            {savedPosts 
            ? savedPosts.map((post) => {
                return(
                    <div className="post-container" key={savedPosts.indexOf(post) + 1}>
                    <p>Saved post #{savedPosts.indexOf(post) + 1}</p>
                    <h4>{post.title}</h4>
                    {post.content ? <p dangerouslySetInnerHTML={{__html: post.content}}></p> : null }
                    <p><a>{post.url}</a></p>
                    <button onClick={() => {handleUnsave()}}>Unsave post {savedPosts.indexOf(post) + 1}</button>
                    </div>

                )
            }) 
            : 
            <p>You haven't added any feeds yet!</p> }
        </div>
    )
}

export default SavedPosts;