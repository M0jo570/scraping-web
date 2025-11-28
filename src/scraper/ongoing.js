const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeOngoing(page = 1) {
  const url = `https://otakudesu.best/ongoing-anime/page/${page}/`;

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let result = [];

  $(".venz ul li .detpost").each((i, el) => {
    const link = $(el).find(".thumb a").attr("href");
    let slug = null;

    if (link && link.includes("/anime/")) {
      slug = link.split("/anime/")[1].replace("/", "");
    }

    result.push({
      title: $(el).find(".thumb .jdlflm").text().trim(),
      link,
      slug,
      thumbnail: $(el).find(".thumb img").attr("src"),
      episode: $(el).find(".epz").text().trim(),
      hari: $(el).find(".epztipe").text().trim(),
      tanggal: $(el).find(".newnime").text().trim(),
    });
  });
  
  console.log(`[ONGOING] page ${page} → ${result.length} anime`);
  
  return result;
}

module.exports = scrapeOngoing;