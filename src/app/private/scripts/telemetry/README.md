# Telemetry Service

Telemetry Service javascript library helps to generate the telemetry events.

## Usage

```html
<script type="text/javascript" src="https://s3-ap-southeast-1.amazonaws.com/ekstep-public/js/telemetry.min.js"></script>
```

Initialise the Telemetry Service by passing game and user details.

```javascript
	var game = {"id":"local-web-renderer","ver":"1.0"};
	var user = {"age":-1,"avatar":"","handle":"developer","language":"","standard":-1,"uid":"ace127ec-2a84-41c2-9e20-43a4dee65098"};
	TelemetryService.webInit(game, user)
    .then(function() {
        // handle telemetry service init success.
    })
    .catch(function(err) {
    	// handle telemetry service init error.
    });

```

## Events

Below are the details of methods and example with sample data to create events.

### OE_START event

`TelemetryService.start()` 

**Parameters**

* `id` - identifier of the game.
* `ver` - version of the game.

**Example**

```javascript
	var id = "local-web-renderer";
	var ver = "1.0";
	TelemetryService.start(id, ver);

```

### OE_NAVIGATE event

`TelemetryService.navigate()` 

**Parameters**

* `stageid` - identifier of the current page/stage/scene.
* `stageto` - identifier of the navigating page/stage/scene.

**Example**

```javascript
	var stageid = "page1";
	var stageto = "page2";
	TelemetryService.navigate(stageid, stageto);
```


### OE_ASSESS event

`TelemetryService.assess()`,  `TelemetryService.assessEnd()`

**Parameters**

* `qid` - unique assessment question identifier.
* `subj` - subject. numeracy or literacy.
* `qlevel` - question level.
* `data` - other data to pass as JSON object while starting assess.
* `endData` - data related to evaluation to stop assess.

**Example**

```javascript
	var qid = "Q.01";
	var subj = "LIT";
	var qlevel = "MEDIUM";
	var data = {maxscore: 5.0};
	var assessEvent = TelemetryService.assess((qid, subj, qlevel, ).start();

	var endData = {
                    pass: "Yes",
                    score: 5.0,
                    res: ["0": "1"],
                    mmc: [],
                    mc: ["CONCEPT_1", "CONCEPT_10"]
                };
    TelemetryService.assessEnd(assessEvent, endData);
```


### OE_ITEM_RESPONSE event

`TelemetryService.itemResponse()` 

**Parameters**

* `data` - item response data as JSON object.

**Example**

```javascript
	var data = {
                itemId: "Q.01",
                res: [{
                    "option": "cat"
                }],
                state: "SELECTED"
                optionTag: "MCQ"
            };
    TelemetryService.itemResponse(data);
```

### OE_INTERACT event

`TelemetryService.interact()` 

**Parameters**

* `type` - type of the interaction.
* `id` - identifier on which the interaction happend.
* `extype` - expected interaction type.
* `data` - other details of the interaction as JSON object.

**Example**

```javascript
	var type = "TOUCH";
	var id = "next";
	var extype = "";
	var data = {
				stageId : "questions_g4",
			};
	TelemetryService.interact(type, id, extype, data);
```


### OE_INTERRUPT event

`TelemetryService.interrupt()` 

**Parameters**

* `type` - interrupt type.
* `stageid` - identifier of the current page/stage/scene.

**Example**

```javascript
	var type = "RESUME";
	var stageid = "page3";
	TelemetryService.interrupt(type, stageid);
```

### OE_END event

`TelemetryService.end()` 

**Parameters**

* No parameters.

**Example**

```javascript
	TelemetryService.end();
```
