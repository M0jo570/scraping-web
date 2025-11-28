const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeHome() {
  const url = "https://otakudesu.best/";
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  const result = [];

  $("div.venz ul li").each((i, el) => {
    const card = $(el);
    const link = card.find(".thumb a").attr("href");
    let slug = null;

    if (link && link.includes("/anime/")) {
      slug = link.split("/anime/")[1].replace("/", "");
    }

    result.push({
      title: card.find("h2.jdlflm").text().trim(),
      link,
      slug,
      thumbnail: card.find(".thumb img").attr("src"),
      episode: card.find(".epz").text().trim(),
      hari: card.find(".epztipe").text().trim(),
      tanggal: card.find(".newnime").text().trim()
    });
  });
  
  return result;
}

module.exports = { scrapeHome };