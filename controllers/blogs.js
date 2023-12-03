const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  /* Solution: declared 'where' variable using 'let' instead of 'const' */
  const where = {};

  if (req.query.search) {
    /* Solution: since where is a variable and not a constant, we can follow the method suggested by the documentation of assigning a new object to 'where' i.e. where = { [Op.or]: {} }*/
    where[Op.or] = [
      {
        title: {
          /* Solution: used `%${req.query.search}%` instead of the addition for cleaner syntax $*/
          [Op.iLike]: "%" + req.query.search + "%",
        },
      },
      {
        author: {
          /* Solution: used `%${req.query.search}%` instead of the addition for cleaner syntax $*/
          [Op.iLike]: "%" + req.query.search + "%",
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    /* Solution: does not exclude any 'attributes' nor specify the 'attributes' property */
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      /* Solution: also includes 'username' instead of only 'name' attribute */
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });

  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  /* Solution: does not have to look for the user each time repeatedly since it is already assigned to 'req.user' inside 'userFromToken' */
  const user = await User.findByPk(req.decodedToken.id);
  /* Solution: 'user.id' is now inside 'req.user.id' */
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

/* Solution: does not refactors 'blogFinder', but I think it is better */
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.delete("/:id", blogFinder, tokenExtractor, async (req, res, next) => {
  /* Solution: does not have to look for the user each time repeatedly since it is already assigned to 'req.user' inside 'userFromToken' */
  const user = await User.findByPk(req.decodedToken.id);

  /* Solution: does not have to check for presence of 'user' too since it is already checked inside 'userFromToken' */
  if (!user || req.blog.userId !== user.id) {
    /* Solution: uses 'send' function instead of 'json', not sure why? 
    return res.status(401).send({ error: 'only creator allowed to delete a blog' }) */
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
    /* Solution: returns the entire blog instead of only the 'likes' property */
    res.json({
      likes: req.blog.likes,
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
