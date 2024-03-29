// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getTodaysPosts, saveAPost } from '../api';

const TodaysPosts = ({user}) => {
    const [todayPosts, setTodayPosts] = useState([]);

    const gettingPosts = async() => {
        const fetchingPosts = await getTodaysPosts(user);
        setTodayPosts(fetchingPosts);
    }

    useEffect(() => {
        gettingPosts();
    }, []);

    const handleSave = async (postId) => {
        const post = await saveAPost(postId, user);
        alert(`Post saved!`)
        return post;
    }
    return (
        <div className='container'>
        {todayPosts.length < 1 
        ? 
            (<div><h5>There are no posts from today.</h5></div>)
        :
            (todayPosts.map((post) => {
                const embedURL = post.url.slice(32)
                return (
                    <div key={post.id} className="todays-container">
                    <h4>{post.title}</h4>
                    {!post.content 
                        ? 
                        <div className="iframe-container">
                            <iframe src={`https://www.youtube.com/embed/${embedURL}`} title={post.title}>
                            </iframe> 
                        </div>
                        : null}
                    <p><a href={post.url} target="_blank">{post.url}</a></p>
                    <button onClick={() => handleSave(post.id)}>Save Post</button>
                    </div>
                )
            })) 
        }
        </div>
    )
}

export default TodaysPosts;