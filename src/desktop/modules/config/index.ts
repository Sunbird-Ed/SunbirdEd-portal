/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */

/**
 * This SDK provides methods to handle file deleting , folder creation and deletion prefixed with pluginId
 *
 */

class Config {
    private config: any;
    constructor() {
        this.config = process.env;
        this.config.CONTENT_SEARCH_FIELDS = "dialcodes,board,medium,gradeLevel,subject,contentType,mimeType,primaryCategory,audience,publisher";
        this.config.CONTENT_SEARCH_LIMIT = 1000;
        this.config.CONTENT_COMPATIBILITY_LEVEL = 6;
        this.config.LANGUAGES = "English, Assamese, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Oriya, Punjabi, Tamil, Telugu, Urdu ";
    }

    /**
     *
     * @param id
     * This method deletes the file it adds the plugin id as prefix so that conflicts with file path
     * with other plugins are resolved it tries to find file from current directory to delete it
     * @returns Promise
     */
    public get(id: string) {
        return this.config[id];
    }

    /**
     * @param folder_path
     * This method deletes the folder it adds the plugin id as prefix so that conflicts with folder path
     * with other plugins are resolved it tries to find folder from current directory to delete it
     * @returns Promise
     */
    public set(id: string, value: string) {
        this.config[id] = value;
    }

}
const config = new Config();
export default config;
