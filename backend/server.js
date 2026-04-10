/**
 * Express.js Backend Server
 * Serves React frontend and proxies ML analysis to FastAPI
 */
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

dotenv.config();

// 🔥 MongoDB Connection (LOCAL)
mongoose.connect('mongodb+srv://amansinamdar2005:aman123@cluster0.sbtyicz.mongodb.net/?appName=Cluster0/password-analyzer')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

const app = express();
const PORT = process.env.PORT || 5000;
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Serve static files (React build)
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mlService: ML_API_URL
  });
});

// Proxy to ML service - Analyze password
app.post('/api/analyze',auth, async (req, res) => {
  try {
    const { password } = req.body;
    

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Add timestamp for latency tracking
    const startTime = Date.now();

    // Call FastAPI ML service
    const response = await axios.post(`${ML_API_URL}/analyze`, {
      password: password
    }, {
      timeout: 10000 // 10 second timeout
    });

    const analysisTime = Date.now() - startTime;

    // Add network latency to response
    response.data.network_latency_ms = analysisTime;
    response.data.total_latency_ms = analysisTime + response.data.estimated_latency_ms;

    res.json(response.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'ML service is unavailable',
        details: 'Make sure FastAPI server is running on ' + ML_API_URL
      });
    }

    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
});

// Proxy to ML service - Get password suggestions
app.post('/api/suggest', async (req, res) => {
  try {
    const { password } = req.body;

    const startTime = Date.now();

    const response = await axios.post(`${ML_API_URL}/suggest`, {
      password: password || ''
    }, {
      timeout: 10000
    });

    const responseTime = Date.now() - startTime;

    res.json({
      suggestions: response.data,
      latency_ms: responseTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Suggestion Service Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: error.message 
    });
  }
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`✅ Express server running on http://localhost:${PORT}`);
  console.log(`📡 Connected to ML service at ${ML_API_URL}`);
});

module.exports = app;
