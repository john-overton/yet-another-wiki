# Database Setup Documentation

## PostgreSQL Setup and Database Initialization Guide

### 1. Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the project repository)

### 2. Docker-based PostgreSQL Setup

We now use Docker to set up and run PostgreSQL. This method provides easier setup, better portability, and simplified management.

#### Step 1: Prepare the Docker Compose file

Ensure the `docker-compose.yml` file is in your project root directory. It should contain the following:

```yaml
version: '3.8'

services:
  postgresql:
    image: bitnami/postgresql:latest
    ports:
      - '5432:5432'
    volumes:
      - 'postgresql_data:/bitnami/postgresql'
      - '.db:/docker-entrypoint-initdb.d'
    environment:
      - POSTGRESQL_USERNAME=rfp_user
      - POSTGRESQL_PASSWORD=rfp_password
      - POSTGRESQL_DATABASE=rfp_application
      - POSTGRESQL_POSTGRES_PASSWORD=admin_password
      - POSTGRESQL_EXTRA_FLAGS=--max_connections=100 --shared_buffers=256MB
      - POSTGRESQL_ENABLE_LDAP=no
      - POSTGRESQL_ENABLE_TLS=no
      - POSTGRESQL_LOG_HOSTNAME=yes
      - POSTGRESQL_LOG_CONNECTIONS=yes
      - POSTGRESQL_LOG_DISCONNECTIONS=yes
      - POSTGRESQL_PGAUDIT_LOG=ALL
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "rfp_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgresql_data:
    driver: local
```

#### Step 2: Prepare the schema file

Ensure your `DatabaseSchema0.01.sql` file is located in the `.db` directory of your project.

#### Step 3: Start the PostgreSQL container

Run the following command in your project root directory:

```bash
docker-compose up -d
```

This command will download the PostgreSQL image (if not already present), create a container, and start it in detached mode.

#### Step 4: Verify the setup

You can check if the container is running with:

```bash
docker-compose ps
```

To view the logs:

```bash
docker-compose logs postgresql
```

### 3. Connecting to the Database

You can connect to the PostgreSQL database using any PostgreSQL client. Use the following credentials:

- Host: localhost
- Port: 5432
- Database: rfp_application
- Username: rfp_user
- Password: rfp_password

For example, using psql:

```bash
psql -h localhost -p 5432 -U rfp_user -d rfp_application
```

### 4. Stopping the Database

To stop the PostgreSQL container:

```bash
docker-compose down
```

To stop the container and remove the volume (this will delete all data):

```bash
docker-compose down -v
```

### 5. Updating the Schema

If you need to update the database schema:

1. Modify the `DatabaseSchema0.01.sql` file in the `.db` directory.
2. Restart the container:

```bash
docker-compose down
docker-compose up -d
```

Note: This method will recreate the database. For production environments, consider using a database migration tool.

### 6. Backup and Restore

To backup the database:

```bash
docker-compose exec postgresql pg_dump -U rfp_user rfp_application > backup.sql
```

To restore from a backup:

```bash
cat backup.sql | docker-compose exec -T postgresql psql -U rfp_user -d rfp_application
```

Remember to replace sensitive information like passwords with environment variables in a production setup.