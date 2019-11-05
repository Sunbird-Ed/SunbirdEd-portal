#####  Pre-requisites:
Install Cassandra:
```brew install cassandra```
```
nvm install 8.16
nvm use 8.16
nvm alias default 8.16
```
```
npm i gulp-cli -g
npm install -g @angular/cli@7.3.6
```
#####  Client app
cd SunbirdEd-portal/src/app/client
npm i

#####  Environment variables
Update .bash_profile in users home
```
export sunbird_environment=local
export sunbird_instance=sunbird
```

Verify the variables are set
```
echo $sunbird_environment
echo $sunbird_instance
```

#####  Server app
cd SunbirdEd-portal/src/app
npm i

##### Manual updates
cbse.component.ts, line 77
```programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1' || _.get(this.programDetails, 'programId'),```
Replace environmentvariableshelper.js
```
lot of secret keys based on your sunbird installation
```


#####  Running
Cassandra: Ensure cassandra is running or run it using ```cassandra -f```
Server: ```npm run server```
Client: ```ng build --watch=true```
Dummy credentials: ntptest102/password
