// import everything
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getTodaysPosts } from '../api';

const TodaysPosts = () => {
    const [todayPosts, setTodayPosts] = useState([]);

    useEffect(() => {
        const gettingPosts = async() => {
            // console.log('getting today posts');
            const fetchingPosts = await getTodaysPosts();
            // console.log('today posts might be here: ', fetchingPosts);
            setTodayPosts(fetchingPosts);
        }
        gettingPosts();
    }, [])

    return (
        <>
        {todayPosts 
        ? 
        (todayPosts.map((post) => {
            return (
                <div key={post.id}>
                <h4>{post.title}</h4>
                <p><a href={post.url}>{post.url}</a></p>
                </div>
            )
        })) 
        :
        (<p>There are no posts from today</p>)}
        </>
    )
}

export default TodaysPosts;