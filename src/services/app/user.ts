const mongoUtil = require("../common/mongoUtil");
const UserModel = require("../../data/User.model");

const userList = async () => {
    const params = {};
    const data = await UserModel.find(params);

    return {
        success: true,
        results: data.map((user: any) => {
            return {
                id: user.id,
                username: user.username,
            };
        })
    };
}

const connectToMongo = async () => {
    try {
        await mongoUtil.getDb();
    } catch (e) {
        console.error(`MongoDB connection catch: ${e}`);
    }
};

module.exports = {
    list: async (body: any) => {
        await connectToMongo();
        return await userList();
    }
};
