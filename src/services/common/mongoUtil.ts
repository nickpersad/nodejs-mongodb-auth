import { isMainThread } from "worker_threads";
import Log from "../common/logUtil";

const mongoose = require("mongoose");
const connection = process.env.MONGODB_CONNECTION;
const log = new Log();

let _db: any;

const mongoConnection = async () => {
  try {
    if (typeof _db === "undefined") {
      _db = await mongoose.connect(
        connection,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          keepAlive: true,
          useCreateIndex: true,
          keepAliveInitialDelay: 300000
        },
        (err: any) => {
          if (err) {
            log.getResponse(
              `Mongo err: ${err}`,
              false,
              "mongoUtil.js/connect()"
            );
            return false;
          } else {
            log.getResponse(
              `Mongo connected in ${
                isMainThread ? "main thread" : "worker thread"
              }.`,
              true,
              "mongoUtil.js/connect()"
            );
            return true;
          }
        }
      );
    } else {
      log.getResponse(
        `Mongo already connected.`,
        true,
        "mongoUtil.js/connect()"
      );
    }
    return _db;
  } catch (e) {
    log.getResponse(`catch: ${e}`, false, "mongoUtil.js/connect()");
    return false;
  }
};

module.exports = {
  connect: async () => {
    return await mongoConnection();
  },
  getDb: async () => {
    if (typeof _db !== "undefined") {
      return _db;
    }
    return await mongoConnection();
  }
};
