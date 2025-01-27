const { Router } = require("express");
const jobRouter = Router();
const customError = require("../utils/customError");
const validateCompany = require("../middlewares/validateCompany.middleware");
const {
  createJob,
  addCandidate,
  sendUpdate,
  getAllJobs,
} = require("../controllers/job.controller");

jobRouter.post("/create", validateCompany, createJob);
jobRouter.put("/addCandidate", validateCompany, addCandidate);
jobRouter.post("/sendUpdate", validateCompany, sendUpdate);
jobRouter.get("/getAllJobs", validateCompany, getAllJobs);

jobRouter.use((req, res, next) => {
  try {
    throw customError(411, "Route not found!");
  } catch (err) {
    next(err);
  }
});

module.exports = jobRouter;
