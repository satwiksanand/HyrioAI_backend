const mongoose = require("mongoose");
const connectionString = process.env.CONNECTION_STRING;
const { companySchema } = require("../models/company.model");
const { jobSchema } = require("../models/job.model");
const { candidateSchema } = require("../models/candidate.model");
const {
  mobileVerificationSchema,
} = require("../models/mobileVerification.model");
const {
  emailVerificationSchema,
} = require("../models/emailVerification.model");

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

const companyModel = mongoose.model("company", companySchema);
const jobModel = mongoose.model("jobs", jobSchema);
const candidateModel = mongoose.model("candidate", candidateSchema);
const emailVerificationModel = mongoose.model(
  "emailVerification",
  emailVerificationSchema
);
const mobileVerificationModel = mongoose.model(
  "mobileVerification",
  mobileVerificationSchema
);

module.exports = {
  companyModel,
  jobModel,
  candidateModel,
  emailVerificationModel,
  mobileVerificationModel,
};
