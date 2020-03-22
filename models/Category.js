const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    title: String,
    slug: String,
    color: String,
    showPage: { type: Boolean, default: false }
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

module.exports = mongoose.model("category", categorySchema);
