import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { userRouter } from './routes/user.js';
import { blogRouter } from './routes/blog.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

// Validation schemas
export const signupInput = z.object({
  email: z.string().email().optional(),
  name: z.string(),
  username: z.string(),
  password: z.string().min(6),
});

export const signinInput = z.object({
  username: z.string(),
  password: z.string(),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

const app = express();
const PORT = process.env.PORT || 3000;

// Create Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Health check endpoint with database test
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log('Database health check failed:', error);
    res.status(503).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Run migrations on startup
async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    await prisma.$executeRawUnsafe(`SELECT 1`);
    console.log('✅ Database connected, ready to accept requests');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Start server
async function start() {
  await runMigrations();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
