const { ObjectId } = require("mongodb");
module.exports = {
  post: async (parent, { id }, { db }) => {
    return await db
      .collection("posts")
      .findOne({ _id: ObjectId(id) })
      .toArray();
    // return await Post.findById(args.id); //.populate("user");
  },
  posts: async (parent, args, { db }) => {
    return await db
      .collection("posts")
      .find()
      .toArray();
    // return await Post.find(); //.populate("user");
  }
};
