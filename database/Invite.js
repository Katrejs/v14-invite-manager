const mongoose = require("mongoose");

const Invite = mongoose.Schema({
  _id: String,
  inviterid: String,
  tarih: String
});

module.exports = mongoose.model("Invite", Invite);
