import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsForLink } from "../api";

const LinkPosts = () => {
// localhost:3000/< linkId here >/posts
// console.log('linkSwitch', linkSwitch)
    const {linkSwitch} = useParams();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        gathering(linkSwitch);
    },[])

    const gathering = async(linkSwitch) => {
        const gettingPosts = await getPostsForLink(linkSwitch);
        console.log('getting posts: ', gettingPosts)
        setPosts(gettingPosts)
    }

    return (
        <div>
            {!posts ? 
                (<p>There are no posts for this link.</p>) 
            : 
                (<div>
                {posts.map((post) => {
                    return (
                        <div key={post.id}>
                            <h4>{post.title}</h4>
                            <p><a href={`${post.url}`}>{post.url}</a></p>
                            <p>Posted on: {post.date}</p>
                        </div>
                    )
                })}
                </div>)}
        </div>
    )
}

export default LinkPosts;