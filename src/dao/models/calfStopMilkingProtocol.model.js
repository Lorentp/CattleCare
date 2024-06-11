const mongoose = require("mongoose");

const calfStopMilkingProtocolSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  calfAgeToStart: {type: Number, required: true},
  stopMilkingProtocolDuration: {type:Number, required:true},
  stopMilkingDays: {type:[String], required: true}
});


const CalfStopMilkingProtocolModel = mongoose.model("protocolStopMilking", calfStopMilkingProtocolSchema);

module.exports = CalfStopMilkingProtocolModel;
