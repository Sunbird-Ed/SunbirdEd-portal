import { PluginConfig, PluginPlacement } from '@project-sunbird/web-extensions';
import { ContentImportHeaderComponent } from './components';

@PluginConfig({
  name: 'content-import-plugin',
  description: 'Shows user profile data of sunbird portal user',
  placements: [
    new PluginPlacement({ name: 'content-import', priority: 1, component: ContentImportHeaderComponent }),
  ]
})
export class ImportContentPlugin {
}
