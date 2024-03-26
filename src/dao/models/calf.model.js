const mongoose = require("mongoose");

const calfSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  treatment: { type: String, required: true },
  endDate: { type: Date, required:true },
});


const CalfModel = mongoose.model("calves", calfSchema);

module.exports = CalfModel;
