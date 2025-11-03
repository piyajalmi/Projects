const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
    required: true
  },

  yearOfStudy: {
    type: String,
    enum: ['1st', '2nd'],
    required: function () {
      return this.role === 'student';
    }
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: function () {
      return this.role === 'student';
    }
  }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
