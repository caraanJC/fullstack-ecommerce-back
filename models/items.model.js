import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  priority: Number,
  outOfStock: Boolean,
  image: String,
  category: String,
});

const Items = mongoose.model('Items', ItemsSchema);
export default Items;
