const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { hash } = require("argon2");
const { genRefreshToken, genAccessToken } = require("../helpers/tokens");
const { auth } = require("../middlewares/auth");
const prisma = new PrismaClient();

router.get("/me", auth, async (req, res) => {
  const { id } = req.user;
  const user = await prisma.user.findUnique({
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
  const { id: rid } = await prisma.refreshtoken.create({
    data: {
      token: rToken,
      userId: user.id,
    },
  });
  let aToken = genAccessToken({ id: user.id, rid });
  res.json({ aToken, rToken });
});

module.exports = router;
