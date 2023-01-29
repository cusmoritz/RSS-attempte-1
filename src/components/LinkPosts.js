import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsForLink } from "../api";

const LinkPosts = () => {
    
    const {linkSwitch} = useParams();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        gathering(linkSwitch);
    },[])

    const gathering = async(linkSwitch) => {
        const gettingPosts = await getPostsForLink(linkSwitch);
        setPosts(gettingPosts)
    }

    return (
        <div className="container">
            {!posts ? 
                (<p>There are no posts for this link.</p>) 
            : 
                (<div>
                {posts.map((post) => {
                    return (
                        <div key={post.id} className="post-container">
                            <h4>{post.title}</h4>
                            <p>Posted on: {post.date}</p>
                            {post.content ? <p dangerouslySetInnerHTML={{__html: post.content}}></p> : null }
                            <button><a href={`${post.url}`}>See original post.</a></button>
                        </div>
                    )
                })}
                </div>)}
        </div>
    )
}

export default LinkPosts;