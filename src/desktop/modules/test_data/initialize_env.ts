import * as fs from "fs";
import * as path from "path";
import { env } from "./routes.spec.data";

export class InitializeEnv {

    public init() {
        for (const envId in env) {
            process.env[envId] = env[envId];
        }
        if (!fs.existsSync(path.join(__dirname,  "database"))) {
            fs.mkdirSync(path.join(__dirname,  "database"));
        }

    }
}
