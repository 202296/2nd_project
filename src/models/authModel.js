const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      salary: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      hireDate: {
        type: String,
        required: true,
      },
      jobTitle: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
        unique: true,
      },
      role: {
        type: String,
        default: "employee",
      },
    },
  );

//Export the model
module.exports = mongoose.model('User', userSchema);