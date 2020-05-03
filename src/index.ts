"use strict";

require("dotenv").config();

import Log from "./services/common/logUtil";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const RoutesController = require("./controllers/routes");

const mongoUtil = require("./services/common/mongoUtil");

const log = new Log();

// run with node --experimental-worker index.js on Node.js 10.x
const { Worker, MessageChannel } = require("worker_threads");

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

    app.listen(PORT, function() {
      log.getResponse(`Listening on ${PORT}`, true, "Express server start");
    });
  } catch (e) {
    log.getResponse(
      `Initial mongoUtil.connect() catch: ${e}`,
      false,
      "index.ts/runLockRenewal()"
    );
  }
})();
