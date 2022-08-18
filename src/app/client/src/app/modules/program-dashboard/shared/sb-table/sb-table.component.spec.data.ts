export let mockTable = {
  table:
    {
      id: "ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight",
      name: "District wise observation status and entities observed",
      config: {
        info: true,
        paging: true,
        filters: [
          {
            label: "district_name",
            reference: "district_name",
            searchable: true,
            controlType: "multi-select",
            displayName: "District",
            placeholder: "Select district",
          },
          {
            label: "organisation_name",
            reference: "organisation_name",
            searchable: true,
            controlType: "multi-select",
            displayName: "Organisation",
            placeholder: "Select Organisation",
          },
        ],
        lengthMenu: [10, 25, 50, 100],
        searchable: true,
        columnConfig: [
          {
            data: "district_externalId",
            title: "district_externalId",
          },
          {
            data: "program_id",
            title: "program_id",
          },
          {
            data: "solution_id",
            title: "solution_id",
          },
          {
            data: "organisation_name",
            title: "Organisation",
          },
          {
            data: "organisation_id",
            title: "organisation_id",
          },
          {
            data: "district_name",
            title: "District",
          },
          {
            data: "Program Name",
            title: "Program",
          },
          {
            data: "Observation Name",
            title: "Observation",
          },
          {
            data: "No of users completed",
            title: "No of users completed",
          },
          {
            data: "Total submissions",
            title: "Total submissions",
          },
          {
            data: "No of users started",
            title: "No of users started",
          },
          {
            data: "Entities observed",
            title: "Entities observed",
          },
        ],
        bLengthChange: true,
      },
      data: [
        {
          "Entities observed": "1.0",
          district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
          program_id: "62034f90841a270008e82e46",
          solution_id: "6214be63c7fe210007b65221",
          "No of users completed": "9.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "ANANTAPUR",
          "Program Name": "Testing program 4.7",
          "No of users started": "7.0",
          "Observation Name": "Simple Observation-FD272(8 submission)",
          "Total submissions": "53.0",
        },
        {
          "Entities observed": "1.0",
          district_externalId: "b617e607-0a5b-45a0-9894-7a325ffa45c7",
          program_id: "62034f90841a270008e82e46",
          solution_id: "6214be63c7fe210007b65221",
          "No of users completed": "1.0",
          organisation_name: "Staging Custodian Organization",
          organisation_id: "0126796199493140480",
          Date: "2022-07-17",
          district_name: "KRISHNA",
          "Program Name": "Testing program 4.7",
          "No of users started": "1.0",
          "Observation Name": "Simple Observation-FD272(8 submission)",
          "Total submissions": "8.0",
        },
      ],
      header: [
        "Date",
        "Program Name",
        "Observation Name",
        "organisation_name",
        "district_name",
        "solution_id",
        "district_externalId",
        "organisation_id",
        "program_id",
        "No of users started",
        "No of users completed",
        "Total submissions",
        "Entities observed",
      ],
      columnsConfiguration: {
        columnConfig: [
          {
            title: "Date",
            data: "Date",
          },
          {
            title: "Program Name",
            data: "Program Name",
          },
          {
            title: "Observation Name",
            data: "Observation Name",
          },
          {
            title: "organisation_name",
            data: "organisation_name",
          },
          {
            title: "district_name",
            data: "district_name",
          },
          {
            title: "solution_id",
            data: "solution_id",
          },
          {
            title: "district_externalId",
            data: "district_externalId",
          },
          {
            title: "organisation_id",
            data: "organisation_id",
          },
          {
            title: "program_id",
            data: "program_id",
          },
          {
            title: "No of users started",
            data: "No of users started",
          },
          {
            title: "No of users completed",
            data: "No of users completed",
          },
          {
            title: "Total submissions",
            data: "Total submissions",
          },
          {
            title: "Entities observed",
            data: "Entities observed",
          },
        ],
        bLengthChange: true,
        info: true,
        lengthMenu: [10, 25, 50, 100],
        paging: true,
        searchable: true,
      },
      downloadUrl:
        "/reports/fetch/6214be63c7fe210007b65221/ml_district_wise_observation_status_and_entities_observed_new_new_new_new_api_new_dataaa_pabitra_eight.csv",
    }
};
