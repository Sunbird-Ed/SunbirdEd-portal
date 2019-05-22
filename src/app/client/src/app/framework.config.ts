import { OfflineModule } from './modules/offline';
import { OfflinePlugins} from './modules/offline/plugin';

export const WebExtensionsConfig = {
  plugins: [{
    'id': 'offline-plugins',
    'ver': '1.0.0',
    'module': OfflineModule,
    'main': OfflinePlugins
  }]
};

export const PluginModules = [ OfflineModule ];
