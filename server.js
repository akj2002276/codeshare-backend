const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ONLINE USERS
let onlineUsers = [];

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("user-online", (userId) => {
    if (!userId) return;

    const alreadyOnline = onlineUsers.find(
      (user) => user.userId === userId
    );

    if (!alreadyOnline) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    } else {
      alreadyOnline.socketId = socket.id;
    }

    io.emit(
      "online-users",
      onlineUsers.map((user) => user.userId)
    );
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    onlineUsers = onlineUsers.filter(
      (user) => user.socketId !== socket.id
    );

    io.emit(
      "online-users",
      onlineUsers.map((user) => user.userId)
    );
  });
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const batchRoutes = require("./routes/batchRoutes");
const topicRoutes = require("./routes/topicRoutes");
const fileRoutes = require("./routes/fileRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const contestRoutes = require("./routes/contestRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/contests", contestRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});