const tagsRouter = require("express").Router();
const { getLinksByTagName, getAllTags } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("a request is being made to /tags");

  next();
});

tagsRouter.get("/", async (req, res, next) => {
  try {
    const tags = await getAllTags();

    res.send({
      tags,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

tagsRouter.get("/:tagName/links", async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const links = await getLinksByTagName(tagName);

    res.send({ links: links });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
