const router = require("express").Router();

const { Readinglist, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res) => {
  const readinglist = await Readinglist.create(req.body);
  res.json(readinglist);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  /* Solution: does not have to look for the user each time repeatedly since it is already assigned to 'req.user' inside 'userFromToken' */
  const user = await User.findByPk(req.decodedToken.id);
  const readinglist = await Readinglist.findByPk(req.params.id);

  /* Solution: does not have to check for presence of 'user' too since it is already checked inside 'userFromToken' */
  if (!user || readinglist.userId !== user.id) {
    /* Solution: gives a more informative message 'only allowed to change status of own readings' */
    return res.status(401).json({ error: "operation not permitted" });
  }

  /* Solution: assumes a readinglist is present and does not check for the presence of the readinglist, I think it's not good */
  if (readinglist) {
    readinglist.read = req.body.read;
    await readinglist.save();
    res.json(readinglist);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
