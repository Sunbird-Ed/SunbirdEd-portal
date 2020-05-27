
 ![](https://travis-ci.org/manjudr/telemetry-lib.svg?branch=master)
 [![codecov](https://codecov.io/gh/manjudr/telemetry-lib/branch/master/graph/badge.svg)](https://codecov.io/gh/manjudr/telemetry-lib)



## Need 

The purpose of a standalone JS library for telemetry is to facilitate capture and distribution of telemetry data by users who would like to use their own apps, content players or portals.  

We chose to use a JS library for the following reasons:

* All the telemetry events that are generated and synced to the server have the same format (field data types and time zone value)

* It is easy to upgrade to new versions, in case of major changes in telemetry

* There is effortless backward compatibility, as changes are handled within the telemetry library. Any upgrade of the telemetry library does not require code changes in the content

* There are reduced number of API calls

* There are simple API methods to generate the complete telemetry event as only the required fields are passed

## Prerequisites 

The following are prerequisites to use or integrate the JS library:

* JQuery library should be available 

* Valid Authtoken and Key to make API calls

* The [telemetry.min.js](https://github.com/project-sunbird/project-sunbird.github.io/blob/dev/pages/developer-docs/telemetry/other_files/telemetry.min.js){:target="_blank"} file

**Note:** For details on generating and using the Authtoken and Key, refer to the section 

* Device ID value

**Note:** For details on how to get the device ID value, refer to [website](https://android-developers.googleblog.com/2011/03/identifying-app-installations.html){:target="_blank"}

## Configure

This JS library helps to generate telemetry events. These events sync to the server or data-pipeline in a batch as defined in the configuration. To log telemetry events, the user has to call the start method by passing the configuration along with other parameters.

**Note:** All telemetry events sync only to the server or data-pipeline, when connected to the Internet.  

Telemetry events are generated based on the configuration of the telemetry library.

**Required Configuration (Context)**

<table>
  
  <thead>
  <tr>
    <th>Property</th>
    <th>Description</th>
    <th>Required</th>
    <th>Default Value</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>pdata</td>
    <td>Producer data. It is an object containing id, version and pid.</td>
    <td>true</td>
    <td>Defaults to genie ex : {"id": "genie", "ver": "6.5.2567" pid:""}</td>
  </tr>
  <tr>
    <td>channel</td>
    <td>It is an string containing unique channel name.</td>
    <td>true</td>
    <td>Defaults to in.ekstep</td>
  </tr>
  <tr>
    <td>uid</td>
    <td>It is an string containing user id.</td>
    <td>true</td>
    <td>defaults to "anonymous"</td>
  </tr>
  <tr>
    <td>did</td>
    <td>It is an string containing unique device id. 
      <ul><li>To generate did value for android refer to <a href ='https://android-developers.googleblog.com/2011/03/identifying-app-installations.html'>here</a> ANDROID_ID is generally used for mobiles</li>
        <li>To generate did value for web client refer <a href = 'https://github.com/Valve/fingerprintjs2'>here</a>. If consumer is not sending any did value then by default library will generate did using <a href ='https://github.com/Valve/fingerprintjs2'>fingerPrintJs2</a>.</li><li>For server side it's mandtory to pass did value</li></ul>
   </td>
    <td>true</td>
    <td>Default to <a href="https://github.com/Valve/fingerprintjs2">fingerPrintjs2</a>(Note: Only for web client)</td>
  </tr>
  <tr>
    <td>authtoken</td>
    <td>It is an string containing consumer token to access the API</td>
    <td>true</td>
    <td></td>
  </tr>
  <tr>
    <td>Property</td>
    <td>Description</td>
    <td>Required</td>
    <td>Default Value</td>
  </tr>
  <tr>
    <td>env</td>
    <td>It is an string containing Unique environment where the event has occurred</td>
    <td>true</td>
    <td>defaults to "ContentPlayer"</td>
  </tr>
  </tbody>
</table>

**Additional Configuration**

<table>
  <tr>
    <td>Property</td>
    <td>Description</td>
    <td>Required</td>
    <td>Default Value</td>
  </tr>
  <tr>
    <td>sid</td>
    <td>It is an string containing user session id.</td>
    <td>optional</td>
    <td> </td>
  </tr>
  <tr>
    <td>batchsize</td>
    <td>It is an int containing number of events count to sync at a time. Can be configured from min value 10 to max value 1000.</td>
    <td>optional</td>
    <td>defaults to 20</td>
  </tr>
  <tr>
    <td>mode</td>
    <td>It is an string which defines to identify preview used by the user to play/edit/preview.</td>
    <td>optional</td>
    <td>defaults to "play"</td>
  </tr>
  <tr>
    <td>host</td>
    <td>It is an string containing API endpoint host.</td>
    <td>optional</td>
    <td>defaults to "https://api.ekstep.in"</td>
  </tr>
  <tr>
    <td>endpoint</td>
    <td>It is an string containing API endpoint. Please don't change default value. Update this only when the data is proxied</td>
    <td>optional</td>
    <td>Defaults to "/v3/telemetry"</td>
  </tr>
  <tr>
    <td>tags</td>
    <td>It is an array. It can be used to tag devices so that summaries/metrics can be derived via specific tags. Helpful during analysis</td>
    <td>optional</td>
    <td>Defaults to []</td>
  </tr>
  <tr>
    <td>cdata</td>
    <td>It is an array. Correlation data. Can be used to correlate multiple events. Generally used to track user flow</td>
    <td>optional</td>
    <td>Defaults to []</td>
  </tr>
  <tr>
    <td>dispatcher</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

**Sample:**

<pre>
{
  "pdata": {
    "id": "genie",
    "ver": "6.5.2567",
    "pid": ""
  },

  "env": "ContentPlayer",
  "channel": "XXXX",
  "did": "20d63257084c2dca33f31a8f14d8e94c0d939de4",
  "authtoken": "XXXX",
  "uid": "anonymous",
  "sid": "85e8a2c8-bb8e-4666-a21b-c29ec590d740",
  "batchsize": 20,
  "mode": "play",
  "host": "XXXX",
  "endpoint": "/v3/telemetry",  
  "tags": [],
  "cdata": []
}
</pre>

**Dispatcher:**

User can define custom dispatcher to override the default functionality of telemetry sync. By default telemetry events will send to default server/host. User can override this default functionality by defining his own "dispatcher" object to handle telemetry events.

<pre>
var customDispatcher = {
    dispatch: function(event){
        // User defined logic to send telemetry to server or store locally etc..
    }
};
</pre>

Send this object as dispatcher in the above sample configuration ("dispatcher":customDispatcher).

## How to use telemetry JS library

Download the telemetry-sdk npm module from [here](https://www.npmjs.com/package/@project-sunbird/telemetry-sdk) 

<pre>
npm i @project-sunbird/telemetry-sdk
</pre>

**Example:**

<pre>
$t = require('@project-sunbird/telemetry-sdk');   
$t.start(config, contentId, contentVer,data, options);
</pre>
   

To use the telemetry JS libraries, add the following to your HTML/application. The file path is a relative path, for example; assets/js to the associated files within the html content.

<pre>
&#x3C;!-- External Libraries --&#x3E;
  &#x3C;script src=&#x22;[relative_path]/jquery.min.js&#x22;&#x3E;&#x3C;/script&#x3E;
  
  &#x3C;!-- Telemetry JS library --&#x3E;
  &#x3C;script src=&#x22;[relative_path]/telemetry.min.js&#x22;&#x3E;&#x3C;/script&#x3E;
  &#x3C;script src=&#x22;[relative_path]/auth-token-generator.min.js&#x22;&#x3E;&#x3C;/script&#x3E;
  &#x3C;script&#x3E;
    function init() {
          // Generate auth token
          // Key: Partner generated key
          // secret: partner secret value 
          let token = AuthTokenGenerate.generate(key, secret);
          config.authToken = token;
          let startEdata = {};
          let options = {};
          $t.start(config, &#x22;content_id, &#x22;contetn_ver&#x22;, startEdata, options );
      }
  init()
  &#x3C;/script&#x3E;
</pre>




## Telemetry API methods

Every API method has an associated event. The following API methods log details of the associated telemetry event. 

* [Start](developer-docs/telemetry/jslibrary/#start) - This method initializes capture of telemetric data associated to the start of user action 

* [Impression](developer-docs/telemetry/jslibrary/#impression) - This method is used to capture telemetry for user visits to  a specific page. 

* [Interact](developer-docs/telemetry/jslibrary/#interact) - This method is used to capture user interactions on a page. For example, search, click, preview, move, resize, configure

* [Assess ](developer-docs/telemetry/jslibrary/#access)- This method is used to capture user assessments that happen while playing content.

* [Response](developer-docs/telemetry/jslibrary/#response) - This method is used to capture user responses. For example; response to a poll, calendar event or a question.

* [Interrupt](developer-docs/telemetry/jslibrary/#interrupt) - This method is used to capture  interrupts triggered during user activity. For example;  mobile app sent to background, call on the mobile, etc.

* [End](developer-docs/telemetry/jslibrary/#end) - This method is used to capture closure after all the activities are completed

* [Feedback](developer-docs/telemetry/jslibrary/#feedback) - This method is used to capture user feedback

* [Share](developer-docs/telemetry/jslibrary/#share) - This method is used to capture everything associated with sharing. For example; Share content, telemetry data, link, file etc.

* [Audit](developer-docs/telemetry//jslibrary/#audit) - This method is used when an object is changed to know previous and current state. This includes lifecycle changes as well.

* [Error](developer-docs/telemetry/jslibrary/#error) - This method is used to capture when users face an error

* [Heartbeat](developer-docs/telemetry/jslibrary/#heartbeat) - This method is used to know is process is running or not.

* [Log](developer-docs/telemetry/jslibrary/#log) - This method is used to capture generic logging of events.  For example; capturing logs for API calls, service calls, app updates etc.

* [Search](developer-docs/telemetry/jslibrary/#search) - This method is used to capture the search state i.e. when search is triggered for content, item, assets etc.

* [Metrics](developer-docs/telemetry/jslibrary/#metrics) - Service business metrics (also accessible via health API)

* [Summary](developer-docs/telemetry/jslibrary/#summary) - Summary event

* [Exdata](developer-docs/telemetry/jslibrary/#exdata) - This method is used as a generic wrapper event to capture encrypted or serialized data

 
 

### Start

This API is used to log telemetry when users view content or initiate game play 

<pre>
start: function(config, contentId, contentVer, data, options) { }
</pre>

Request Arguments:

<pre>
let config = Object; // Telemetry Configurations
let contentId = String; //Required. Id of the content
let contentVer = String; //Required. Version of the content. Defaults to "1.0"
let data = { // Required. event data
    "type": String, //Required.  app, session, editor, player, workflow, assessment
    "mode": "", //Required. mode of preview: preview, edit or play 
    "stageid": "" //Required. stage id where the play has been initiated
};
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};

</pre>

### Impression

This API is used to log telemetry when users visit a specific page.

<pre>
impression: function(data, options) { }
</pre>

Request Arguments:

<pre>

let data = { // Required
    "type": String, //Required. Impression type (list, detail, view, edit, workflow, search)
    "subtype": String, //Optional. Additional subtype. "Paginate", "Scroll"
    "pageid": String, //Required.  Unique page id
    "itype": "", // type of interaction - SWIPE, SCRUB (fast forward using page thumbnails) or AUTO
    "stageto": "" // game level, stage of page id to which the navigation was done
};
</pre>

<pre>
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>  


### Interact

This API is used to log telemetry of user interactions on the page. For example, search, click, preview, move, resize, configure

<pre>
interact: function(data, options) { }
</pre>

Request Arguments:

<pre>

let data = { // Required
    "type": "", // Required. Type of interaction TOUCH,DRAG,DROP,PINCH,ZOOM,SHAKE,ROTATE,SPEAK,LISTEN,WRITE,DRAW,START,ENDCHOOSE,ACTIVATE,SHOW,HIDE,SCROLL,HEARTBEAT,OTHER
    "subtype": "", // Optional. Additional types for a global type. For ex: for an audio the type is LISTEN and thesubtype can be one of PLAY,PAUSE,STOP,RESUME,END
    "id": "", // Required. Resource (button, screen, page, etc) id on which the interaction happened - use systemidentifiers when reporting device events
    "pageid": "", // Optional. Stage or page id on which the event happened
    "extra": { // Optional. Extra attributes for an interaction
        "pos": [{ "x": , "y": , "z": }], // Array of positional attributes. For ex: Drag and Drop has two positional attributes. One where the drag has started and the drop point
        "values": [], // Array of values, e.g. for timestamp of audio interactions
        "tid": "", // When interaction is between multiple resources, (e.g. drag and drop) - target resource id
        "uri": "" // Unique external resource identifier if any (for recorded voice, image, etc.)
    }
};
</pre>
<pre>
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
}; 
</pre>  

### Assess

This API is used to log telemetry of assessments that have occured when the user is viewing content

<pre>
assess: function(data, options) { }
</pre>

Request Arguments:

<pre>
let QUESTION = {
    "id": "", // unique assessment question id. its an required property.
    "maxscore", // user defined score to this assessment/question.
    "exlength": , // expected time (decimal number) in seconds that ideally child should take
    "params": [ // Array of parameter tuples
        { "id": "value" } // for ex: if var1 is substituted with 5 apples the parameter is {"var1":"5"}
    ],
    "uri": "", // Unique external resource identifier if any (for recorded voice, image, etc.)
    "desc": "short description",
    "title": "title",
    "mmc": [], // User defined missing micros concepts
    "mc": [] // micro concepts list
}

let data = { //Required
    "item": QUESTION, // Required. Question Data
    "pass": "", // Required. Yes, No. This is case-sensitive. default value: No.
    "score": "", // Required. Evaluated score (Integer or decimal) on answer(between 0 to 1), default is 1 if pass=YES or 0 if pass=NO. 
    "resvalues": [{ "id": "value" }], // Required. Array of key-value pairs that represent child answer (result of this assessment)
    "duration": "" // Required. time taken (decimal number) for this assessment in seconds
};
</pre>
<pre>
 let options = { //Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Response

This API is used to log telemetry of user response. For example; Responded to assessments.

<pre>
response: function(data, options) { }
</pre>

Request Arguments:

<pre>
let TARGET = {
    "id": "", // Required. unique id for the target
    "ver": "", // Required. version of the target
    "type": "", // Required. Type of the target
    "parent": {
        "id": "", // Optional. parent id of the object
        "type": "" // Optional. parent type of the object. Required if parentid is present.
    }
};

let data = { // Required
    "target": TARGET, // Required. Target of the response
    "qid": "", // Required. Unique assessment/question id
    "type": "", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
    "values": [{ "key": "value" }] // Required. Array of response tuples. For ex: if lhs option1 is matched with rhs optionN - [{"lhs":"option1"}, {"rhs":"optionN"}]
};
</pre>
<pre>
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Interrupt

This API is used to log telemetry for any interruptions that have occurred when a user is viewing content or playing games. For example; screen lock, incoming call, etc.

<pre>
interrupt: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { //Required
    "type": "", // Required. Type of interuption
    "pageid": "", // Optional. Current Stage/Page unique id on which interuption occured
    "eventid": "" // Optional. unique event ID
};
</pre>
  
<pre>
 let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>



### Feedback

This API is used to log telemetry of feedback provided by the user.

<pre>
// To log content start/play event
feedback: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "contentId": "", // Required. Id of the content
    "rating": 3, // Optional. Numeric score (+1 for like, -1 for dislike, or 4.5 stars given in a rating)
    "comments": "User entered feedback" // Optional. Text feedback (if any)
};
</pre>

<pre>
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Share

This API is used to log telemetry when a user shares any content with other users.

<pre>
// To log content start/play event
share: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "dir": "", // In/Out
    "type": "", // File/Link/Message
    "items": [{ // Required. array of items shared
        "obj": {
            "id": "",
            "type": "",
            "ver": ""
        },
        "params": [
            { "key": "value" }
        ],
        "origin": { // Origin of the share file/link/content
            "id": "", // Origin id
            "type": "" // Origin type
        },
        "to": {
            "id": "",
            "type": ""
        }
    }]
};
</pre>
<pre>
 let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};

</pre>

### Audit

This API is used to log telemetry when an object is changed. This includes life-cycle changes as well.

<pre>
audit: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "edata": {
        "props": [""], // Updated properties
        "state": "", // Optional. Current state
        "prevstate": "" // Optional. Previous state
    }
};
</pre>
<pre>
  let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Error

This API is used to log telemetry of any error that has occurred when a user is viewing content or playing games. 

<pre>
error: function(error, options) { }
</pre>

Request Arguments:

<pre>
let error = { // Required
    "err": "", // Required. Error code
    "errtype": "", // Required. Error type classification - "SYSTEM", "MOBILEAPP", "CONTENT"
    "stacktrace": "", // Required. Detailed error data/stack trace
};
</pre>

<pre>
 let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Heartbeat

This API is used to log telemetry for heartbeat event to denote that the process is running.

<pre>
heartbeat: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "edata": {}
}
</pre>

<pre>
 let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};

</pre>

### Log

This API is used to log telemetry of generic log events. For example; API calls, service calls, app updates, etc.

<pre>
log: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "type": "", // Required. Type of log (system, process, api_access, api_call, job, app_update etc)
    "level": "", // Required. Level of the log. TRACE, DEBUG, INFO, WARN, ERROR, FATAL
    "message": "", // Required. Log message
    "params": [{ "key": "value" }] // Optional. Additional params in the log message
};
</pre>

<pre>
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Search

This API is used to log telemetry when a user triggers a search for any content, item or asset 

<pre>
search: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "type": "", // Required. content, assessment, asset 
    "query": "", // Required. Search query string 
    "filters": {}, // Optional. Additional filters
    "sort": {}, // Optional. Additional sort parameters
    "correlationid": "", // Optional. Server generated correlation id (for mobile app's telemetry)
    "size": 333, // Required. Number of search results
    "topn": [{}] // Required. top N (configurable) results with their score
};
</pre>
<pre>
let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
}; 
</pre>

### Metrics

This API is used to log telemetry for service business metrics (also accessible via health API).

<pre>
metrics: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "edata": {
        "metric1": Int,
        "metric2": Int
            /// more metrics, each is a key value
    }
};
</pre>

<pre>
 let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Summary

This API is used to log telemetry summary event

<pre>
summary: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "edata": {
        "type": "", // Required. Type of summary. Free text. "session", "app", "tool" etc
        "mode": "", // Optional.
        "starttime": Long, // Required. Epoch Timestamp of app start. Retrieved from first event.
        "endtime": Long, // Required. Epoch Timestamp of app end. Retrieved from last event.
        "timespent": Double, // Required. Total time spent by visitor on app in seconds excluding idle time.
        "pageviews": Long, // Required. Total page views per session(count of CP_IMPRESSION)
        "interactions": Long, // Required. Count of interact events
        "envsummary": [{ // Optional
            "env": String, // High level env within the app (content, domain, resources, community)
            "timespent": Double, // Time spent per env
            "visits": Long // count of times the environment has been visited
        }],
        "eventssummary": [{ // Optional
            "id": String, // event id such as CE_START, CE_END, CP_INTERACT etc.
            "count": Long // Count of events.
        }],
        "pagesummary": [{ // Optional
            "id": String, // Page id
            "type": String, // type of page - view/edit
            "env": String, // env of page
            "timespent": Double, // Time taken per page
            "visits": Long // Number of times each page was visited
        }]
    }
};
</pre>

<pre>
  let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### Exdata

This API is used to log telemetry for external data, while playing content

<pre>
exdata: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = {
    "type":"" - Free flowing text.For ex: partnerdata,xapi etc
   ....Serialized data(can be either encrypted / encoded / stringified)

};
</pre>

<pre>
  let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>

### End

This API is used to log telemetry while the user is closing or exiting the content or game

<pre>
end: function(data, options) { }
</pre>

Request Arguments:

<pre>
let data = { // Required
    "contentId": "", // Required. Id of the content
    "type": "", // Required. app, session, editor, player, workflow, assessment
    "duration": "", // Required. Total duration from start to end in seconds
    "pageid": "", // Optional. Page/Stage id where the end has happened.
    "summary": [{ "key": "value" }] // Optional. Summary of actions done between start and end. For ex: "progress" for player session, "nodesModified" for collection editor
};
</pre>

<pre>
  let options = { // Optional
    context: {}, // To override the existing context
    object: {}, // To override the existing object
    actor: {}, // To override the existing actor
    tags: {}, // To override the existing tags
    runningEnv: "server" // It can be either client or server
};
</pre>


### ResetContext
  This is used to reset the current context value with new context object.

<pre>
 @param {context} Object    - If context is undefined then library is reset to previous event context value.
 $t.resetContext(context) 
</pre>

### ResetObject
 Which is used reset the current object value with new obj

<pre>
 @param {obj} Object      - If the Object is undefined then library is reset to previous event object value.
 $t.resetObject(obj) 
</pre>

### ResetActor
  Which is used reset the current actor value with new actor   

<pre>
 @param {actor} Object    - If the actor is undefined then library is reset to previous event actor value.
 $t.resetActor(actor) 
</pre>

### ResetTags
  Which is used to reset the current tag's value with new tag's

<pre>
 @param {tags} Array      - If tags are undefined then library is reset to previous event tags value.
 $t.resetTags(tags) 
</pre>




## ChangeLogs

  ******  ******
**[0.0.1](https://github.com/manjudr/telemetry-lib/releases/tag/v1.0.0)**
 
  * Initial version of the telemetry-sdk [npm](https://www.npmjs.com/package/@project-sunbird/telemetry-sdk)

**[0.0.2](https://github.com/manjudr/telemetry-lib/releases/tag/v1.0.0)**
 
  * Bug fixes

**[0.0.3](https://github.com/manjudr/telemetry-lib/releases/tag/v1.0.1)**

  * Name space changes in the code 
  * Removed `EkTelemetry` keyword in the code and provided a backward compatibility

**[0.0.4](https://github.com/manjudr/telemetry-lib/releases/tag/v1.0.2)**

  * Bug fixes - Duration issue fix in both START and END Event (Converting millisecond to seconds)
  * Test case setup and improved code coverage
  * Travis integration     


  

    
