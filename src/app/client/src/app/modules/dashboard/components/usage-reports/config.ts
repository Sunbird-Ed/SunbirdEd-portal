export let config = {
  "id": "api.report",
  "ver": "1.0",
  "ts": "2019-07-01 10:18:42:645+0000",
  "params": {
    "resmsgid": "9a17d850-9be9-11e9-8335-8552c2bd16d5",
    "msgid": null,
    "status": "success",
    "err": null,
    "errmsg": null
  },
  "responseCode": "OK",
  "result": [
    {
      "id": "daily_metrics",
      "label": "DIKSHA Usage Repport",
      "title": "DIKSHA Usage Report",
      "description": "This report provides details of DIKSHA usage in terms of QR code scans, Content downloads, and plays. All the graphs show usage statistics per day. The report is updated every day. Following are the graphs shown:<br/><span style=\"margin-top:8px;margin-bottom:3px;display:inline-block;\"><b>QR Code Scans per day</b>: This graph shows the total number of QR code scans, per day.</span><br/><span style=\"margin:3px 0px;display:inline-block;\"><b>Failed QR Code Scans per day</b>: This graph shows the percentage of failed QR code scans, per day.</span><br/><span style=\"margin:3px 0px;display:inline-block;\"><b>Content Downloads per day</b>: This graph shows the total number of contents downloaded (from app), per day.</span><br/><span style=\"margin:3px 0px;display:inline-block;\"><b>Content Plays(App and Portal) per day</b>: This graph shows the total number of times contents are played (on portal and app), per day.</span><br/><span style=\"margin:3px 0px;display:inline-block;\"><b>Hours of Content Played per day</b>:  This graph shows the total number of hours for which contents are played (on portal and app), per day.</span><br/><span style=\"margin:3px 0px;display:inline-block;\"><b>Unique Active Devices per day</b>: This graph shows the total number of unique devices that played at least one content, per day.</span>",
      "dataSource": "/reports/sunbird/daily_metrics.json",
      "charts": [
        {
          "datasets": [
            {
              "dataExpr": "Total QR scans",
              "label": "Total QR Code Scans"
            }
          ],
          "colors": [
            {
              "borderColor": "rgb(1, 184, 170)",
              "backgroundColor": "rgba(1, 184, 170, 0.2)"
            }
          ],
          "labelsExpr": "Date",
          "chartType": "line",
          "options": {
            "scales": {
              "yAxes": [
                {
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Total QR Code Scans"
                  }
                }
              ],
              "xAxes": [
                {
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Date"
                  }
                }
              ]
            },
            "tooltips": {
              "intersect": false,
              "mode": "x-axis",
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "QR Code Scans per day"
            },
            "legend": {
              "display": false
            },
            "responsive": true
          },
          "filters": [
            {
              "displayName": "Select Date",
              "reference": "Date",
              "controlType": "date"
            }
          ]
        }
      ],
      "table": {
        "columnsExpr": "keys",
        "valuesExpr": "tableData"
      },
      "downloadUrl": "/reports/sunbird/daily_metrics.csv"
    },
    {
      "id": "textbook_level_dialcode_exception_report",
      "label": "QR Code Exception: Summary",
      "title": "QR Code Exception: Summary",
      "description": "This report provides a list of all  ‘Live’ textbooks within the State along with linked QR codes. It also depicts the QR codes for which there is no linked content.",
      "dataSource": "/reports/sunbird/DCException_Report_Textbook_Level.json",
      "downloadUrl": "/reports/sunbird/DCException_Report_Textbook_Level.csv",
      "charts": [
        {
          "id": "aggregated_live_textbook_qr_content_status",
          "datasets": [
            {
              "label": "Total number of QR codes",
              "dataExpr": "Total number of QR codes"
            }
          ],
          "colors": [
            {
              "backgroundColor": [
                "rgb(0, 199, 134)",
                "rgb(255, 69, 88)",
                "rgb(0, 0, 134)",
                "rgb(255, 0, 0)",
                "rgb(0, 199, 134)",
                "rgb(13, 69, 6)",
                "rgb(0, 34, 6)",
                "rgb(0, 0, 88)",
                "rgb(80, 199, 134)",
                "rgb(255, 169, 88)"
              ]
            }
          ],
          "labelsExpr": "Grade",
          "chartType": "pie",
          "options": {
            "tooltips": {
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "Total QR scans Report by class"
            },
            "legend": {
              "display": true
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select Medium",
            "reference": "Medium",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Grade",
            "reference": "Grade",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Textbook name",
            "reference": "Textbook name",
            "controlType": "multi-select"
          }]
        },
        {
          "id": "aggregated_live_textbook_qr_content_status",
          "datasets": [
            {
              "label": "Total number of QR codes",
              "dataExpr": "Total number of QR codes"
            },
            {
              "label": "Number of QR codes with atleast 1 linked content",
              "dataExpr": "Number of QR codes with atleast 1 linked content"
            },
            {
              "label": "Number of QR codes with no linked content",
              "dataExpr": "Number of QR codes with no linked content"
            }
          ],
          "colors": [
            {
              "backgroundColor": [
                "rgb(0, 199, 134)",
                "rgb(255, 69, 88)"
              ]
            }
          ],
          "labelsExpr": "Grade",
          "chartType": "bar",
          "options": {
            "tooltips": {
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "QR Code Exception Report by class"
            },
            "legend": {
              "display": true
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select Medium",
            "reference": "Medium",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Grade",
            "reference": "Grade",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Textbook name",
            "reference": "Textbook name",
            "controlType": "multi-select"
          }]
        },
        {
          "id": "aggregated_live_textbook_qr_content_status",
          "filters": [
            {
              "displayName": "Select Grade",
              "reference": "Grade",
              "controlType": "multi-select"
            },
            {
              "displayName": "Select Medium",
              "reference": "Medium",
              "controlType": "multi-select"
            },
            {
              "displayName": "Select Textbook name",
              "reference": "Textbook name",
              "controlType": "multi-select"
            }],
          "datasets": [
            {
              "label": "Total number of QR codes",
              "dataExpr": "Total number of QR codes"
            },
            {
              "label": "Number of QR codes with atleast 1 linked content",
              "dataExpr": "Number of QR codes with atleast 1 linked content"
            },
            {
              "label": "Number of QR codes with no linked content",
              "dataExpr": "Number of QR codes with no linked content"
            }
          ],
          "colors": [
            {
              "backgroundColor": [
                "rgb(0, 199, 134)",
                "rgb(255, 69, 88)"
              ]
            }
          ],
          "labelsExpr": "Medium",
          "chartType": "bar",
          "options": {
            "tooltips": {
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "QR Code Exception Report by Medium"
            },
            "legend": {
              "display": true
            },
            "responsive": true
          }
        },
        {
          "id": "aggregated_live_textbook_qr_content_status",
          "filters": [{
            "displayName": "Select Medium",
            "reference": "Medium",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Grade",
            "reference": "Grade",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Textbook name",
            "reference": "Textbook name",
            "controlType": "multi-select"
          }],
          "datasets": [
            {
              "label": "Total number of QR codes",
              "dataExpr": "Total number of QR codes"
            },
            {
              "label": "Number of QR codes with atleast 1 linked content",
              "dataExpr": "Number of QR codes with atleast 1 linked content"
            },
            {
              "label": "Number of QR codes with no linked content",
              "dataExpr": "Number of QR codes with no linked content"
            }
          ],
          "colors": [
            { // grey
              backgroundColor: 'rgba(148,159,177,0.2)',
              borderColor: 'rgba(148,159,177,1)',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            { // dark grey
              backgroundColor: 'rgba(77,83,96,0.2)',
              borderColor: 'rgba(77,83,96,1)',
              pointBackgroundColor: 'rgba(77,83,96,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(77,83,96,1)'
            },
            { // red
              backgroundColor: 'rgba(255,0,0,0.3)',
              borderColor: 'red',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }
          ],
          "labelsExpr": "Subject",
          "chartType": "line",
          "options": {
            "tooltips": {
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "QR Code Exception Report by Subject"
            },
            "legend": {
              "display": true
            },
            "responsive": true
          }
        }
      ],
      "table": {
        "columnsExpr": "keys",
        "valuesExpr": "tableData"
      }
    },
    {
      "id": "textbook_level_etb_report_report",
      "label": "ETB Creation Status: Summary",
      "title": "ETB Creation Status: Summary",
      "description": "It helps the State administrators and ETB coordinators to understand the details of all textbooks such as QR codes linkage status, number of textbooks created class wise, medium wise etc. These reports help administrators compare their actual with projected targets.",
      "dataSource": "/reports/sunbird/ETB_Report_Textbook_Level.json",
      "downloadUrl": "/reports/sunbird/ETB_Report_Textbook_Level.csv",
      "charts": [
        {
          "id": "aggregated_textbook_status",
          "datasets": [
            {
              "label": "Total content linked",
              "dataExpr": "Total content linked"
            }
          ],
          "colors": [
            {
              "backgroundColor": [
                "rgb(0, 199, 134)",
                "rgb(255, 161, 29)",
                "rgb(255, 69, 88)"
              ]
            }
          ],
          "labelsExpr": "Current status",
          "chartType": "pie",
          "options": {
            "tooltips": {
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "Total Linked Content By Status"
            },
            "legend": {
              "display": true
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select Medium",
            "reference": "Medium",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Grade",
            "reference": "Grade",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Subject",
            "reference": "Subject",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Textbook name",
            "reference": "Textbook name",
            "controlType": "multi-select"
          }]
        },
        {
          "id": "aggregated_textbook_status_by_class",
          "datasets": [
            {
              "label": "Total content linked",
              "dataExpr": "Total content linked"
            },
            {
              "label": "Number Of QR codes not linked to content",
              "dataExpr": "Number Of QR codes not linked to content"
            },
            {
              "label": "Total leaf nodes",
              "dataExpr": "Total leaf nodes"
            }
          ],
          "colors": [
            {
              "borderColor": "rgb(0, 199, 134)",
              "backgroundColor": "rgb(0, 199, 134)"
            },
            {
              "borderColor": "rgb(255, 161, 29)",
              "backgroundColor": "rgb(255, 161, 29)"
            },
            {
              "borderColor": "rgb(255, 69, 88)",
              "backgroundColor": "rgb(255, 69, 88)"
            }
          ],
          "labelsExpr": "Subject",
          "chartType": "bar",
          "options": {
            "scales": {
              "yAxes": [
                {
                  "stacked": true,
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Total Linked Content"
                  }
                }
              ],
              "xAxes": [
                {
                  "stacked": true,
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Subject"
                  }
                }
              ]
            },
            "tooltips": {
              "intersect": false,
              "mode": "x-axis",
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "Total Linked Content By Subject"
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select Medium",
            "reference": "Medium",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Subject",
            "reference": "Subject",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Grade",
            "reference": "Grade",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Textbook name",
            "reference": "Textbook name",
            "controlType": "multi-select"
          }]
        }
      ]
    },
    {
      "id": "textbook_level_etb_report_report2",
      "label": "usage report by district",
      "title": "usage report by district test data",
      "description": "It helps the State administrators and ETB coordinators to understand the details of all textbooks such as QR codes linkage status, number of textbooks created class wise, medium wise etc. These reports help administrators compare their actual with projected targets.",
      "dataSource": "/reports/sunbird/district_usage_report.json",
      "downloadUrl": "/reports/sunbird/district_usage_report.csv",
      "charts": [
        {
          "id": "aggregated_textbook_status",
          "datasets": [
            {
              "label": "Unique users",
              "dataExpr": "_number_unique_users"
            }
          ],
          "labelsExpr": "_date",
          "chartType": "bar",
          "options": {
            "tooltips": {
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "Total unique users by date"
            },
            "legend": {
              "display": true
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select District",
            "reference": "_district",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Access Point",
            "reference": "_access_point",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Date",
            "reference": "_date",
            "controlType": "date"
          }]
        },
        {
          "id": "aggregated_textbook_status_by_class",
          "datasets": [
            {
              "label": "Total unique users",
              "dataExpr": "_number_unique_users"
            }
          ],
          "colors": [
            {
              "borderColor": "rgb(0, 199, 134)",
              "backgroundColor": "rgb(0, 199, 134)"
            },
            {
              "borderColor": "rgb(255, 161, 29)",
              "backgroundColor": "rgb(255, 161, 29)"
            },
            {
              "borderColor": "rgb(255, 69, 88)",
              "backgroundColor": "rgb(255, 69, 88)"
            }
          ],
          "labelsExpr": "_district",
          "chartType": "bar",
          "options": {
            "scales": {
              "yAxes": [
                {
                  "stacked": true,
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Total Unique users"
                  }
                }
              ],
              "xAxes": [
                {
                  "stacked": true,
                  "scaleLabel": {
                    "display": true,
                    "labelString": "District"
                  }
                }
              ]
            },
            "tooltips": {
              "intersect": false,
              "mode": "x-axis",
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "Total unique users By District"
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select access point",
            "reference": "_access_point",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Distict",
            "reference": "_district",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Date",
            "reference": "_date",
            "controlType": "date"
          }]
        },
        {
          "id": "aggregated_textbook_status_by_class",
          "datasets": [
            {
              "label": "Total unique users",
              "dataExpr": "_number_unique_users"
            }
          ],
          "colors": [
            {
              "borderColor": "rgb(0, 199, 134)",
              "backgroundColor": "rgb(0, 199, 134)"
            },
            {
              "borderColor": "rgb(255, 161, 29)",
              "backgroundColor": "rgb(255, 161, 29)"
            },
            {
              "borderColor": "rgb(255, 69, 88)",
              "backgroundColor": "rgb(255, 69, 88)"
            }
          ],
          "labelsExpr": "_access_point",
          "chartType": "bar",
          "options": {
            "scales": {
              "yAxes": [
                {
                  "stacked": true,
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Total Unique Users"
                  }
                }
              ],
              "xAxes": [
                {
                  "stacked": true,
                  "scaleLabel": {
                    "display": true,
                    "labelString": "Access Point"
                  }
                }
              ]
            },
            "tooltips": {
              "intersect": false,
              "mode": "x-axis",
              "titleSpacing": 5,
              "bodySpacing": 5
            },
            "title": {
              "fontSize": 16,
              "display": true,
              "text": "Total unique users By District"
            },
            "responsive": true
          },
          "filters": [{
            "displayName": "Select access point",
            "reference": "_access_point",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select district",
            "reference": "_district",
            "controlType": "multi-select"
          },
          {
            "displayName": "Select Date",
            "reference": "_date",
            "controlType": "date"
          }]
        }
      ]
    }
  ]
}