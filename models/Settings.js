const mongoose = require("mongoose");
const { Schema } = mongoose;
const settingsSchema = new Schema(
  {
    title: String,
    keywords: String,
    desciption: String,
    analyticCode: String,

    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,

    appStoreLink: String,
    googlePlayLink: String,
    footerContent: String,

    logo: String
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

module.exports = mongoose.model("settings", settingsSchema);
