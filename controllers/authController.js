const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= GENERATE TOKEN =================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
      trainerKey,
    } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // ================= CHECK USER =================
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ================= TRAINER SECURITY =================
    if (role === "trainer") {

      if (!trainerKey) {
        return res.status(401).json({
          message: "Trainer Secret Key required",
        });
      }

      if (
        trainerKey !== process.env.TRAINER_SECRET
      ) {
        return res.status(401).json({
          message: "Invalid Trainer Secret Key",
        });
      }
    }

    // ================= HASH PASSWORD =================
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // ================= RESPONSE =================
    res.status(201).json({
      success: true,
      message: "Account Created Successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // ================= FIND USER =================
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // ================= MATCH PASSWORD =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // ================= RESPONSE =================
    res.status(200).json({
      success: true,
      message: "Login Successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  registerUser,
  loginUser,
};