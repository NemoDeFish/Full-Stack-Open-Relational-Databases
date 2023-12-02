const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: "%" + req.query.search + "%",
        },
      },
      {
        author: {
          [Op.iLike]: "%" + req.query.search + "%",
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });

  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.delete("/:id", blogFinder, tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (!user || req.blog.userId !== user.id) {
    return res.status(401).json({ error: "operation not permitted" });
  }

  if (req.blog) {
    await req.blog.destroy();
  }

  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res, next) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json({
      likes: req.blog.likes,
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
