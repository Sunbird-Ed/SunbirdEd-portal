/**
 * ITelemetryShare Interface
*/
export interface ITelemetryShare {
    id: string;
    type: string;
    ver: string;
    params?: [{id?: string}];
}
