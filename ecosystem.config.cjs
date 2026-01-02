module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || "sr2-app",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        // sr2-beta: 3001, sr2-app (production): 3002
        PORT: process.env.PORT || (process.env.PM2_APP_NAME === "sr2-beta" ? 3001 : process.env.PM2_APP_NAME === "sr2-app" ? 3002 : 3000),
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
