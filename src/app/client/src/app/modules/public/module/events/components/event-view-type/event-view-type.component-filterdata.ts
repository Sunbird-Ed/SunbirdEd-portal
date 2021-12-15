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
                            "type": "select",
                            "templateOptions": {
                                "placeHolder":"Select Event Type",
                                "label":"Event Type",
                                "multiple": false,
                                "hidden": false,
                                "options": [
                                    {
                                        "value":"Online",
                                        "label":"Online"
                                    },
                                    {
                                        "value":"Offline",
                                        "label":"Offline"
                                    },
                                    {
                                        "value":"OnlineAndOffline",
                                        "label":"OnlineAndOffline"
                                    }
                                ]
                            }
                        },
                        {
                            "code": "eventTime",
                            "type": "select",
                            "templateOptions": {
                                "placeHolder":"Select Event Time",
                                "label":"Event Time",
                                "multiple": false,
                                "hidden": false,
                                "options": [
                                    {
                                        "value":"Past",
                                        "label":"Past"
                                    },
                                    {
                                        "value":"Upcoming",
                                        "label":"Upcoming"
                                    },
                                    {
                                        "value":"Ongoing",
                                        "label":"Ongoing"
                                    }
                                ]
                            }
                        },
                        {
                            "code": "eventStatus",
                            "type": "select",
                            "templateOptions": {
                                "placeHolder":"Select Event Status",
                                "label":"Event Status",
                                "multiple": false,
                                "hidden": false,
                                "options": [
                                    {
                                        "value":"Live",
                                        "label":"Live"
                                    },
                                    {
                                        "value":"Draft",
                                        "label":"Draft"
                                    }
                                ]
                            }
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