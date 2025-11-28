const axios = require("axios");
const cheerio = require("cheerio");
const { BASE_URL } = require("../config");

function normalizeUrl(href) {
  if (!href) return null;
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href}`;
}

function extractPageNumber(href) {
  if (!href) return null;
  const match = href.match(/page\/(\d+)\//);
  
  return match ? Number(match[1]) : null;
}

async function scrapeGenreList() {
  try {
    const url = `${BASE_URL}/genre-list/`;
    
    console.log("[GENRE LIST FETCHING]:", url)
    
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    
    const $ = cheerio.load(data);
    const genres = [];
    
    $(".genres li a").each((i, el) => {
      const name = $(el).text().trim();
      const path = $(el).attr("href");
      
      if (name && path) {
        const cleanSlug = path
        .replace("/genres/", "")
        .replace(/\//g, "")
        .trim();
        
        genres.push({
          name,
          slug:
          cleanSlug,
          path,
          
          url: normalizeUrl(path),
        });
      }
    });
    
    console.log(`[GENRE LIST] total genre found: ${genres.length}`);
    
    return {
      status: true,
      total: genres.length,
      data: genres,
    };
    
  } catch(err) {
    console.log("[GENRE LIST EROR]:", err.message);
    return {
      status: false,
      eror: err.message,
    };
  }
}


async function scrapeGenreContent(slug, page = 1) {
  try {
    const url = `${BASE_URL}/genres/${slug}/page/${page}/`;
    console.log("[GENRE CONTENT] fetching:", url);
    
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0"}
    });
    
    const $ = cheerio.load(data);
    const result = [];
    
    $(".col-anime-con").each((i, el) => {
      
      const title = $(el).find(".col-anime-title a").text().trim();
      const detail_url = $(el).find(".col-anime-title a").attr("href");
      
      let slug = null;
      if (detail_url) {
        const parts = detail_url.split("/").filter(Boolean);
        slug = parts.pop();
      }
      
      const studio = $(el).find(".col-anime-studio").text().trim() || null;
      const eps = $(el).find(".col-anime-eps").text().trim() || null;
      const ratingRaw = $(el).find(".col-anime-rating").text().trim();
      const rating = ratingRaw === "" ? null : ratingRaw;
      
      
      const genres = [];
      $(el).find(".col-anime-genre a")
      .each((i, g) => {
        genres.push($(g).text().trim());
      });
      
      const poster = $(el).find(".col-anime-cover img").attr("src") || null;
      const season = $(el).find(".col-anime-date").text().trim() || null;
      const synopsis = $(el).find(".col-synopsis p").first().text().trim() || null;
      const download_url = $(el).find(".col-anime-trailer a").attr("href") || null;
      
      result.push({
        title,
        slug,
        detail_url,
        studio,
        eps,
        rating,
        genres,
        poster,
        season,
        synopsis,
        download_url,
      });
    });
    
    const prevHref = $(".pagination .prev").attr("href") || null;
    const nextHref = $(".pagination .next").attr("href") || null;
    
    const pagination = {
      prev: prevHref
      ? {
        page: extractPageNumber(prevHref),
        url: normalizeUrl(prevHref),
      }
      : null,
      next: nextHref
      ? {
        page: extractPageNumber(nextHref),
        url: normalizeUrl(nextHref),
      }
      : null,
    };
    
    return {
      status: true,
      genre: slug,
      page: Number(page),
      total: result.length,
      data: result,
      pagination,
    };

  } catch(err) {
    console.log("[GENRE CONTENT EROR]:", err.message);
    return { status: false, eror: err.message }
  }
}

module.exports = { scrapeGenreList, scrapeGenreContent };