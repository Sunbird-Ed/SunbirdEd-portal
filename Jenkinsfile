#!groovy

node('docker') {

    currentBuild.result = "SUCCESS"

    try {

       stage('Checkout'){

          checkout scm
       }

       stage('Pre-Build'){

         sh('./player/installDeps.sh')

       }

       stage('Build'){

         env.NODE_ENV = "build"

         print "Environment will be : ${env.NODE_ENV}"
         sh('./player/build.sh')

       }

       stage('Publish'){

         echo 'Push to Repo'
         sh 'ls -al ~/'
         sh 'ARTIFACT_LABEL=bronze ./player/dockerPushToRepo.sh'

       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
