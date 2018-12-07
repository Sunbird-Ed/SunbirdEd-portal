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
            // Building image
            sh"""
                sudo su
                docker build -f ./Dockerfile.Build --build-arg commit_hash=${commit_hash} -t ${org}/${name}:${version}-build . 
                docker run --name=${name}-${version}-build ${org}/${name}:${version}-build
                containerid=$(docker ps -aqf "name=${name}-${version}-build")
                rm -rf ./dist
                docker cp $containerid:/opt/player/app/player-dist.tar.gz .
                docker rm ${containerid}
                docker build -f ./Dockerfile --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${version}_${commit_hash} .
            """
       }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
