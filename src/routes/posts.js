const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { auth } = require("../middlewares/auth");
const prisma = new PrismaClient();
router.get("/", auth, async (req, res) => {
  const { id } = req.user;
  const posts = await prisma.post.findMany({
    where: {
      userId: id,
    },
  });
  res.json(posts);
});
router.post("/", auth, async (req, res) => {
  const { id } = req.user;
  const post = await prisma.post.create({
    data: {
      content: req.body.content,
      userId: id,
    },
  });
  res.json(post);
});

module.exports = router;
