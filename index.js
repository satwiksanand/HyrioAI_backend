require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const rootRouter = require("./routes/index");
const PORT = 3000;

const allowedOrigins = [
  "https://hyrioaifrontend.vercel.app",
  "http://localhost:5173",
  "https://hyrioaifrontend-dzvn8ybh0-satwik-sanands-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
