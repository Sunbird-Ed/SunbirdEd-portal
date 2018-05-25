import { PluginConfig, PluginPlacement } from 'sunbird-web-extension';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ProfileBadgeComponent } from './components/profile-badge/profile-badge.component';

@PluginConfig({
  name: 'profile plugin',
  description: 'Shows user profile data of sunbird portal user',
  placements: [
    new PluginPlacement({ name: 'profile-widget', priority: 1, component: ProfileBadgeComponent }),
    new PluginPlacement({ name: 'header-menu-item', priority: 1, component: MenuItemComponent })
  ]
})
export class ProfilePlugin {
}
