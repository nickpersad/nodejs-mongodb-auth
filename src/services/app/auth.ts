import Log from "../common/logUtil";

const mongoUtil = require("../common/mongoUtil");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
const UserModel = require("../../data/User.model");
const SessionModel = require("../../data/Session.model");
const log = new Log();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const insertUser = async (user: any) => {
  const facility = "home.ts/getFromMongo()";
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const objectId = new ObjectID(timestamp);
  const hash = bcrypt.hashSync(user.password, saltRounds);
  const document = {
    _id: objectId,
    id: objectId,
    username: user.username,
    password: hash
  }

  try {
    return await UserModel.collection.insertOne(document).then((result: any) => {
      return { success: true, id: document.id };
    }).catch((err: any) => {
      if (err.code === 11000) {
        return { success: false, msg: `User already exists.` }
      }
      return { success: false, msg: err.errmsg }
    })
  } catch (e) {
    return { success: false, msg: `catch: ${e}` };
  }
}

const checkUser = async (user: any) => {
  const params = { username: user.username };
  const doc = await UserModel.findOne(params, (err: any, doc: any) => {
    if (err) {
      return { success: false, msg: err };
    }
    return { success: true, data: doc };
  });

  if (doc !== null) {
    const match = await bcrypt.compare(user.password, doc.password);

    if (match) {
      return { success: true }
    }
  }
  return { success: false, msg: `Unable to login.` }
}

const checkUserSession = async (session: string) => {
  const params = { id: session };
  const doc = await SessionModel.findOne(params, (err: any, doc: any) => {
    if (err) {
      return { success: false, msg: err };
    }
    return { success: true };
  });
  return { success: false };
}

const removeSession = async (username: string) => {
  const params = { username: username };
  const res = await SessionModel.deleteOne(params);

  if (res.deletedCount === 1) {
    return { success: true, msg: `Session for ${username} removed.` };
  }
  return { success: false, msg: `Session for ${username} was not removed.` };
}

const createSession = async (user: any) => {
  const facility = "auth.ts/createSession()";
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const objectId = new ObjectID(timestamp);
  const document = {
    _id: objectId,
    id: objectId,
    username: user.username
  }

  try {
    return await SessionModel.collection.insertOne(document).then((result: any) => {
      return { success: true, id: document.id };
    }).catch((err: any) => {
      if (err.code === 11000) {
        return { success: false, msg: `Session already exists.` }
      }
      return { success: false, msg: err.errmsg }
    })
  } catch (e) {
    return { success: false, msg: `catch: ${e}` };
  }
}

const connectToMongo = async () => {
  const facility = "auth.ts/connectToMongo()";
  try {
    await mongoUtil.getDb();
  } catch (e) {
    log.getResponse(`MongoDB connection catch: ${e}`, false, facility);
  }
};

module.exports = {
  login: async (body: any) => {
    await connectToMongo();
    const login = await checkUser(body);

    if (login.success) {
      return await createSession(body);
    }
    return login;
  },
  signup: async (body: any) => {
    await connectToMongo();
    return await insertUser(body);
  },
  signout: async (username: string) => {
    await connectToMongo();
    return await removeSession(username);
  },
  sessionCheck: async (id: string) => {
    return checkUserSession(id);
  }
};
