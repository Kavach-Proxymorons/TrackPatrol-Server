import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  last_login: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', authSchema);

export default User;
