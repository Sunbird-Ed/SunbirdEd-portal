Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const routes_spec_data_1 = require("./routes.spec.data");
class InitializeEnv {
    init() {
        for (const envId in routes_spec_data_1.env) {
            process.env[envId] = routes_spec_data_1.env[envId];
        }
        if (!fs.existsSync(path.join(__dirname, "database"))) {
            fs.mkdirSync(path.join(__dirname, "database"));
        }
    }
}
exports.InitializeEnv = InitializeEnv;
