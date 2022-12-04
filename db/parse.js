let Parser = require('rss-parser');
let parser = new Parser();

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

  const linkArray = [];

  feed.items.map(item => {

    // console.log('each item here', item);
    // console.log('checking the date, ', item.date)

      if (!item.content) {
        const youtubeLink = {
          title: item.title, 
          link: item.link, 
          date: item.isoDate, 
        }
        linkArray.push(youtubeLink);
      } else {
        const eachItem = { 
          title: item.title, 
          link: item.link, 
          date: item.isoDate, 
          content: item.content 
        };
        linkArray.push(eachItem)
      }
    
  });
  return linkArray;
}; 

module.exports = {
  linkParse,
}

// 