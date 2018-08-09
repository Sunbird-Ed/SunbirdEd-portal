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

            // Getting commit short hash
            GIT_COMMIT_HASH = sh (
            script: 'git rev-parse --short HEAD',
            returnStdout: true
            ).trim()
            echo "Git Hash: ${GIT_COMMIT_HASH}"
            sh("sudo ./build.sh ${GIT_COMMIT_HASH}")
       }

       stage('Publish'){

         echo 'Push to Repo'
         dir('.') {
          sh 'ARTIFACT_LABEL=bronze ./dockerPushToRepo.sh'
          sh './src/app/metadata.sh > metadata.json'
          sh 'cat metadata.json'
          archive includes: "metadata.json", "player-dist_${GIT_COMMIT_HASH}.tar.gz"
         }

       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
