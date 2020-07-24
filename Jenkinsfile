pipeline {
    agent { docker 'node:alpine3.11' }
    stages {
        stage('配置node环境') {
            steps {
                sh 'npm --version'
            }
        }
        stage('克隆项目') {
            steps {
                git branch: 'test', credentialsId: 'jenkins', url: 'http://git.xinglinglove.cn:9091/root/medical-reservation.git'
            }
        }
        stage('打包构建项目') {
            steps {
                sh label: '', script: '''export  NODE_HOME=/usr/local/nodejs
                export  PATH=$PATH:$NODE_HOME/bin
                npm install -g cnpm --registry=https://registry.npm.taobao.org
                cnpm install
                cnpm install node-sass --unsafe-perm --save-dev
                cnpm install core-js@2
                npm run build:stage'''
            }
        }
        stage('远程拷贝部署项目到nginx') {
            steps {
                sh label: '', script: '''rm -rf /usr/share/nginx/html/test/medical-reservation/dist
                cp -r dist /usr/share/nginx/html/test/medical-reservation/'''
            }
        }
    }
}
