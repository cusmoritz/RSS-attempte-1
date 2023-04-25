# RSS-attempte-1

This website is a bare-ish bones RSS feed reader.

It's an attempt at creating my own news feed. 

https://user-images.githubusercontent.com/109768964/232326301-4aad50eb-77d9-4f18-bf60-e78910239fcb.mov

I haven't enjoyed using many social media sites recently, but that's where I happen to get all my news. I decided to create my own loophole.

So I created this to find my own news and subscribe to creators that I applaud and enjoy. 

It's built and designed to take an RSS / XML link, parse them into JSON, and serve it back to the user. 

You have the ability to "Save a story" for reading later.

The sign up is strictly used to save an individual user's posts and links to their associated sign-up email and username. 

It doesn't currently have the ability to check for a link that ISN'T an RSS / XML link ... so please check the link before you add it to make sure that it's actually an RSS link.

This website is built in React on the front-end, Express.JS for server and API calls, and PostrgeSQL for the backend database. 

It's fun to be in charge of my own news again.

## For forking this repo:

`npm i`
to instal dependancies. Those include: 
- bcrypt
- cors
- dotenv
- express
- jsonwebtoken
- morgan
- nodemon
- pg
- postgrator-cli
- react
- react-dom
- react-router-dom
- react-scripts
- rss-parser

Most notable is Express for the server and API, PostgreSQL for the database, React for the front end, and the small but important rss-parser for handling the XML files.

`npm run db:build`
will run node to create the tables for the database.

`npm run api:test`
will run node to turn on the server.

`npm run dev:start`
runs the react scripts to load up the front end.


## TODO:
- [ ] Deploy database on the cloud to make sure updates run.
- [ ] Deploy application.
- [ ] Remove 'Update posts' button after deploying.
- [ ] Possibly add 'Deactivate account' option for users.
- [ ] Possibly add the ability to change the title of a link.
- [ ] Possibly add the ability to check for a legitimate XML file when adding a new link.
- [ ] Change navigation bar responsiveness for smaller screens to change to a sandwich menu.
- [ ] Find willing users.
- [ ] Contact the media.

