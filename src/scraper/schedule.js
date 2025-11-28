const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

function extractSlug(detailUrl) {
  if (!detailUrl) return null;
  
  const parts = detailUrl.split("/").filter(Boolean);
  return parts.pop() || null;
}

async function scrapeSchedule() {
  try {
    const url = `${BASE_URL}/jadwal-rilis/`;
    console.log("[SCHEDULE] fetching:", url);
    
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    
    const $ = cheerio.load(data);
    const days = [];
    
    $(".kglist321").each((i, el) => {
      const dayName = $(el).find("h2").text().trim();
      
      const anime = [];
      
      $(el)
      .find("ul li a")
      .each((j, a) => {
        const title = $(a).text().trim();
        const detail_url = $(a).attr("href");
        const slug = extractSlug(detail_url);
        
        anime.push({
          title,
          slug,
          detail_url,
        });
      });
      
      days.push({
        day: dayName,
        total: anime.length,
        anime,
      });
    });
    console.log("[SCHEDULE TOTAL DAYS]:", days.length);
    return {
      status: true,
      total_days: days.length,
      data: days,
    };
  } catch(err) {
    console.log("[SCHEDULE EROR]:", err.message);
    return {
      status: false,
      eror: err.message,
    };
  }
}

module.exports = { scrapeSchedule };