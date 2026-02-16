module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || "sr2-beta",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        // PORT is read from .env file by Next.js
      },
      // Logging
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
      // Restart policy
      max_restarts: 10,
      restart_delay: 1000,
      autorestart: true,
      watch: false,
      // Memory management
      max_memory_restart: "500M",
    },
  ],
};
