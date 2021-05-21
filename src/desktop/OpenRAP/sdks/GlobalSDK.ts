import { DataBaseSDK } from "./DataBaseSDK";
import { PluginConfig } from "./../interfaces";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */

/*
 * Plugin to register with the container on initialization.
 */

let databaseName = "plugin_registry";
export const register = async (
  pluginId: string,
  pluginConfig: object
): Promise<boolean> => {
  let dbSDK = new DataBaseSDK();
  await dbSDK.upsertDoc(databaseName, pluginId, pluginConfig).catch(err => {
    logger.error("while inserting the plugin to the database", err);
});
  return true;
};

/*
 * Get the plugin configuration.
 * @param pluginId String
 * @return pluginConfig
 */
export const get = async (pluginId: string): Promise<PluginConfig> => {
  let dbSDK = new DataBaseSDK();
  let pluginConfig = await dbSDK.getDoc(databaseName, pluginId);
  delete pluginConfig["_id"];
  delete pluginConfig["_rev"];
  return Promise.resolve(pluginConfig);
};

/*
 * list the plugins .
 
 * @return plugins
 */
export const list = async (): Promise<PluginConfig[]> => {
  let dbSDK = new DataBaseSDK();
  let { docs } = await dbSDK.find(databaseName, { selector: {} });
  let pluginConfigs = [];
  _.forEach(docs, doc => {
    let pluginConfig = _.omit(doc, ["_id", "_rev"]);
    pluginConfig.id = doc["_id"];
    pluginConfigs.push(pluginConfig);
  });
  return Promise.resolve(pluginConfigs);
};
