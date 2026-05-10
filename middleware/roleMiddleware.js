const trainerOnly = (req, res, next) => {

  if (req.user && req.user.role === "trainer") {

    next();

  } else {

    return res.status(403).json({
      message: "Access denied. Trainers only.",
    });

  }

};

module.exports = trainerOnly;