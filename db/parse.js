let Parser = require('rss-parser');
let parser = new Parser();


// convert iso string into date format
const createDateFormat = (isoDate) => {
  const oldDate = new Date(isoDate);

  // get the year, month, and day
  const year = oldDate.getFullYear();
  const month = oldDate.getMonth() + 1;
  const day = oldDate.getDate();
  
  return `${year}-${month}-${day}`
}

const linkParse = async (link) => {

  // parseURL OR parseString
  let feed = await parser.parseURL(link);

  const linkArray = [];

  feed.items.map(item => {

    newDate = createDateFormat(item.isoDate)

      if (!item.content) {
        const youtubeLink = {
          title: item.title, 
          link: item.link, 
          date: newDate, 
        }
        linkArray.push(youtubeLink);
      } else {
        const eachItem = { 
          title: item.title, 
          link: item.link, 
          date: newDate, 
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