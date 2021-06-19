const axios = require("axios");
const express = require("express");
const { randomSubreddit, filterImage } = require("./utils");

const router = express.Router();

const diyCache = {
  cachedSubreddits: {},
  lastUpdated: Date.now(),
  cacheTimeLimit: 2000, // 2 millisecons
};

router.use((req, res, next) => {
  if (Object.keys(diyCache.cachedSubreddits).length > 5) {
    delete diyCache.cachedSubreddits["0"];
  }
  next();
});

// random subreddit
router.get("/", async (req, res) => {
  const subreddit = randomSubreddit();
  res.redirect(`/api/v1/${subreddit}`);
});

// specific subreddit
router.get("/:subreddit", async (req, res, next) => {
  try {
    const { subreddit } = req.params;
    const { after: nextPage } = req.query;

    let baseUrl = `https://www.reddit.com/r/${subreddit}.json`;
    if (nextPage) baseUrl += `?after=${nextPage}`;
    if (diyCache.cachedSubreddits[baseUrl]) {
      const imagesData = diyCache.cachedSubreddits[baseUrl];
      // console.log("from cache");
      res.json(imagesData);
    } else {
      const {
        data: {
          data: { children, after },
        },
      } = await axios.get(baseUrl);

      const images = filterImage(children);
      diyCache.cachedSubreddits[baseUrl] = { images, after };
      res.json({
        images,
        after,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
