require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async () => {
  try {
    // Attempt DB connection with retries
    await connectDB();
  } catch (err) {
    console.error('⚠️  Initial MongoDB connection could not be established:', err.message);
    console.log('Server will continue running; background reconnection will retry...');
  }

  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${PORT} is busy, retrying in 1s...`);
      setTimeout(() => {
        try { server.close(); } catch (_) {}
        server.listen(PORT);
      }, 1000);
    } else {
      console.error('❌ Server error:', err);
    }
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  // Graceful shutdown helper
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle nodemon restart signal cleanly
  process.once('SIGUSR2', () => {
    server.close(() => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
  });
};

startServer();
