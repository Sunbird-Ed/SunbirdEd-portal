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
            // Building image
            sh("sudo ./build.sh ${GIT_COMMIT_HASH}")
       }

       stage('Publish'){

           echo 'Push to Repo'
           dir('.') {
               sh 'ARTIFACT_LABEL=bronze ./dockerPushToRepo.sh'
               sh "./src/app/metadata.sh ${GIT_COMMIT_HASH} > metadata.json"
               sh "cat metadata.json"
               archive includes: "metadata.json"
           }
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
