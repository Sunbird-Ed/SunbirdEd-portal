export const TableData = {
    responseData :  [
      {
        state: 'Andhra Pradesh',
        district: 'Chittoor',
        noofEnrollments: 20,
        noofCompletions: 10
      },
      {
        state: 'Andhra Pradesh',
        district: 'Vishakapatanam',
        noofEnrollments: 50,
        noofCompletions: 25
      },
      {
        state: 'Andhra Pradesh',
        district: 'Guntur',
        noofEnrollments: 70,
        noofCompletions: 30
      },
      {
        state: 'Andhra Pradesh',
        district: 'Kadapa',
        noofEnrollments: 65,
        noofCompletions: 10
      },
      {
        state: 'Andhra Pradesh',
        district: 'Nellore',
        noofEnrollments: 100,
        noofCompletions: 25
      },
      {
        state: 'Telengana',
        district: 'Hydrabad',
        noofEnrollments: 45,
        noofCompletions: 15
      }
      ],
      sortData_ASC : [
        {
          state: 'Andhra Pradesh',
          district: 'Chittoor',
          noofEnrollments: 20,
          noofCompletions: 10
        },
        {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          noofEnrollments: 70,
          noofCompletions: 30
        },
        {
          state: 'Telengana',
          district: 'Hydrabad',
          noofEnrollments: 45,
          noofCompletions: 15
        },
        {
          state: 'Andhra Pradesh',
          district: 'Kadapa',
          noofEnrollments: 65,
          noofCompletions: 10
        },
        {
          state: 'Andhra Pradesh',
          district: 'Nellore',
          noofEnrollments: 100,
          noofCompletions: 25
        },
        {
          state: 'Andhra Pradesh',
          district: 'Vishakapatanam',
          noofEnrollments: 50,
          noofCompletions: 25
        }
      ],
      sortData_DESC : [
        {
          state: 'Andhra Pradesh',
          district: 'Vishakapatanam',
          noofEnrollments: 50,
          noofCompletions: 25
        },
        {
          state: 'Andhra Pradesh',
          district: 'Nellore',
          noofEnrollments: 100,
          noofCompletions: 25
        },
        {
          state: 'Andhra Pradesh',
          district: 'Kadapa',
          noofEnrollments: 65,
          noofCompletions: 10
        },
        {
          state: 'Telengana',
          district: 'Hydrabad',
          noofEnrollments: 45,
          noofCompletions: 15
        },
        {
          state: 'Andhra Pradesh',
          district: 'Guntur',
          noofEnrollments: 70,
          noofCompletions: 30
        },
        {
          state: 'Andhra Pradesh',
          district: 'Chittoor',
          noofEnrollments: 20,
          noofCompletions: 10
        }
      ],
    columns : [
      { name: 'State', isSortable: true, prop: 'state' },
      { name: 'District', isSortable: true,  prop: 'district' },
      { name: 'No. of Enrollment', isSortable: true,  prop: 'noofEnrollments'},
      { name: 'No. of Completions', isSortable: true,  prop: 'noofCompletions' }],
    searchFields : ['0','1','state', 'district'],
    telemetryDataForDownload: {
      context: {
        env: 'reports',
        cdata: [{id: 'do_112470675618004992181', type: 'Course'}, {id: '01248661388792627227', type: 'Batch'}]
      },
      edata: {
        id: 'download-summary-report',
        type: 'click',
        pageid: 'summary-report'
      }
    }
};
