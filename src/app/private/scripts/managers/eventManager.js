/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

/**
 * EventManger to log or capature any sunbird portal events
 */
org.sunbird.portal.eventManager = {}

/**
 * Register an event listener callback function for the events raised by the framework.
 * @param type {string} name of the event (e.g. sunbird:controller:init).
 * @param callback {function} callback function
 * @param scope {object} the scope of the callback (use this)
 * @memberof org.sunbird.portal
 */

org.sunbird.portal.eventManager.addEventListener = function (type, callback, scope) {
  EventBus.addEventListener(type, callback, scope)
}

/**
 * Fires an event to the framework, allowing other plugins who may have registered to receive the callback notification. All
 * communication between the framework and other plugins is via the events.
 * @param type {string} name of the event to fire (e.g. sunbird:controller:init)
 * @param data {object} event data to carry along with the notification
 * @param target {object} the scope of the event (use this)
 * @memberof org.sunbird.portal
 */

org.sunbird.portal.eventManager.dispatchEvent = function (type, data, target) {
  EventBus.dispatch(type, target, data)
}

/**
 * Remove an event listener to an event. Plugins should cleanup when they are removed.
 * @param type {string} name of the event registered with (e.g. sunbird:controller:init)
 * @param callback {function} remove the callback function
 * @param scope {object} the scope of the event (use this)
 * @memberof org.sunbird.portal
 */

org.sunbird.portal.eventManager.removeEventListener = function (type, callback, scope) {
  EventBus.removeEventListener(type, callback, scope)
}

/**
 * @param type {string} name of the event which is being registred
 * Returns paticular event which are being registed on element.
 * empty if the event not registed.
 * @memberof org.sunbird.portal
 */

org.sunbird.portal.eventManager.hasEventListener = function (eventName) {
  return EventBus.hasEventListener(eventName)
}

/**
 * Returns all event which are being registed on element.
 * empty if the none of the events are being registed.
 * @memberof org.sunbird.portal
 */

org.sunbird.portal.eventManager.getEvents = function () {
  return EventBus.getEvents()
}
