# Deployment: Step-by-Step Guide

## 1. Prepare Docker Files (I have done this)

Ensure you have:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml` (For local testing)
- `.github/workflows/deploy.yml` (For automation)

## 2. Set Up AWS EC2 Instance

1.  **Launch Instance**: Go to AWS Console > EC2 > Launch Instance.
    - **OS**: Ubuntu Server 22.04 LTS (Recommended).
    - **Size**: `t2.micro` (Free Tier) or `t3.small`.
    - **Key Pair**: Create one (e.g., `blogger-key.pem`) and download it.
2.  **Security Group**: Add Inbound Rules:
    - SSH (Port 22) -> Anywhere (0.0.0.0/0)
    - HTTP (Port 80) -> Anywhere (0.0.0.0/0)
    - Custom TCP (Port 5000) -> Anywhere (Currently needed for API)

## 3. Install Docker on EC2

**On your local machine**, open a terminal where your `.pem` key is trying to SSH:
`ssh -i "path/to/key.pem" ubuntu@<EC2-PUBLIC-IP>`

**Inside the EC2 terminal**, run these commands one by one:

```bash
# Update and install Docker
sudo apt update
sudo apt install -y docker.io docker-compose

# Start Docker and enable it on boot
sudo systemctl start docker
sudo systemctl enable docker

# Give permission to ubuntu user (so you don't need sudo for docker)
sudo usermod -aG docker ubuntu

# Create app directory
mkdir -p /home/ubuntu/app
exit
```

## 4. Set Up GitHub Secrets

Go to your **GitHub Repository** > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

Add these exact names and values:

| Secret Name             | Value Example                                        |
| :---------------------- | :--------------------------------------------------- |
| `DOCKER_USERNAME`       | Your Docker Hub Username                             |
| `DOCKER_PASSWORD`       | Your Docker Hub Password (or Token)                  |
| `EC2_HOST`              | The Public IP of your EC2 instance                   |
| `EC2_USER`              | `ubuntu`                                             |
| `EC2_SSH_KEY`           | Paste the **entire content** of your `.pem` key file |
| `MONGO_URI`             | Your MongoDB Atlas Connection String                 |
| `JWT_SECRET`            | A secure random string                               |
| `CLOUDINARY_CLOUD_NAME` | Your Cloud Name                                      |
| `CLOUDINARY_API_KEY`    | Your API Key                                         |
| `CLOUDINARY_API_SECRET` | Your API Secret                                      |
| `GOOGLE_API_KEY`        | Your Gemini API Key                                  |
| `CLIENT_URL`            | `http://<EC2_PUBLIC_IP>`                             |
| `VITE_API_URL`          | `http://<EC2_PUBLIC_IP>:5000/api`                    |

## 5. Deploy!

1.  Push your code to GitHub:
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```
2.  Go to the **Actions** tab on GitHub to watch the build.
3.  Once the "Deploy" job turns green, visit `http://<EC2_PUBLIC_IP>` in your browser.
