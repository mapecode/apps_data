const scraper = require('google-play-scraper');
const fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({ sendHeaders: false });


const get_reviews = async (nextPaginationToken) => {
  let data = []

  const reviews = await scraper.reviews({
    appId: 'freeplay.crowdrun.com',
    sort: scraper.sort.RATING,
    nextPaginationToken,
  })

  reviews.data.map(review => data.push({
    text: review.text,
    score: review.score
  }))

  if (!!reviews.nextPaginationToken) get_reviews(reviews.nextPaginationToken)
  appendCsv(data)
}

const appendCsv = (data) => {
  writer = csvWriter({ sendHeaders: false });
  writer.pipe(fs.createWriteStream('android_out.csv', { flags: 'a' }));
  data.map(review => writer.write({
    header1: review.text,
    header2: review.score,
  }))
  writer.end();
}

(async () => {
  await get_reviews(null)
})();


