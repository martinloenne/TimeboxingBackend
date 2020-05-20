const slugify = require('slugify');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name for the project'],
      unique: true,
      trim: true,
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
    },
    slugURL: String,
    description: {
      type: String,
      required: [false, 'Please add a description'],
      maxlength: [800, 'Description can not be more than 800 characters']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Maybe make my own slugify
// Mongoose Middleware runs before(pre) save of the model
// Create project slug from the name
// This is used to make URL to the user directly on the front-end
projectSchema.pre('save', function(next) {
  this.slugURL = slugify(this.name, { lower: true });
  next(); // Move to the next middleware if any
});

module.exports = mongoose.model('project', projectSchema);