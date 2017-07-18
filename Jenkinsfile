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
         sh(' ./player/build.sh')

       }

       stage('Publish'){

         echo 'Push to Repo'
         dir('./player') {
          sh 'ARTIFACT_LABEL=bronze ./dockerPushToRepo.sh'
          sh './app/metadata.sh > metadata.json'
          sh 'cat metadata.json'
          archive includes: "metadata.json"
         }

       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
