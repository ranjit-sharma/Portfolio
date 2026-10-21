const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB with automated retries and resilient connection options.
 */
const connectDB = async (retries = 5, delayMs = 3000) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set in server/.env');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 Connecting to MongoDB Atlas (attempt ${attempt}/${retries})...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000, // 30s timeout for Atlas latency
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
      });

      isConnected = true;
      console.log(`✅ MongoDB connected: ${conn.connection.host} [database: ${conn.connection.name}]`);
      return conn;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('💥 All MongoDB connection attempts exhausted.');
        throw err;
      }
    }
  }
};

// Event handlers
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️  MongoDB disconnected. Attempting auto-reconnection in 3s...');
  setTimeout(() => {
    if (mongoose.connection.readyState === 0) {
      connectDB(3, 2000).catch((e) => {
        console.error('Auto-reconnect failed:', e.message);
      });
    }
  }, 3000);
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ MongoDB reconnected successfully');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ MongoDB error event:', err.message);
});

/**
 * Helper to inspect connection status
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const stateCode = mongoose.connection.readyState;
  return {
    isConnected: stateCode === 1,
    status: states[stateCode] || 'unknown',
    readyState: stateCode,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};

module.exports = connectDB;
module.exports.getConnectionStatus = getConnectionStatus;
