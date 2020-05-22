import { isMainThread } from "worker_threads";

const mongoose = require("mongoose");
const connection = process.env.MONGODB_CONNECTION;

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
          keepAliveInitialDelay: 300000,
        },
        (err: any) => {
          if (err) {
            console.log(`Mongo err: ${err}`);
            return false;
          } else {
            console.log(
              `Mongo connected in ${
                isMainThread ? "main thread" : "worker thread"
              }.`
            );
            return true;
          }
        }
      );
    } else {
      console.log(`Mongo already connected.`);
    }
    return _db;
  } catch (e) {
    console.log(e);
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
  },
};
