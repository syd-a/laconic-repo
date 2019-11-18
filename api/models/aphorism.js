const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aphorismSchema = new Schema({
  content: {type: String, required: true},
  votes: {type: Number, default: 0},
  voters: [{type: Schema.Types.ObjectId, ref: "Speaker"}],
  tags: [{type: String}],
  speaker_id: {type: Schema.Types.ObjectId, ref: "Speaker", required: true},
  speaker_name: {type: String, required: true},
  date: {type: Date, default: Date.now}
});

const Aphorism = mongoose.model("Aphorism", aphorismSchema);
module.exports = Aphorism;
