#!groovy

node('build-slave') {

    currentBuild.result = "SUCCESS"

    try {

       stage('Checkout'){

          checkout scm
       }

       stage('Pre-Build'){

         sh('./installDeps.sh')

       }

       stage('Build'){

         env.NODE_ENV = "build"

         print "Environment will be : ${env.NODE_ENV}"
         sh('sudo ./build.sh')

       }

       stage('Publish'){

         echo 'Push to Repo'
         dir('.') {
          sh 'ARTIFACT_LABEL=bronze ./dockerPushToRepo.sh'
          sh './src/app/metadata.sh > metadata.json'
          sh 'cat metadata.json'
          sh 'export vcs-ref=$(git rev-parse --short HEAD)'
          archive includes: "metadata.json", "player-dist_${env.vcs-ref}.tar.gz"
          print "vcs-ref: ${env.vcs-ref}"
         }

       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
