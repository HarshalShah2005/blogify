pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Stop Previous Containers') {
            steps {
                bat 'docker compose down --remove-orphans || exit /b 0'
            }
        }

        stage('Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                bat '''
                    echo Waiting for services to be healthy...
                    timeout /t 30
                    docker compose ps
                    docker compose logs --tail=50
                '''
            }
        }
    }

    post {
        failure {
            bat 'docker compose logs --tail=100 || exit /b 0'
        }
        always {
            bat 'docker compose logs > deployment.log 2>&1 || exit /b 0'
        }
    }
}