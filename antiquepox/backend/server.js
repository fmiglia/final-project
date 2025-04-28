import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import config from './config.js';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import stripeRouter from './routes/stripeRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import cors from 'cors';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID || 'sb');
});

// CORS middleware configuration
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials to be sent with requests
  })
);

// routes
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/messages', messageRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = config.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
