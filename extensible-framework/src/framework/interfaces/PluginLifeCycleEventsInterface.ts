export interface PluginLifeCycleEvents {
	onInstall: (...args: any[]) => void;
	onStart: (...args: any[]) => void;
	onStop: (...args: any[]) => void;
}