// export const urlConfig = {
//     // endpoint configs...!
//     // URLs...!
//     eventListApi : "assets/api/eventlist.json",
//     eventCreateApi: "https://jsonplaceholder.typicode.com/posts",
//     enrollListApi : "assets/api/enrolled-events.json",
//     myEvents:"v2/user/courses/list",
//     enrollApi: "v1/event/enroll",
//     usersApi: "assets/api/users.json",
//     // URLs...!
//     detail :  "/event/v4/read/",
//     // detail : "assets/api/event-detail.json",
//     list : "assets/api/eventlist.json",
//     create: "/api/event/v4/create",
//     update: "/event/v4/update",
//     formConfig : "assets/api/event-create.json",
//     enrolllist : "assets/api/enrolled-events.json",
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
    create: "/event/v4/create",
    update: "/event/v4/update",
    detail :  "/event/v4/read/",
    publish:"/event/v4/publish",
    enrollApi: "/v1/event/enroll",
    unenrollApi: "/v1/event/unenroll",
    BBBGetUrlModerator: "/event/v4/join/moderator",
    BBBGetUrlAttendee:"/event/v4/join/attendee",
    createImage: "content/v3/create",
    batchlist: "/v1/course/batch/search",
    createBatch: "/v1/course/batch/create",
    enrollUserEventList:"/v2/user/courses/list",
    eventFormConfigApi : "https://staging-sunbird.nsdl.co.in/api/data/v1/form/read",
    eventFilterConfigApi : "https://staging-sunbird.nsdl.co.in/api/data/v1/form/read",
    myEvents:"/v2/user/courses/list",
    search:"/api/event/v1/search",

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
    
    // BBBGetUrl:"assets/api/BBBCreatEvent.json",
    // BBBGetUrl:"event/v4/join",
    
};
