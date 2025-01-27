const { jobModel } = require("../db/index");
const customError = require("../utils/customError");
const zod = require("zod");
const nodemailer = require("nodemailer");

const jobSchema = zod.object({
  title: zod.string().nonempty(),
  description: zod.string().nonempty(),
  experience: zod.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]),
  endDate: zod.date(),
});

const addCandidateSchema = zod.object({
  candidateEmail: zod.string().email(),
  jobId: zod.string().nonempty(),
});

const sendUdpateSchema = zod.object({
  subject: zod.string().nonempty(),
  text: zod.string().nonempty(),
  jobId: zod.string().nonempty(),
});

const createJob = async (req, res, next) => {
  const job = {
    title: req.body.title,
    description: req.body.description,
    experience: req.body.experience,
    endDate: new Date(req.body.endDate),
  };
  try {
    if (!jobSchema.safeParse(job).success) {
      throw customError(400, "Invalid details!");
    }
    //let's say one company can post many jobs with the same title and description for now.
    const newJob = new jobModel({
      author: req.body.companyId,
      title: job.title,
      description: job.description,
      experience: job.experience,
      endDate: job.endDate,
    });
    await newJob.save();
    return res.status(201).json({
      message: "job created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res, next) => {
  const companyId = req.body.companyId;
  try {
    const job = await jobModel.find({ author: companyId });
    return res.status(200).json(job);
  } catch (err) {
    next(err);
  }
};

// i don't know what the ui requirements are man so i'm just going to let it be simple.

const addCandidate = async (req, res, next) => {
  //the body here will contain only one string and that will be the email.
  //i am expecting the jobid of the job here so take that into account.
  const details = {
    candidateEmail: req.body.candidateEmail,
    jobId: req.body.jobId,
  };
  try {
    if (!addCandidateSchema.safeParse(details).success) {
      throw customError(400, "Invalid details!");
    }
    await jobModel.findByIdAndUpdate(req.body.jobId, {
      $addToSet: { candidate: details.candidateEmail }, //no duplicate user in the applied list.
    });
    return res.status(201).json({
      message: "Candidate added successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// this function is meant to send email updates to the user.

const sendUpdate = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    //the organization will send the email of company behalf.
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ORG_EMAIL,
      pass: process.env.ORG_API_KEY,
    },
  });
  //email should contain sender information and job details.
  const details = {
    subject: req.body.subject,
    text: req.body.text,
    jobId: req.body.jobId,
  };
  try {
    //again let's say i am expecting the jobID of the job, for now let's say that the user is sending it in body.
    if (!sendUdpateSchema.safeParse(details).success) {
      throw customError(400, "Invalid Details");
    }
    const job = await jobModel.findById(details.jobId);
    if (!job) {
      throw customError(401, "job doesn't exist");
    }
    const candidatesEmail = job.candidate.join(", ");
    await transporter.sendMail({
      from: req.company.companyEmail, //you might not want to share the company email that the company used for registration, but we have to share the sender details so let it be
      to: candidatesEmail,
      subject: `${details.subject} for ${job.title}`, //sharing job details
      text: details.text,
    });
    return res.status(200).send({
      message: "Email sent successfully!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createJob,
  addCandidate,
  sendUpdate,
  getAllJobs,
};
