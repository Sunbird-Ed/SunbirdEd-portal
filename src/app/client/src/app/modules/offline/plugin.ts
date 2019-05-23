import { PluginConfig, PluginPlacement } from '@project-sunbird/web-extensions';
import { ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent, DownloadManagerComponent } from './components';

@PluginConfig({
  name: 'offline-plugin',
  description: 'Shows different components of offline module',
  placements: [
    new PluginPlacement({ name: 'content-import', priority: 1, component: ContentImportHeaderComponent }),
    new PluginPlacement({ name: 'watch-video', priority: 1, component: WatchVideoComponent }),
    new PluginPlacement({ name: 'network-status-notify', priortiy: 1, component: NetworkStatusComponent
    }),
    new PluginPlacement({ name: 'download-manager', priortiy: 1, component: DownloadManagerComponent
    })
  ]
})
export class OfflinePlugins {
}
