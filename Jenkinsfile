@Library('deploy-conf') _
node('build-slave') {
    currentBuild.result = "SUCCESS"
    try {
       stage('Checkout'){
         if(!env.hub_org)
            error 'Please set a Jenkins environment variable named hub_org with value as registery/sunbidrded'
         if(!env.push_to_hub)
            error 'Please set a Jenkins environment variable named push_to_hub with value as true / false'
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
         sh("sudo ./build.sh ${commit_hash} ${branch_name} ${env.NODE_NAME} ${hub_org}")
       }
       stage('Push'){
          if(push_to_hub == "true"){
             values = [:]
             image_name = sh(returnStdout: true, script: 'jq -r .image_name metadata.json').trim()
             image_tag = sh(returnStdout: true, script: 'jq -r .image_tag metadata.json').trim()
             agent = sh(returnStdout: true, script: 'jq -r .node_name metadata.json').trim()
             currentWs = sh(returnStdout: true, script: 'pwd').trim()
             ansiblePlaybook = "docker_image_push.yml"
             ansibleExtraArgs = """\
                               --extra-vars "hub_org=$hub_org image_name=docker_service_name 
                               image_tag=docker_service_version" --vault-password-file /home/ops/vault
                               """.stripIndent().replace("\n"," ")
            values.put('env', 'dev')
            values.put('agent', agent)
            values.put('image_name', image_name)
            values.put('image_tag', image_tag)
            values.put('currentWs', currentWs)
            values.put('ansiblePlaybook', ansiblePlaybook)
            values.put('ansibleExtraArgs', ansibleExtraArgs)
            ansible_playbook_run(values)
        }
      }       stage('ArchiveArtifacts'){
           archiveArtifacts "metadata.json"
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
