# SmartOps CI/CD – Jenkins + AWS Docker Deployment Pipeline

## Project Overview
This project demonstrates a fully automated CI/CD pipeline for a Java Spring Boot application. It leverages Jenkins to automate the building of the application, containerizing it with Docker, pushing the image to Docker Hub, and finally deploying it to an AWS EC2 instance running Amazon Linux.

## Tech Stack
- **Backend:** Java 21, Spring Boot 3, Maven
- **Containerization:** Docker, Docker Hub
- **CI/CD:** Jenkins (Declarative Pipeline)
- **Infrastructure:** AWS EC2 (Amazon Linux 2023)
- **Scripting:** Bash
- **Terminal Access:** MobaXterm

## Pipeline Explanation

The Jenkins declarative pipeline automates the entire software delivery process through the following stages:

1. **Clone Code:** Jenkins pulls the latest source code from the GitHub repository.
2. **Build Application:** Maven compiles the Java code, runs tests, and packages it into an executable JAR file (`mvn clean package`).
3. **Build Docker Image:** Docker builds an image using the provided `Dockerfile`, packaging the JAR file.
4. **Tag Image:** The Docker image is tagged with `latest` and a specific build number for version control.
5. **Docker Login:** Jenkins securely authenticates with Docker Hub using stored credentials.
6. **Push Image:** The tagged Docker images are pushed to the Docker Hub registry.
7. **Deploy Application:** The `deploy.sh` script is executed on the EC2 instance. It stops any running container, removes it, pulls the latest image from Docker Hub, and starts a new container mapped to port 80.

## Architecture Diagram

```mermaid
flowchart TD
    GitHub[GitHub Repository\n(Source Code)] -->|Webhook/Poll| Jenkins[Jenkins CI/CD\n(Build & Test)]
    Jenkins -->|Maven| Build[Spring Boot JAR]
    Build -->|docker build| Docker[Docker Image]
    Docker -->|docker push| DockerHub[Docker Hub\n(Registry)]
    DockerHub -->|docker pull| EC2[AWS EC2 Instance\n(Amazon Linux)]
    Jenkins -->|ssh/execute| EC2
    EC2 -->|docker run| RunningApp[Running Application\n(Port 80)]
```

## Setup Steps

### 1. AWS EC2 Setup
1. Launch an EC2 instance using the **Amazon Linux** AMI.
2. Configure Security Group to open ports:
   - `22` (SSH) - For MobaXterm access
   - `80` (HTTP) - For application access
   - `8080` (TCP) - For Jenkins dashboard (if running Jenkins on the same instance)
3. Download the `.pem` key pair for SSH access.

### 2. MobaXterm Access
1. Open MobaXterm and start a new SSH Session.
2. Remote host: `<your-ec2-public-ip>`
3. Specify username: `ec2-user`
4. Use private key: Select your `.pem` file.

### 3. Install Dependencies on EC2
Execute these commands via MobaXterm:
```bash
# Update system
sudo yum update -y

# Install Java (required for Jenkins)
sudo yum install java-21-amazon-corretto -y

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install jenkins -y
sudo systemctl enable jenkins
sudo systemctl start jenkins

# Install Git and Maven
sudo yum install git maven -y
```
*(Note: Log out and log back in for docker group changes to take effect).*

### 4. Jenkins Configuration
1. Access Jenkins at `http://<your-ec2-public-ip>:8080`.
2. Retrieve initial password: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`.
3. Install suggested plugins.
4. Add Docker Hub credentials:
   - Go to Manage Jenkins > Credentials > System > Global credentials.
   - Add new credentials of type "Username with password".
   - ID: `dockerhub-credentials`
   - Description: Docker Hub Credentials
5. Ensure the Jenkins user has permission to run Docker commands: `sudo usermod -aG docker jenkins` and restart Jenkins (`sudo systemctl restart jenkins`).

## Deployment Instructions

1. **Update placeholders:**
   - In `Jenkinsfile`: Replace `your-dockerhub-username` and the GitHub URL.
   - In `deploy.sh`: Ensure the fallback image name matches your Docker Hub repo.
2. **Push to GitHub:** Commit and push this project structure to your GitHub repository.
3. **Create Jenkins Pipeline:**
   - In Jenkins, create a new "Pipeline" item named `smartops-pipeline`.
   - Under Pipeline definition, select "Pipeline script from SCM".
   - Select Git, provide your repository URL, and specify `main` branch.
   - Save and click "Build Now".
4. **Access the Application:** Once the deployment is successful, navigate to `http://<your-ec2-public-ip>` in your web browser. You should see the health check response from the Spring Boot application.
