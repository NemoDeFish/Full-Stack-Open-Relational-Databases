const router = require("express").Router();

const { User, Blog } = require("../models");

router.post("/", async (req, res, next) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      /* Solution: includes attributes ['title', 'url', 'author', 'likes'] instead of excluding 'userId' */
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.put("/:username", async (req, res) => {
  /* Solution: does not include the 'where' property and immediately uses the 'username' object, not sure if it works? */
  const user = await User.findOne({ where: { username: req.params.username } });

  /* Solution: does not check if a user is found, maybe because it automatically redirects to the 'errorHandler' middleware? */
  if (user) {
    /* Solution: changes the name instead of the username, which is incorrect according to Task 13.8 */
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.get("/:id", async (req, res) => {
  const where = {};

  if (req.query.read) {
    /* Solution: uses a conditional operator req.query.read === 'false' ? false : true, but I think this is unnecessary */
    where.read = req.query.read === "true";
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    /* Solution: does not wrap the {} inside an array [], not sure if it works */
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId"] },
        through: {
          /* Solution: has an empty 'attributes' array and uses an additional 'include' property to limit the 'readinglist' attributes, however, my method works just the same and does not require importing 'Readinglist' model */
          attributes: ["read", "id"],
          /* Solution: where is not included here, but below in the 'Readinglist' include*/
          where,
        },
        /* include: {
          model: Readinglist,
          where,
          attributes: [ 'read', 'id' ]
        }, */
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
