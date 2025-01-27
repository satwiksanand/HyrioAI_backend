const { Router } = require("express");
const authRouter = Router();
const customError = require("../utils/customError");
const {
  signup,
  signin,
  signout,
  verifyEmail,
  verifyMobile,
} = require("../controllers/auth.controller");
const validateCompany = require("../middlewares/validateCompany.middleware");
//here there will be some kind of controller to manage authentication;
//let us first connect with the database then we will think about the contolere.

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", validateCompany, signout);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/verifyMobile", verifyMobile);

authRouter.use((req, res, next) => {
  try {
    throw customError(411, "Route not found!");
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;
