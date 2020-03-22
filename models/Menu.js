const mongoose = require("mongoose");
const { Schema } = mongoose;
const menuSchema = new Schema(
  {
    title: String,
    slug: String,
    order: Number,
    page: { type: Schema.Types.ObjectId, ref: "page", default: null },
    category: { type: Schema.Types.ObjectId, ref: "category", default: null },
    externalLink: String,
    menuLocation: String
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

const autoPopulate = function(next) {
  this.populate(["page", "category"]);
  next();
};

menuSchema.pre("findOne", autoPopulate).pre("find", autoPopulate);

module.exports = mongoose.model("menu", menuSchema);
