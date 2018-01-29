export interface PluginLifeCycleEvents {
	onInit: (...args: any[]) => void;
	onInstall: (...args: any[]) => void;
	onUninstall: (...args: any[]) => void;
	onStart: (...args: any[]) => void;
	onStop: (...args: any[]) => void;
	onUpdate: (...args: any[]) => void;
	onDestroy: (...args: any[]) => void;
}