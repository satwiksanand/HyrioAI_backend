const { Router } = require("express");
const authRouter = require("./auth.router");
const jobRouter = require("./jobs.router");
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/jobs", jobRouter);

rootRouter.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "Something wrong with the server at the moment!",
  });
});

module.exports = rootRouter;
