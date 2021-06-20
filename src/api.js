const axios = require("axios");
const express = require("express");
const {
  getRandomSubreddit,
  filterImage,
  newRandomSubreddit,
} = require("./utils");

const router = express.Router();

const diyCache = {
  cachedSubreddits: {},
  lastUpdated: Date.now(),
  cacheTimeLimit: 60 * 1000, // 1 minute = 60 seconds
};

// random subreddit
router.get("/", async (req, res) => {
  const subreddit = getRandomSubreddit();
  res.redirect(`/api/v1/${subreddit}`);
});

// get random image
router.get("/random", async (req, res, next) => {
  try {
    const keys = Object.keys(diyCache.cachedSubreddits);
    if (
      keys.length < 20 ||
      Date.now() - diyCache.lastUpdated > diyCache.cacheTimeLimit
    ) {
      // get new random subreddit
      const subreddit = newRandomSubreddit(diyCache.cachedSubreddits);
      console.log("add to cache", subreddit);
      const baseUrl = `https://www.reddit.com/r/${subreddit}.json`;
      const {
        data: {
          data: { children, after },
        },
      } = await axios.get(baseUrl);
      const images = filterImage(children);
      diyCache.cachedSubreddits[baseUrl] = { subreddit, images, after };
      diyCache.lastUpdated = Date.now();
    }

    // return from cache
    const newKeys = Object.keys(diyCache.cachedSubreddits);
    const randomCachedSubreddit =
      diyCache.cachedSubreddits[
        newKeys[Math.floor(Math.random() * newKeys.length)]
      ];
    const randomImage =
      randomCachedSubreddit.images[
        Math.floor(Math.random() * randomCachedSubreddit.images.length)
      ];
    res.json({ image: randomImage });
    // res.send(`<img src=${randomImage.image} alt=${randomImage.title}>`);
  } catch (error) {
    next(error);
  }
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
      if (images.length > 2) {
        diyCache.cachedSubreddits[baseUrl] = { subreddit, images, after };
        diyCache.lastUpdated = Date.now();
      }
      res.json({
        subreddit,
        images,
        after,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
