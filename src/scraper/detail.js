const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

async function scrapeDetail(slug) {
  const url = `${BASE_URL}/anime/${slug}/`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://google.com/",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const $ = cheerio.load(data);

  const thumbnail = $(".fotoanime img").attr("src") || null;

  const info = {};
  $(".infozingle p").each((i, el) => {
    const key = $(el).find("b").text().trim();
    const raw = $(el).text().trim();
    const value = raw.replace(`${key}:`, "").trim();
    info[key.toLowerCase()] = value;
  });

  const genre = [];
  $(".infozingle p span a").each((i, el) => {
    genre.push($(el).text().trim());
  });

  const sinopsis = $(".sinopc p").text().trim() || null;

  const episodes = [];
  $(".episodelist ul li").each((i, el) => {
    const title = $(el).find("a").text().trim();
    const link = $(el).find("a").attr("href") || null;
    const tanggal = $(el).find(".zeebr").text().trim();
    const slug = link.split("/episode/")[1]?.replace("/", "") || null;
    
    episodes.push({ title, link, tanggal, slug });
  });
  
  console.log(`[DETAIL] ${slug} → ${episodes.length} episode ditemukan`);

  return {
    slug,
    thumbnail,
    title: info["judul"] || null,
    japanese: info["japanese"] || null,
    score: info["skor"] || null,
    producer: info["produser"] || null,
    type: info["tipe"] || null,
    status: info["status"] || null,
    total_episode: info["total episode"] || null,
    duration: info["durasi"] || null,
    release_date: info["tanggal rilis"] || null,
    studio: info["studio"] || null,
    genre,
    sinopsis,
    episodes
  };
}

module.exports = { scrapeDetail };