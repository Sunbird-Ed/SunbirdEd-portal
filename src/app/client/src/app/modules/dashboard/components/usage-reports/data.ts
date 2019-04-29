export let stateDataWithUsers = {
    'options': {
      'scales': {
        'yAxes': [
          {
            'stacked': true,
            'scaleLabel': {
              'display': true,
              'labelString': 'No. of users'
            }
          }
        ],
        'xAxes': [
          {
            'stacked': true,
            'scaleLabel': {
              'display': true,
              'labelString': 'States'
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
        'text': 'No. of users in different states'
      },
      'responsive': true
    },
    'colors': [
      {
        'borderColor': 'rgb(0, 199, 134)',
        'backgroundColor': 'rgb(0, 199, 134)'
      },
      {
        'borderColor': 'rgb(255, 69, 88)',
        'backgroundColor': 'rgb(255, 69, 88)'
      }
    ],
    'chartType': 'bar',
    'labels': [
      'Karnataka',
      'Maharastra',
      'Haryana',
      'UP',
      'Goa',
      'Punjab'
    ],
    'legend': true,
    'datasets': [
      {
        'label': 'Teacher',
        'data': [
          '98.8',
          '46.8',
          '36.0',
          '98.8',
          '46.8',
          '36.0'
        ]
      },
      {
        'label': 'Students',
        'data': [
          '32.2',
          '53.2',
          '64.0',
          '98.8',
          '46.8',
          '36.0'
        ]
      },
       {
        'label': 'Undeclared',
        'data': [
          '11.2',
          '76.2',
          '98.0',
          '98.8',
          '46.8',
          '36.0'
        ]
      }
    ]
  };




  export let CourseEnrollmentCharts = [
    {
      'datasets': [
        {
          'data': [
            '54814',
            '51356',
            '67348',
            '176538',
            '214892'
          ],
          'label': 'Enrollment Report by course'
        }
      ],
      'colors': [
        {
          'borderColor': 'rgb(1, 184, 170)',
          'backgroundColor': 'rgba(2, 79, 157, 1)'
        }
      ],
      'labels': [
        'English Training Program',
        'Physical Science Training Program',
        'Maths Training Program'
      ],
      'chartType': 'horizontalBar',
      'options': {
        'scales': {
          'yAxes': [
            {
              'stacked': true,
              'scaleLabel': {
                'display': true,
                'labelString': 'Course name'
              }
            }
          ],
          'xAxes': [
            {
              'stacked': true,
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
          'text': 'Course enrollment'
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
            '3000',
            '500',
            '1000',
            '500'
          ],
          'label': 'English Traning program'
        },
        {
          'data': [
            '3432',
            '560',
            '1000',
            '7500'
          ],
          'label': 'Physical Science Traing Program'
        },
        {
          'data': [
            '20',
            '800',
            '5000',
            '2500'
          ],
          'label': 'Maths Traing Program'
        }
      ],
      'colors': [
        {
          'borderColor': 'rgb(242, 203, 28)',
          'backgroundColor': 'rgba(242, 203, 28, 0.2)'
        },
        {
          'borderColor': 'rgb(55, 70, 73)',
          'backgroundColor': 'rgba(55, 70, 73, 0.2)'
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
                'labelString': 'Name Of District'
              }
            }
          ],
          'xAxes': [
            {
              'stacked': true,
              'scaleLabel': {
                'display': true,
                'labelString': 'Avg time spent(mins)'
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
        'responsive': true
      }
    }
  ];
