const express = require("express");
const router = express.Router();

const CorralManager = require("../dao/db/corral-manager.js");
const corralManager = new CorralManager();

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id
    const newCorral = req.body;
    newCorral.owner = owner
    await corralManager.addCorral(newCorral);
    console.log(newCorral)
    res.redirect("/agregar");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});


router.post("/delete:cid", async (req,res) => {
  try {
    const deletedCorral = await corralManager.deleteCorral(req.params.cid)
    console.log(deletedCorral)
    res.redirect("/agregar")
  } catch (error) {
    console.log(error)
  }
})

module.exports = router