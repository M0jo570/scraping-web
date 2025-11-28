const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

async function scrapeEpisode(slug) {
  try {
    const url = `${BASE_URL}/episode/${slug}/`;
    
    console.log("[EPISODE] Fetching:", url);

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    // TITLE
    const title = $(".posttl").text().trim() || null;
    console.log("[EPISODE] Title:", title);

    // ALL EPISODES DROPDOWN
    const allEpisodes = [];
    $("#selectcog option").each((i, el) => {
      const epTitle = $(el).text().trim();
      const epUrl = $(el).attr("value");

      if (epUrl && epUrl !== "0") {
        allEpisodes.push({
          title: epTitle,
          url: epUrl,
        });
      }
    });

    console.log("[EPISODE] Total episodes found:", allEpisodes.length);

    // NEXT & PREVIOUS
    const next = $(".prevnext .flir a[title='Episode Selanjutnya']").attr("href") || null;
    const prev = $(".prevnext .flir a[title='Episode Sebelumnya']").attr("href") || null;

    console.log("[EPISODE] Next:", next);
    console.log("[EPISODE] Prev:", prev);

    // STREAMING MIRRORS
    const streaming = [];
    $(".mirrorstream ul").each((i, ul) => {
      const quality = $(ul).attr("class");
      const readableQuality = quality?.replace("m", "") || null;

      const mirrors = [];
      $(ul).find("li a").each((j, a) => {
        const host = $(a).text().trim();
        const dataContent = $(a).attr("data-content") || null;

        if (dataContent) {
          mirrors.push({ host, data: dataContent });
        }
      });

      streaming.push({
        quality: readableQuality,
        mirrors
      });

      console.log(`[STREAM] ${readableQuality}: ${mirrors.length} mirrors`);
    });

    // DOWNLOAD LINKS
    const download = [];
    $(".download > ul").each((i, ul) => {
      const qualityRaw = $(ul).find("strong").first().text().trim();
      const size = $(ul).find("i").text().trim() || null;

      const links = [];

      $(ul).find("a").each((j, a) => {
        const host = $(a).text().trim();
        const link = $(a).attr("href");

        if (link) {
          links.push({ host, url: link });
        }
      });

      download.push({
        quality: qualityRaw,
        size,
        links
      });

      console.log(`[DOWNLOAD] ${qualityRaw} (${size}) →`, links.length, "links");
    });

    console.log("[EPISODE] DONE scraping!\n");

    return {
      status: true,
      title,
      episode: {
        current: title,
        next,
        previous: prev,
        all_episodes: allEpisodes,
      },
      streaming,
      download
    };

  } catch (err) {
    console.log("[EPISODE] ERROR:", err.message);
    return {
      status: false,
      error: err.message
    };
  }
}

module.exports = { scrapeEpisode };