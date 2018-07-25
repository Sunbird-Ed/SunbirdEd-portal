"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const typescript_ioc_1 = require("typescript-ioc");
let SchemaService = class SchemaService {
    constructor() {
        this.schemaMap = {};
    }
    setSchema(pluginId, schema) {
        if (pluginId)
            this.schemaMap[pluginId] = _.cloneDeep(schema);
    }
    getSchemaByPlugin(pluginId) {
        if (pluginId)
            return _.cloneDeep(this.schemaMap[pluginId]);
    }
    getSchemaBykeyspace(keyspace) {
        if (keyspace) {
            return _.values(this.schemaMap).find((schema) => {
                return schema.keyspace_name === keyspace;
            });
        }
    }
};
SchemaService = __decorate([
    typescript_ioc_1.Singleton
], SchemaService);
exports.SchemaService = SchemaService;
