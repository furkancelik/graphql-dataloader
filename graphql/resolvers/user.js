const DataLoader = require("dataloader");
const _ = require("lodash");

// const loader = new DataLoader(async keys => {
//   return await db
//     .collection("posts")
//     .find({ user: { $in: keys } })
//     .toArray();
// });

module.exports = {
  posts: async (parent, args, { db, loader }) => {
    return await loader.load(parent._id.toString());
  }
};
