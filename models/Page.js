const mongoose = require("mongoose");
const { Schema } = mongoose;
const pageSchema = new Schema(
  {
    title: String,
    // titleVisible: { type: Boolean, default: true },
    slug: String,
    content: String
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

module.exports = mongoose.model("page", pageSchema);
