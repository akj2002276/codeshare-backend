const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const batchRoutes = require("./routes/batchRoutes");
const topicRoutes = require("./routes/topicRoutes");
const fileRoutes = require("./routes/fileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/files", fileRoutes);
// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});