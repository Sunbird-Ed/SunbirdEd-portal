enum PluginStatusEnum {
	unknown,
	installed,
	resolved,
	started,
	stopped,
	active,
	uninstalled
}

interface Registry {
	name: string;
	type: string;
	id: string; // unique id
	version: string; //plugin version
	repo: string;
	author?: string;
	status: PluginStatusEnum;
}

export {Registry, PluginStatusEnum}