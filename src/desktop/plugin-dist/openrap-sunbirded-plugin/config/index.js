/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This SDK provides methods to handle file deleting , folder creation and deletion prefixed with pluginId
 *
 */
class Config {
    constructor() {
        this.config = process.env;
        this.config.CONTENT_SEARCH_FIELDS = "dialcodes,board,medium,gradeLevel,subject,contentType";
        this.config.CONTENT_SEARCH_LIMIT = 1000;
        this.config.CONTENT_COMPATIBILITY_LEVEL = 4;
        this.config.LANGUAGES = "English, Hindi";
    }
    /**
     *
     * @param id
     * This method deletes the file it adds the plugin id as prefix so that conflicts with file path
     * with other plugins are resolved it tries to find file from current directory to delete it
     * @returns Promise
     */
    get(id) {
        return this.config[id];
    }
    /**
     * @param folder_path
     * This method deletes the folder it adds the plugin id as prefix so that conflicts with folder path
     * with other plugins are resolved it tries to find folder from current directory to delete it
     * @returns Promise
     */
    set(id, value) {
        this.config[id] = value;
    }
}
const config = new Config();
exports.default = config;
