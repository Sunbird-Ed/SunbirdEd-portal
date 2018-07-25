"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PluginStatusEnum;
(function (PluginStatusEnum) {
    PluginStatusEnum[PluginStatusEnum["unknown"] = 0] = "unknown";
    PluginStatusEnum[PluginStatusEnum["created"] = 1] = "created";
    PluginStatusEnum[PluginStatusEnum["registered"] = 2] = "registered";
    PluginStatusEnum[PluginStatusEnum["installed"] = 3] = "installed";
    PluginStatusEnum[PluginStatusEnum["resolved"] = 4] = "resolved";
    PluginStatusEnum[PluginStatusEnum["started"] = 5] = "started";
    PluginStatusEnum[PluginStatusEnum["stopped"] = 6] = "stopped";
    PluginStatusEnum[PluginStatusEnum["active"] = 7] = "active";
    PluginStatusEnum[PluginStatusEnum["uninstalled"] = 8] = "uninstalled";
    PluginStatusEnum[PluginStatusEnum["unregistered"] = 9] = "unregistered";
})(PluginStatusEnum = exports.PluginStatusEnum || (exports.PluginStatusEnum = {}));
