const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    time: {
      type: mongoose.SchemaTypes.Number,
      required: true
		},
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'project',
      required: true
		},
		category: {
      type: mongoose.Schema.ObjectId,
      ref: 'category',
      required: true
		},
		type: {
      type: mongoose.Schema.ObjectId,
      ref: 'type',
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

module.exports = mongoose.model('session', sessionSchema);