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
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  await User.find;
  if (user) {
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
    where.read = req.query.read === "true";
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["read", "id"],
          where,
        },
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
