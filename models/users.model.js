import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: String,
  password: String,
  email: String,
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

const Users = mongoose.model('Users', UsersSchema);
export default Users;
