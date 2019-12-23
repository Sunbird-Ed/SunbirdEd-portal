module.exports = {
    fields: {
        id: "text", //uuid
        createdby: "text", //user who uploaded the file
        createdon: "timestamp", // the time stamp of the file uploaded
        data: "text", // full file converted in json formate
        failureresult: "text", // json for the failed records
        lastupdatedon: "timestamp", 
        objecttype: "text", // certificate
        organisationid: "text", //the user org who uploaded the file
        processendtime: "text", // the time when you update the fiailure and success in the DB
        processstarttime: "text", // current time
        retrycount: "int", // only update the satatus is 0 
        status: "int", // enum 0,1,2
        storagedetails: "text", // azure path of the zip file
        successresult: "text", //
        taskcount: "int", //NOT required
        telemetrycontext: {
            type: "map",
            typeDef: "<text, text>"
        }, // Empty
        uploadedby: "text", // the ID who uploaded the file
        uploadeddate: "text" // Time stamp
    },
    key: ['id'],
    index: ['inx_status(status)']
}
