import React, { useEffect, useState } from "react";
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
        // console.log('posts? ', gettingPosts)
        // const date = new Date().getTime();
        // const sortedPosts = gettingPosts.sort(function(date, b){return b > date});
        // // get today's date, sort by posts that are less than todays date?

        // console.log(date, sortedPosts)
        setPosts(gettingPosts)
    }

    // return <div dangerouslySetInnerHTML={createMarkup()} />;
    // dangerouslySetInnerHTML={{__html: data}}

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
                            <p><a href={`${post.url}`}>See original post.</a></p>
                        </div>
                    )
                })}
                </div>)}
        </div>
    )
}

export default LinkPosts;