export interface ITelemetrySkipped {
  id: string;
  reason: string;
}

export class ErrorObj {
  constructor(public errCode: string, public errMessage: string) {
  }
}
export const getErrorObj = (error, errCode = "UNHANDLED_ERROR") => {
  if (error instanceof ErrorObj) {
    return error;
  }
  return new ErrorObj(errCode, error.message);
};
export const handelError = (errCode) => {
  return (error: Error | ErrorObj) => {
    throw getErrorObj(error, errCode);
  };
};
