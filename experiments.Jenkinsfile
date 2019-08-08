brary('deploy-conf') _
node() {
    try {
     timestamps {
        ansiColor('xterm') {
            String ANSI_GREEN = "\u001B[32m"
            String ANSI_NORMAL = "\u001B[0m"
            String ANSI_BOLD = "\u001B[1m"
            String ANSI_RED = "\u001B[31m"
	

 //           if (params.cdn_enable == "true") {
                stage('Initialize repos') {
//                    cleanWs()
                    checkout scm
                    git clone https://github.com/project-sunbird/sunbird-devops -b master .
                    values = [:]
                    envDir = sh(returnStdout: true, script: "echo $JOB_NAME").split('/')[-3].trim()
                    module = sh(returnStdout: true, script: "echo $JOB_NAME").split('/')[-2].trim()
                    jobName = sh(returnStdout: true, script: "echo $JOB_NAME").split('/')[-1].trim()
                    currentWs = sh(returnStdout: true, script: 'pwd').trim()
                    ansiblePlaybook = "$currentWs/ansible/portal-experiments.yml"
                    ansibleExtraArgs = "--syntax-check"
                    values.put('currentWs', currentWs)
                    values.put('env', envDir)
                    values.put('module', module)
                    values.put('jobName', jobName)
                    values.put('ansiblePlaybook', ansiblePlaybook)
                    values.put('ansibleExtraArgs', ansibleExtraArgs)
                    ansible_playbook_run(values)
                }

                stage('Deploy CDN') {
                    def filePath = "$WORKSPACE/ansible/inventory/env/common.yml"
                    cdnUrl = sh(script: """grep sunbird_portal_cdn_url $filePath | grep -v '^#' | grep --only-matching --perl-regexp 'http(s?):\\/\\/[^ \"\\(\\)\\<\\>]*' || true""", returnStdout: true).trim()
                    if (cdnUrl == '') {
                        println(ANSI_BOLD + ANSI_RED + "Uh oh! cdn_enable variable is true, But no sunbird_portal_cdn_url in $filePath" + ANSI_NORMAL)
                        error 'Error: sunbird_portal_cdn_url is not set'
                    }
                    else {
                        println cdnUrl
                        dir('sunbird-portal') {
                            checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: "${params.portal_branch_name}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: "${params.portal_repo_url}"]]]
                            commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                            sh "./experiments.sh ${cdnUrl} ${commitHash}"
                        }
                        ansibleExtraArgs = "--extra-vars assets=$currentWs/sunbird-portal/src/app/dist --extra-vars folder_name=$jobName --vault-password-file /var/lib/jenkins/secrets/vault-pass"
                        values.put('ansibleExtraArgs', ansibleExtraArgs)
                        ansible_playbook_run(values)
                        archiveArtifacts 'metadata.json, sunbird-portal/src/app/dist/index_cdn.ejs'
                        //currentBuild.description = "Image tag: " + values.image_tag + ", CDN Hash: " + commitHash
                    }
                }
            }
            
        //}
    }
}
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
