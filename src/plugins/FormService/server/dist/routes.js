Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@project-sunbird/ext-framework-server/api");
const RequestValidator_1 = require("./RequestValidator");
class Router {
    init(app, manifest, auth) {
        const server = api_1.frameworkAPI.getPluginInstance(manifest.id);
        const validator = new RequestValidator_1.RequestValidator();
        app.post('/read', validator.validateReadAPI, (req, res) => { server.read(req, res); });
        app.post('/update', validator.validateUpdateAPI, (req, res) => { server.update(req, res); });
        app.post('/create', validator.validateCreateAPI, (req, res) => { server.create(req, res); });
    }
}
exports.Router = Router;
