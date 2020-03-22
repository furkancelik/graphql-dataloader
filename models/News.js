const mongoose = require("mongoose");
const { Schema } = mongoose;
const newsSchema = new Schema(
  {
    newsLocation: String,
    newsDate: Date,
    title: String,
    slug: String,
    image: String,
    headlineTitle: String,
    category: { type: Schema.Types.ObjectId, ref: "category" },
    keywords: String,
    content: String,
    externalLink: { type: String, default: "" },
    page: { type: Schema.Types.ObjectId, ref: "page", default: null },
    isCommentable: { type: Boolean, default: true },
    readCount: { type: Number, default: 0 }
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

var autoPopulate = function(next) {
  this.populate(["category", "page"]);
  next();
};

newsSchema.pre("findOne", autoPopulate).pre("find", autoPopulate);

newsSchema.statics.findWithCommentCount = function({ limit, ...data }) {
  const newsLocation = data.newsLocation === "" ? ".*." : data.newsLocation;
  const newsDate = data.newsDate === "" ? null : data.newsDate;
  const title = data.title === "" ? ".*." : data.title;
  const category =
    data.category === "" ? null : mongoose.Types.ObjectId(data.category);
  const content = data.content === "" ? ".*." : data.content;

  const match = {
    $match: {
      title: new RegExp(title, "i"),
      content: new RegExp(content, "i"),
      newsLocation: new RegExp(newsLocation, "i"),
      $and: [
        {
          newsDate: {
            $gte: newsDate
              ? new Date(new Date(newsDate).setHours(-24, 0, 0, 0))
              : new Date(0)
          }
        },
        {
          newsDate: {
            $lte: newsDate
              ? new Date(new Date(newsDate).setHours(24, 0, 0, 0))
              : new Date()
          }
        }
      ]
    }
  };

  if (category) match["$match"].category = category;
  return this.aggregate([
    { $sort: { newsDate: -1 } },
    {
      ...match
    },
    { $limit: limit },
    {
      $lookup: {
        from: "commentnews",
        localField: "_id",
        foreignField: "news",
        as: "cmt"
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: { path: "$category", preserveNullAndEmptyArrays: true }
    },
    { $addFields: { "category.id": "$category._id" } },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$$ROOT",
            { commentCount: { $size: "$cmt" } },
            { id: "$_id" }
          ]
        }
      }
    }
  ]);
};

module.exports = mongoose.model("news", newsSchema);
