const express = require("express");
const router = express.Router();
const ScheduleManager = require("../dao/db/schedule-manager.js")
const scheduleManager = new ScheduleManager()



router.post("/add", async (req,res) => {
    try { 
        const owner = req.session.user._id
        const {
            title, 
            taskOne, 
            taskTwo, 
            taskThree, 
            taskFour, 
            taskFive, 
            taskSix, 
            taskSeven, 
            taskEight,  
        } = req.body

        const newSchedule = {
            owner: owner,
            title: title,
            taskOne: taskOne, 
            taskTwo: taskTwo,
            taskThree: taskThree,
            taskFour: taskFour,
            taskFive: taskFive,
            taskSix: taskSix,
            taskSeven: taskSeven,
            taskEight: taskEight,  
        }


        await scheduleManager.addSchedule(newSchedule)
        res.redirect("/agregar")
    } catch (error) {
        console.log(error)
    }
})


router.post("/update:cid", async (req,res) => {
    try {
        const newSchedule = await scheduleManager.updateSchedule(req.params.cid, req.body)
        console.log(newSchedule)
        res.redirect("/agregar")
    } catch (error) {
        console.log(error)
    }
})


router.post("/delete:cid", async(req,res)=> {
    try {
        const deletedSchedule = await scheduleManager.deleteSchedule(req.params.cid)
        console.log(deletedSchedule)
        res.redirect("/agregar")
    } catch (error) {
        console.log(error)
    }
})


module.exports = router