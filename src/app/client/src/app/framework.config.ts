import { OfflinePlugins } from './modules/public/module/offline/plugin';
import { OfflineModule } from './modules/public/module/offline/';

export const WebExtensionsConfig = {
  plugins: [
    {
    'id': 'offline-plugins',
    'ver': '1.0.0',
    'module': OfflineModule,
    'main': OfflinePlugins
  }
]
};

export const PluginModules = [ OfflineModule ];

