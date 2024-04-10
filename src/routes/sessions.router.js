const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");




router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {

    if(!username && !password){
      req.session.errors = {username:"Por favor ingrese un usuario", password:"Por favor ingrese una contraseña"} 
      return res.redirect("/")
    }
    if(!username){
      req.session.error = {username:"Por favor ingrese un usuario"}
    }

    if(!password){
      req.session.error = {password:"Por favor ingrese un usuario"}
      return res.redirect("/")
    }

    const user = await UserModel.findOne({ username: username });
    
    if(user.username !== username || user.password !== password){
      req.session.errors = { username: "El usuario o la contraseña son incorrectos", password:"El usuario o la contraseña son incorrectos"}
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
