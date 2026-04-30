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
                sh 'docker compose down --remove-orphans || true'
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for services to be healthy..."
                    sleep 30
                    docker compose ps
                    docker compose logs --tail=50
                '''
            }
        }
    }

    post {
        failure {
            sh 'docker compose logs --tail=100 || true'
        }
        always {
            sh 'docker compose logs > deployment.log 2>&1 || true'
        }
    }
}