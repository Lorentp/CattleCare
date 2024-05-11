const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner", required: true },
  title: { type: String, required: true },
  taskOne: { type: String},
  taskTwo: { type: String},
  taskThree: { type: String},
  taskFour: { type: String},
  taskFive: { type: String},
  taskSix: { type: String},
  taskSeven: { type: String},
  taskEight: { type: String},
  photoOne: {type: String},
  photoTwo: {type: String},
  
});

const ScheduleModel = mongoose.model("schedules", scheduleSchema);

module.exports = ScheduleModel;
