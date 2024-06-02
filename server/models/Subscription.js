const mongoose = require("mongoose");

const keysSchema = new mongoose.Schema({
  auth: {
    type: String,
    required: true
  },
  p256dh: {
    type: String,
    required: true
  }
}, { _id: false });

const subscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true
  },
  expirationTime: {
    type: Date,
    default: null
  },
  keys: {
    type: keysSchema,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
