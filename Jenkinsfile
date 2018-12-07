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
          branch_name = sh (
          script: 'git rev-parse --abbrev-ref HEAD',
          returnStdout: true
          ).trim()
          echo 'branch_name: '+branch_name
       }
       stage('Build'){
            sh("printenv")
            echo "Git Hash: "+commit_hash
            def org = sunbird
            def name = player
            def version = branch_name
            // Building image
            sh("sudo ./build.sh")
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
