import { ProfileModule, ProfilePlugin } from './plugins/profile';

export const WebExtensionsConfig = {
  plugins: [{
    'id': 'profile',
    'ver': '1.0.0',
    'module': ProfileModule,
    'main': ProfilePlugin
  }]
};

export const PluginModules = [ ProfileModule ];
