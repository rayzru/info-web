// This file is not needed for static site deployment
// Static files from 'out' directory are served directly by nginx/apache
// Keep this file for reference only

module.exports = {
  apps: [
    {
      name: 'sr2.ru',
      script: 'npx',
      args: 'serve out -l 3000',
      cwd: '/var/www/sr2/data/www/sr2.ru',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}
