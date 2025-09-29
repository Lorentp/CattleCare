const mongoose = require("mongoose")

const vacunationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  name: { type: String, required: true },
});

const VacunationModel = mongoose.model("vacunations", vacunationSchema);

module.exports = VacunationModel;
