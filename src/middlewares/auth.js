const { verify } = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const aToken = req.header("autenticacion");
  if (!aToken) {
    return res.status(498).json({ msg: "No envio el header de autenticacion" });
  }
  try {
    const payload = verify(aToken, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(498).json({ msg: error.message });
  }
};
