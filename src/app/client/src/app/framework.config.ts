import { OfflineModule } from './modules/offline';
import { ImportContentPlugin} from './modules/offline/plugin';

export const WebExtensionsConfig = {
  plugins: [{
    'id': 'offline',
    'ver': '1.0.0',
    'module': OfflineModule,
    'main': ImportContentPlugin
  }]
};

export const PluginModules = [ OfflineModule ];
