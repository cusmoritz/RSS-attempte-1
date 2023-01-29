// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getTodaysPosts } from '../api';

const TodaysPosts = () => {
    const [todayPosts, setTodayPosts] = useState([]);

    useEffect(() => {
        const gettingPosts = async() => {
            const fetchingPosts = await getTodaysPosts();
            setTodayPosts(fetchingPosts);
        }
        gettingPosts();
    }, [])
    console.log('today posts', todayPosts)
    return (
        <div className='container'>
        {todayPosts.length < 1 
        ? 
            (<div><h5>There are no posts from today.</h5></div>)
        :
            (todayPosts.map((post) => {
                return (
                    <div key={post.id}>
                    <h4>{post.title}</h4>
                    <p><a href={post.url}>{post.url}</a></p>
                    </div>
                )
            })) 
        }
        </div>
    )
}

export default TodaysPosts;