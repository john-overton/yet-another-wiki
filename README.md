# Yet Another Wiki - Demo

A Next.js-based wiki application with advanced features including authentication, rate limiting, and security protections.

## Deployment Options

You can deploy Yet Another Wiki in two ways:
1. Docker-based deployment (recommended for easier setup)
2. Traditional deployment on a Linux server

## Option 1: Docker Deployment (Recommended)

### Prerequisites
- A Linux server (Ubuntu 20.04 or later recommended)
- Docker and Docker Compose installed

### Installation Steps

1. [Install Docker and Docker Compose](https://docs.docker.com/engine/install/ubuntu/):
```shell
# 1. Set up Docker's [apt] repository.
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# 2. To install the latest version, run:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Verify that the installation is successful by running the hello-world image:
sudo docker run hello-world
```

2. Clone the repository:
```bash
git clone https://github.com/yourusername/yet-another-wiki.git
cd yet-another-wiki
```

3. Configure your domain:
```bash
# Edit the NEXTAUTH_URL in docker-compose.yml
nano docker-compose.yml
```

4. Start the application:
```bash
docker-compose up -d
```

The application will be available at your domain, with SSL certificates automatically managed by Certbot.

## Option 2: Traditional Deployment

### System Setup

1. Get a Linux server (Ubuntu 20.04 or later recommended)

2. Download and run the system setup script:
```bash
wget https://raw.githubusercontent.com/yourusername/yet-another-wiki/main/scripts/setup-system.sh
chmod +x setup-system.sh
sudo ./setup-system.sh
```

This script will install:
- Node.js 18.x
- PNPM
- Nginx
- Certbot
- Git
- PM2
- Configure basic firewall rules

### Application Deployment

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yet-another-wiki.git
cd yet-another-wiki
```

2. Run the application setup:
```bash
node scripts/setup.js
```

3. Deploy the application:
```bash
node scripts/deploy-prod.js yourdomain.com
```

## Post-Deployment

### For Docker Deployment
- View logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Update application: `docker-compose pull && docker-compose up -d`

### For Traditional Deployment
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs`
- View Nginx logs: `tail -f /var/log/nginx/access.log`

## Configuration

Key configuration files:
- `.env.production`: Environment variables
- `nginx/conf.d/app.conf`: Nginx configuration
- `config/settings/`: Application settings

### Environment Variables

Required environment variables:
- `NEXTAUTH_URL`: Your domain URL
- `NEXTAUTH_SECRET`: Random string for session encryption
- `DATABASE_URL`: Path to SQLite database

## Security Features

The application includes several security features:
- Rate limiting for API and regular endpoints
- IP blocking for repeated failed login attempts
- SSL/TLS configuration with modern cipher suites
- Security headers including HSTS, CSP, and XSS protection
- Request body size limits and timeout configurations

## Troubleshooting

### Docker Deployment Issues
1. Container not starting:
   - Check logs: `docker-compose logs app`
   - Verify environment variables
   - Check disk space and permissions

2. SSL Certificate Issues:
   - Verify domain DNS settings
   - Check Certbot logs: `docker-compose logs certbot`
   - Ensure ports 80/443 are open

### Traditional Deployment Issues
1. Application Not Starting:
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check Node.js version compatibility

2. Nginx Issues:
   - Test configuration: `nginx -t`
   - Check error logs: `tail -f /var/log/nginx/error.log`
   - Verify permissions on config files

## Testing

Run the test suite:

```bash
# Set up test environment
node scripts/setup-test-env.js

# Run authentication tests
node scripts/test-auth.js

# Clean up test environment
node scripts/cleanup-test-env.js
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
