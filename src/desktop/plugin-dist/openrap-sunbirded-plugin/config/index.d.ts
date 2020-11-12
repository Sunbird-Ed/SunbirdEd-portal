/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */
/**
 * This SDK provides methods to handle file deleting , folder creation and deletion prefixed with pluginId
 *
 */
declare class Config {
    private config;
    constructor();
    /**
     *
     * @param id
     * This method deletes the file it adds the plugin id as prefix so that conflicts with file path
     * with other plugins are resolved it tries to find file from current directory to delete it
     * @returns Promise
     */
    get(id: string): any;
    /**
     * @param folder_path
     * This method deletes the folder it adds the plugin id as prefix so that conflicts with folder path
     * with other plugins are resolved it tries to find folder from current directory to delete it
     * @returns Promise
     */
    set(id: string, value: string): void;
}
declare const config: Config;
export default config;
