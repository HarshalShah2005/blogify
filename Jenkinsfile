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
                sh 'docker-compose down || true'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
        
        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for services to be healthy..."
                    sleep 5
                    docker-compose ps
                    docker-compose logs
                '''
            }
        }
    }
    
    post {
        failure {
            sh 'docker-compose logs'
        }
        always {
            sh 'docker-compose logs > deployment.log || true'
        }
    }
}