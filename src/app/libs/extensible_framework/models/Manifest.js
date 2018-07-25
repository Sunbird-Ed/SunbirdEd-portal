"use strict";
/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const util_1 = require("../util");
/**
 *
 *
 * @export
 * @class Manifest
 */
class Manifest {
    /**
     * Creates an instance of Manifest.
     * @param {IPluginManifest} manifest
     * @memberof Manifest
     */
    constructor(manifest) {
        this.json = manifest;
        this._id = manifest.id;
        this._version = manifest.version;
        this._author = manifest.author;
        this._description = manifest.description;
        this._server = manifest.server;
    }
    /**
     *
     *
     * @static
     * @param {(IPluginManifest | string)} json
     * @returns {Manifest}
     * @memberof Manifest
     */
    static fromJSON(json) {
        try {
            if (typeof json === "string")
                json = JSON.parse(json);
            return new Manifest(json);
        }
        catch (error) {
            throw new util_1.FrameworkError({ message: `unable to parse manifest, invalid JSON format!`, code: util_1.FrameworkErrors.MANIFEST_NOT_PARSEABLE, rootError: error });
        }
    }
    /**
     *
     *
     * @readonly
     * @type {string}
     * @memberof Manifest
     */
    get id() {
        return this._id;
    }
    /**
     *
     *
     * @readonly
     * @type {string}
     * @memberof Manifest
     */
    get name() {
        return this._name;
    }
    /**
     *
     *
     * @readonly
     * @type {string}
     * @memberof Manifest
     */
    get version() {
        return this._version;
    }
    /**
     *
     *
     * @readonly
     * @type {string}
     * @memberof Manifest
     */
    get author() {
        return this._author;
    }
    /**
     *
     *
     * @readonly
     * @type {string}
     * @memberof Manifest
     */
    get description() {
        return this._description;
    }
    /**
     *
     *
     * @readonly
     * @type {IServerSchema}
     * @memberof Manifest
     */
    get server() {
        return this._server;
    }
    /**
     *
     *
     * @returns
     * @memberof Manifest
     */
    getDependencies() {
        return this.server.dependencies;
    }
    /**
     *
     *
     * @param {boolean} toString
     * @returns {(IPluginManifest | string)}
     * @memberof Manifest
     */
    toJSON(toString = false) {
        if (toString)
            return JSON.stringify(this.json);
        return _.cloneDeep(this.json);
    }
}
exports.Manifest = Manifest;
