const mongoose = require("mongoose");
const { Schema } = mongoose;

const adsSchema = new Schema(
  {
    title: String,
    type: String,
    code: String,
    image: String,
    link: String,
    location: String,
    adsenseClient: String,
    adsenseFormat: String,
    adsenseSlot: String,
    status: { type: Boolean, default: false }
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

module.exports = mongoose.model("ads", adsSchema);
