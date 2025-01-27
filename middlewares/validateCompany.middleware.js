const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
const { companyModel } = require("../db");

const validateCompany = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    if (!token) {
      throw customError(411, "Invalid Token!");
    }
    const decodedCompany = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedCompany) {
      throw customError(411, "Invalid Token");
    }
    //i also want to check if there is any pending verification liek email or mobile
    //if the token is not invalid find the company and check for the latest data of verification
    const company = await companyModel.findById(decodedCompany.companyId);
    req.body.companyId = decodedCompany.companyId;
    if (!company.emailVerified || !company.mobileVerified) {
      throw customError(411, "Email or Mobile not verified yet!");
    }
    req.company = decodedCompany;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validateCompany;
