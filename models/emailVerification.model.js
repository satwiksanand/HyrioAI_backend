const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
});

module.exports = {
  emailVerificationSchema,
};
