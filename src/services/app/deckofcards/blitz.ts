export { };

const mongoUtil = require("../../common/mongoUtil");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
const BlitzGameModel = require("../../../data/BlitzGame.model");

const axios = require('axios');

const connectToMongo = async () => {
    try {
        await mongoUtil.getDb();
    } catch (e) {
        console.log(`MongoDB connection catch: ${e}`);
    }
};

const updateGame = async (params: any, updateObj: any) => {
    try {
        const updated = await BlitzGameModel.updateOne(params, updateObj);

        console.log(updated);
        if (updated.nModified > 0) {
            return { success: true };
        }
        return { success: false, msg: `Couldn't join.` };
    } catch (e) {
        return { success: false, msg: `catch: ${e}` };
    }
}

const insertGameId = async (user: string) => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const objectId = new ObjectID(timestamp);

    const document = {
        _id: objectId,
        id: objectId,
        initialUser: user,
        users: [user],
        deckId: ''
    }

    try {
        return await BlitzGameModel.collection.insertOne(document).then((result: any) => {
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

module.exports = {
    create: async (user: string) => {
        await connectToMongo();
        return await insertGameId(user);
    },
    join: async (initialUser: string, user: string) => {
        await connectToMongo();

        const params = { initialUser: initialUser };
        const data = await BlitzGameModel.findOne(params);

        if (data) {
            return await updateGame(params, {
                $addToSet: {
                    users: [user]
                }
            });
        }
    },
    shuffle: async (id: string) => {
        await connectToMongo();
        const params = { id: id };

        try {
            const deck = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");

            if (deck.data.success) {
                return await updateGame(params, {
                    deckId: deck.data.deck_id
                });
            }
            return { success: false, msg: deck };
        } catch (e) {
            return { success: false, msg: `catch: ${e}` };
        }
    }
};
