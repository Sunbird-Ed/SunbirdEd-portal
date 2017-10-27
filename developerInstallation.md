---
type: landing
directory: developer-docs
title: Installation
page_title: Installation
description: Installation
keywords: Installation, Pre-requisite, Quick installation, Installation Procedure
hide_platform_selector: true
hide_section_selector: true
---

# Installation
Installing Sunbird requires two primary software components, the Sunbird portal or web application, and the Sunbird services stack or the backend API interface. 

# Sunbird Portal Setup

## Prerequisites
Please complete the following pre-requisites before installing and running the sunbird-player application

### Software dependencies
* [Node](https://nodejs.org/en/download/) - install the latest release of 6.x.x LTS series
* [Bower](https://bower.io/#install-bower) - latest version of bower: `npm install -g bower`
* [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) - latest version of gulp: `npm install -g gulp-cli`
* [Mongo DB](https://www.mongodb.com/) - v3.4.1 and newer

### API Keys
This installation guide will use a cloud hosted Sunbird APIs for which an API key is needed. Please email info@sunbird.org for an API key to use when [configuring the application](#edit-the-application-config).

## Setup
* Checkout the code from `https://github.com/project-sunbird/sunbird-portal.git`
* Run the following commands
```
$ cd <PROJECT-FOLDER>/src
$ npm install
$ bower cache clean
$ bower install --force
```

## Backend Service Stack
The Sunbird portal application is powered by a set of Service APIs. These Service APIs can be run in a distributed environment, for instance when you deploy to production, or they can be run locally on a single server for ease of use and debugging. For now, we will configure our Sunbird portal to use a cloud instance of the Sunbird Service APIs. These APIs are hosted by Project Sunbird and are used for testing and demonstration purposes. 

*Please note*: the cloud instance of the APIs hosted by Project Sunbird are not for production usage.

## Edit the application config
* Open `<PROJECT-FOLDER>/src/app/helpers/environmentVariablesHelper.js` in your favourite text editor. Update the file so it contains the following values:    
```
module.exports = {
  LEARNER_URL: env.sunbird_learner_player_url || 'https://staging.open-sunbird.org/api/',     // 1. LEARNER_URL
  CONTENT_URL: env.sunbird_content_player_url || 'https://staging.open-sunbird.org/api/',     // 2. CONTENT_URL
  CONTENT_PROXY_URL: env.sunbird_content_proxy_url || 'https://staging.open-sunbird.org',     // 3. CONTENT_PROXY
  PORTAL_REALM: env.sunbird_portal_realm || 'sunbird',
  PORTAL_AUTH_SERVER_URL: env.sunbird_portal_auth_server_url || 'https://staging.open-sunbird.org/auth',    // 4. PORTAL_AUTH_SERVER_URL
  PORTAL_AUTH_SERVER_CLIENT: env.sunbird_portal_auth_server_client || "portal",
  ...
  PORTAL_PORT: env.sunbird_port || 3000,
  PORTAL_API_AUTH_TOKEN: env.sunbird_api_auth_token || 'email-info@sunbird.org-for-an-api-token',    // 5. PORTAL_API_AUTH_TOKEN
  PORTAL_MONGODB_IP: env.sunbird_mongodb_ip,
  ...
  PORTAL_SSO_ENABLED: env.sunbird_sso_enabled || false,
  PORTAL_ECHO_API_URL: env.sunbird_echo_api_url || '',                                        // 6. PORTAL_ECHO_API_URL
  ...
}
```
## Run Application
* Run the following commands:
```
$ gulp build`
$ cd <PROJECT-FOLDER>/src/app
$ node server.js
```
* Open `http://localhost:3000` in browser

# Sunbird Services Setup
Coming soon!
