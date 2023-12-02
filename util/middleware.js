const jwt = require("jsonwebtoken");

const { SECRET } = require("../util/config");
const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.token = authorization.substring(7);
      req.decodedToken = jwt.verify(req.token, SECRET);

      const user = await User.findByPk(req.decodedToken.id);
      const session = await Session.findOne({
        where: {
          token: req.token,
        },
      });

      if (user.disabled) {
        await session.destroy();

        return response.status(401).json({
          error: "account disabled, please contact admin",
        });
      }

      if (!session) {
        throw new Error();
      }
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { tokenExtractor };
