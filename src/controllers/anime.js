const { scrapeHome } = require("../scraper/home");
const scrapeOngoing  = require("../scraper/ongoing");
const { scrapeComplete } = require("../scraper/complete");
const { scrapeDetail } = require("../scraper/detail");
const { scrapeSearch } = require("../scraper/search");
const { scrapeAnimeList } = require("../scraper/animeList");
const { scrapeEpisode } = require("../scraper/episode");
const { scrapeGenreList, scrapeGenreContent } = require("../scraper/genre");
const { scrapeSchedule } = require("../scraper/schedule");

async function getHome(req, res) {
  try {
    const data = await scrapeHome();
    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
}

async function getOngoing(req, res) {
  try {
    const page = req.params.page || 1;
    const data = await scrapeOngoing(page);

    res.json({ status: true, page, data });
  } catch (err) {
    res.status(500).json({ status: false, eror: err.message });
  }
}

async function getComplete(req, res) {
  try {
    const page = req.params.page || 1;
    const data = await scrapeComplete(page);
    res.json({ status: true, page, data });
  } catch (err) {
    res.status(500).json({ status: false, eror: err.message });
  }
}

async function getDetail(req, res) {
  try {
    const slug = req.params.slug;
    const data = await scrapeDetail(slug);
    res.json({ status: true, slug, data});
  } catch(err) {
    res.status(500).json({ status:false, eror: err.message });
  }
}

async function getSearch(req, res) {
  try {
    const query = req.params.query;
    const data = await scrapeSearch(query);
    
    res.json({ status:true, query, result:data });
  } catch(err) {
    res.status(500).json({ status:false, eror: err.message });
  }
}

async function getAnimeList(req, res) {
  try {
  
    let { filter } = req.query;
    filter = filter ? String(filter).trim().toUpperCase() : null;

    const data = await scrapeAnimeList();

  
    if (!filter) {
      console.log(`[ANIME LIST] Tanpa filter → total: ${data.length}`);

      return res.json({
        status: true,
        total: data.length,
        filter: null,
        data
      });
    }

  
    let filtered;

  
    if (filter === "#" || /^\d$/.test(filter)) {
      filtered = data.filter(a => /^\d/.test(a.title));
    } 
  
    else {
      filtered = data.filter(a =>
        a.title.toUpperCase().startsWith(filter)
      );
    }

    console.log(`[ANIME LIST] Hasil setelah filter "${filter}": ${filtered.length}`);

    return res.json({
      status: true,
      filter,
      total: filtered.length,
      data: filtered,
    });

  } catch (err) {
    res.status(500).json({ status: false, eror: err.message });
  }
}

async function getEpisode(req, res) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: false,
        error: "Episode slug is required",
      });
    }
    
    console.log("\n=== REQUEST EPISODE ===");
    console.log("Slug:", slug);
    
    const result = await scrapeEpisode(slug);  // ⬅️ cukup kirim slug

    if (!result || !result.episode) {
      return res.status(500).json(result || {
        status: false,
        error: "Failed to scrape episode"
      });
    }

    console.log("=== FINISH EPISODE RESPONSE ===\n");
    return res.json(result);
    
  } catch (err) {
    console.log("[CONTROLLER EPISODE ERROR]:", err.message);
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
}

async function getGenreList(req, res) {
  try {
    const result = await scrapeGenreList();
    
    if (!result || result.status === false) {
      return res.status(500).json(result);
    }
    
    return res.json(result);
  } catch(err) {
    console.log("[CONTROLLER GENRE LIST EROR]:", err.message);
    res.status(500).json({
      status: false,
      eror: err.message,
    });
  }
}

async function getGenreContent(req, res) {
  try {
    const { slug } = req.params;
    const page = req.query.page || 1;
    
    if (!slug) {
      return res.status(500).json({
        status: false,
        eror: "Genre slug is required",
      });
    }
    const result = await scrapeGenreContent(slug, page);
    
    if (!result || result.status === false) {
      return res.status(500).json(result || {
        status: false,
        eror: "failed to fetch genre content",
      });
    }
    
    return res.json(result);
  } catch(err) {
    console.log("[GENRE CONTENT EROR]:", err.message);
    res.status(500).json({
      status: false,
      eror: err.message,
    });
  }
}

async function getSchedule(req, res) {
  try {
    const result = await scrapeSchedule();
    
    if (!result || result.status === false) {
      return res.status(500).json(result);
    }
    
    return res.json(result);
  } catch(err) {
    console.log("[CONTROLLER SCHEDULE EROR]:", err.message);
    res.status(500).json({
      status: false,
      eror: err.message,
    });
  }
}

async function getScheduleByDay(req, res) {
  try {
    const { day } = req.params;
    if (!day) {
      return res.status(404).json({
        status: false,
        eror: "Day is required",
      });
    }
    
    const result = await scrapeSchedule();
    
    if (!result || result.status === false) {
      return res.status(500).json(result);
    }
    
    const normalized = day.toLowerCase();
    const found = result.data.find((d) => d.day.toLowerCase() === normalized);
    
    if (!found) {
      return res.status(404).json({
        status: false,
        eror: `Day "${day}" not found`,
      });
    }
    
    return res.json({
      status: true,
      day: found.day,
      total: found.total,
      anime: found.anime,
    });
  } catch(err) {
    console.log("[CONTROLLER SCHEDULE BY DAY EROR]:", err.message);
    res.statu(500).json({
      status: false,
      eror: err.message,
    });
  }
}



module.exports = { getHome, getOngoing, getComplete, getDetail, getSearch, getAnimeList, getEpisode, getGenreList, getGenreContent, getSchedule, getScheduleByDay };