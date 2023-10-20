const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");

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
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
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
      password: {
        type: String,
        required: true,
        validate: {
        validator: function (value) {
          // Minimum length of 8 characters
          if (value.length < 8) return false;

          // Maximum length of 26 characters
          if (value.length > 26) return false;

          // At least 1 lowercase letter
          if (!/[a-z]/.test(value)) return false;

          // At least 1 uppercase letter
          if (!/[A-Z]/.test(value)) return false;

          // At least 1 numeric character
          if (!/\d/.test(value)) return false;

          // At least 1 symbol character (e.g., @, #, $, etc.)
          if (!/[!@#$%^&*]/.test(value)) return false;

          return true; // Password meets all requirements
        },
        message: 'Password does not meet the requirements of: Minimum length of 8 characters, At least 1 lowercase letter, At least 1 uppercase letter, At least 1 numeric character, At least 1 symbol character (e.g., @, #, $, etc.)',
      },
    },

    role: {
      type: String,
      default: "employee",
    },
    refreshToken: {
      type: String,
    },
    },
    {
    timestamps: true,
    }
  );

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

//Export the model
module.exports = mongoose.model('User', userSchema);