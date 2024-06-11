const mongoose = require("mongoose");

const calfStopMilkingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  name: { type: String, required: true },
  finished:{type:Boolean, default:false},
  startStopMilkingDate:{type:Date},
  stopStopMilkingDate:{type:Date},
  stopMilkingProtocol: { type: mongoose.Schema.Types.ObjectId, ref: 'CalfStopMilkingProtocol', required: true }
});


const CalfStopMilkingModel = mongoose.model("calvesStopMilking", calfStopMilkingSchema);

module.exports = CalfStopMilkingModel;
