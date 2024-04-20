const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");




router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {

    const user = await UserModel.findOne({ username: username });
    
    if(!user){
      req.session.errors = { username: "Error, el usuario no existe"}
      return res.redirect("/")
    }
    if(user.password !== password){
      req.session.errors = {password:"Error, contraseña incorrecta"}
      return res.redirect("/")
    }
    

    if (user.password === password) {
      req.session.login = true;
      req.session.user = user
      res.redirect("/home");
    } 
  } catch (error) {
    res.send(error);
  }
});



router.get("/logout", async (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/")
});

module.exports = router;
