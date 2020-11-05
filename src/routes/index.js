const express = require("express");
const router = express.Router();
const Auth=require("../middlewares/auth");
const userRouter = require("./user");

router.use("/user", userRouter);

router.get("/",(req, res) => {
  res.render("index");
});
// to test auth only 
router.get("/auth-test",Auth,(req,res)=>{
  res.send("Auth working ");
})
router.get("*", (req, res, next) => {
  const error = new Error("Invalid Endpoint");
  error.statusCode = 404;
  next(error);
});

router.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.statusCode || 500).json({
    error: true,
    message: error.message || "An Error Occured",
    route: req.url,
  });
});

module.exports = router;
