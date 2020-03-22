const mongoose = require("mongoose");
const { Schema } = mongoose;
const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    title: String,
    desciption: String
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

module.exports = mongoose.model("post", postSchema);
