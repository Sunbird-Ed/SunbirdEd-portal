export interface PluginConfig {
    id?: string,
    pluginVer: string,
    apiToken: string,
    apiBaseURL: string,
    apiTokenRefreshFn: string
}