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

    console.log("ONLINE USERS:", onlineUsers);

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

    console.log("ONLINE USERS AFTER DISCONNECT:", onlineUsers);

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

// NEW COMPILER ROUTE
const compilerRoutes = require("./routes/compilerRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/files", fileRoutes);

// NEW COMPILER API
app.use("/api/compiler", compilerRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});


const PORT = process.env.PORT || 8000;


// IMPORTANT
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});