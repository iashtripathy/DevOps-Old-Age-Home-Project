pipeline {
    agent any 
    environment{
        DOCKERHUB_CREDENTIALS=credentials('docker-hub-creds')
    }
    options{
        skipDefaultCheckout(true)
    }
    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('clone repo and install') { 
            steps {
                git url: 'https://github.com/iashtripathy/SPE.git', branch: 'main'
                sh "npm install"
            }
        }
        stage('Testing'){
            steps{
                sh "npm test"
            }
        }
        stage('Build docker image'){
            steps{
                sh 'docker build -t spefinal:latest .'
            }
        }
        stage('Push to Dockerhub'){
            steps{
                echo 'docker tag'
                sh 'docker tag spefinal gururajmujumdar/spefinal:latest'
                echo 'docker login'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                echo 'Pushing image to hub'
                sh 'docker push gururajmujumdar/spefinal'
                echo 'docker logout'
                sh 'docker logout'
            }
        }
        stage('Pull image from docker hub'){
            steps {
                ansiblePlaybook colorized: true, disableHostKeyChecking: true, installation: 'Ansible', inventory: 'inventory', playbook: 'playbook.yml'
            }
        }
        
    }
}
