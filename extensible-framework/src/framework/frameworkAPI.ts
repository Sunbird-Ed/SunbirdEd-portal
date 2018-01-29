export class FrameworkAPI {
	public static getDecorator(decoratorName: string) {
		return global.ext_framework.decorator[decoratorName];
	}
	public static getInterface(interfaceName: string) {
		return global.ext_framework.interface[interfaceName]
	}
}