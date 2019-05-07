export const mockChartData = {
    configData: {
        'id': 'api.report',
        'ver': '1.0',
        'ts': '2019-05-03 08:13:54:563+0000',
        'params': {
          'resmsgid': '6479f530-6d7b-11e9-b029-4de126dd73ce',
          'msgid': null,
          'status': 'success',
          'err': null,
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': [
          {
            'id': 'course_enrollment_report',
            'label': 'Online Course Report',
            'title': 'Online Course Report',
            'description': 'Reports related to show the course wise enrollment numbers,to  by district.',
            'dataSource': '/reports/sunbird/course_enrollment.json',
            'charts': [
              {
                'datasets': [
                  {
                    'dataExpr': 'data["Total Enrollment"]',
                    'label': 'Enrollment Report by course'
                  }
                ],
                'colors': [
                  {
                    'borderColor': 'rgb(1, 184, 170)',
                    'backgroundColor': 'rgba(2, 79, 157, 1)'
                  }
                ],
                'labelsExpr': 'data.CourseName',
                'chartType': 'horizontalBar',
                'options': {
                  'scales': {
                    'yAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'Course name'
                        }
                      }
                    ],
                    'xAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'No of enrollments'
                        }
                      }
                    ]
                  },
                  'tooltips': {
                    'intersect': false,
                    'mode': 'x-axis',
                    'titleSpacing': 5,
                    'bodySpacing': 5
                  },
                  'title': {
                    'fontSize': 16,
                    'display': true,
                    'text': 'Enrollment Report by Course'
                  },
                  'legend': {
                    'display': false
                  },
                  'responsive': true
                }
              },
              {
                'datasets': [
                  {
                    'data': [
                      '100',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'English Training Program'
                  },
                  {
                    'data': [
                      '100',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'Physical Science Training Program'
                  },
                  {
                    'data': [
                      '0',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'Krishna'
                  },
                  {
                    'data': [
                      '0',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'Maths Training Program'
                  }
                ],
                'colors': [
                  {
                    'borderColor': 'rgba(2, 79, 157, 1)',
                    'backgroundColor': 'rgba(2, 79, 157, 1)'
                  },
                  {
                    'borderColor': 'rgb(245, 40, 63, 1)',
                    'backgroundColor': 'rgba(245, 40, 63, 1)'
                  },
                  {
                    'borderColor': 'rgb(247, 148, 4, 1)',
                    'backgroundColor': 'rgba(247, 148, 4, 1)'
                  }
                ],
                'labels': [
                  'East Godavari',
                  'West Godavari',
                  'Krishna',
                  'visakhapatnam'
                ],
                'chartType': 'horizontalBar',
                'options': {
                  'scales': {
                    'yAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'District Name'
                        },
                        'stacked': true
                      }
                    ],
                    'xAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'No of enrollments'
                        },
                        'stacked': true
                      }
                    ]
                  },
                  'tooltips': {
                    'intersect': false,
                    'mode': 'x-axis',
                    'titleSpacing': 5,
                    'bodySpacing': 5
                  },
                  'title': {
                    'fontSize': 16,
                    'display': true,
                    'text': 'Enrollment Report by District'
                  },
                  'legend': {
                    'display': false
                  },
                  'responsive': true
                }
              },
              {
                'datasets': [
                  {
                    'dataExpr': 'data["Average Time Spent Course"]',
                    'label': 'Time Spent Report by Course'
                  }
                ],
                'colors': [
                  {
                    'borderColor': 'rgb(1, 184, 170)',
                    'backgroundColor': 'rgba(2, 79, 157, 1)'
                  }
                ],
                'labelsExpr': 'data.TimeSpentCourseName',
                'chartType': 'horizontalBar',
                'options': {
                  'scales': {
                    'yAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'Course name'
                        }
                      }
                    ],
                    'xAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'Avg.time spent(mins)'
                        }
                      }
                    ]
                  },
                  'tooltips': {
                    'intersect': false,
                    'mode': 'x-axis',
                    'titleSpacing': 5,
                    'bodySpacing': 5
                  },
                  'title': {
                    'fontSize': 16,
                    'display': true,
                    'text': 'Time Spent Report by Course'
                  },
                  'legend': {
                    'display': false
                  },
                  'responsive': true
                }
              },
              {
                'datasets': [
                  {
                    'data': [
                      '100',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'English Traning program'
                  },
                  {
                    'data': [
                      '0',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'Physical Science Training Program'
                  },
                  {
                    'data': [
                      '0',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'Maths Training Program'
                  }
                ],
                'colors': [
                  {
                    'borderColor': 'rgba(2, 79, 157, 1)',
                    'backgroundColor': 'rgba(2, 79, 157, 1)'
                  },
                  {
                    'borderColor': 'rgb(245, 40, 63, 1)',
                    'backgroundColor': 'rgba(245, 40, 63, 1)'
                  },
                  {
                    'borderColor': 'rgb(247, 148, 4, 1)',
                    'backgroundColor': 'rgba(247, 148, 4, 1)'
                  }
                ],
                'labels': [
                  'East Godavari',
                  'West Godavari',
                  'Krishna'
                ],
                'chartType': 'horizontalBar',
                'options': {
                  'scales': {
                    'yAxes': [
                      {
                        'stacked': true,
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'District Name'
                        }
                      }
                    ],
                    'xAxes': [
                      {
                        'stacked': true,
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'Avg. time spent(mins)'
                        }
                      }
                    ]
                  },
                  'tooltips': {
                    'intersect': false,
                    'mode': 'x-axis',
                    'titleSpacing': 5,
                    'bodySpacing': 5
                  },
                  'title': {
                    'fontSize': 16,
                    'display': true,
                    'text': 'Time Spent Report By District'
                  },
                  'responsive': true,
                  'legend': {
                    'display': false
                  }
                }
              },
              {
                'datasets': [
                  {
                    'dataExpr': 'data["Total Completion"]',
                    'label': 'Course Completion Report by Course '
                  }
                ],
                'colors': [
                  {
                    'borderColor': 'rgb(1, 184, 170)',
                    'backgroundColor': 'rgba(2, 79, 157, 1)'
                  }
                ],
                'labelsExpr': 'data.CompletedCourse',
                'chartType': 'horizontalBar',
                'options': {
                  'scales': {
                    'yAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'Course name'
                        }
                      }
                    ],
                    'xAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'No of enrollments'
                        }
                      }
                    ]
                  },
                  'tooltips': {
                    'intersect': false,
                    'mode': 'x-axis',
                    'titleSpacing': 5,
                    'bodySpacing': 5
                  },
                  'title': {
                    'fontSize': 16,
                    'display': true,
                    'text': 'Course Completion Report by Course'
                  },
                  'legend': {
                    'display': false
                  },
                  'responsive': true
                }
              },
              {
                'datasets': [
                  {
                    'data': [
                      '100',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'visakhapatnam'
                  },
                  {
                    'data': [
                      '100',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'East Godavari'
                  },
                  {
                    'data': [
                      '0',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'Krishna'
                  },
                  {
                    'data': [
                      '0',
                      '500',
                      '1000',
                      '1500'
                    ],
                    'label': 'West Godavari'
                  }
                ],
                'colors': [
                  {
                    'borderColor': 'rgba(2, 79, 157, 1)',
                    'backgroundColor': 'rgba(2, 79, 157, 1)'
                  },
                  {
                    'borderColor': 'rgb(245, 40, 63, 1)',
                    'backgroundColor': 'rgba(245, 40, 63, 1)'
                  },
                  {
                    'borderColor': 'rgb(247, 148, 4, 1)',
                    'backgroundColor': 'rgba(247, 148, 4, 1)'
                  }
                ],
                'labels': [
                  'East Godavari',
                  'West Godavari',
                  'Krishna',
                  'visakhapatnam'
                ],
                'chartType': 'horizontalBar',
                'options': {
                  'scales': {
                    'yAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'District Name'
                        },
                        'stacked': true
                      }
                    ],
                    'xAxes': [
                      {
                        'scaleLabel': {
                          'display': true,
                          'labelString': 'No of enrollments'
                        },
                        'stacked': true
                      }
                    ]
                  },
                  'tooltips': {
                    'intersect': false,
                    'mode': 'x-axis',
                    'titleSpacing': 5,
                    'bodySpacing': 5
                  },
                  'title': {
                    'fontSize': 16,
                    'display': true,
                    'text': 'Course Completion report by District'
                  },
                  'legend': {
                    'display': false
                  },
                  'responsive': true
                }
              }
            ],
            'downloadUrl': '/reports/sunbird/daily_metrics.csv'
        }
        ]
    }
};

