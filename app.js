import express from 'express';
import cors from 'cors';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import path from 'path';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Database connection
import connectDB from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Stripe setup
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// Connect to MongoDB
connectDB();

// Cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/order', orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
