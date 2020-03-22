const DataLoader = require("dataloader");
const _ = require("lodash");
module.exports = {
  posts: async (parent, args, { db }) => {
    const loader = new DataLoader(async keys => {
      return await db
        .collection("posts")
        .find({ user: { $in: keys } })
        .toArray();
    });

    return await loader.load(parent._id.toString());
  }
};
