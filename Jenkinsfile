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
                    } else
                        println(ANSI_BOLD + ANSI_GREEN + "Found environment variable named hub_org with value as: " + hub_org + ANSI_NORMAL)
                }
                cleanWs()
                if (params.github_release_tag == "") {
                    checkout scm
                    commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    branch_name = sh(script: 'git name-rev --name-only HEAD | rev | cut -d "/" -f1| rev', returnStdout: true).trim()
                    build_tag = branch_name + "_" + commit_hash
                    // Creating artifact version
                    artifact_version = branch_name + "_" + commit_hash
                    println(ANSI_BOLD + ANSI_YELLOW + "github_release_tag not specified, using the latest commit hash: " + commit_hash + ANSI_NORMAL)
                } else {
                    def scmVars = checkout scm
                    checkout scm: [$class: 'GitSCM', branches: [[name: "refs/tags/$params.github_release_tag"]], userRemoteConfigs: [[url: scmVars.GIT_URL]]]
                    build_tag = params.github_release_tag
                    // Creating artifact version
                    commit_hash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    branch_name = sh(script: 'git name-rev --name-only HEAD | rev | cut -d "/" -f1| rev', returnStdout: true).trim()
                    artifact_version = branch_name + "_" + commit_hash
                    println(ANSI_BOLD + ANSI_YELLOW + "github_release_tag specified, building from github_release_tag: " + params.github_release_tag + ANSI_NORMAL)
                }
                echo "build_tag: " + build_tag

                stage('Build') {
                    sh("./build.sh ${build_tag} ${env.NODE_NAME} ${hub_org} ${params.sunbird_content_editor_artifact_url} ${params.sunbird_collection_editor_artifact_url} ${params.sunbird_generic_editor_artifact_url}")
                }

                stage('ArchiveArtifacts') {
                    archiveArtifacts "metadata.json"
                    currentBuild.description = "${build_tag}"
                }
            }
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }
}
