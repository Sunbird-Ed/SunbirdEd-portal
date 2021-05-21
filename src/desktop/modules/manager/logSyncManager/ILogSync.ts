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

export interface ILogAPIFormat {
  appver: string;
  pageid: string;
  ts: number;
  log: string;
}