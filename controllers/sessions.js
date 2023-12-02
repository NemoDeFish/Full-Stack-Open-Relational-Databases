const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User, Session } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/login", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  if (user.disabled) {
    return response.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);
  await Session.create({ token: token });

  response.status(200).send({ token, username: user.username, name: user.name });
});

router.delete("/logout", tokenExtractor, async (request, response) => {
  const session = await Session.findOne({
    where: {
      token: request.token,
    },
  });

  if (session) {
    await session.destroy();
  }

  response.status(204).end();
});

module.exports = router;
