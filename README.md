# Yet Another Wiki

A Next.js-based wiki application with advanced features including authentication, rate limiting, and security protections.

## Deployment Options

You can deploy Yet Another Wiki in two ways:
1. Docker-based deployment (recommended for easier setup)
2. Traditional deployment on a Linux server or Windows

## Option 1: Docker Deployment (Recommended)

### Prerequisites
- A personal or pro license key: [Yet Another Wiki](https://www.yetanotherwiki.com)
- Docker Desktop or Docker and Docker Compose installed

System requirements:
* CPU: 1 CPU with at least 1 ghz
* Memory: 1 GB
* Disk space Required: base app is 2.1 GB, additional space for stored documents, files, pictures

### Installation Steps

### Option 1: Docker

Download (docker desktop)[https://www.docker.com/products/docker-desktop/] or install through terminal:

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
docker pull joverton/yet-another-wiki-app
```

3. Start the image
```bash
docker up -d -p 3000:3000 joverton/yet-another-wiki-app
```

### Option 2: Traditional Deployment

#### Option 2: Prerequisites

Before beginning the installation, ensure you have:

1. [Git](https://git-scm.com/downloads)
2. [Node.js](https://nodejs.org/en/download/prebuilt-installer/current)

#### Installation Steps

#### 1. Prepare Installation Directory

Open a terminal and navigate to the directory where you want to install Yet Another Wiki.

#### 2. Clone Repository

```bash
git clone https://github.com/john-overton/yet-another-wiki.git
```

#### 3. Navigate to Project Directory

```bash
cd yet-another-wiki
```

#### 4. Install Package Manager and Dependencies

```bash
# Install pnpm globally
npm install -g pnpm

# Install project dependencies
pnpm install
```

#### 5. Setup Server

```bash
pnpm run setup
```

### Running the Application

#### Development Mode

To start a development server:

```bash
pnpm run dev
```

### Production Mode

To prepare and run in production:

```bash
# Build for production (may take several minutes)
pnpm next build

# Start production server
pnpm next start
```