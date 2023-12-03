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

  /* Solution: does not check for the disabled users */
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

  /* Solution: also adds the `userId: user.id` into the session */
  await Session.create({ token: token });

  response.status(200).send({ token, username: user.username, name: user.name });
});

router.delete("/logout", tokenExtractor, async (request, response) => {
  const session = await Session.findOne({
    where: {
      /* Solution: since the solution includes the user's details in each session, the token is not required to look for the session and subsequently not required to be assigned in the 'tokenExtractor' middleware */
      token: request.token,
    },
  });

  /* Solution: immediately destroys the session and does not find and check if the session is present inside the database, I don't think that this is good
  await Session.destroy({
    where: {
      userId: req.user.id
    }
  }) */
  if (session) {
    await session.destroy();
  }

  /* Solution: returns status 200 and sends a message { message: 'token revoken' } instead of returning status 204 and ending without a message */
  response.status(204).end();
});

module.exports = router;
