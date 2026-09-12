pipeline {
  agent any

  parameters {
    choice(
      name: 'DEPLOY_ENV',
      choices: ['prod', 'test'],
      description: 'Target environment to build & deploy'
    )
  }

  environment {
    // --- Environment-independent ---
    DEPLOY_HOST = "57.128.227.137"
    DEPLOY_USER = "kacper"
    NODEJS = "NodeJS_22"

    // --- Environment-dependent (prod vs test) ---
    APP_NAME    = "${params.DEPLOY_ENV == 'prod' ? 'camperparkstaryfolwark' : 'camperparkstaryfolwark_test'}"
    SERVER_PATH = "${params.DEPLOY_ENV == 'prod' ? '/var/www/camperparkstaryfolwark' : '/var/www/camperparkstaryfolwark_test'}"
    PORT        = "${params.DEPLOY_ENV == 'prod' ? '4100' : '4101'}"
    GIT_BRANCH  = "${params.DEPLOY_ENV == 'prod' ? 'master' : 'develop'}"

    // Jenkins credential holding the web app API key (org id 1).
    // Credential id is the same in both folders; it resolves per Jenkins folder:
    //   prod -> kacper/camper_park/deploy/credentials
    //   test -> kacper/camper_park/test_deploy/credentials
    // If this pipeline runs as a single job (not one job per folder), give the
    // two credentials distinct ids and switch on params.DEPLOY_ENV here instead.
    // in future if there will be more then 1 organisations the id will be taken from the credentials as well

    WEB_APP_ORG_ID = "1"
    WEB_APP_API_URL = "http://localhost:${params.DEPLOY_ENV == 'prod' ? 2000 : 2001}"
    API_KEY_CREDENTIAL_ID = "web_app_api_key_for_orgId-${WEB_APP_ORG_ID}"
  }

  stages {

    stage('Checkout') {
      steps {
        echo "Environment: ${params.DEPLOY_ENV} (branch: ${GIT_BRANCH}, port: ${PORT}, app: ${APP_NAME})"
        git branch: "${GIT_BRANCH}",
            url: "https://github.com/01szak/cp-web-app.git"
      }
    }

    stage('Install dependencies') {
      steps {
        nodejs("${NODEJS}") {
          sh 'npm ci'
        }
      }
    }

    stage('Build SSR') {
      steps {
        nodejs("${NODEJS}") {
          sh 'npm run build'
        }
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([string(credentialsId: "${API_KEY_CREDENTIAL_ID}", variable: 'WEB_APP_API_KEY')]) {
          sh """
            set -e

            echo "Deploying build to ${params.DEPLOY_ENV}..."

            rsync -avz --delete \
              dist/cp-web-app/ \
              ${DEPLOY_USER}@${DEPLOY_HOST}:${SERVER_PATH}/

            ssh ${DEPLOY_USER}@${DEPLOY_HOST} "
              set -e

              cd ${SERVER_PATH}

              echo '🟢 Restarting PM2 app...'
              pm2 delete ${APP_NAME} || true

              PORT=${PORT} \
              WEB_APP_API_KEY='\$WEB_APP_API_KEY' \
              WEB_APP_ORG_ID=${WEB_APP_ORG_ID} \
              WEB_APP_API_URL=${WEB_APP_API_URL} \
              pm2 start server/server.mjs --name ${APP_NAME} --update-env
              pm2 save
            "

            echo "Deploy finished (${params.DEPLOY_ENV})"
          """
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
