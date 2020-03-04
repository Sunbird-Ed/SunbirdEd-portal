import { PluginConfig, PluginPlacement } from '@project-sunbird/web-extensions';
import { ContentImportHeaderComponent, WatchVideoComponent, ContentManagerComponent } from './components';

@PluginConfig({
  name: 'offline-plugin',
  description: 'Shows different components of offline module',
  placements: [
    new PluginPlacement({ name: 'content-import', priority: 1, component: ContentImportHeaderComponent }),
    new PluginPlacement({ name: 'watch-video', priority: 1, component: WatchVideoComponent }),
    new PluginPlacement({ name: 'content-manager', priortiy: 1, component: ContentManagerComponent
    })
  ]
})
export class OfflinePlugins {
}
