

export const getDashboard = (req, res) => {
  // req.student is available from middleware
  res.json({
    success: true,
    message: "Welcome to your dashboard",
    student: req.student
  });
};
