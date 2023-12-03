const router = require("express").Router();
/* Solution: immediately destructure the required functions from sequelize `{ Op, fn, col, literal }` */
const sequelize = require("sequelize");

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      /* Solution: since the required sequelize functions are already destructed, we can immediately use them using `fn` instead of `sequelize.fn` */
      [sequelize.fn("COUNT", sequelize.col("author")), "articles"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    /* Solution: wraps the group in an array, not sure if it is necessary ['author'] */
    group: "author",
    /* Solution: uses the 'literal' function to wrap the order literal('SUM(likes) DESC'), not sure what for, since mine achieves the same result */
    order: [["likes", "DESC"]],
  });

  /* Solution: uses `res.send` instead of `res.json` */
  res.json(authors);
});

module.exports = router;
