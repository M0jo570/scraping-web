const { scrapeHome } = require("../scraper/home");
const scrapeOngoing  = require("../scraper/ongoing");
const { scrapeComplete } = require("../scraper/complete");
const { scrapeDetail } = require("../scraper/detail");
const { scrapeSearch } = require("../scraper/search");
const { scrapeAnimeList } = require("../scraper/animeList");

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
    res.status(500).json({ status: false, error: err.message });
  }
}

async function getComplete(req, res) {
  try {
    const page = req.params.page || 1;
    const data = await scrapeComplete(page);
    res.json({ status: true, page, data });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
}

async function getDetail(req, res) {
  try {
    const slug = req.params.slug;
    const data = await scrapeDetail(slug);
    res.json({ status: true, slug, data});
  } catch(err) {
    res.status(500).json({ status:false, error: err.message });
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

module.exports = { getHome, getOngoing, getComplete, getDetail, getSearch, getAnimeList };