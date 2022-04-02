const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hash } = require("argon2");
const { verify: verifyJwt } = require("jsonwebtoken");
const { genRefreshToken, genAccessToken } = require("../helpers/tokens");
const { auth } = require("../middlewares/auth");

router.get("/me", auth, async (req, res) => {
  const { id } = req.user;
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      email: true,
    },
    where: {
      id,
    },
  });
  res.json({ user });
});

// /auth/login
router.post("/login", (req, res) => {});

// /auth/registro
router.post("/registro", async (req, res) => {
  let { password } = req.body;
  password = await hash(password);
  req.body.password = password;
  const user = await prisma.user.create({
    data: req.body,
  });
  let rToken = genRefreshToken({ id: user.id });
  // guardar refresh token
  const { id: rid } = await prisma.refreshtoken.create({
    data: {
      token: rToken,
      userId: user.id,
    },
  });
  let aToken = genAccessToken({ id: user.id, rid });
  res.json({ aToken, rToken });
});
// refresh token
router.get("/refresh", async (req, res) => {
  const { rToken } = req.query;
  let id;
  try {
    let payload = verifyJwt(rToken, process.env.JWT_REFRESH_SECRET);
    id = payload.id;
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
  try {
    const user = await prisma.user.findUnique({
      select: {
        email: true,
        name: true,
        refreshTokens: true,
      },
      where: {
        id,
      },
    });
    const valido = user.refreshTokens.find((r) => r.token == rToken);
    if (!valido) {
      return res.status(401).json({ msg: "Token invalido" });
    }
    const aToken = genAccessToken({ id, rid: valido.id });
    res.json({ aToken, user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
