const customError = require("../utils/customError");
const zod = require("zod");
const bcryptjs = require("bcryptjs");
const {
  companyModel,
  emailVerificationModel,
  mobileVerificationModel,
} = require("../db/index");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/requestEmailOTP");
const sendMobileOTP = require("../utils/requestMobileOTP");
const secretKey = process.env.SECRET_KEY;

const signupSchema = zod.object({
  companyName: zod.string().nonempty(),
  companyEmail: zod.string().email(),
  companyPassword: zod.string().min(6),
  companyContact: zod.string().min(10),
});

const signinSchema = zod.object({
  companyEmail: zod.string().email(),
  companyPassword: zod.string().min(6),
});

const verifyOTPSchema = zod.object({
  companyId: zod.string().nonempty(),
  otp: zod.string().min(4).max(4),
});

const signup = async (req, res, next) => {
  const details = {
    companyName: req.body.companyName,
    companyEmail: req.body.companyEmail,
    companyPassword: req.body.companyPassword,
    companyContact: req.body.companyContact,
  };
  try {
    if (!signupSchema.safeParse(details).success) {
      throw customError(400, "Invalid details!");
    }
    const company = await companyModel.findOne({
      companyEmail: details.companyEmail,
    });
    if (!company) {
      const hashedPassword = bcryptjs.hashSync(details.companyPassword, 10);
      details.companyPassword = hashedPassword;
      const newCompany = await companyModel.create(details);
      //i want to send the email otp to the user and the mobile otp to the user
      //use the utility function to send email verification otp
      const emailOtp = Math.floor(1000 + Math.random() * 9000);
      await sendOtpEmail(details.companyEmail, emailOtp);
      const newEmailVerification = {
        companyId: newCompany._id,
        otp: emailOtp,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000),
      };
      await emailVerificationModel.create(newEmailVerification);
      //mobile otp verification code.
      const mobileOtp = Math.floor(1000 + Math.random() * 9000);
      await sendMobileOTP(details.companyContact, mobileOtp);
      const newMobileVerification = {
        companyId: newCompany._id,
        otp: mobileOtp,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000),
      };
      await mobileVerificationModel.create(newMobileVerification);
      return res.status(201).json({
        message: "Company registered successfully!",
        companyId: newCompany._id,
      });
    } else {
      throw customError(400, "Email already exists!");
    }
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const details = {
    companyEmail: req.body.companyEmail,
    companyPassword: req.body.companyPassword,
  };
  try {
    if (!signinSchema.safeParse(details).success) {
      throw customError(400, "Invalid details!");
    }
    const company = await companyModel.findOne({
      companyEmail: details.companyEmail,
    });
    if (!company) {
      throw customError(400, "Invalid email or password!");
    }
    const isMatch = await bcryptjs.compare(
      details.companyPassword,
      company.companyPassword
    );
    if (!isMatch) {
      throw customError(400, "Invalid email or password!");
    }
    const token = jwt.sign(
      { companyEmail: company.companyEmail, companyId: company._id },
      secretKey
    );
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 25892000000),
        secure: true,
        sameSite: "None",
      })
      .json({
        message: "signin successful!",
      });
  } catch (err) {
    next(err);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").json({
      message: "signout successfull!",
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  //again i am expecting the company id in the request body change it as per ui later.
  const details = {
    companyId: req.body.companyId,
    otp: req.body.otp,
  };
  try {
    if (!verifyOTPSchema.safeParse(details).success) {
      throw customError(400, "Invalid details!");
    }
    const emailVerification = await emailVerificationModel.findOne({
      companyId: details.companyId,
      otp: details.otp,
    });
    if (!emailVerification) {
      throw customError(400, "Invalid OTP!");
    }
    await emailVerificationModel.deleteOne({ _id: emailVerification._id });
    if (emailVerification.expiredAt < new Date()) {
      throw customError(400, "OTP has expired!");
    }
    await companyModel.findByIdAndUpdate(details.companyId, {
      emailVerified: true,
    });
    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    next(err);
  }
};

const verifyMobile = async (req, res, next) => {
  //again i am expecting the company id in the request body change it as per ui later.
  const details = {
    companyId: req.body.companyId,
    otp: req.body.otp,
  };
  try {
    if (!verifyOTPSchema.safeParse(details).success) {
      throw customError(400, "Invalid details!");
    }
    console.log(details);
    const mobileVerification = await mobileVerificationModel.findOne({
      companyId: details.companyId,
      otp: details.otp,
    });
    if (!mobileVerification) {
      throw customError(400, "Invalid OTP!");
    }
    await mobileVerificationModel.deleteOne({ _id: mobileVerification._id });
    if (mobileVerification.expiredAt < new Date()) {
      throw customError(400, "OTP has expired!");
    }
    await companyModel.findByIdAndUpdate(details.companyId, {
      mobileVerified: true,
    });
    return res.status(200).json({ message: "Mobile verified successfully!" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  signin,
  signout,
  verifyEmail,
  verifyMobile,
};
