export let mockData = {
  rowsData: [
    {
      'District': 'SRIKAKULAM',
      'channel_slug': 'sunbirdpreprodcustodian',
      'Program Name': 'Test Program',
      'Observation Form Name': 'AP-TEST-PROGRAM-3.6.5-OBS-ALL-QUESTION-TYPES-1-HM',
      'No of unique users': '1.0',
      'Date': '2020-12-01'
    },
    {
      'District': 'CHITTOOR',
      'channel_slug': 'sunbirdpreprodcustodian',
      'Program Name': 'Test Program',
      'Observation Form Name': 'AP-TEST-PROGRAM-3.6.5-OBS-1-DEO',
      'No of unique users': '1.0',
      'Date': '2020-12-01'
    },
    {
      'District': 'ANANTAPUR',
      'channel_slug': 'sunbirdpreprodcustodian',
      'Program Name': 'Test Program',
      'Observation Form Name': 'AP-TEST-PROGRAM-3.6.5-OBS-1-DEO',
      'No of unique users': '1.0',
      'Date': '2020-12-01'
    },
    {
      'District': 'GUNTUR',
      'channel_slug': 'sunbirdpreprodcustodian',
      'Program Name': 'Test Program',
      'Observation Form Name': 'AP-TEST-PROGRAM-3.6.5-OBS-IMP-PROJECT-2-DEO',
      'No of unique users': '1.0',
      'Date': '2020-12-01'
    }
  ],
  config: {
    columnConfig: [
      {
        'data': 'Program Name',
        'title': 'Program Name'
      },
      {
        'data': 'District',
        'title': 'District Name'
      },
      {
        'data': 'Date',
        'title': 'Date'
      }
    ],
    filters: [
      {
        'label': 'Program Name',
        'reference': 'Program Name',
        'searchable': true,
        'controlType': 'multi-select',
        'displayName': 'Program Name',
        'placeholder': 'Program Name'
      },
      {
        'label': 'District',
        'reference': 'District',
        'searchable': true,
        'controlType': 'multi-select',
        'displayName': 'District',
        'placeholder': 'District'
      }
    ],

    'lengthMenu': [
      30,
      40
    ],
    'pageLength': 30,
    'order': [
      1,
      'desc'
    ],
    'bFilter': true,
    'paging': true
  },
  filter: {
    allFilters: [
      {
        reference: "district_name",
        controlType: "multi-select",
        displayName: "District",
        options: ["anantapur", "chittoor", "guntur", "krishna", "unknown"],
      },
      {
        reference: "organisation_name",
        controlType: "multi-select",
        displayName: "Organisation",
        options: ["kirubaorg2.1", "staging custodian organization", "unknown"],
      },
    ],
    filters: {
      district_name: ["anantapur"],
    },
    chartData: [
      {
        id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
        data: [
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "2.0",
            Completed: "3.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "26.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "7.0",
            Completed: "19.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "6.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
        ],
      },
    ],
  }

};
