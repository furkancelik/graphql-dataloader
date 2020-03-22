const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    //-1=>yetkisiz
    //0=>süperadmin
    //1=>admin
    //2=>yazar
    //...
    authority: { type: Number, required: true, default: -1 }
  },
  { timestamps: {} }
);

// rename createdAt
// { timestamps: { createdAt: "created_at" } }

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10).then(hash => {
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model("user", userSchema);
