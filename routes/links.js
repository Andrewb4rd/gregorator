const linksRouter = require("express").Router();
const { getAllLinks, createLink, updateLink } = require("../db");

linksRouter.use((req, res, next) => {
  console.log("a request is being made to /links");

  next();
});

linksRouter.get("/", async (req, res, next) => {
  try {
    const links = await getAllLinks();

    res.send({
      links,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

linksRouter.post("/", async (req, res, next) => {
  const { url, comment, date, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const linkData = {};
  // only send the tags if there are some to send
  if (tagArr.length) {
    linkData.tags = tagArr;
  } else {
    linkData.tags = [];
  }

  try {
    // add url, comment, date to linkData object
    linkData.url = url;
    linkData.comment = comment;
    linkData.date = date;
    const link = await createLink(linkData);
    // this will create the link and the tags for us
    // if the link comes back, res.send({ link });
    if (link) {
      res.send({ link });
    } else {
      next({ link });
    }
    // otherwise, next an appropriate error object
  } catch ({ name, message }) {
    next({ name, message });
  }
});

linksRouter.patch("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedLink = await updateLink(id);
    res.send({ link: updatedLink });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = linksRouter;
