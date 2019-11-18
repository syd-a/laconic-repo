const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const speakerSchema = new Schema({
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  following: [{type: Schema.Types.ObjectId, ref: "Speaker"}],
  followers: [{type: Schema.Types.ObjectId, ref: "Speaker"}],
  date: {type: Date, default: Date.now}
});

const Speaker = mongoose.model("Speaker", speakerSchema);
module.exports = Speaker;
