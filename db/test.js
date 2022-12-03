let Parser = require('rss-parser');
let parser = new Parser();

(async () => {

    // parseURL OR parseString
  let feed = await parser.parseURL('https://feeds.arstechnica.com/arstechnica/staff-blogs');
  console.log(feed);

  /* feed (for each item (below)) gives us 
    - creator
    - title
    - link
    - pubDate
    - isoDate
    ((((( for the ars technica staf--blogs link anyway )))))
  */

  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link + ':' + item.isoDate)
  });

})();