# Deployment Guide for sr2.ru

## Architecture

This Next.js application runs in server mode with API routes support:
- **Frontend**: Next.js on port 3001
- **API Routes**: `/api/message` and `/api/thankyou` for Telegram bot integration
- **Process Manager**: PM2
- **Web Server**: nginx (proxy to localhost:3001)
- **Server**: rayz.ru

## Server Configuration

### Directory Structure
```
/var/www/sr2/data/www/sr2.ru/
├── .env                    # Environment variables (not in git)
├── .next/                  # Next.js build output
├── node_modules/
├── src/
├── ecosystem.config.cjs    # PM2 configuration
├── next.config.js
└── package.json
```

### Environment Variables

Create `/var/www/sr2/data/www/sr2.ru/.env` on the server:

```env
BOT_TOKEN=2084173352:AAGSgT0S6zok6GQX1WT8DFX9yh468_vbn1Y
PERSONAL_ID=191201984
NODE_ENV=production
PORT=3001
```

⚠️ **Important**: The `.env` file is excluded from git for security. It must be created manually on the server.

### Nginx Configuration

Nginx is configured to proxy all requests to the Next.js server on port 3001:

```nginx
upstream sr2.ru {
    server localhost:3001;
    keepalive 64;
}

server {
    server_name sr2.ru www.sr2.ru;
    listen 217.18.62.152:443 ssl http2;

    location / {
        proxy_pass http://sr2.ru;
        proxy_http_version 1.1;
        include /etc/nginx/proxy_params;
    }

    location /api/ {
        proxy_pass http://sr2.ru;
        proxy_http_version 1.1;
        include /etc/nginx/proxy_params;
    }
}
```

Configuration file: `/etc/nginx/fastpanel2-available/sr2/sr2.ru.conf`

### PM2 Process

The application runs as a PM2 process named `sr2.ru`:

```bash
# Start the application
pm2 start ecosystem.config.cjs --env production

# Check status
pm2 status sr2.ru

# View logs
pm2 logs sr2.ru

# Restart
pm2 reload sr2.ru
```

## GitHub Actions Deployment

### Required Secrets

Configure these secrets in GitHub repository settings:
- `HOST`: `rayz.ru`
- `USER`: `sr2`
- `PASSWORD`: SSH password for sr2 user

### Deployment Flow

When you push to `main` branch:

1. **Sync Files**: rsync project files to server (excluding node_modules, .next, etc.)
2. **Install Dependencies**: `npm ci` on the server
3. **Build**: `npm run build` creates optimized production build
4. **Restart PM2**: Reloads the application with zero downtime

### Manual Deployment

You can trigger deployment manually from GitHub Actions tab using "workflow_dispatch".

## API Routes

### POST /api/message
Sends parking information to Telegram bot.

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "parking": "string"
}
```

**Response:**
```json
{
  "status": true
}
```

### POST /api/thankyou
Sends a thank you message to Telegram bot.

**Request Body:**
```json
{
  "message": "string"
}
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your credentials:
```env
BOT_TOKEN=your_bot_token
PERSONAL_ID=your_telegram_id
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Troubleshooting

### API routes not working
- Ensure Next.js is NOT in `output: 'export'` mode (check `next.config.js`)
- Verify environment variables are loaded: check PM2 logs
- Check nginx is proxying requests: `nginx -t && systemctl status nginx`

### PM2 process not starting
```bash
# Check PM2 logs
pm2 logs sr2.ru --lines 50

# Restart PM2
pm2 restart sr2.ru

# If needed, delete and start fresh
pm2 delete sr2.ru
pm2 start ecosystem.config.cjs --env production
pm2 save
```

### Environment variables not loaded
PM2 reads `.env` file from the project directory. Verify:
```bash
cd /var/www/sr2/data/www/sr2.ru
cat .env
pm2 restart sr2.ru --update-env
```

### Port already in use
If port 3001 is occupied, update:
1. `.env` file on server: `PORT=3002`
2. `ecosystem.config.cjs`: `PORT: '3002'`
3. nginx config: `server localhost:3002;`
4. Restart nginx and PM2

## Monitoring

- **PM2 Dashboard**: `pm2 monit`
- **Logs**: `/var/www/sr2/data/www/sr2.ru/logs/`
- **Nginx Logs**: `/var/www/sr2/data/logs/sr2.ru-frontend.{access,error}.log`
