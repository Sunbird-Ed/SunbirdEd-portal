node('build-slave') {
    try {
        String ANSI_GREEN = "\u001B[32m"
        String ANSI_NORMAL = "\u001B[0m"
        String ANSI_BOLD = "\u001B[1m"
        String ANSI_RED = "\u001B[31m"
        String ANSI_YELLOW = "\u001B[33m"

        ansiColor('xterm') {
            timestamps {
                stage('Checkout') {
                    if (!env.hub_org) {
                        println(ANSI_BOLD + ANSI_RED + "Uh Oh! Please set a Jenkins environment variable named hub_org with value as registery/sunbidrded" + ANSI_NORMAL)
                        error 'Please resolve the errors and rerun..'
                    } else {
                        println(ANSI_BOLD + ANSI_GREEN + "Found environment variable named hub_org with value as: " + hub_org + ANSI_NORMAL)
                    }
                }
                // cleanWs()
                checkout scm
                commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                build_tag = sh(script: "echo " + params.github_release_tag.split('/')[-1] + "_" + commit_hash + "_" + env.BUILD_NUMBER, returnStdout: true).trim()
                echo "build_tag: " + build_tag

                stage('Customize dependencies') {
                    if (params.WL_Customization == null) {
                        println("Skipping customization")
                    } else {
                        sh """
                      git clone --recurse-submodules ${WL_Customization} sunbirded-portal
                      cp -r ${WORKSPACE}/sunbirded-portal/images/ ${WORKSPACE}/src/app/client/src/assets
                      cp -r ${WORKSPACE}/sunbirded-portal/resourceBundles/data/ ${WORKSPACE}/src/app/resourcebundles/
                      """
                    }
                }
                stage('Snyk Setup') {
                    if (!env.SNYK_TOKEN) {
                        println(ANSI_BOLD + ANSI_RED + "Please set a Jenkins environment variable named SNYK_TOKEN" + ANSI_NORMAL)
                        error 'Please resolve the errors and rerun..'
                    } else {
                        sh '''
                    export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
npm install -g snyk snyk-to-html
snyk auth ${SNYK_TOKEN}
                    '''
                        println(ANSI_BOLD + ANSI_GREEN + "Snyk setup successful!" + ANSI_NORMAL)
                    }
                }
                stage('Build') {
                    sh("bash ./build.sh  ${build_tag} ${env.NODE_NAME} ${hub_org} ${params.buildDockerImage} ${params.buildCdnAssests} ${params.cdnUrl}")
                }

                // check if params.buildDockerImage is true, then install snyk and run scan
                stage('Snyk Scan') {
                    if (params.buildDockerImage == 'true') {
                        sh """
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
[ -s "\$NVM_DIR/bash_completion" ] && . "\$NVM_DIR/bash_completion"
snyk container test ${hub_org}/player:${build_tag} --json | snyk-to-html -d -o snyk_results.html
"""
                    }
                }
                stage('ArchiveArtifacts') {
                    archiveArtifacts "metadata.json"
                    // archive the html report for snyk scan
                    if (params.buildDockerImage == 'true') {
                        archiveArtifacts 'snyk_results.html'
                    }
                    if (params.buildCdnAssests == 'true') {
                        sh """
                        rm -rf cdn_assets
                        mkdir cdn_assets
                        cp -r src/app/dist-cdn/* cdn_assets/
                        zip -Jr cdn_assets.zip cdn_assets
                        """
                        archiveArtifacts "src/app/dist-cdn/index_cdn.ejs, cdn_assets.zip"
                    }
                    currentBuild.description = "${build_tag}"
                }

                // publish the HTML report for snyk scan
                stage('PublishReport') {
                    if (params.buildDockerImage == 'true') {
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: '', reportFiles: 'snyk_results.html', reportName: 'Snyk Scan Report', reportTitles: ''])
                    }
                }
            }
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
