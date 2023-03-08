import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSaved, fetchOnePost, unsavePost} from "../api";

const SavedPosts = () => {
    const {userId} = useParams();
    const [savedPosts, setSavedPosts] = useState([])

    const getSavedPosts = async () => {
        const gettingPosts = await fetchSaved(userId)
        setSavedPosts(gettingPosts)
        console.log('saved posts', savedPosts)
        return;
    }

    const handleUnsave = async (postId) => {
        const noMorePost = await unsavePost(postId, userId);
        console.log('no more post: ', noMorePost) 
        getSavedPosts();
    }

    useEffect(() => {
        getSavedPosts();
    },[])
    
    return (
        <div className="container">
            {!savedPosts 
            ? 
            (<div>
                <p>You haven't saved any posts yet!</p>
            </div>)
            : 
            savedPosts.map((post) => {
                console.log('each post', post)
                return(
                    <div className="post-container" key={savedPosts.indexOf(post) + 1}>
                        <p>Saved post #{savedPosts.indexOf(post) + 1}</p>
                        <h4>{post.title}</h4>
                        {post.content ? <p dangerouslySetInnerHTML={{__html: post.content}}></p> : null }
                        <p><a>{post.url}</a></p>
                        <button onClick={() => {handleUnsave(post.post_id)}}>Unsave post</button>
                    </div>

                )
            })
            }
        </div>
    )
}

export default SavedPosts;