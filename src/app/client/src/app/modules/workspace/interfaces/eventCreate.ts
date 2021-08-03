export const eventCreate = {
    "id": "api.form.read",
    "params": {
        "resmsgid": "21e6f3da-8a7c-44cc-a6c0-4703dcc60927",
        "msgid": "cfe90415-9aff-439f-b580-170b9189db85",
        "status": "successful"
    },
    "responseCode": "OK",
    "result": {
        "form": {
            "type": "content",
            "subtype": "textbook",
            "action": "create",
            "component": "*",
            "framework": "tn_k-12_5",
            "data": {
                "templateName": "defaultTemplate",
                "action": "create",
                "fields": [{
                        "code": "name",
                        "dataType": "text",
                        "name": "Name",
                        "label": "Event Name",
                        "description": "Event Name",
                        "editable": true,
                        "placeholder": "Event Name",
                        "inputType": "text",
                        "required": true,
                        "displayProperty": "Editable",
                        "visible": true,
                        "renderingHints": {
                            "class": "sb-g-col-lg-1 required"
                        },
                        "index": 1,
                        "validations": [{
                                "type": "pattern",
                                "value": "^[a-zA-Z0-9 &]*$",
                                "message": "Invalid Input"
                            },
                            {
                                "type": "required",
                                "value": "80",
                                "message": "Enter Event Name"
                            }
                        ]
                    },
                    {
                        "code": "eventType",
                        "dataType": "text",
                        "name": "Event Type",
                        "label": "Event Type",
                        "description": "Type of the event",
                        "editable": true,
                        "default": "",
                        "placeholder": "Select Event Type",
                        "inputType": "select",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "range": ["Online", "Offline", "OnlineAndOffline"],
                        "renderingHints": {
                            "semanticColumnWidth": "six"
                        },
                        "index": 4
                    },
                    {
                        "code": "description",
                        "dataType": "text",
                        "name": "Description",
                        "Type": "textarea",
                        "required": false,
                        "displlabel": "Description",
                        "description": "Event Description",
                        "editable": true,
                        "placeholder": "Description",
                        "inputayProperty": "Editable",
                        "visible": true,
                        "renderingHints": {
                            "semanticColumnWidth": "twelve"
                        },
                        "index": 1,
                        "validations": [{
                            "type": "regex",
                            "value": "^[a-zA-Z0-9 &]*$",
                            "message": "Invalid Input"
                        }]
                    }, {
                        "code": "venue",
                        "dataType": "text",
                        "name": "Venue",
                        "label": "Venue",
                        "description": "Venue",
                        "editable": true,
                        "placeholder": "Venue",
                        "inputType": "textarea",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "renderingHints": {
                            "semanticColumnWidth": "twelve"
                        },
                        "index": 1,
                        "validations": [{
                            "type": "regex",
                            "value": "^[a-zA-Z0-9 &]*$",
                            "message": "Invalid Input"
                        }]
                    },
                    {
                        "code": "code",
                        "dataType": "text",
                        "name": "Code",
                        "label": "Code",
                        "description": "Code",
                        "editable": true,
                        "placeholder": "Code",
                        "inputType": "text",
                        "required": true,
                        "displayProperty": "Editable",
                        "visible": true,
                        "renderingHints": {
                            "class": "sb-g-col-lg-1 required"
                        },
                        "index": 6,
                        "validations": [{
                                "type": "regex",
                                "value": "^[a-zA-Z0-9]*$",
                                "message": "Invalid Input"
                            },
                            {
                                "type": "required",
                                "value": "80",
                                "message": "Enter Code"
                            }
                        ]
                    }, {
                        "code": "onlineProvider",
                        "dataType": "text",
                        "name": "Online Provider",
                        "label": "Online Provider",
                        "description": "Online Provider",
                        "editable": true,
                        "placeholder": "E.g Zoom",
                        "inputType": "select",
                        "required": false,
                        "displayProperty": "Editable",
                        "range": ["Zoom", "GoToMeeting", "Google Meet", "Jitsi"],
                        "visible": true,
                        "renderingHints": {
                            "semanticColumnWidth": "twelve"
                        },
                        "index": 1,
                        "validations": [{
                            "type": "regex",
                            "value": "^[a-zA-Z0-9 &]*$",
                            "message": "Invalid Input"
                        }]
                    }, {
                        "code": "onlineProviderData",
                        "dataType": "text",
                        "name": "Online Provider Data",
                        "label": "Online Provider Data",
                        "description": "Online Provider Data",
                        "editable": true,
                        "placeholder": "https://meetingLink",
                        "inputType": "text",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "renderingHints": {
                            "semanticColumnWidth": "twelve"
                        },
                        "index": 1,
                        "validations": [{
                            "type": "regex",
                            "value": "^[a-zA-Z0-9 &]*$",
                            "message": "Invalid Input"
                        }]
                    }, {
                        "code": "visibility",
                        "dataType": "text",
                        "name": "Visibility",
                        "label": "Visibility",
                        "description": "Visibility",
                        "editable": true,
                        "placeholder": "Select Visibility",
                        "inputType": "select",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "range": ["Default", "Parent"],
                        "renderingHints": {
                            "semanticColumnWidth": "six"
                        },
                        "index": 4
                    }, {
                        "code": "audience",
                        "dataType": "text",
                        "name": "Audience",
                        "label": "Audience",
                        "description": "Audience",
                        "editable": true,
                        "placeholder": "Select Audience",
                        "inputType": "nestedselect",
                        "default": "",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "range": ["Student", "Teacher", "Administrator"],
                        "renderingHints": {
                            "semanticColumnWidth": "six"
                        },
                        "index": 4
                    },
                    {
                        "code": "language",
                        "dataType": "text",
                        "name": "Language",
                        "label": "Language",
                        "description": "Language",
                        "editable": true,
                        "placeholder": "Select Language",
                        "inputType": "nestedselect",
                        "default": "",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "range": ["English", "Hindi", "Assamese", "Bengali", "Gujarati", "Kannada", "Malayalam", "Marathi", "Nepali", "Odia", "Punjabi", "Tamil", "Telugu", "Urdu", "Sanskrit", "Maithili", "Munda", "Santali", "Juang", "Ho"],
                        "renderingHints": {
                            "semanticColumnWidth": "six"
                        },
                        "index": 4
                    },
                    {
                        "code": "source",
                        "dataType": "text",
                        "name": "source",
                        "label": "Source",
                        "description": "Source",
                        "editable": true,
                        "placeholder": "Source",
                        "inputType": "text",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "renderingHints": {
                            "semanticColumnWidth": "twelve"
                        },
                        "index": 1,
                        "validations": [{
                            "type": "regex",
                            "value": "^[a-zA-Z0-9 &]*$",
                            "message": "Invalid Input"
                        }]
                    },
                    {
                        "code": "keywords",
                        "visible": true,
                        "editable": true,
                        "dataType": "list",
                        "name": "Keywords",
                        "description": "Keywords for the content",
                        "inputType": "keywords",
                        "label": "keywords",
                        "placeholder": "Enter Keywords",
                        "required": false,
                        "validations": [
                            {
                                "type": "required",
                                "message": "Keyword is required"
                            }
                        ]
                    }
                ]
            },
            "created_on": "2020-11-12T07:02:44.056Z",
            "last_modified_on": "2020-11-12T07:02:59.202Z",
            "rootOrgId": "01269878797503692810"
        }
    },
    "ts": "2021-02-17T05:33:12.609Z",
    "ver": "1.0"
}