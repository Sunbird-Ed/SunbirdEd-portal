import { PluginConfig, PluginPlacement } from '@project-sunbird/web-extensions';
import { ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent } from './components';

@PluginConfig({
  name: 'offline-plugin',
  description: 'Shows user profile data of sunbird portal user',
  placements: [
    new PluginPlacement({ name: 'content-import', priority: 1, component: ContentImportHeaderComponent }),
    new PluginPlacement({ name: 'watch-video', priority: 1, component: WatchVideoComponent }),
    new PluginPlacement({ name: 'network-status-notify', priortiy: 1, component: NetworkStatusComponent
    })
  ]
})
export class OfflinePlugins {
}
