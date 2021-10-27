export let mockData =
{
  rowsData: [
    {
      "District": "SRIKAKULAM",
      "channel_slug": "dikshapreprodcustodian",
      "Program Name": "Test Program",
      "Observation Form Name": "AP-TEST-PROGRAM-3.6.5-OBS-ALL-QUESTION-TYPES-1-HM",
      "No of unique users": "1.0",
      "Date": "2020-12-01"
    },
    {
      "District": "CHITTOOR",
      "channel_slug": "dikshapreprodcustodian",
      "Program Name": "Test Program",
      "Observation Form Name": "AP-TEST-PROGRAM-3.6.5-OBS-1-DEO",
      "No of unique users": "1.0",
      "Date": "2020-12-01"
    },
    {
      "District": "ANANTAPUR",
      "channel_slug": "dikshapreprodcustodian",
      "Program Name": "Test Program",
      "Observation Form Name": "AP-TEST-PROGRAM-3.6.5-OBS-1-DEO",
      "No of unique users": "1.0",
      "Date": "2020-12-01"
    },
    {
      "District": "GUNTUR",
      "channel_slug": "dikshapreprodcustodian",
      "Program Name": "Test Program",
      "Observation Form Name": "AP-TEST-PROGRAM-3.6.5-OBS-IMP-PROJECT-2-DEO",
      "No of unique users": "1.0",
      "Date": "2020-12-01"
    }
  ],
  config: {
    columnConfig: [
      {
        "data": "Program Name",
        "title": "Program Name"
      },
      {
        "data": "District",
        "title": "District Name"
      },
      {
        "data": "Date",
        "title": "Date"
      }
    ],
    filters: [
      {
        "label": "Program Name",
        "reference": "Program Name",
        "searchable": true,
        "controlType": "multi-select",
        "displayName": "Program Name",
        "placeholder": "Program Name"
      },
      {
        "label": "District",
        "reference": "District",
        "searchable": true,
        "controlType": "multi-select",
        "displayName": "District",
        "placeholder": "District"
      }
    ],

    "lengthMenu": [
      30,
      40
    ],
    "pageLength": 30,
    "order": [
      1,
      "desc"
    ],
    "bFilter": true,
    "paging": true
  }

};