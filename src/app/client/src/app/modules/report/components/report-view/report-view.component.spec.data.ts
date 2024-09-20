export const stateData = {
  entityId: '5fd098e2e049735a86b748b8',
  observationId: '60587848129c8857da854d9e',
  entityType: 'district',
  solutionId: '6054abd9823d601f0af5c3a0',
  filter: {
    questionId: [],
  },
  criteriaWise: false,
  scores: false,
  observation: true,
  pdf: false,
};

export const reportData = {
  result: true,
  entityType: 'district',
  entityId: '5fd098e2e049735a86b748b8',
  entityName: 'CHITTOOR',
  solutionName: 'Obs Form for All Question type',
  observationId: '60587848129c8857da854d9e',
  districtName: 'CHITTOOR',
  programName: '3.8.0 testing program - 2',
  reportSections: [
    {
      order: 'Q10_1616157220157-1616161753198',
      question: 'Add the student interview responses',
      responseType: 'matrix',
      answers: [],
      chart: {},
      instanceQuestions: [
        {
          order: 'Q12_1616157220157-1616161753212',
          question: 'How would you rate the course taken?',
          responseType: 'slider',
          answers: ['3'],
          chart: {},
          instanceQuestions: [],
        },
        {
          order: 'Q13_1616157220157-1616161753214',
          question: 'How many courses have you taken?',
          responseType: 'number',
          answers: ['2'],
          chart: {},
          instanceQuestions: [],
        },
        {
          order: 'Q14_1616157220157-1616161753215',
          question: 'Which courses did you go through?',
          responseType: 'text',
          answers: ['test'],
          chart: {},
          instanceQuestions: [],
          evidences: [
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/1617216994418.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=Sa5htAH2jVN0gU2FtfX%2FK7bkHW2S16qqLsPWcmyOddg%3D',
              extension: 'jpg',
            },
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/606c0ba72396373802fb57f4/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG_20201028_1711075500160580162872754.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=mi7FFoBQAIqLUyrpy4FS39s8iAqAcPRWoFVRQ2%2Be0Fk%3D',
              extension: 'jpg',
            },
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/606c0ba72396373802fb57f4/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_images8404688319259463054.jpeg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=E0M64OC6qJRYtiEFCIbYqb4TU6btcEtEgIA%2BMxW11VM%3D',
              extension: 'jpeg',
            },
          ],
          evidence_count: 10,
        },
      ],
    },
    {
      order: 'Q1_1616157220157-1616161753196',
      question: 'Enter the date of observation',
      responseType: 'date',
      answers: ['1-4-2021 0:21:43 AM'],
      chart: {},
      instanceQuestions: [],
    },
    {
      order: 'Q2_1616157220157-1616161753199',
      question: 'Which class does your child study in?',
      responseType: 'number',
      answers: ['2'],
      chart: {},
      instanceQuestions: [],
    },
    {
      order: 'Q3_1616157220157-1616161753202',
      question: 'Are you currently living in the vicinity of the school?',
      responseType: 'radio',
      answers: [
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'Yes',
        'R',
        'R',
        'No',
        'R',
        'Yes',
        'No',
        'No',
        'R1',
        'R1',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
      ],
      chart: {
        type: 'pie',
        data: {
          labels: ['No', 'Yes', 'R', 'R1'],
          datasets: [
            {
              backgroundColor: [
                '#FFA971',
                '#F6DB6C',
                '#98CBED',
                '#C9A0DA',
                '#5DABDC',
                '#88E5B0',
              ],
              data: [73.08, 26.92],
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
            align: 'start',
          },
        },
      },
      instanceQuestions: [],
    },
    {
      order: 'Q4_1616157220157-1616161753203',
      question: 'Are you planning to come back?',
      responseType: 'radio',
      answers: [
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'Yes',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
      ],
      chart: {
        type: 'pie',
        data: {
          labels: ['No', 'Yes'],
          datasets: [
            {
              backgroundColor: [
                '#FFA971',
                '#F6DB6C',
                '#98CBED',
                '#C9A0DA',
                '#5DABDC',
                '#88E5B0',
              ],
              data: [69.23, 3.85],
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
            align: 'start',
          },
        },
      },
      instanceQuestions: [],
    },
    {
      order: 'Q5_1616157220157-1616161753205',
      question: 'What type of device is available at home?',
      responseType: 'multiselect',
      answers: [
        ['Smart phone with internet/data pack'],
        ['Smart phone without internet/data pack'],
        [
          'Smart phone with internet/data pack',
          'Smart phone without internet/data pack',
        ],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Smart phone without internet/data pack'],
        ['Smart phone with internet/data pack'],
        ['Simple mobile phone without internet/data pack'],
        ['Radio'],
        ['Smart phone with internet/data pack'],
        ['Simple mobile phone without internet/data pack'],
        ['Simple mobile phone without internet/data pack'],
        [
          'Simple mobile phone without internet/data pack',
          'Smart phone with internet/data pack',
          'Smart phone without internet/data pack',
        ],
        ['Simple mobile phone without internet/data pack'],
        ['Smart phone with internet/data pack'],
        [
          'Smart phone with internet/data pack',
          'Smart phone without internet/data pack',
        ],
        ['Simple mobile phone without internet/data pack'],
      ],
      chart: {
        type: 'horizontalBar',
        data: {
          labels: [
            'Smart phone with internet/data pack',
            'Smart phone without internet/data pack',
            'Simple mobile phone without internet/data pack',
            'Radio',
          ],
          datasets: [
            {
              data: [69.23, 19.23, 23.08, 3.85],
              backgroundColor: '#de8657',
            },
          ],
        },
        options: {
          legend: false,
          scales: {
            xAxes: [
              {
                ticks: {
                  min: 0,
                  max: 100,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Responses in percentage',
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Responses',
                },
              },
            ],
          },
        },
      },
      instanceQuestions: [],
      evidences: [
        {
          url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00042204198365642023404.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=pgo4lwG6elAarY5SSJcrBMrLg2qeEnGplKk2WFPNeQk%3D',
          extension: 'jpg',
        },
        {
          url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210331-WA00046839844612612680327.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=4mleNpgAdWWGrZ7v1QXysOFXcmt5q%2BtkwCkPPXznUbk%3D',
          extension: 'jpg',
        },
        {
          url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00151579082204213199966.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=XQ5TQFVLTvO4pQ2Mys4LXWyMWYjBIzNZJa4VaJsFduU%3D',
          extension: 'jpg',
        },
      ],
      evidence_count: 21,
    },
    {
      order: 'Q6_1616157220157-1616161753206',
      question: 'Does the child have a quiet place to study?',
      responseType: 'radio',
      answers: [
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
        'Yes',
        'R',
        'R',
        'No',
        'R',
        'Yes',
        'No',
        'No',
        'R2',
        'R2',
        'No',
        'No',
        'No',
        'Yes',
        'No',
        'No',
      ],
      chart: {
        type: 'pie',
        data: {
          labels: ['No', 'Yes', 'R', 'R2'],
          datasets: [
            {
              backgroundColor: [
                '#FFA971',
                '#F6DB6C',
                '#98CBED',
                '#C9A0DA',
                '#5DABDC',
                '#88E5B0',
              ],
              data: [80.77, 19.23],
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
            align: 'start',
          },
        },
      },
      instanceQuestions: [],
    },
    {
      order: 'Q7_1616157220157-1616161753207',
      question: 'Were you able to enrol your child in courses on SUNBIRD?',
      responseType: 'radio',
      answers: [
        'No',
        'No',
        'No',
        'No',
        'No',
        'Yes',
        'No',
        'No',
        'Yes',
        'No',
        'Yes',
        'R',
        'R',
        'No',
        'R',
        'Yes',
        'No',
        'Yes',
        'R1',
        'R1',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
      ],
      chart: {
        type: 'pie',
        data: {
          labels: ['No', 'Yes', 'R', 'R1'],
          datasets: [
            {
              backgroundColor: [
                '#FFA971',
                '#F6DB6C',
                '#98CBED',
                '#C9A0DA',
                '#5DABDC',
                '#88E5B0',
              ],
              data: [61.54, 38.46],
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
            align: 'start',
          },
        },
      },
      instanceQuestions: [],
    },
    {
      order: 'Q8_1616157220157-1616161753209',
      question: 'What are the challenges that you are facing in enrolment?',
      responseType: 'multiselect',
      answers: [
        ['Don’t find the courses useful'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not aware of the enrolment process in the classroom'],
        ['Not aware of the enrolment process in the classroom'],
        ['Not aware of the enrolment process in the classroom'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not able to use the app'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not aware of the enrolment process in the classroom'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not aware of the enrolment process in the classroom'],
        ['Not aware of classrooms on SUNBIRD'],
        ['Not able to use the app', 'Not aware of classrooms on SUNBIRD'],
        ['Not able to use the app'],
      ],
      chart: {
        type: 'horizontalBar',
        data: {
          labels: [
            'Don’t find the courses useful',
            'Not aware of the enrolment process in the classroom',
            'Not aware of classrooms on SUNBIRD',
            'Not able to use the app',
          ],
          datasets: [
            {
              data: [3.85, 19.23, 30.77, 11.54],
              backgroundColor: '#de8657',
            },
          ],
        },
        options: {
          legend: false,
          scales: {
            xAxes: [
              {
                ticks: {
                  min: 0,
                  max: 100,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Responses in percentage',
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Responses',
                },
              },
            ],
          },
        },
      },
      instanceQuestions: [],
    },
    {
      order: 'Q9_1616157220157-1616161753210',
      question:
        'On basis of the responses received above,  do you think this student is a potential drop out?',
      responseType: 'radio',
      answers: [
        'No',
        'No',
        'No',
        'No',
        'No',
        'Yes',
        'No',
        'No',
        'Yes',
        'Yes',
        'Yes',
        'R',
        'R',
        'No',
        'R',
        'Yes',
        'No',
        'Yes',
        'R2',
        'R1',
        'No',
        'No',
        'No',
        'No',
        'No',
        'No',
      ],
      chart: {
        type: 'pie',
        data: {
          labels: ['No', 'Yes', 'R', 'R2', 'R1'],
          datasets: [
            {
              backgroundColor: [
                '#FFA971',
                '#F6DB6C',
                '#98CBED',
                '#C9A0DA',
                '#5DABDC',
                '#88E5B0',
              ],
              data: [65.38, 34.62],
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
            align: 'start',
          },
        },
      },
      instanceQuestions: [],
    },
  ],
  totalSubmissions: 26,
  filters: [
    {
      order: '',
      filter: {
        type: 'dropdown',
        title: '',
        keyToSend: 'submissionId',
        data: [
          {
            _id: '6059cb813753e011940bee2b',
            name: 'Observation 1',
          },
          {
            _id: '606fd48ad3aba804336dcd26',
            name: 'Observation 10',
          },
          {
            _id: '60702e9773372a08bff7cefa',
            name: 'Observation 11',
          },
          {
            _id: '60705a9b0a49e008a699ab87',
            name: 'Observation 12',
          },
          {
            _id: '607eaff79a989a06e9944c1a',
            name: 'Observation 13',
          },
          {
            _id: '607eb2059a989a06e9944c1c',
            name: 'Observation 15',
          },
          {
            _id: '609c17e0ad58ae7dad6ef808',
            name: 'Observation 17',
          },
          {
            _id: '6064c4bbb6bd37361305ddd9',
            name: 'Observation 2',
          },
          {
            _id: '60b5e6846cca3b564233debe',
            name: 'Observation 25',
          },
          {
            _id: '60b864536cca3b564233dec1',
            name: 'Observation 26',
          },
          {
            _id: '60be30e74d5bea24ac0a5c79',
            name: 'Observation 27',
          },
          {
            _id: '60c76603b66fbd53b9c52d9b',
            name: 'Observation 28',
          },
          {
            _id: '60c85f0a07c84a53aa3ae9c9',
            name: 'Observation 29',
          },
          {
            _id: '606be3d48e08415d1f8d2a86',
            name: 'Observation 3',
          },
          {
            _id: '60c86453b66fbd53b9c52de1',
            name: 'Observation 30',
          },
          {
            _id: '60c8648cb66fbd53b9c52de2',
            name: 'Observation 31',
          },
          {
            _id: '60c87cb507c84a53aa3ae9cb',
            name: 'Observation 32',
          },
          {
            _id: '60c8873807c84a53aa3ae9de',
            name: 'Observation 35',
          },
          {
            _id: '60c8898e07c84a53aa3ae9df',
            name: 'Observation 36',
          },
          {
            _id: '60c994a6ecea0772d81d7e26',
            name: 'Observation 38-draft',
          },
          {
            _id: '606bf45f17beaa5d0ad70bd4',
            name: 'Observation 4',
          },
          {
            _id: '606bf9a32396373802fb57f2',
            name: 'Observation 5',
          },
          {
            _id: '606c0ad32396373802fb57f3',
            name: 'Observation 6',
          },
          {
            _id: '606c0ba72396373802fb57f4',
            name: 'Observation 7',
          },
          {
            _id: '606c0d6a0773ad37f073133c',
            name: 'Observation 8',
          },
          {
            _id: '606c0fae0773ad37f073133e',
            name: 'Observation 9',
          },
        ],
      },
    },
    {
      order: '',
      filter: {
        type: 'segment',
        title: '',
        keyToSend: 'criteriaWise',
        data: ['questionWise', 'criteriaWise'],
      },
    },
    {
      order: '',
      filter: {
        type: 'modal',
        title: '',
        keyToSend: 'questionId',
        data: [
          {
            name: 'Are you currently living in the vicinity of the school?',
            _id: 'Q3_1616157220157-1616161753202',
          },
          {
            name: 'Are you planning to come back?',
            _id: 'Q4_1616157220157-1616161753203',
          },
          {
            name: 'Does the child have a quiet place to study?',
            _id: 'Q6_1616157220157-1616161753206',
          },
          {
            name: 'On basis of the responses received above,  do you think this student is a potential drop out?',
            _id: 'Q9_1616157220157-1616161753210',
          },
          {
            name: 'Were you able to enrol your child in courses on SUNBIRD?',
            _id: 'Q7_1616157220157-1616161753207',
          },
          {
            name: 'What are the challenges that you are facing in enrolment?',
            _id: 'Q8_1616157220157-1616161753209',
          },
          {
            name: 'What type of device is available at home?',
            _id: 'Q5_1616157220157-1616161753205',
          },
          {
            name: 'Enter the date of observation',
            _id: 'Q1_1616157220157-1616161753196',
          },
          {
            name: 'How many courses have you taken?',
            _id: 'Q13_1616157220157-1616161753214',
          },
          {
            name: 'How would you rate the course taken?',
            _id: 'Q12_1616157220157-1616161753212',
          },
          {
            name: 'Which class does your child study in?',
            _id: 'Q2_1616157220157-1616161753199',
          },
          {
            name: 'Which courses did you go through?',
            _id: 'Q14_1616157220157-1616161753215',
          },
        ],
      },
    },
  ],
  responseCode: 'OK',
};

export const reportSectionData = [
  {
    questionArray: [
      {
        order: 'Q10_1616157220157-1616161753198',
        question: 'Add the student interview responses',
        responseType: 'matrix',
        answers: [],
        chart: {},
        instanceQuestions: [
          {
            order: 'Q12_1616157220157-1616161753212',
            question: 'How would you rate the course taken?',
            responseType: 'slider',
            answers: ['3'],
            chart: {},
            instanceQuestions: [],
          },
          {
            order: 'Q13_1616157220157-1616161753214',
            question: 'How many courses have you taken?',
            responseType: 'number',
            answers: ['2'],
            chart: {},
            instanceQuestions: [],
          },
          {
            order: 'Q14_1616157220157-1616161753215',
            question: 'Which courses did you go through?',
            responseType: 'text',
            answers: ['test'],
            chart: {},
            instanceQuestions: [],
            evidences: [
              {
                url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/1617216994418.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=Sa5htAH2jVN0gU2FtfX%2FK7bkHW2S16qqLsPWcmyOddg%3D',
                extension: 'jpg',
              },
              {
                url: 'https://samikshaprod.blob.core.windows.net/samiksha/606c0ba72396373802fb57f4/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG_20201028_1711075500160580162872754.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=mi7FFoBQAIqLUyrpy4FS39s8iAqAcPRWoFVRQ2%2Be0Fk%3D',
                extension: 'jpg',
              },
              {
                url: 'https://samikshaprod.blob.core.windows.net/samiksha/606c0ba72396373802fb57f4/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_images8404688319259463054.jpeg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=E0M64OC6qJRYtiEFCIbYqb4TU6btcEtEgIA%2BMxW11VM%3D',
                extension: 'jpeg',
              },
            ],
            evidence_count: 10,
          },
        ],
      },
      {
        order: 'Q1_1616157220157-1616161753196',
        question: 'Enter the date of observation',
        responseType: 'date',
        answers: ['1-4-2021 0:21:43 AM'],
        chart: {},
        instanceQuestions: [],
      },
      {
        order: 'Q2_1616157220157-1616161753199',
        question: 'Which class does your child study in?',
        responseType: 'number',
        answers: ['2'],
        chart: {},
        instanceQuestions: [],
      },
      {
        order: 'Q3_1616157220157-1616161753202',
        question: 'Are you currently living in the vicinity of the school?',
        responseType: 'radio',
        answers: [
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'Yes',
          'R',
          'R',
          'No',
          'R',
          'Yes',
          'No',
          'No',
          'R1',
          'R1',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
        ],
        chart: {
          type: 'pie',
          data: {
            labels: ['No', 'Yes', 'R', 'R1'],
            datasets: [
              {
                backgroundColor: [
                  '#FFA971',
                  '#F6DB6C',
                  '#98CBED',
                  '#C9A0DA',
                  '#5DABDC',
                  '#88E5B0',
                ],
                data: [73.08, 26.92],
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              position: 'bottom',
              align: 'start',
            },
          },
        },
        instanceQuestions: [],
      },
      {
        order: 'Q4_1616157220157-1616161753203',
        question: 'Are you planning to come back?',
        responseType: 'radio',
        answers: [
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'Yes',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
        ],
        chart: {
          type: 'pie',
          data: {
            labels: ['No', 'Yes'],
            datasets: [
              {
                backgroundColor: [
                  '#FFA971',
                  '#F6DB6C',
                  '#98CBED',
                  '#C9A0DA',
                  '#5DABDC',
                  '#88E5B0',
                ],
                data: [69.23, 3.85],
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              position: 'bottom',
              align: 'start',
            },
          },
        },
        instanceQuestions: [],
      },
      {
        order: 'Q5_1616157220157-1616161753205',
        question: 'What type of device is available at home?',
        responseType: 'multiselect',
        answers: [
          ['Smart phone with internet/data pack'],
          ['Smart phone without internet/data pack'],
          [
            'Smart phone with internet/data pack',
            'Smart phone without internet/data pack',
          ],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Smart phone without internet/data pack'],
          ['Smart phone with internet/data pack'],
          ['Simple mobile phone without internet/data pack'],
          ['Radio'],
          ['Smart phone with internet/data pack'],
          ['Simple mobile phone without internet/data pack'],
          ['Simple mobile phone without internet/data pack'],
          [
            'Simple mobile phone without internet/data pack',
            'Smart phone with internet/data pack',
            'Smart phone without internet/data pack',
          ],
          ['Simple mobile phone without internet/data pack'],
          ['Smart phone with internet/data pack'],
          [
            'Smart phone with internet/data pack',
            'Smart phone without internet/data pack',
          ],
          ['Simple mobile phone without internet/data pack'],
        ],
        chart: {
          type: 'horizontalBar',
          data: {
            labels: [
              'Smart phone with internet/data pack',
              'Smart phone without internet/data pack',
              'Simple mobile phone without internet/data pack',
              'Radio',
            ],
            datasets: [
              {
                data: [69.23, 19.23, 23.08, 3.85],
                backgroundColor: '#de8657',
              },
            ],
          },
          options: {
            legend: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    min: 0,
                    max: 100,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Responses in percentage',
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Responses',
                  },
                },
              ],
            },
          },
        },
        instanceQuestions: [],
        evidences: [
          {
            url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00042204198365642023404.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=pgo4lwG6elAarY5SSJcrBMrLg2qeEnGplKk2WFPNeQk%3D',
            extension: 'jpg',
          },
          {
            url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210331-WA00046839844612612680327.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=4mleNpgAdWWGrZ7v1QXysOFXcmt5q%2BtkwCkPPXznUbk%3D',
            extension: 'jpg',
          },
          {
            url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00151579082204213199966.jpg?sv=2020-06-12&st=2021-07-04T04%3A37%3A30Z&se=2022-07-04T04%3A47%3A30Z&sr=b&sp=rw&sig=XQ5TQFVLTvO4pQ2Mys4LXWyMWYjBIzNZJa4VaJsFduU%3D',
            extension: 'jpg',
          },
        ],
        evidence_count: 21,
      },
      {
        order: 'Q6_1616157220157-1616161753206',
        question: 'Does the child have a quiet place to study?',
        responseType: 'radio',
        answers: [
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
          'Yes',
          'R',
          'R',
          'No',
          'R',
          'Yes',
          'No',
          'No',
          'R2',
          'R2',
          'No',
          'No',
          'No',
          'Yes',
          'No',
          'No',
        ],
        chart: {
          type: 'pie',
          data: {
            labels: ['No', 'Yes', 'R', 'R2'],
            datasets: [
              {
                backgroundColor: [
                  '#FFA971',
                  '#F6DB6C',
                  '#98CBED',
                  '#C9A0DA',
                  '#5DABDC',
                  '#88E5B0',
                ],
                data: [80.77, 19.23],
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              position: 'bottom',
              align: 'start',
            },
          },
        },
        instanceQuestions: [],
      },
      {
        order: 'Q7_1616157220157-1616161753207',
        question: 'Were you able to enrol your child in courses on SUNBIRD?',
        responseType: 'radio',
        answers: [
          'No',
          'No',
          'No',
          'No',
          'No',
          'Yes',
          'No',
          'No',
          'Yes',
          'No',
          'Yes',
          'R',
          'R',
          'No',
          'R',
          'Yes',
          'No',
          'Yes',
          'R1',
          'R1',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
        ],
        chart: {
          type: 'pie',
          data: {
            labels: ['No', 'Yes', 'R', 'R1'],
            datasets: [
              {
                backgroundColor: [
                  '#FFA971',
                  '#F6DB6C',
                  '#98CBED',
                  '#C9A0DA',
                  '#5DABDC',
                  '#88E5B0',
                ],
                data: [61.54, 38.46],
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              position: 'bottom',
              align: 'start',
            },
          },
        },
        instanceQuestions: [],
      },
      {
        order: 'Q8_1616157220157-1616161753209',
        question: 'What are the challenges that you are facing in enrolment?',
        responseType: 'multiselect',
        answers: [
          ['Don’t find the courses useful'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not aware of the enrolment process in the classroom'],
          ['Not aware of the enrolment process in the classroom'],
          ['Not aware of the enrolment process in the classroom'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not able to use the app'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not aware of the enrolment process in the classroom'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not aware of the enrolment process in the classroom'],
          ['Not aware of classrooms on SUNBIRD'],
          ['Not able to use the app', 'Not aware of classrooms on SUNBIRD'],
          ['Not able to use the app'],
        ],
        chart: {
          type: 'horizontalBar',
          data: {
            labels: [
              'Don’t find the courses useful',
              'Not aware of the enrolment process in the classroom',
              'Not aware of classrooms on SUNBIRD',
              'Not able to use the app',
            ],
            datasets: [
              {
                data: [3.85, 19.23, 30.77, 11.54],
                backgroundColor: '#de8657',
              },
            ],
          },
          options: {
            legend: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    min: 0,
                    max: 100,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Responses in percentage',
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Responses',
                  },
                },
              ],
            },
          },
        },
        instanceQuestions: [],
      },
      {
        order: 'Q9_1616157220157-1616161753210',
        question:
          'On basis of the responses received above,  do you think this student is a potential drop out?',
        responseType: 'radio',
        answers: [
          'No',
          'No',
          'No',
          'No',
          'No',
          'Yes',
          'No',
          'No',
          'Yes',
          'Yes',
          'Yes',
          'R',
          'R',
          'No',
          'R',
          'Yes',
          'No',
          'Yes',
          'R2',
          'R1',
          'No',
          'No',
          'No',
          'No',
          'No',
          'No',
        ],
        chart: {
          type: 'pie',
          data: {
            labels: ['No', 'Yes', 'R', 'R2', 'R1'],
            datasets: [
              {
                backgroundColor: [
                  '#FFA971',
                  '#F6DB6C',
                  '#98CBED',
                  '#C9A0DA',
                  '#5DABDC',
                  '#88E5B0',
                ],
                data: [65.38, 34.62],
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              position: 'bottom',
              align: 'start',
            },
          },
        },
        instanceQuestions: [],
      },
    ],
  },
];

export const filterData = [
  {
    order: '',
    filter: {
      type: 'dropdown',
      title: '',
      keyToSend: 'submissionId',
      data: [
        {
          _id: '6059cb813753e011940bee2b',
          name: 'Observation 1',
        },
        {
          _id: '606fd48ad3aba804336dcd26',
          name: 'Observation 10',
        },
        {
          _id: '60702e9773372a08bff7cefa',
          name: 'Observation 11',
        },
        {
          _id: '60705a9b0a49e008a699ab87',
          name: 'Observation 12',
        },
        {
          _id: '607eaff79a989a06e9944c1a',
          name: 'Observation 13',
        },
        {
          _id: '607eb2059a989a06e9944c1c',
          name: 'Observation 15',
        },
        {
          _id: '609c17e0ad58ae7dad6ef808',
          name: 'Observation 17',
        },
        {
          _id: '6064c4bbb6bd37361305ddd9',
          name: 'Observation 2',
        },
        {
          _id: '60b5e6846cca3b564233debe',
          name: 'Observation 25',
        },
        {
          _id: '60b864536cca3b564233dec1',
          name: 'Observation 26',
        },
        {
          _id: '60be30e74d5bea24ac0a5c79',
          name: 'Observation 27',
        },
        {
          _id: '60c76603b66fbd53b9c52d9b',
          name: 'Observation 28',
        },
        {
          _id: '60c85f0a07c84a53aa3ae9c9',
          name: 'Observation 29',
        },
        {
          _id: '606be3d48e08415d1f8d2a86',
          name: 'Observation 3',
        },
        {
          _id: '60c86453b66fbd53b9c52de1',
          name: 'Observation 30',
        },
        {
          _id: '60c8648cb66fbd53b9c52de2',
          name: 'Observation 31',
        },
        {
          _id: '60c87cb507c84a53aa3ae9cb',
          name: 'Observation 32',
        },
        {
          _id: '60c8873807c84a53aa3ae9de',
          name: 'Observation 35',
        },
        {
          _id: '60c8898e07c84a53aa3ae9df',
          name: 'Observation 36',
        },
        {
          _id: '60c994a6ecea0772d81d7e26',
          name: 'Observation 38-draft',
        },
        {
          _id: '606bf45f17beaa5d0ad70bd4',
          name: 'Observation 4',
        },
        {
          _id: '606bf9a32396373802fb57f2',
          name: 'Observation 5',
        },
        {
          _id: '606c0ad32396373802fb57f3',
          name: 'Observation 6',
        },
        {
          _id: '606c0ba72396373802fb57f4',
          name: 'Observation 7',
        },
        {
          _id: '606c0d6a0773ad37f073133c',
          name: 'Observation 8',
        },
        {
          _id: '606c0fae0773ad37f073133e',
          name: 'Observation 9',
        },
      ],
    },
  },
  {
    order: '',
    filter: {
      type: 'segment',
      title: '',
      keyToSend: 'criteriaWise',
      data: ['questionWise', 'criteriaWise'],
    },
  },
  {
    order: '',
    filter: {
      type: 'modal',
      title: '',
      keyToSend: 'questionId',
      data: [
        {
          name: 'Are you currently living in the vicinity of the school?',
          _id: 'Q3_1616157220157-1616161753202',
        },
        {
          name: 'Are you planning to come back?',
          _id: 'Q4_1616157220157-1616161753203',
        },
        {
          name: 'Does the child have a quiet place to study?',
          _id: 'Q6_1616157220157-1616161753206',
        },
        {
          name: 'On basis of the responses received above,  do you think this student is a potential drop out?',
          _id: 'Q9_1616157220157-1616161753210',
        },
        {
          name: 'Were you able to enrol your child in courses on SUNBIRD?',
          _id: 'Q7_1616157220157-1616161753207',
        },
        {
          name: 'What are the challenges that you are facing in enrolment?',
          _id: 'Q8_1616157220157-1616161753209',
        },
        {
          name: 'What type of device is available at home?',
          _id: 'Q5_1616157220157-1616161753205',
        },
        {
          name: 'Enter the date of observation',
          _id: 'Q1_1616157220157-1616161753196',
        },
        {
          name: 'How many courses have you taken?',
          _id: 'Q13_1616157220157-1616161753214',
        },
        {
          name: 'How would you rate the course taken?',
          _id: 'Q12_1616157220157-1616161753212',
        },
        {
          name: 'Which class does your child study in?',
          _id: 'Q2_1616157220157-1616161753199',
        },
        {
          name: 'Which courses did you go through?',
          _id: 'Q14_1616157220157-1616161753215',
        },
      ],
    },
  },
];

export const CriteriaData = {
  result: true,
  entityType: 'district',
  entityId: '5fd098e2e049735a86b748b8',
  entityName: 'CHITTOOR',
  solutionName: 'Obs Form for All Question type',
  observationId: '60587848129c8857da854d9e',
  districtName: 'CHITTOOR',
  programName: '3.8.0 testing program - 2',
  reportSections: [
    {
      criteriaId: '6054abd9823d601f0af5c39f',
      criteriaName: 'Criteria 2',
      questionArray: [
        {
          order: 'Q12_1616157220157-1616161753212',
          question: 'How would you rate the course taken?',
          responseType: 'slider',
          answers: ['3'],
          chart: {},
          instanceQuestions: [],
          criteriaName: 'Criteria 2',
          criteriaId: '6054abd9823d601f0af5c39f',
        },
        {
          order: 'Q13_1616157220157-1616161753214',
          question: 'How many courses have you taken?',
          responseType: 'number',
          answers: ['2'],
          chart: {},
          instanceQuestions: [],
          criteriaName: 'Criteria 2',
          criteriaId: '6054abd9823d601f0af5c39f',
        },
        {
          order: 'Q14_1616157220157-1616161753215',
          question: 'Which courses did you go through?',
          responseType: 'text',
          answers: ['test'],
          chart: {},
          instanceQuestions: [],
          criteriaName: 'Criteria 2',
          criteriaId: '6054abd9823d601f0af5c39f',
          evidences: [
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/1617216994418.jpg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=7GgQ9eeL%2FUE1VkgwEKmjdxzy9YkZCq4tVYLx3lr9vRQ%3D',
              extension: 'jpg',
            },
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/606c0ba72396373802fb57f4/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG_20201028_1711075500160580162872754.jpg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=GUSk8GtIEuumXfMuxF9LxOdAINyVDkyk2z96%2FBftx3E%3D',
              extension: 'jpg',
            },
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/606c0ba72396373802fb57f4/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_images8404688319259463054.jpeg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=EwC8i11Dq6V%2BME%2F5jFbfsQL9EAlXTEXRgA%2BkB05FjYc%3D',
              extension: 'jpeg',
            },
          ],
          evidence_count: 10,
        },
      ],
    },
    {
      criteriaId: '6054abd9823d601f0af5c39e',
      criteriaName: 'Criteria 1',
      questionArray: [
        {
          order: 'Q1_1616157220157-1616161753196',
          question: 'Enter the date of observation',
          responseType: 'date',
          answers: ['1-4-2021 0:21:43 AM'],
          chart: {},
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q2_1616157220157-1616161753199',
          question: 'Which class does your child study in?',
          responseType: 'number',
          answers: ['2'],
          chart: {},
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q3_1616157220157-1616161753202',
          question: 'Are you currently living in the vicinity of the school?',
          responseType: 'radio',
          answers: [
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'Yes',
            'R',
            'R',
            'No',
            'R',
            'Yes',
            'No',
            'No',
            'R1',
            'R1',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
          ],
          chart: {
            type: 'pie',
            data: {
              labels: ['No', 'Yes', 'R', 'R1'],
              datasets: [
                {
                  backgroundColor: [
                    '#FFA971',
                    '#F6DB6C',
                    '#98CBED',
                    '#C9A0DA',
                    '#5DABDC',
                    '#88E5B0',
                  ],
                  data: [73.08, 26.92],
                },
              ],
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
                align: 'start',
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q4_1616157220157-1616161753203',
          question: 'Are you planning to come back?',
          responseType: 'radio',
          answers: [
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'Yes',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
          ],
          chart: {
            type: 'pie',
            data: {
              labels: ['No', 'Yes'],
              datasets: [
                {
                  backgroundColor: [
                    '#FFA971',
                    '#F6DB6C',
                    '#98CBED',
                    '#C9A0DA',
                    '#5DABDC',
                    '#88E5B0',
                  ],
                  data: [69.23, 3.85],
                },
              ],
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
                align: 'start',
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q5_1616157220157-1616161753205',
          question: 'What type of device is available at home?',
          responseType: 'multiselect',
          answers: [
            ['Smart phone with internet/data pack'],
            ['Smart phone without internet/data pack'],
            [
              'Smart phone with internet/data pack',
              'Smart phone without internet/data pack',
            ],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Smart phone without internet/data pack'],
            ['Smart phone with internet/data pack'],
            ['Simple mobile phone without internet/data pack'],
            ['Radio'],
            ['Smart phone with internet/data pack'],
            ['Simple mobile phone without internet/data pack'],
            ['Simple mobile phone without internet/data pack'],
            [
              'Simple mobile phone without internet/data pack',
              'Smart phone with internet/data pack',
              'Smart phone without internet/data pack',
            ],
            ['Simple mobile phone without internet/data pack'],
            ['Smart phone with internet/data pack'],
            [
              'Smart phone with internet/data pack',
              'Smart phone without internet/data pack',
            ],
            ['Simple mobile phone without internet/data pack'],
          ],
          chart: {
            type: 'horizontalBar',
            data: {
              labels: [
                'Smart phone with internet/data pack',
                'Smart phone without internet/data pack',
                'Simple mobile phone without internet/data pack',
                'Radio',
              ],
              datasets: [
                {
                  data: [69.23, 19.23, 23.08, 3.85],
                  backgroundColor: '#de8657',
                },
              ],
            },
            options: {
              legend: false,
              scales: {
                xAxes: [
                  {
                    ticks: {
                      min: 0,
                      max: 100,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Responses in percentage',
                    },
                  },
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: 'Responses',
                    },
                  },
                ],
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
          evidences: [
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00042204198365642023404.jpg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=j3ncE3aazopRGhk4IbKzECmGvBxZ7%2BLwVx%2FfARjcquc%3D',
              extension: 'jpg',
            },
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210331-WA00046839844612612680327.jpg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=i%2FAUP7BKHq%2FcuwI%2BidqGKkKN8aFoq6qhnVUIF7ZtvRI%3D',
              extension: 'jpg',
            },
            {
              url: 'https://samikshaprod.blob.core.windows.net/samiksha/6064c4bbb6bd37361305ddd9/0fecc38b-956c-4909-a3e7-be538ef7acd4/tmp_IMG-20210329-WA00151579082204213199966.jpg?sv=2020-06-12&st=2021-07-04T05%3A55%3A29Z&se=2022-07-04T06%3A05%3A29Z&sr=b&sp=rw&sig=MEvUjedko1cFzY7219y%2F8aVFa52Y3h1HZz9hF%2B7AHco%3D',
              extension: 'jpg',
            },
          ],
          evidence_count: 21,
        },
        {
          order: 'Q6_1616157220157-1616161753206',
          question: 'Does the child have a quiet place to study?',
          responseType: 'radio',
          answers: [
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
            'Yes',
            'R',
            'R',
            'No',
            'R',
            'Yes',
            'No',
            'No',
            'R2',
            'R2',
            'No',
            'No',
            'No',
            'Yes',
            'No',
            'No',
          ],
          chart: {
            type: 'pie',
            data: {
              labels: ['No', 'Yes', 'R', 'R2'],
              datasets: [
                {
                  backgroundColor: [
                    '#FFA971',
                    '#F6DB6C',
                    '#98CBED',
                    '#C9A0DA',
                    '#5DABDC',
                    '#88E5B0',
                  ],
                  data: [80.77, 19.23],
                },
              ],
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
                align: 'start',
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q7_1616157220157-1616161753207',
          question: 'Were you able to enrol your child in courses on SUNBIRD?',
          responseType: 'radio',
          answers: [
            'No',
            'No',
            'No',
            'No',
            'No',
            'Yes',
            'No',
            'No',
            'Yes',
            'No',
            'Yes',
            'R',
            'R',
            'No',
            'R',
            'Yes',
            'No',
            'Yes',
            'R1',
            'R1',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
          ],
          chart: {
            type: 'pie',
            data: {
              labels: ['No', 'Yes', 'R', 'R1'],
              datasets: [
                {
                  backgroundColor: [
                    '#FFA971',
                    '#F6DB6C',
                    '#98CBED',
                    '#C9A0DA',
                    '#5DABDC',
                    '#88E5B0',
                  ],
                  data: [61.54, 38.46],
                },
              ],
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
                align: 'start',
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q8_1616157220157-1616161753209',
          question: 'What are the challenges that you are facing in enrolment?',
          responseType: 'multiselect',
          answers: [
            ['Don’t find the courses useful'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not aware of the enrolment process in the classroom'],
            ['Not aware of the enrolment process in the classroom'],
            ['Not aware of the enrolment process in the classroom'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not able to use the app'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not aware of the enrolment process in the classroom'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not aware of the enrolment process in the classroom'],
            ['Not aware of classrooms on SUNBIRD'],
            ['Not able to use the app', 'Not aware of classrooms on SUNBIRD'],
            ['Not able to use the app'],
          ],
          chart: {
            type: 'horizontalBar',
            data: {
              labels: [
                'Don’t find the courses useful',
                'Not aware of the enrolment process in the classroom',
                'Not aware of classrooms on SUNBIRD',
                'Not able to use the app',
              ],
              datasets: [
                {
                  data: [3.85, 19.23, 30.77, 11.54],
                  backgroundColor: '#de8657',
                },
              ],
            },
            options: {
              legend: false,
              scales: {
                xAxes: [
                  {
                    ticks: {
                      min: 0,
                      max: 100,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Responses in percentage',
                    },
                  },
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: 'Responses',
                    },
                  },
                ],
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
        {
          order: 'Q9_1616157220157-1616161753210',
          question:
            'On basis of the responses received above,  do you think this student is a potential drop out?',
          responseType: 'radio',
          answers: [
            'No',
            'No',
            'No',
            'No',
            'No',
            'Yes',
            'No',
            'No',
            'Yes',
            'Yes',
            'Yes',
            'R',
            'R',
            'No',
            'R',
            'Yes',
            'No',
            'Yes',
            'R2',
            'R1',
            'No',
            'No',
            'No',
            'No',
            'No',
            'No',
          ],
          chart: {
            type: 'pie',
            data: {
              labels: ['No', 'Yes', 'R', 'R2', 'R1'],
              datasets: [
                {
                  backgroundColor: [
                    '#FFA971',
                    '#F6DB6C',
                    '#98CBED',
                    '#C9A0DA',
                    '#5DABDC',
                    '#88E5B0',
                  ],
                  data: [65.38, 34.62],
                },
              ],
            },
            options: {
              responsive: true,
              legend: {
                position: 'bottom',
                align: 'start',
              },
            },
          },
          instanceQuestions: [],
          criteriaName: 'Criteria 1',
          criteriaId: '6054abd9823d601f0af5c39e',
        },
      ],
    },
  ],
  totalSubmissions: 26,
  filters: [
    {
      order: '',
      filter: {
        type: 'dropdown',
        title: '',
        keyToSend: 'submissionId',
        data: [
          {
            _id: '6059cb813753e011940bee2b',
            name: 'Observation 1',
          },
          {
            _id: '606fd48ad3aba804336dcd26',
            name: 'Observation 10',
          },
          {
            _id: '60702e9773372a08bff7cefa',
            name: 'Observation 11',
          },
          {
            _id: '60705a9b0a49e008a699ab87',
            name: 'Observation 12',
          },
          {
            _id: '607eaff79a989a06e9944c1a',
            name: 'Observation 13',
          },
          {
            _id: '607eb2059a989a06e9944c1c',
            name: 'Observation 15',
          },
          {
            _id: '609c17e0ad58ae7dad6ef808',
            name: 'Observation 17',
          },
          {
            _id: '6064c4bbb6bd37361305ddd9',
            name: 'Observation 2',
          },
          {
            _id: '60b5e6846cca3b564233debe',
            name: 'Observation 25',
          },
          {
            _id: '60b864536cca3b564233dec1',
            name: 'Observation 26',
          },
          {
            _id: '60be30e74d5bea24ac0a5c79',
            name: 'Observation 27',
          },
          {
            _id: '60c76603b66fbd53b9c52d9b',
            name: 'Observation 28',
          },
          {
            _id: '60c85f0a07c84a53aa3ae9c9',
            name: 'Observation 29',
          },
          {
            _id: '606be3d48e08415d1f8d2a86',
            name: 'Observation 3',
          },
          {
            _id: '60c86453b66fbd53b9c52de1',
            name: 'Observation 30',
          },
          {
            _id: '60c8648cb66fbd53b9c52de2',
            name: 'Observation 31',
          },
          {
            _id: '60c87cb507c84a53aa3ae9cb',
            name: 'Observation 32',
          },
          {
            _id: '60c8873807c84a53aa3ae9de',
            name: 'Observation 35',
          },
          {
            _id: '60c8898e07c84a53aa3ae9df',
            name: 'Observation 36',
          },
          {
            _id: '60c994a6ecea0772d81d7e26',
            name: 'Observation 38-draft',
          },
          {
            _id: '606bf45f17beaa5d0ad70bd4',
            name: 'Observation 4',
          },
          {
            _id: '606bf9a32396373802fb57f2',
            name: 'Observation 5',
          },
          {
            _id: '606c0ad32396373802fb57f3',
            name: 'Observation 6',
          },
          {
            _id: '606c0ba72396373802fb57f4',
            name: 'Observation 7',
          },
          {
            _id: '606c0d6a0773ad37f073133c',
            name: 'Observation 8',
          },
          {
            _id: '606c0fae0773ad37f073133e',
            name: 'Observation 9',
          },
        ],
      },
    },
    {
      order: '',
      filter: {
        type: 'segment',
        title: '',
        keyToSend: 'criteriaWise',
        data: ['questionWise', 'criteriaWise'],
      },
    },
    {
      order: '',
      filter: {
        type: 'modal',
        title: '',
        keyToSend: 'criteria',
        data: [
          {
            _id: '6054abd9823d601f0af5c39f',
            name: 'Criteria 2',
          },
          {
            _id: '6054abd9823d601f0af5c39e',
            name: 'Criteria 1',
          },
        ],
      },
    },
  ],
  responseCode: 'OK',
};

export const downloadData = {
  status: 'success',
  message: 'Pdf report generated successfully',
  pdfUrl:
    'https://samikshaprod.blob.core.windows.net/samiksha/reports/6d44dc02-48af-47b3-b6da-7257d8885b93.pdf?sv=2020-06-12&st=2021-07-04T07%3A16%3A21Z&se=2022-07-04T07%3A26%3A21Z&sr=b&sp=rw&sig=3VIbKEk9Ms5YHctdbtiffR3Jzegjq%2FEfl8d%2FOQR%2F1xw%3D',
  responseCode: 'OK',
};


