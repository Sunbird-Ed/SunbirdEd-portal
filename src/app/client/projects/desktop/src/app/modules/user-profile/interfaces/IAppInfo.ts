export interface IAppInfo {
    termsOfUseUrl: string;
    version: string;
    releaseDate?: string;
    languages: string;
    deviceId: string;
    updateInfo?: {
        updateAvailable?: boolean,
        url?: string,
        version?: string
    };
}
