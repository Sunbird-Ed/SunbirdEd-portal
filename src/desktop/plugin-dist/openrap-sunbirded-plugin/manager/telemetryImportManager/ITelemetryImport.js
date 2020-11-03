Object.defineProperty(exports, "__esModule", { value: true });
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
