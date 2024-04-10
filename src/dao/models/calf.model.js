const mongoose = require("mongoose");

const calfSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  treatment: { type: String, required: true },
  medication: { type: String, required: true},
  duration: { type: Number, required: true},
  endDate: { type: Date, required: true },
  corral: { type: String, required:true},
  corralId: {type: String, required:true},
  finished:{type:Boolean, default:false},
  resetTreatment:{type:Boolean, default:false},
  prevTreatment:{type:String },
  prevEndDate:{type:Date},
  
});


const CalfModel = mongoose.model("calves", calfSchema);

module.exports = CalfModel;
