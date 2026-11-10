const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  offeredSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },

  requestedSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },

  message: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);

