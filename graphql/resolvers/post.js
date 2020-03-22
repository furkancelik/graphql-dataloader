const { ObjectId } = require("mongodb");
module.exports = {
  user: async (parent, args, { db }) => {
    // n+1 ile olan
    return await db.collection("users").findOne({ _id: ObjectId(parent.user) });
  }
};
