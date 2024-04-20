const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./config.env" });
const app = express();
connectDB();

app.use(cors());
app.use(express.json({ extended: false, limit: "50mb" }));

// api names---
//example => app.use("/api/todo", require("./routes/todo"));

app.use("/api/userlist", require("./routes/userlist"));
app.use("/api/addstudents", require("./routes/addstudents"));
app.use("/api/addcourse", require("./routes/addcourse"));
app.use("/api/newsandannu", require("./routes/newsandannu"));
app.use("/api/request", require("./routes/request"));
app.use('/api/teacher', require("./routes/teacherRoutes"));
app.use('/api/student', require("./routes/studentRoutes"));
app.use('/api/assignments',require("./routes/assignmentRoutes"));
app.use('/api/questions',require("./routes/Quiz"));
app.use('/api/upload/teacher',require("./routes/VideoModel"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));



// ROUTES

