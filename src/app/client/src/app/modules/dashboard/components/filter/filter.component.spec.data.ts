
export let mockChartData = {
    chartData: [{ state: 'b00bc992ef25f1a9a8d63291e20efc8d', Plays: '323', Date: '2020-04-28' },
    { state: '0130385861180866561', Plays: '10', Date: '2020-04-28' },
    { state: 'b00bc992ef25f1a9a8d', Plays: '20', Date: '2020-04-28' },
    { state: '013016492159606784174', Plays: '8', Date: '2020-04-28' },
    { state: '01285019302823526477', Plays: '10', Date: '2020-04-28' },
    { state: 'b00bc992ef25f1a9a8d63291e20efc8d', Plays: '323', Date: '2020-04-28' },
    { state: '0130385861180866561', Plays: '10', Date: '2020-04-28' },
    { state: 'b00bc992ef25f1a9a8d', Plays: '20', Date: '2020-04-28' },
    { state: '013016492159606784174', Plays: '9', Date: '2020-04-28' },
    { state: '01285019302823526477', Plays: '10', Date: '2020-04-28' }],
    filters: [{
        'controlType': 'multi-select',
        'displayName': 'Select state',
        'options': ['01285019302823526477', '013016492159606784174', '0130385861180866561', 'b00bc992ef25f1a9a8d', 'b00bc992ef25f1a9a8d63291e20efc8d'],
        'reference': 'state'
    }, {
        'controlType': 'multi-select',
        'displayName': 'Select Plays',
        'options': ['10', '20', '8', '9', '323'],
        'reference': 'Plays'
    },
    {
        'controlType': 'date',
        'displayName': 'Select Date',
        'options': [],
        'reference': 'Date'
    }],
    dependencyFilters:[
        {
            "reference": "Program name",
            "controlType": "multi-select",
            "displayName": "Program"
        },
        {
            "reference": "Observation name",
            "controlType": "multi-select",
            "displayName": "Observation"
        },
        {
            "reference": "District name",
            "controlType": "multi-select",
            "displayName": "District"
        },
        {
            "reference": "Organisation",
            "controlType": "multi-select",
            "displayName": "Organisation",
            "dependency":{
              "reference": "District name",
              "displayName": "district name"
            }
        }
    ],
    selectedFiltersWithoutDependecy:{
        "Program name":['abc'],
        "Organisation":['xyz']
    },
    resultedFilters:{
        "Program name":['abc']
    }


};

