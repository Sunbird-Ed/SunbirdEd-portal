
//  export const urlConfig = {
//     // endpoint configs...!
//     // URLs...!
//     // eventDetailApi :  "assets/api/event-detail.json",
//     eventListApi : "assets/api/eventlist.json",
//     eventCreateApi: "https://jsonplaceholder.typicode.com/posts",
//     // eventFormConfigApi : "assets/api/event-create.json",
//     // eventFilterConfigApi: "assets/api/event-filter.json",
//     enrollListApi : "assets/api/enrolled-events.json",
//     // myEvents: "assets/api/myeventlist.json",
//     myEvents:"v2/user/courses/list",
//     enrollApi: "v1/event/enroll",
//     usersApi: "assets/api/users.json",
//     // URLs...!
//     // detail :  "/event/v4/read/do_11334351316861747212",
//     // detail :  "/event/v4/read/",
//     detail : "assets/api/event-detail.json",
//     list : "assets/api/eventlist.json",
//     create: "/api/event/v4/create",
//     update: "/event/v4/update",
//     formConfig : "assets/api/event-create.json",
//     enrolllist : "assets/api/enrolled-events.json",
//     // enrolllist : "assets/api/enroll-list.json",
//     enroll: "https://igot-sunbird.idc.tarento.com/v1/event/enroll",
//     retire : "https://igot-sunbird.idc.tarento.com/private/event/v4/retire",
//     publish: "/event/v4/publish",
//     calenderevent:"assets/api/eventlist_new.json",
//     ImageSearchApi :  "assets/api/search-images.json",
//     EditModeApi :  "assets/api/editmode.json",
//     createImage:"content/v3/create",
//     BBBGetUrl:"event/v4/join",
//     search:"/api/event/v1/search",
//     eventFormConfigApi : "https://staging-sunbird.nsdl.co.in/api/data/v1/form/read",
//     eventFilterConfigApi : "https://staging-sunbird.nsdl.co.in/api/data/v1/form/read"
// };

export const urlConfig = {
    // endpoint configs...!
    // Live API's
    create: "/api/event/v4/create",

    // update: "/event/v4/update",
    update: "/api/event/v4/update",

    // detail :  "/event/v4/read/",
    detail: "/api/event/v4/read/",

    // publish:"/event/v4/publish",
    publish: "/api/event/v4/publish",
    // publish:"/event/v4/publish",
    enrollApi: "/learner/course/v1/enrol",
    unenrollApi: "/learner/course/v1/unenrol",
    BBBGetUrlModerator: "/api/event/v4/join/moderator",
    BBBGetUrlAttendee:"/api/event/v4/join/attendee",
    createImage: "/action/content/v3/create",
    uploadImage: "/action/content/v3/upload",
    // createImage: "https://staging-sunbird.nsdl.co.in/action/content/v3/create",
    // uploadImage:"https://staging-sunbird.nsdl.co.in/action/content/v3/upload",

    batchlist: "/api/course/v1/batch/list",
    createBatch: "/api/course/v1/batch/create",
    enrollUserEventList:"/api/course/v2/user/enrollment/list",
    eventFormConfigApi : "https://staging-sunbird.nsdl.co.in//api/data/v1/form/read",
    eventFilterConfigApi : "/api/data/v1/form/read",
    myEvents:"/api/course/v2/user/enrollment/list",
    search: "/api/event/v1/search",

    eventListApi : "assets/api/eventlist.json",
    eventCreateApi: "https://jsonplaceholder.typicode.com/posts",
    enrollListApi : "assets/api/enrolled-events.json",
    
    usersApi: "assets/api/users.json",
    // URLs...!
//    list : "assets/api/eventlist.json",
    
    formConfig : "assets/api/event-create.json",
    enrolllist : "assets/api/enrolled-events.json",
    // enrolllist : "assets/api/enroll-list.json",
    enroll: "https://igot-sunbird.idc.tarento.com/v1/event/enroll",
    retire : "https://igot-sunbird.idc.tarento.com/private/event/v4/retire",
    // publish: "https://igot-sunbird.idc.tarento.com/event/v4/publish",
    
    calenderevent:"assets/api/eventlist_new.json",
    ImageSearchApi :  "assets/api/search-images.json",
    EditModeApi :  "assets/api/editmode.json",
    compositeSearch: "/action/composite/v3/search"
    // compositeSearch : "https://staging-sunbird.nsdl.co.in/action/composite/v3/search",

    // BBBGetUrl:"assets/api/BBBCreatEvent.json",
    // BBBGetUrl:"event/v4/join",
    
};
