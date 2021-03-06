// const express = require("express");
const apiRouter = require("express").Router();
// apiRouter.use(express.json());

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
  next();
});

const linksRouter = require("./links");
apiRouter.use("/links", linksRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
