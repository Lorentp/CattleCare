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
        res.status(201).json({ success: true, message: "Tarea creada con exito"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error al crear la tarea" });
    }
})


router.post("/update/:cid", async (req,res) => {
    try {
        const { cid } = req.params
        const updatedScheduleData = req.body

        const result = await scheduleManager.updateSchedule(cid, updatedScheduleData)
        
        if (result.success){
            res.status(200).json(result)
        } else {
            res.status(500).json(result)
        }
    } catch (error) {
        console.log(error)
    }
})


router.post("/delete/:cid", async(req,res)=> {
    try {
        const {cid} = req.params
        const result = await scheduleManager.deleteSchedule(cid)
        if(result.success){
            res.status(200).json(result)
        } else {
            res.status(404).json(result)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
})


module.exports = router