const mongoose = require("mongoose");

//ok so here is the thing i am guessing that add candidate means to provide company with the liberty to add candidates on it's own, but it will also contain student's who have applied for the job, let's go with that.

const jobSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  candidate: {
    type: [String],
    default: [], // implies at the time of job posting no candidate has applied.
  },
  endDate: {
    type: Date,
    required: true,
  },
});

module.exports = {
  jobSchema,
};
