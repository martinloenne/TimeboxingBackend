const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name for the project'],
      maxlength: [80, 'Name need to be less than 80 characteres']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('category', categorySchema);