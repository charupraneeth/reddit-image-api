const axios = require("axios");
const express = require("express");

const router = express.Router();

const subreddits = [
  "aww",
  "natureporn",
  "pics",
  "pic",
  "photo",
  "abandonedporn",
  "images",
  "earthporn",
  "spaceporn",
  "itookapicture",
  "photographs",
  "photocritique",
  "postprocessing",
  "mildlyinteresting",
];

router.get("/", async (req, res, next) => {
  try {
    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    const baseUrl = `https://www.reddit.com/r/${subreddit}.json`;
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
      subreddit,
      images,
      after,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:subreddit", async (req, res, next) => {
  try {
    const { after: nextPage } = req.query;
    let baseUrl = `https://www.reddit.com/r/${req.params.subreddit}.json`;
    if (nextPage) baseUrl += `&after=${nextPage}`;
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
