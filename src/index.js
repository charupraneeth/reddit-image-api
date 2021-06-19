const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

const port = process.env.PORT || 1337;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "this is the index route , the api is in /api/v1 route",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`listening on port : ${port}`);
  /* eslint-enable no-console */
});
