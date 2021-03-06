const { sign } = require("jsonwebtoken");

exports.genAccessToken = ({ id, rid }) => {
  // id de rfresh token
  return sign({ id, rid }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30s",
  });
};
exports.genRefreshToken = ({ id }) => {
  return sign({ id }, process.env.JWT_REFRESH_SECRET);
};
