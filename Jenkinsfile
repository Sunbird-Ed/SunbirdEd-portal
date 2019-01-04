node('build-slave') {
    currentBuild.result = "SUCCESS"
    try {
       stage('Checkout'){
         ansiColor('xterm'){
           String ANSI_GREEN = "\u001B[32m"
           String ANSI_NORMAL = "\u001B[0m"
           String ANSI_BOLD = "\u001B[1m"
           String ANSI_RED = "\u001B[31m"
           if(!env.hub_org){
             println (ANSI_BOLD + ANSI_RED + "Uh Oh! Please set a Jenkins environment variable named hub_org with value as registery/sunbidrded" + ANSI_NORMAL)
             error 'Please resolve the errors and rerun..'
           }
           else
             println (ANSI_BOLD + ANSI_GREEN + "Found environment variable named hub_org with value as: " + hub_org + ANSI_NORMAL)
         }
          checkout scm
          // Getting commit short hash
          commit_hash = sh (
          script: 'git rev-parse --short HEAD',
          returnStdout: true
          ).trim()
          branch_name = sh (
          script: 'git name-rev --name-only HEAD | rev | cut -d "/" -f1| rev',
          returnStdout: true
          ).trim()
          echo 'branch_name: '+branch_name
       }
       stage('Build'){
            sh("printenv")
            echo "Git Hash: "+commit_hash
            // Building image
         sh("./build.sh ${commit_hash} ${branch_name} ${env.NODE_NAME} ${hub_org}")
       }
        stage('ArchiveArtifacts'){
           archiveArtifacts "metadata.json"
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
