export interface PluginRegistryObject {
  id: string, // Plugin id
  config: {
    pluginVer: string,
    apiToken: string,
    apiBaseURL: string,
    apiTokenRefreshFn: Function
  }
}
