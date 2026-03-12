import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import laborRoutes from './routes/laborRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js'; // 1. Import invoice routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'ERP Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/labor', laborRoutes);
app.use('/api/invoices', invoiceRoutes); // 2. Add invoice route endpoint

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});