#!groovy
node('build-slave') {
    currentBuild.result = "SUCCESS"
    try {
       stage('Checkout'){
          checkout scm
          echo $GIT_BRANCH
       }
       stage('Build'){
            sh("printenv")
            // Getting commit short hash
            def commit_hash=env.GIT_COMMIT.substring(0,9)
            echo "Git Hash: "+commit_hash
            // Building image
            sh("sudo ./build.sh ${commit_hash}")
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
