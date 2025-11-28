const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

async function scrapeSearch(query) {
  const url = `${BASE_URL}/?s=${query}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  const results = [];

  $(".chivsrc li").each((i, el) => {
    let slug = null;
    const thumbnail = $(el).find("img").attr("src") || null;
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href") || null;

    if (!link || !link.includes("/anime/"))
    return;
    
    slug = link.split("/anime/")[1].replace("/", "")

    const genres = [];
    $(el).find(".set a").each((i2, g) => {
      genres.push($(g).text().trim());
    });

    results.push({
      thumbnail,
      title,
      slug,
      link,
      genres,
    });
  });
  
  console.log(`[SEARCH] Query "${query}" → ${results.length} hasil`)

  return results;
}

module.exports = { scrapeSearch };