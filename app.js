import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import entryRoutes from './routes/entryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

connectDB();

const app = express();
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//Testing backend
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use(express.static('public'));

app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;