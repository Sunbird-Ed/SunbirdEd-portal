import { PluginConfig, PluginPlacement } from 'sunbird-web-extension';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ProfileBadgeComponent } from './components/profile-badge/profile-badge.component';

@PluginConfig({
  name: 'profile plugin',
  description: 'some description',
  placements: [
    new PluginPlacement({ name: 'profile-badge', priority: 5, component: ProfileBadgeComponent }),
    new PluginPlacement({ name: 'profile-badge', priority: 90, component: ProfileBadgeComponent }),
    new PluginPlacement({ name: 'main-menu-item', priority: 1, component: MenuItemComponent })
  ]
})
export class ProfilePlugin {
}
