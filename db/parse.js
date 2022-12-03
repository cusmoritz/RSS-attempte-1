let Parser = require('rss-parser');
let parser = new Parser();


// we need to get a new link into the parser from somewhere

const linkParse = async (link) => {

    // parseURL OR parseString
  let feed = await parser.parseURL(link);
  // console.log(feed);

  /* feed (for each item (below)) gives us 
    - creator
    - title
    - link
    - pubDate
    - isoDate
    ((((( for the ars technica staf--blogs link anyway )))))
  */

  feed.items.forEach(item => {
    return {title: item.title, link: item.link, date: item.isoDate, content: item.content }
  });
  
}; 

module.exports = {
  linkParse,

}

// 