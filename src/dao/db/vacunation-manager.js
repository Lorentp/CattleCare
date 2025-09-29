const VacunationModel = require("../models/vacunation.model")


class VacunationManager {
    async addVacunation({
        name,
        owner
    }){
        try {
            let vacunationExist = await VacunationModel.findOne({ owner: owner, name: name})
            
            if(vacunationExist){
                return {
                    success: false,
                    message: "El protocolo ya existe"
                }
            }

            const newVacunation = new VacunationModel({
                name,
                owner,
            })

            await newVacunation.save()

            return{
                success: true,
                message: "Protocolo creado con exito"
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    async getProtocols(userId){
        try {
            const protocols = await VacunationModel.find({ owner:userId })
            return protocols
        } catch (error) {
            console.log(error)
        }
    }

    async deleteVacunation(id){
        try {
            const deletedVacunation = await VacunationModel.findByIdAndDelete(id)

            if(!deletedVacunation){
                return{
                    success: false,
                    message: "No existe"
                }
            }

            return{
                success:true,
                message: "Protocolo eliminado con exito",
                data: deletedVacunation
            }        
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = VacunationManager