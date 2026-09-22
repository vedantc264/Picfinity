import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './config/db.js';
import routerAPI from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Picfinity API Server is running with MySQL',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routerAPI);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Initialize Database and Start Server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`[Picfinity Server] Running on http://localhost:${PORT}`);
      console.log(`[Picfinity Server] API base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('[Picfinity Server] Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();

export default app;
