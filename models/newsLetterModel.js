const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({

    email: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      default: Date.now,
      required: true
    }
  });

module.exports = mongoose.model("NewsLetter", newsLetterSchema);
