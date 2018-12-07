#!groovy
node('build-slave') {
    currentBuild.result = "SUCCESS"
    try {
       stage('Checkout'){
          checkout scm
          // Getting commit short hash
          commit_hash = sh (
          script: 'git rev-parse --short HEAD',
          returnStdout: true
          ).trim()
          branch_name = scm.branches[0].name
       }
       stage('Build'){
            sh("printenv")
            echo "Git Hash: "+commit_hash
            // Building image
            sh("sudo ./build.sh ${commit_hash} ${branch_name}")
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
