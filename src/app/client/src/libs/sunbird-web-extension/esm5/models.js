/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} config
 * @return {?}
 */
export function PluginConfig(config) {
    return function (type) {
        type._pluginConfig = config;
    };
}
var PluginPlacement = /** @class */ (function () {
    function PluginPlacement(options) {
        this.name = options.name;
        this.priority = options.priority;
        this.component = options.component;
    }
    return PluginPlacement;
}());
export { PluginPlacement };
function PluginPlacement_tsickle_Closure_declarations() {
    /** @type {?} */
    PluginPlacement.prototype.name;
    /** @type {?} */
    PluginPlacement.prototype.priority;
    /** @type {?} */
    PluginPlacement.prototype.component;
}
var PluginData = /** @class */ (function () {
    function PluginData(plugin, placement) {
        this.plugin = plugin;
        this.placement = placement;
    }
    return PluginData;
}());
export { PluginData };
function PluginData_tsickle_Closure_declarations() {
    /** @type {?} */
    PluginData.prototype.plugin;
    /** @type {?} */
    PluginData.prototype.placement;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uLyIsInNvdXJjZXMiOlsibW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsTUFBTSx1QkFBdUIsTUFBTTtJQUNqQyxNQUFNLENBQUMsVUFBUyxJQUFJO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0tBQzdCLENBQUM7Q0FDSDtBQUVELElBQUE7SUFJRSx5QkFBWSxPQUFPO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0tBQ3BDOzBCQWRIO0lBZUMsQ0FBQTtBQVRELDJCQVNDOzs7Ozs7Ozs7QUFFRCxJQUFBO0lBR0Usb0JBQVksTUFBTSxFQUFFLFNBQVM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDNUI7cUJBdkJIO0lBd0JDLENBQUE7QUFQRCxzQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBQbHVnaW5Db25maWcoY29uZmlnKSB7XG4gIHJldHVybiBmdW5jdGlvbih0eXBlKSB7XG4gICAgdHlwZS5fcGx1Z2luQ29uZmlnID0gY29uZmlnO1xuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgUGx1Z2luUGxhY2VtZW50IHtcbiAgcHVibGljIG5hbWU7XG4gIHB1YmxpYyBwcmlvcml0eTtcbiAgcHVibGljIGNvbXBvbmVudDtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IG9wdGlvbnMuY29tcG9uZW50O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5EYXRhIHtcbiAgcHVibGljIHBsdWdpbjtcbiAgcHVibGljIHBsYWNlbWVudDtcbiAgY29uc3RydWN0b3IocGx1Z2luLCBwbGFjZW1lbnQpIHtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB0aGlzLnBsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgfVxufVxuIl19