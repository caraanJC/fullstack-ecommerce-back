import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';
import authRouter from './routes/auth.js';

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('connected to db!');
  }
);

app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Welcome');
});

app.listen(port, () => console.log(`App is listening to PORT ${port}`));
