const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  companyPassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  companyContact: {
    type: String,
    required: true,
    minlength: 10,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  companySchema,
};
