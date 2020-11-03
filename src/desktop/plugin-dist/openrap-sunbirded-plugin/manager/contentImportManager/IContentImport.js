Object.defineProperty(exports, "__esModule", { value: true });
var ImportSteps;
(function (ImportSteps) {
    ImportSteps["copyEcar"] = "COPY_ECAR";
    ImportSteps["parseEcar"] = "PARSE_ECAR";
    ImportSteps["extractEcar"] = "EXTRACT_ECAR";
    ImportSteps["processContents"] = "PROCESS_CONTENTS";
    ImportSteps["complete"] = "COMPLETE";
})(ImportSteps = exports.ImportSteps || (exports.ImportSteps = {}));
var ImportProgress;
(function (ImportProgress) {
    ImportProgress[ImportProgress["COPY_ECAR"] = 1] = "COPY_ECAR";
    ImportProgress[ImportProgress["PARSE_ECAR"] = 25] = "PARSE_ECAR";
    ImportProgress[ImportProgress["EXTRACT_ECAR"] = 26] = "EXTRACT_ECAR";
    ImportProgress[ImportProgress["EXTRACT_ARTIFACT"] = 90] = "EXTRACT_ARTIFACT";
    ImportProgress[ImportProgress["PROCESS_CONTENTS"] = 99] = "PROCESS_CONTENTS";
    ImportProgress[ImportProgress["COMPLETE"] = 100] = "COMPLETE";
})(ImportProgress = exports.ImportProgress || (exports.ImportProgress = {}));
var ImportStatus;
(function (ImportStatus) {
    ImportStatus[ImportStatus["reconcile"] = 0] = "reconcile";
    ImportStatus[ImportStatus["resume"] = 1] = "resume";
    ImportStatus[ImportStatus["inQueue"] = 2] = "inQueue";
    ImportStatus[ImportStatus["inProgress"] = 3] = "inProgress";
    ImportStatus[ImportStatus["pausing"] = 4] = "pausing";
    ImportStatus[ImportStatus["paused"] = 5] = "paused";
    ImportStatus[ImportStatus["canceling"] = 6] = "canceling";
    ImportStatus[ImportStatus["canceled"] = 7] = "canceled";
    ImportStatus[ImportStatus["completed"] = 8] = "completed";
    ImportStatus[ImportStatus["failed"] = 9] = "failed";
})(ImportStatus = exports.ImportStatus || (exports.ImportStatus = {}));
class ErrorObj {
    constructor(errCode, errMessage) {
        this.errCode = errCode;
        this.errMessage = errMessage;
    }
}
exports.ErrorObj = ErrorObj;
exports.getErrorObj = (error, errCode = "UNHANDLED_ERROR") => {
    if (error instanceof ErrorObj) {
        return error;
    }
    return new ErrorObj(errCode, error.message);
};
exports.handelError = (errCode) => {
    return (error) => {
        throw exports.getErrorObj(error, errCode);
    };
};
