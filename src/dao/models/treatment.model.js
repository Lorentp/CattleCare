const mongoose = require("mongoose");

const treatmentsSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  medication: { type: String, required: true },
});

const TreatmentsModel = mongoose.model("treatments", treatmentsSchema);

module.exports = TreatmentsModel;
