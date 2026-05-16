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

// LIVE CODE STATE
let liveCodeState = {
  code: `console.log("Welcome to CodeShareX Live Code");`,
  language: "javascript",
  input: "",
  output: "",
  isLive: false,
};

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // SEND CURRENT LIVE CODE TO NEW USER
  socket.emit("live-code-state", liveCodeState);

  // USER ONLINE
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

  // TRAINER START LIVE
  socket.on("live-start", () => {
    liveCodeState.isLive = true;

    io.emit("live-code-state", liveCodeState);
  });

  // TRAINER STOP LIVE
  socket.on("live-stop", () => {
    liveCodeState.isLive = false;

    io.emit("live-code-state", liveCodeState);
  });

  // TRAINER CODE CHANGE
  socket.on("live-code-change", (code) => {
    liveCodeState.code = code;

    socket.broadcast.emit("live-code-update", code);
  });

  // TRAINER LANGUAGE CHANGE
  socket.on("live-language-change", (language) => {
    liveCodeState.language = language;

    io.emit("live-language-update", language);
  });

  // TRAINER INPUT CHANGE
  socket.on("live-input-change", (input) => {
    liveCodeState.input = input;

    socket.broadcast.emit("live-input-update", input);
  });

  // TRAINER OUTPUT CHANGE
  socket.on("live-output-change", (output) => {
    liveCodeState.output = output;

    io.emit("live-output-update", output);
  });

  // RESET LIVE CODE
  socket.on("live-reset", () => {
    liveCodeState = {
      code: `console.log("Welcome to CodeShareX Live Code");`,
      language: "javascript",
      input: "",
      output: "",
      isLive: false,
    };

    io.emit("live-code-state", liveCodeState);
  });

  // DISCONNECT
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