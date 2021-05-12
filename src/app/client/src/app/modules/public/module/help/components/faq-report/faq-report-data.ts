export const FaqReportData = {
  "id": "api.form.read",
  "params": {
    "resmsgid": "13e25148-f99e-4b8e-a65e-af942099f87e",
    "msgid": "a77c8e00-25b3-44ac-a1e9-d0cb8c0e1abb",
    "status": "successful"
  },
  "responseCode": "OK",
  "result": {
    "form": {
      "type": "dynamicform",
      "subtype": "support",
      "action": "get",
      "component": "web",
      "framework": "*",
      "data": {
        "templateName": "support",
        "action": "get",
        "fields": [
          {
            "code": "category",
            "type": "nested_select",
            "templateOptions": {
              "placeHolder": "Select Category",
              "multiple": false,
              "hidden": false,
              "options": [
                {
                  "value": "content",
                  "label": "Content"
                },
                {
                  "value": "loginRegistration",
                  "label": "Login/Registration"
                },
                {
                  "value": "teacherTraining",
                  "label": "Teacher Training"
                },
                {
                  "value": "otherissues",
                  "label": "Other Issues",
                  "dataSrc": {
                    "action": "telemetry"
                  }
                }
              ]
            },
            "validations": [
              {
                "type": "required"
              }
            ],
            "children": {
              "otherissues": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ]
            }
          },
          {
            "code": "subcategory",
            "context": "category",
            "type": "nested_select",
            "children": {
              "contentquality": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "contentnotplaying": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "contentavailability": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                },
                {
                  "code": "notify",
                  "type": "checkbox",
                  "templateOptions": {
                    "label": "Notify me on availability"
                  }
                }
              ],
              "contentotherissues": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "otpissue": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "profilevalidation": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "profiledetails": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "certificate": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "teacherid": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "profileotherissues": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ],
              "teacherotherissues": [
                {
                  "code": "details",
                  "type": "textarea",
                  "context": null,
                  "templateOptions": {
                    "label": "Tell us more",
                    "placeHolder": "Enter Details"
                  },
                  "validations": [
                    {
                      "type": "maxLength",
                      "value": 1000
                    }
                  ]
                }
              ]
            },
            "templateOptions": {
              "placeHolder": "Select Subcategory",
              "multiple": false,
              "hidden": false,
              "options": {
                "loginRegistration": [
                  {
                    "value": "otpissue",
                    "label": "OTP Issue",
                    "dataSrc": {
                      "action": "telemetry"
                    }
                  },
                  {
                    "value": "profilevalidation",
                    "label": "Profile validation/No green tick on my profile",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "profiledetails",
                    "label": "Profile details incorrect",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "certificate",
                    "label": "Certificate related",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "teacherid",
                    "label": "Teacher id",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "profileotherissues",
                    "label": "Other issues",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  }
                ],
                "content": [
                  {
                    "value": "contentquality",
                    "label": "Content Quality",
                    "dataSrc": {
                      "action": "telemetry"
                    }
                  },
                  {
                    "value": "contentnotplaying",
                    "label": "Content not playing/downloading",
                    "dataSrc": {
                      "action": "telemetry"
                    }
                  },
                  {
                    "value": "contentavailability",
                    "label": "Content availability",
                    "dataSrc": {
                      "action": "telemetry"
                    }
                  },
                  {
                    "value": "contentotherissues",
                    "label": "Other Issues",
                    "dataSrc": {
                      "action": "telemetry"
                    }
                  }
                ],
                "teacherTraining": [
                  {
                    "value": "profilevalidation",
                    "label": "Profile validation/No green tick on my profile",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "profiledetails",
                    "label": "Profile details incorrect",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "certificate",
                    "label": "Certificate related",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  },
                  {
                    "value": "teacherotherissues",
                    "label": "Other issues",
                    "dataSrc": {
                      "action": "contactBoard"
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      "created_on": "2020-08-26T11:50:11.735Z",
      "last_modified_on": "2020-10-13T13:30:37.231Z",
      "rootOrgId": "*"
    }
  },
  "ts": "2021-04-09T12:02:12.116Z",
  "ver": "1.0"
}