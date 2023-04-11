# RSS-attempte-1

This website is a bare-ish bones RSS feed reader.

It's an attempt at creating my own news feed, after Twitter had a change in management circa 2022. 

I personally don't enjoy Facebook; Reddit is too much to take in at once; Instagram is for people who are much prettier than I am; MySpace has gone the way of the dinosaur; and every other social media site I can think of either buries the content you subscribe to among ads and "You might be interested in" content. 

So I created this to find my own news and subscribe to creators that I applaud and enjoy. 

It's built and designed to take an RSS / XML link, parse them into JSON, and serve it back to the user. 

You have the ability to "Save a story" for reading later.

The sign up is strictly used to save an individual user's posts and links to their associated sign-up email and username. 

It doesn't currently have the ability to check for a link that ISN'T an RSS / XML link ... so please check the link before you add it to make sure that it's actually an RSS link.

This website is built in React on the front-end, Express.JS for API calls, and PostrgeSQL for the backend database. 

It's quite robust, I think. And fun to be in charge of my own news again.