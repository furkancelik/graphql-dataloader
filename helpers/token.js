const jwt = require("jsonwebtoken");

module.exports = {
  generate: ({ _id, username, authority }, expiresIn = 60 * 60 * 24) => {
    return jwt.sign({ id: _id, username, authority }, process.env.SECRET_KEY, {
      expiresIn
    });
  },
  verify: async token => {
    try {
      return await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
      throw new Error(e);
    }
  }
};
