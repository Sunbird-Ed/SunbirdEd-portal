export const myEventFilter = {
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
                "fields": [
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
                        "code": "eventTime",
                        "dataType": "text",
                        "name": "Event Time",
                        "label": "Event Time",
                        "description": "Time of the event",
                        "editable": true,
                        "default": "",
                        "placeholder": "Select Event Type",
                        "inputType": "select",
                        "required": false,
                        "displayProperty": "Editable",
                        "visible": true,
                        "range": ["Post", "Upcoming"],
                        "renderingHints": {
                            "semanticColumnWidth": "six"
                        },
                        "index": 4
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