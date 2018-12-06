#!groovy
node('build-slave') {
    currentBuild.result = "SUCCESS"
    try {
       stage('Checkout'){
          checkout scm
       }
       stage('Build'){
            // Getting commit short hash
            GIT_COMMIT_HASH = sh (
            script: 'git rev-parse --short HEAD',
            returnStdout: true
            ).trim()
            echo "Git Hash: ${GIT_COMMIT_HASH}"
            // Building image
            sh("sudo ./build.sh ${GIT_COMMIT_HASH}")
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
