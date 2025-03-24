const ScheduleModel = require("../models/daySchedule.model")

class ScheduleManager { 
    async addSchedule({owner, title, taskOne, taskTwo, taskThree, taskFour, taskFive, taskSix, taskSeven, taskEight }){
        try {

            const newSchedule = new ScheduleModel({
                owner, 
                title, 
                taskOne, 
                taskTwo, 
                taskThree, 
                taskFour, 
                taskFive, 
                taskSix, 
                taskSeven, 
                taskEight,     
            })

            await newSchedule.save()
            console.log("Nueva tarea creada", newSchedule)
        } catch (error) {
            console.log(error)
        }
    }

    async getSchedules(userId){
        try {
            const schedules = await ScheduleModel.find({owner: userId})
            return schedules
        } catch (error) {
            console.log(error)            
        }
    }

    async updateSchedule(id, updatedScheduleData){
        try {
            const updatedSchedule = await ScheduleModel.findByIdAndUpdate(id, updatedScheduleData, { new:true })
            return {
                success: true,
                message: "Tarea actualizada con éxito",
                data: updatedSchedule
              };
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: "Error al actualizar la tarea"
              };
        }
    }

    async deleteSchedule(id){
        try {
            const deletedSchedule = await ScheduleModel.findByIdAndDelete(id)
            return {
                success: true,
                message: "Tarea eliminada con éxito",
                data: deletedSchedule
              };
        } catch (error) {
            console.log(error)
        }
    }
        
}


module.exports = ScheduleManager