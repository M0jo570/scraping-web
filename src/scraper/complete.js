const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

async function scrapeComplete(page = 1) {
  const url = `${BASE_URL}/complete-anime/page/${page}/`;

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const results = [];

  $(".venz ul li .detpost").each((i, el) => {
    const link = $(el).find(".thumb a").attr("href");
    let slug = null;

    if (link && link.includes("/anime/")) {
      slug = link.split("/anime/")[1].replace("/", "");
    }

    results.push({
      title: $(el).find(".jdlflm").text().trim(),
      link,
      slug,
      thumbnail: $(el).find(".thumbz img").attr("src"),
      episode: $(el).find(".epz").text().trim(),
      rating: $(el).find(".epztipe").text().trim(),
      tanggal: $(el).find(".newnime").text().trim(),
    });
  });
  
  console.log(`[COMPLETE] page ${page} → ${results.length} anime ditemukan`);

  return results;
}

module.exports = { scrapeComplete };