export const mockChart = {
  chartConfig: {
    id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1",
    colors: [
      {
        borderColor: "rgb(0, 199, 134)",
        borderWidth: 2,
        backgroundColor: "rgba(0, 199, 134, 0.3)",
      },
      {
        borderColor: "rgb(255, 161, 29)",
        borderWidth: 2,
        backgroundColor: "rgba(255, 161, 29, 0.3)",
      },
      {
        borderColor: "rgb(255, 69, 88)",
        borderWidth: 2,
        backgroundColor: "rgba(255, 69, 88, 0.3)",
      },
      {
        borderColor: "rgb(242, 203, 28)",
        borderWidth: 2,
        backgroundColor: "rgba(242, 203, 28, 0.3)",
      },
      {
        borderColor: "rgb(55, 70, 73)",
        borderWidth: 2,
        backgroundColor: "rgba(55, 70, 73, 0.3)",
      },
    ],
    filters: [
      {
        reference: "District name",
        controlType: "multi-select",
        displayName: "District",
      },
      {
        reference: "Program name",
        controlType: "multi-select",
        displayName: "Program",
      },
      {
        reference: "Observation name",
        controlType: "multi-select",
        displayName: "Observation",
      },
      {
        reference: "Block name",
        controlType: "multi-select",
        displayName: "Block",
      }
    ],
    options: {
      title: {
        text: "District-wise unique users who submitted form",
        display: true,
        fontSize: 16,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: "District name",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: "No. of unique users",
            },
          },
        ],
      },
      tooltips: {
        mode: "x-axis",
        intersect: false,
        bodySpacing: 5,
        titleSpacing: 5,
      },
      responsive: true,
      showLastUpdatedOn: true,
    },
    datasets: [
      {
        label: "No of unique users",
        dataExpr: "No of unique users",
      },
    ],
    chartType: "bar",
    dataSource: {
      ids: [
        "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1",
      ],
      commonDimension: "District name",
    },
    labelsExpr: "District name",
  },
  chartConfigWithDependencyFilter: {
    id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1",
    colors: [
      {
        borderColor: "rgb(0, 199, 134)",
        borderWidth: 2,
        backgroundColor: "rgba(0, 199, 134, 0.3)",
      },
      {
        borderColor: "rgb(255, 161, 29)",
        borderWidth: 2,
        backgroundColor: "rgba(255, 161, 29, 0.3)",
      },
      {
        borderColor: "rgb(255, 69, 88)",
        borderWidth: 2,
        backgroundColor: "rgba(255, 69, 88, 0.3)",
      },
      {
        borderColor: "rgb(242, 203, 28)",
        borderWidth: 2,
        backgroundColor: "rgba(242, 203, 28, 0.3)",
      },
      {
        borderColor: "rgb(55, 70, 73)",
        borderWidth: 2,
        backgroundColor: "rgba(55, 70, 73, 0.3)",
      },
    ],
    filters: [
      {
        reference: "District name",
        controlType: "multi-select",
        displayName: "District",
      },
      {
        reference: "Program name",
        controlType: "multi-select",
        displayName: "Program",
      },
      {
        reference: "Observation name",
        controlType: "multi-select",
        displayName: "Observation",
      },
      {
        reference: "Block name",
        controlType: "multi-select",
        displayName: "Block",
        dependency:{
        reference: "District name",
        displayName: "District"
      }
    }
    ],
    options: {
      title: {
        text: "District-wise unique users who submitted form",
        display: true,
        fontSize: 16,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: "District name",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: "No. of unique users",
            },
          },
        ],
      },
      tooltips: {
        mode: "x-axis",
        intersect: false,
        bodySpacing: 5,
        titleSpacing: 5,
      },
      responsive: true,
      showLastUpdatedOn: true,
    },
    datasets: [
      {
        label: "No of unique users",
        dataExpr: "No of unique users",
      },
    ],
    chartType: "bar",
    dataSource: {
      ids: [
        "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1",
      ],
      commonDimension: "District name",
    },
    labelsExpr: "District name",
  },
  chartData: [
    {
      "Program name": "Observation led projects testing",
      "Observation name": "Leadership Self Assessment(Percentage)",
      "District name": "ANANTAPUR",
      solution_id: "60a245158eee6c5040d16a4a",
      Date: "2022-06-15",
      "No of unique users": "2.0",
      Organisation: "unknown",
    },
    {
      "Program name": "Observation led projects testing",
      "Observation name": "Leadership Self Assessment(Percentage)",
      "District name": "CHITTOOR",
      solution_id: "60a245158eee6c5040d16a4a",
      Date: "2022-06-15",
      "No of unique users": "2.0",
      Organisation: "Staging Custodian Organization",
    },
  ],
  transformedConfig: {
    colors: [
      {
        borderColor: "rgb(0, 199, 134)",
        borderWidth: 2,
        backgroundColor: "rgba(0, 199, 134, 0.3)",
      },
      {
        borderColor: "rgb(255, 161, 29)",
        borderWidth: 2,
        backgroundColor: "rgba(255, 161, 29, 0.3)",
      },
      {
        borderColor: "rgb(255, 69, 88)",
        borderWidth: 2,
        backgroundColor: "rgba(255, 69, 88, 0.3)",
      },
      {
        borderColor: "rgb(242, 203, 28)",
        borderWidth: 2,
        backgroundColor: "rgba(242, 203, 28, 0.3)",
      },
      {
        borderColor: "rgb(55, 70, 73)",
        borderWidth: 2,
        backgroundColor: "rgba(55, 70, 73, 0.3)",
      },
    ],
    filters:  [
      {
        reference: "District name",
        controlType: "multi-select",
        displayName: "District",
      },
      {
        reference: "Program name",
        controlType: "multi-select",
        displayName: "Program",
      },
      {
        reference: "Observation name",
        controlType: "multi-select",
        displayName: "Observation",
      },
      {
        reference: "Block name",
        controlType: "multi-select",
        displayName: "Block",
      }
    ],
    options: {
      title: {
        text: "District-wise unique users who submitted form",
        display: true,
        fontSize: 16,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: "District name",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: "No. of unique users",
            },
          },
        ],
      },
      tooltips: {
        mode: "x-axis",
        intersect: false,
        bodySpacing: 5,
        titleSpacing: 5,
      },
      responsive: true,
      showLastUpdatedOn: true,
    },
    datasets: [
      {
        label: "No of unique users",
        dataExpr: "No of unique users",
      },
    ],
    type: "bar",
    labelExpr: "District name",
  },
};
