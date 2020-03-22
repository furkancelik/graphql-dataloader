module.exports = {
  createPost: async (parent, { data }, { db }) => {
    const create = await db.collection("posts").insertOne(data);
    return await db.collection("posts").findOne({ _id: create.insertedId });
  }
};
