const mongoose = require('mongoose');
const config = require('./config');
const dbContact = async () => {
  const conn = await mongoose.connect(config.DB.URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log(`Connected to DB!`);
};
module.exports = dbContact;