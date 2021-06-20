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
function getRandomSubreddit() {
  return subreddits[Math.floor(Math.random() * subreddits.length)];
}

function newRandomSubreddit(cachedSubreddits) {
  const subreddit = getRandomSubreddit();
  return cachedSubreddits[subreddit]
    ? newRandomSubreddit(cachedSubreddits)
    : subreddit;
}

function filterImage(collection) {
  return collection
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
}

module.exports = {
  getRandomSubreddit,
  filterImage,
  newRandomSubreddit,
};
