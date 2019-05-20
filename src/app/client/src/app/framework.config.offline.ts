import { OfflinePlugins } from './modules/offline/plugin';
import { OfflineModule } from './modules/offline';

export const WebExtensionsConfig = {
  plugins: [{
    'id': 'content-import',
    'ver': '1.0.0',
    'module': OfflineModule,
    'main': OfflinePlugins
  }]
};

export const PluginModules = [ OfflineModule ];

