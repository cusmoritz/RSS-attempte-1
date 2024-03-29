import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsForLink, saveAPost } from "../api";

const LinkPosts = ({user}) => {
    
    const {linkSwitch} = useParams();

    const [allPosts, setAllPosts] = useState([]);
    const [pagePosts, setPagePosts] = useState([])
    const [page, setPage] = useState(0);

    useEffect(() => {

        // fetch all the posts 
        const gathering = async(linkSwitch) => {
            setAllPosts(await getPostsForLink(linkSwitch));
        };

        gathering(linkSwitch);
    }, [])

    useEffect(() => {
        // // this sets our pagination from all the posts
        const setPostsOnPage = (page) => {
            const pageBegin = page*10;
            const pageEnd = (page*10)+10;
            const otherPagePosts = allPosts.slice(pageBegin, pageEnd);
            setPagePosts(otherPagePosts);
        };
        setPostsOnPage(page);
    }, [page, allPosts])

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

                    // build youtube links for each post to disply on the site
                    const embedURL = post.url.slice(32)

                    return (
                        <div key={post.id} className="post-container">
                            <h4>{post.title}</h4>
                            <p>Posted on: {post.date.slice(0, -14)}</p>
                            {post.content ? <p dangerouslySetInnerHTML={{__html: post.content}}></p> : null }
                            {!post.content 
                            ? 
                                <div className="iframe-container">
                                    <iframe src={`https://www.youtube.com/embed/${embedURL}`} title={post.title}>
                                    </iframe> 
                                </div>

                            : null}

                            <button><a href={`${post.url}`} target="_blank">See original post</a></button>
                            <button onClick={() => handleSave(post.id)}>Save Post</button>
                        </div>
                    )
                })}
            </div>)}
                {(page==0) ? null : (<button id="previous_button" onClick={() => setPage(page - 1)}>Page {page}</button>)}
                
                {pagePosts.length < 10 ? null : (<button id="next-button" onClick={() => setPage(page + 1)}>Page {page + 2}</button>)}
                
        </div>
    )
}

export default LinkPosts;