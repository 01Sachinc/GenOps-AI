pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Jenkins Credentials ID
        DOCKERHUB_USERNAME = 'your-dockerhub-username' // Replace with your Docker Hub username
        PROJECT_NAME = 'smartops-app'
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${PROJECT_NAME}"
        IMAGE_TAG = "latest" // Or use ${env.BUILD_ID} for specific versioning
    }

    stages {
        stage('Clone Code') {
            steps {
                echo 'Cloning code from GitHub...'
                // Update this URL with your actual GitHub repository URL
                git branch: 'main', url: 'https://github.com/your-github-username/smartops-ci-cd.git'
            }
        }

        stage('Build Application') {
            steps {
                echo 'Building Spring Boot application with Maven...'
                // Use Maven to build the application
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Tag Image') {
            steps {
                echo 'Tagging image...'
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:build-${env.BUILD_ID}"
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Logging into Docker Hub...'
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
            }
        }

        stage('Push Image') {
            steps {
                echo 'Pushing image to Docker Hub...'
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:build-${env.BUILD_ID}"
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying application to AWS EC2...'
                // Make the script executable
                sh 'chmod +x deploy.sh'
                // Execute the deployment script
                // Note: If Jenkins is on a different server, you would use ssh to run this remotely
                sh "./deploy.sh ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
            // Logout from Docker Hub
            sh 'docker logout'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
