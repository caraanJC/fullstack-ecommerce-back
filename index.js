import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(
  'mongodb+srv://user:1234@cluster0.vklrd.mongodb.net/7JsKitchen?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);
app.listen(port, () => console.log(`App is listening to PORT ${port}`));
