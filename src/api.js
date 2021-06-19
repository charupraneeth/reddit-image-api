const axios = require("axios");
const express = require("express");

const router = express.Router();

router.get("/:subreddit", async (req, res, next) => {
  try {
    const nextPage = req.query.after;
    const baseUrl = `https://www.reddit.com/r/${req.params.subreddit}.json?after=${nextPage}`;
    const {
      data: {
        data: { children, after },
      },
    } = await axios.get(baseUrl);

    const images = children
      .filter(
        ({ data }) => data.url && data.url.match(/\.(jpg|png|jpeg|bmp|webm)$/)
      )
      .map(({ data }) => ({
        title: data.title.replace(/\[(.*)\]|\((.*)\)/, "").trim(),
        image: data.url,
        thumbnail: data.thumbnail,
        author: data.author,
        source: `https://www.reddit.com${data.permalink}`,
        created_utc: data.created_utc,
      }));

    res.json({
      images,
      after,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
