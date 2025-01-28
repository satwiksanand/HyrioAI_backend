require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const rootRouter = require("./routes/index");
const PORT = 3000;
app.use(
  cors({
    origin: [
      "https://hyrioaifrontend.vercel.app/",
      "http://localhost:5173/",
      "https://hyrioaifrontend-dzvn8ybh0-satwik-sanands-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
