export interface Roles {
  actionGroups: Array<ActionGroups>;
  id: string;
  name: string;
}
export interface ActionGroups {
  actions: Array<RoleAction>;
  id: string;
  name: string;
}
export interface RolesAndPermissions {
  actions: Array<RoleAction>;
  role: string;
  roleName: string;
}
export interface RoleAction {
  id: string;
  name: string;
  urls: Array<string>;
}
