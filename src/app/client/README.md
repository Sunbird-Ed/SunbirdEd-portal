# Installing Sunbird Portal

Installing Sunbird requires two primary software components:

- Sunbird portal or web application
- Sunbird services stack or the backend API interface

## Table of contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Running Application](#running-application)
- [Project Structure](#project-structure)
- [Testing](#testing)
---

### Prerequisites

<table>
  <tr>
    <td colspan="2"><b>System Requirements</b></td>
  </tr>
  <tr>
    <td><b>Operating System</b></td>
    <td>Windows 7 and above/4.2 Mac OS X 10.0 and above/Linux</td>
  </tr>
  <tr>
    <td><b>RAM</b></td>
    <td>> 1.5 Gb</td>
  </tr>
  <tr>
    <td><b>CPU</b></td>
    <td>2 cores, > 2 GHz</td>
  </tr>
</table>


| Software dependencies |  |
| :--- | ------- |
| **[Node](https://nodejs.org/en/download/)** | > 8.x.x (Install the latest release of LTS version) |
| **[Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started/1-quick-start.md)** | Latest version of gulp: `npm install -g gulp-cli` |
| **[nodemon](https://www.npmjs.com/package/nodemon)** | Latest version  of nodemon: `npm install -g nodemon` |


### Project Setup

1. Clone project

    ```console
    git clone https://github.com/Sunbird-Ed/SunbirdEd-portal.git
    ```

    > ***Note***: Stable versions of the sunbird portal are available via tags for each release, and the master branch contains latest stable release. For latest stable release [refer](https://github.com/Sunbird-Ed/SunbirdEd-portal/branches)

2. Add the following environment variables - *Required for downloading editors (Via gulp task)*

      ```console
      export sunbird_content_editor_artifact_url="https://sunbirddev.blob.core.windows.net/sunbird-content-dev/artefacts/editor/content-editor-iframe-2.6.0.zip"

      export sunbird_collection_editor_artifact_url="https://sunbirddev.blob.core.windows.net/sunbird-content-dev/artefacts/editor/collection-editor-iframe-2.6.0.zip"

      export sunbird_generic_editor_artifact_url="https://sunbirddev.blob.core.windows.net/sunbird-content-dev/artefacts/editor/generic-editor-iframe-2.6.0.zip"
      ```

3. Install required dependencies

    1. Sunbird portal or web application

        1. $ cd {PROJECT-FOLDER}/src/app/client
        2. $ npm install

    2. Sunbird services stack or the backend API interface

        1. $ gulp download:editors
        2. $ cd {PROJECT-FOLDER}/src/app
        3. $ npm install

4. Configuring the Environment and Services Stack

    > Configure the following system environment variables in the terminal which you have opened

          | Environment Variable      |  Value  | Data Type |
          | :------------------------ | ------- | --------- |
          |  sunbird_environment      | local   |   string  |
          |  sunbird_instance         | sunbird |   string  |
          |  sunbird_default_channel  | sunbird |   string  |
          |  sunbird_default_tenant   | sunbird |   string  |

    > The initialization of these environmental variables can take place in a common place like in your **.bashrc** or **.bash_profile**

5. Edit the Application Configuration

    > Open `<PROJECT-FOLDER>/src/app/helpers/environmentVariablesHelper.js` in any available text editor and update the contents of the file so that it contains exactly the following values

      ```console
          module.exports = {
              // 1. LEARNER_URL   
              LEARNER_URL: env.sunbird_learner_player_url || <'https://<host for adopter's instance>',
              
              // 2. CONTENT_URL
              CONTENT_URL: env.sunbird_content_player_url || <'https://<host for adopter's instance>',
              
              // 3. CONTENT_PROXY  
              CONTENT_PROXY_URL: env.sunbird_content_proxy_url || <'https://<host for adopter's instance>',
              PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
              
              // 4. PORTAL_AUTH_SERVER_URL
              PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || <'https://<host for adopter's instance>',
              PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || "portal",
              ...
              PORTAL_PORT: env.sunbird_port || 3000,
                
              // 5. PORTAL_API_AUTH_TOKEN
              PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token || User generated API auth token
              ...
              
              // 6. PORTAL_ECHO_API_URL
              PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || '',
              ...
          }
      ```

    > Once the file is updated with appropriate values, then you can proceed with running the application

### Running Application

1. Sunbird portal or web application

    1. Run the following command in the **{PROJECT-FOLDER}/src/app/client** folder
    2. $ nodemon
    3. Wait for the following message before proceeding to the next step 
        ```
        [nodemon] clean exit - waiting for changes before restart
        ```

2. Sunbird services stack or the backend API interface

    1. Run the following command in the **{PROJECT-FOLDER}/src/app** folder
    2. $ node server.js

3. The local HTTP server is launched at `http://localhost:3000`

### Project Structure

    .
    ├── Sunbirded-portal                                            
    |   ├── /.circleci                           # 
    │   |   └── config.yml                       # Circleci Configuration file
    |   ├── /experiments                         # -|-
    |   ├── /src/app                             # Sunbird portal or web application
    │   |   ├── /client                          # -|-
    │   |   |    └── src                         # -|-
    │   |   ├── /helpers                         # Helpers and Service file
    │   |   ├── /libs                            # Sunbird utilities
    │   |   ├── /proxy                           # Redirection to respective services
    │   |   ├── /resourcebundles                 # Language resources
    │   |   ├── /routes                          # Sunbird Backend Routes
    │   |   ├── /sunbird-plugins                 # Sunbird plugins for editors
    │   |   ├── /tests                           # Test case scripts for helpers and routes
    │   |   ├── framework.config.js              # Default framework configuration
    │   |   ├── gulp-tenant.js                   # -|-
    │   |   ├── gulpfile.js                      # Gulp build configuration
    │   |   ├── package.json                     # Contains Node packages as specified as dependencies in package.json
    │   |   └── server.js                        # Main application program file / entry file for Sunbird services stack or the backend API interface
    └───└── .gitignore                           # git configuration to ignore some files and folder

### Testing

1. Sunbird portal or web application

        1. $ cd {PROJECT-FOLDER}/src/app/client
        2. $ npm run test
        3. With Coverage $ npm run test-coverage

2. Sunbird services stack or the backend API interface

        1. $ cd {PROJECT-FOLDER}/src/app
        2. $ npm run backend-test
        3. With Coverage $ npm run backend-test-with-coverage

