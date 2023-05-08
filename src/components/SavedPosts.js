import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSaved, fetchOnePost, unsavePost} from "../api";

const SavedPosts = () => {
    const {userId} = useParams();
    const [savedPosts, setSavedPosts] = useState([])

    const getSavedPosts = async () => {
        const gettingPosts = await fetchSaved(userId)
        setSavedPosts(gettingPosts)
        return;
    }

    const handleUnsave = async (postId) => {
        const noMorePost = await unsavePost(postId, userId);
        getSavedPosts();
    }

    useEffect(() => {
        getSavedPosts();
    },[])
    
    return (
        <div className="container">
            {(savedPosts.length < 1 ) 
            ? 
            (<div>
                <h5>You haven't saved any posts yet!</h5>
            </div>)
            : 
            savedPosts.map((post) => {
                const embedURL = post.url.slice(32)

                return(
                    <div className="post-container" key={savedPosts.indexOf(post) + 1}>
                        <p>Saved post #{savedPosts.indexOf(post) + 1}</p>
                        <h4>{post.title}</h4>
                        {post.content 
                        ? <p dangerouslySetInnerHTML={{__html: post.content}}></p> 
                        : 
                            <div className="iframe-container">
                                <iframe src={`https://www.youtube.com/embed/${embedURL}`} title={post.title}>
                                </iframe> 
                            </div>
                        }
                        <p><a href={post.url} target="_blank">See original post.</a></p>
                        <button onClick={() => {handleUnsave(post.post_id)}}>Unsave post</button>
                    </div>

                )
            })
            }
        </div>
    )
}

export default SavedPosts;