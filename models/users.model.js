import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: { type: String, required: true, min: 6, max: 255 },
  password: { type: String, required: true, min: 6, max: 1024 },
  email: { type: String, min: 6, max: 255 },
  date: { type: Date, default: Date.now },
  firstName: String,
  lastName: String,
  fb: String,
  phone: String,
  address1: String,
  address2: String,
  lastAddress: String,
  roles: [String],
  cartItems: [],
  orders: [
    {
      items: [],
      status: String,
      userID: String,
      date: Date,
      address: String,
    },
  ],
});

export default mongoose.model('Users', UsersSchema);
