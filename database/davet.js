const mongoose = require("mongoose");

const davet = mongoose.Schema({
  _id: String,
  size: Number
});

module.exports = mongoose.model("davet", davet);