const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

async function scrapeAnimeList() {
  const url = `${BASE_URL}/anime-list/`;
  
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  
  const $ = cheerio.load(data);
  const results = [];
  
  $(".bariskelom").each((i, section) => {
    $(section).find("ul li").each((j, el) => {
      const link = $(el).find("a").attr("href");
      const title = $(el).find("a").text().trim();
      
      if (!link || !title) return;
      
      const slug = link.split("/anime/")[1]?.replace("/", "") || null;
      
      results.push({
        title,
        slug,
        link,
      });
    });
  });
  


  return results;
  
}

module.exports = { scrapeAnimeList };