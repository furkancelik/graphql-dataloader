const bcrypt = require("bcryptjs");
const Token = require("../../../helpers/token");
module.exports = {
  createUser: async (parent, { data }, { db }) => {
    const create = await db.collection("users").insertOne(data);
    return await db.collection("users").findOne({ _id: create.insertedId });
  }
};
