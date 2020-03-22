const mongoose = require("mongoose");
const { Schema } = mongoose;
const commentNewsSchema = new Schema(
  {
    news: { type: Schema.Types.ObjectId, ref: "news" },
    fullName: String,
    comment: String,
    visibility: { type: Boolean, default: false }

    // newsSource: { type: Schema.Types.ObjectId, ref: "newsSource" }
  },
  { timestamps: {} }
);
// rename createdAt
// { timestamps: { createdAt: "created_at" } }

var autoPopulate = function(next) {
  this.populate(["news"]);
  next();
};

commentNewsSchema.pre("findOne", autoPopulate).pre("find", autoPopulate);

commentNewsSchema.statics.findMostSpoken = function({ limit }) {
  return this.aggregate([
    {
      $group: {
        _id: "$news",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "news",
        localField: "_id",
        foreignField: "_id",
        as: "news"
      }
    },
    {
      $unwind: { path: "$news", preserveNullAndEmptyArrays: true }
    },

    {
      $replaceRoot: {
        newRoot: { $mergeObjects: ["$news", { id: "$_id" }] }
      }
    },

    {
      $lookup: {
        from: "pages",
        localField: "page",
        foreignField: "_id",
        as: "page"
      }
    },
    {
      $unwind: { path: "$page", preserveNullAndEmptyArrays: true }
    },
    { $addFields: { page: { $ifNull: ["$page", null] } } },

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
      $addFields: {
        page: {
          $cond: {
            if: { $eq: ["$page", null] },
            then: null,
            else: {
              id: "$page._id",
              title: "$page.title",
              slug: "$page.slug",
              content: "$page.content"
            }
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model("commentNews", commentNewsSchema);
