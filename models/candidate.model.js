const mongoose = require("mongoose");

//technically, we should also save the jobs selected by candidates but for now we will leave that, add it later though.
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = {
  candidateSchema,
};
