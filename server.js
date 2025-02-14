import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/database.js'; // Add the .js extension if it's a local file
import router from './src/routes/api.js'; // Add the .js extension if it's a local file

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', router);

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to VocalTrainingDB API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
