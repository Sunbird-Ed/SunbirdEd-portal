/**
 * @file track.js
 */
import * as browser from '../utils/browser.js';
import document from 'global/document';
import * as Guid from '../utils/guid.js';
import EventTarget from '../event-target';

/**
 * A Track class that contains all of the common functionality for {@link AudioTrack},
 * {@link VideoTrack}, and {@link TextTrack}.
 *
 * > Note: This class should not be used directly
 *
 * @see {@link https://html.spec.whatwg.org/multipage/embedded-content.html}
 * @extends EventTarget
 * @abstract
 */
class Track extends EventTarget {

  /**
   * Create an instance of this class.
   *
   * @param {Object} [options={}]
   *        Object of option names and values
   *
   * @param {string} [options.kind='']
   *        A valid kind for the track type you are creating.
   *
   * @param {string} [options.id='vjs_track_' + Guid.newGUID()]
   *        A unique id for this AudioTrack.
   *
   * @param {string} [options.label='']
   *        The menu label for this track.
   *
   * @param {string} [options.language='']
   *        A valid two character language code.
   *
   * @abstract
   */
  constructor(options = {}) {
    super();

    let track = this; // eslint-disable-line

    if (browser.IS_IE8) {
      track = document.createElement('custom');
      for (const prop in Track.prototype) {
        if (prop !== 'constructor') {
          track[prop] = Track.prototype[prop];
        }
      }
    }

    const trackProps = {
      id: options.id || 'vjs_track_' + Guid.newGUID(),
      kind: options.kind || '',
      label: options.label || '',
      language: options.language || ''
    };

    /**
     * @member {string} id
     *         The id of this track. Cannot be changed after creation.
     *
     * @readonly
     */

    /**
     * @member {string} kind
     *         The kind of track that this is. Cannot be changed after creation.
     *
     * @readonly
     */

    /**
     * @member {string} label
     *         The label of this track. Cannot be changed after creation.
     *
     * @readonly
     */

    /**
     * @member {string} language
     *         The two letter language code for this track. Cannot be changed after
     *         creation.
     *
     * @readonly
     */

    for (const key in trackProps) {
      Object.defineProperty(track, key, {
        get() {
          return trackProps[key];
        },
        set() {}
      });
    }

    return track;
  }
}

export default Track;
