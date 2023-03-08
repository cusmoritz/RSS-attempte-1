import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsForLink, saveAPost } from "../api";

const LinkPosts = ({user}) => {
    
    const {linkSwitch} = useParams();

    const [allPosts, setAllPosts] = useState([]);
    const [pagePosts, setPagePosts] = useState([])
    const [page, setPage] = useState(0);

    useEffect(() => {
        console.log('one...', allPosts)

        // fetch all the posts 
        const gathering = async(linkSwitch) => {
            console.log('two....', allPosts)
            // const gettingPosts = await getPostsForLink(linkSwitch);
            // console.log('three...', allPosts);
            setAllPosts(await getPostsForLink(linkSwitch));
            console.log('four...', allPosts);

        };

        console.log('five...', allPosts);
        // this sets our pagination from all the posts
        const setPostsOnPage = (page) => {
            console.log('six...', allPosts)
            const pageBegin = page*10;
            const pageEnd = (page*10)+10;
            console.log('seven...', allPosts)
            const otherPagePosts = allPosts.slice(pageBegin, pageEnd);
            console.log('eight...', allPosts)
            setPagePosts(otherPagePosts);
        }

        console.log('nine...', allPosts);
        gathering(linkSwitch);

        setPostsOnPage(page);

    },[])

    const handleSave = async (postId) => {
        const post = await saveAPost(postId, user);
        return post;
    }

    return (

        <div className="container">
            {!pagePosts ? 
                (<p>There are no posts for this link.</p>) 
            : 
                (<div>
                {pagePosts.map((post) => {

                    return (
                        <div key={post.id} className="post-container">
                            <h4>{post.title}</h4>
                            <p>Posted on: {post.date.slice(0, -14)}</p>
                            {post.content ? <p dangerouslySetInnerHTML={{__html: post.content}}></p> : null }
                            <button><a href={`${post.url}`} target="_blank">See original post.</a></button>
                            <button onClick={() => handleSave(post.id)}>Save Post</button>
                        </div>
                    )
                })}
            </div>)}
                {/* <button onClick={() => setPage(page +1)}>Next Page</button> */}
        </div>
    )
}

export default LinkPosts;