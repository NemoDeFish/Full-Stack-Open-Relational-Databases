const router = require("express").Router();

const { Readinglist, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res) => {
  const readinglist = await Readinglist.create(req.body);
  res.json(readinglist);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const readinglist = await Readinglist.findByPk(req.params.id);

  if (!user || readinglist.userId !== user.id) {
    return res.status(401).json({ error: "operation not permitted" });
  }

  if (readinglist) {
    readinglist.read = req.body.read;
    await readinglist.save();
    res.json(readinglist);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
