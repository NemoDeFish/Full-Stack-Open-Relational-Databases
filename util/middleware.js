const jwt = require("jsonwebtoken");

const { SECRET } = require("../util/config");
const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  /* Solution: uses an if statement to check for error and throws error `error: 'token missing'` instead */
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    /* Solution: does not use try-catch method, instead immediately use if statements and return errors */
    try {
      /* Solution: since the solution already has the user's detail inside 'session' we do not have to verify, instead we can directly assign the user to `req.user = session.user` */
      req.token = authorization.substring(7);
      req.decodedToken = jwt.verify(req.token, SECRET);

      /* Solution: refactors this into a separate function that returns the below code and assign into 'session' constant 
      const session = await sessionFrom(authorization.substring(7)) */
      const session = await Session.findOne({
        where: {
          token: req.token,
        },
        /* Solution: includes 'User' model because it also includes the user logged-in instead of only the token
        include: {
          model: User
        } */
      });

      /* Solution: since the 'user' is also included inside the 'session' variable, we do not have to look for the user in the 'users' table and we can directly access the user's property using 'session.user.disabled' */
      const user = await User.findByPk(req.decodedToken.id);
      if (user.disabled) {
        /* Solution: does not destroy the session if a disabled user is found, but I think mine is better */
        await session.destroy();

        return response.status(401).json({
          error: "account disabled, please contact admin",
        });
      }

      if (!session) {
        /* Solution: immediately return an error instead of using the same generic error message 
        return res.status(401).json({ error: 'no valid session' }) */
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

/* Solution: also exports 'errorHandler' since it is refactored into the middleware */
module.exports = { tokenExtractor };
