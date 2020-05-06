"use strict";

require("dotenv").config();

export { };

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const RoutesController = require("./controllers/routes");

const mongoUtil = require("./services/common/mongoUtil");

/**
 * https://github.com/expressjs/cors
 * Enable All CORS Requests
 */
app.use(cors());

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// Routing
app.use("/", RoutesController);

// START
(async () => {
  // start the Express server
  try {
    // Connect To Mongo
    await mongoUtil.connect();

    app.listen(PORT, function () {
      console.log(`Listening on ${PORT}`);
    });
  } catch (e) {
    console.log(`Initial mongoUtil.connect() catch: ${e}`);
  }
})();
