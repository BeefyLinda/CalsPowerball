const axios = require('axios');
const cheerio = require('cheerio');

async function fetchPowerballResults() {
  const url = 'https://www.powerball.com/previous-results';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const results = [];
  $('.d-flex.gap-3.flex-column .card').each((index, element) => {
    const date = $(element).find('.card-title').text().trim();
    const numbers = $(element).find('.game-ball-group .item-powerball')
                             .map((i, el) => parseInt($(el).text().trim()))
                             .get();
    results.push({ date, numbers });
  });

  return results;
}

module.exports = fetchPowerballResults;
