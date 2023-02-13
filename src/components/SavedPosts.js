import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSaved, fetchOnePost } from "../api";

const SavedPosts = () => {
    const {userId} = useParams();
    const [savedPosts, setSavedPosts] = useState([])

    const getSavedPosts = async () => {
        const gettingPosts = await fetchSaved(userId)
        // console.log('gettingposts', gettingPosts)
        let postArray = [];
        gettingPosts.forEach(async (element) => {
            const onePost = await fetchOnePost(element.post_id);
            // console.log('onePost', onePost)
            postArray.push(onePost);
            // console.log('post array', postArray);
        });
        setSavedPosts(postArray);
        return;
    }

    useEffect(() => {
        getSavedPosts();
    },[userId])

    console.log('saved posts? ', savedPosts)

    return (
        
        <div>
            {savedPosts 
            ? savedPosts.map((post) => {
                return (
                    <div>
                        <h4>{post.title}</h4>
                        <p>{post.url}</p>
                    </div>

                )
            }) 
            : 
            (<p>You haven't added any feeds yet!</p>) }
        </div>
    )
}

export default SavedPosts;