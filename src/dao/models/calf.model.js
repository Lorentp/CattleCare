const mongoose = require("mongoose");

const calfSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  name: { type: String, required: true },
  gender: { type: String },
  birthDate: { type: Date },
  birthType: { type: String },
  calfWeight: { type: String },
  calfCalostro: { type: String },
  startDate: { type: Date },
  treatment: { type: Array },
  endDate: { type: Date },
  corral: { type: String },
  corralId: { type: String },
  finished: { type: Boolean, default: false },
  resetTreatment: { type: Boolean, default: false },
  prevTreatment: { type: String },
  prevEndDate: { type: Date },
  lastDayTreated: { type: Date },
  isDead: { type: Boolean, default: false },
  timeDead: { type: Date },
  comment: { type: String },
  isReleased: { type: Boolean },
  releasedWeight: { type: Number },
  whenReleased: { type: Date },
  daysInGuachera: { type: Number },
  weightDiference: { type: Number },
  weightGainPerDay: { type: Number },
  stopMilking: { type: Boolean },
  mother: {type: String},
  vacunation: [{
    protocolId: {type: mongoose.Types.ObjectId,  ref: "vacunations"},
    date: {type: Date, default: Date.now}
  }]
});

const CalfModel = mongoose.model("calves", calfSchema);

module.exports = CalfModel;
