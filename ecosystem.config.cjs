module.exports = {
  apps: [
    {
      name: 'sr2.ru',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/sr2/data/www/sr2.ru',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: '3001',
        // Telegram bot credentials will be loaded from .env file
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}
