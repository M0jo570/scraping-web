const { scrapeEpisode } = require("../scraper/episode");

async function getEpisode(req, res) {
  try {
    const { slug } = req.params;
    const url = `https://otakudesu.best/episode/${slug}/`;
    
    console.log("\n=== REQUEST EPISODE ===");
    console.log("Slug:", slug);
    console.log("URL:", url);
    
    const result = await scrapeEpisode(url);
    
    if (!result.episode) {
      return
      res.status(500).json(result);
    }
    console.log("=== FINISH EPISODE RESPONSE ===\n");
    res.json(result);
    
  } catch(err) {
    console.log("[CONTROLLER EPISODE EROR]:", err.message);
    res.status(500).json({
      status:false,
      eror:err.message
    });
  }
}

module.exports = { getEpisode };