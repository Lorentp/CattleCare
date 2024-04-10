const mongoose = require("mongoose");

const corralSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  corral: {type: String, required: true}
});

const CorralModel = mongoose.model("corral", corralSchema);

module.exports = CorralModel;
