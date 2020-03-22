const { ObjectId } = require("mongodb");
module.exports = {
  user: async (parent, { id }, { db }) => {
    return await db.collection("users").findOne({ _id: ObjectId(id) });
  },
  users: async (parent, args, { db }) => {
    return await db
      .collection("users")
      .find()
      .toArray();
  }
};
