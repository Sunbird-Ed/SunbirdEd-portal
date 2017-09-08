/**
 * @file text-track-cue-list.js
 */
import * as browser from '../utils/browser.js';
import document from 'global/document';

/**
 * @typedef {Object} TextTrackCue
 *
 * @property {string} id
 *           The unique id for this text track cue
 *
 * @property {number} startTime
 *           The start time for this text track cue
 *
 * @property {number} endTime
 *           The end time for this text track cue
 *
 * @property {boolean} pauseOnExit
 *           Pause when the end time is reached if true.
 *
 * @see [Spec]{@link https://html.spec.whatwg.org/multipage/embedded-content.html#texttrackcue}
 */

/**
 * A List of TextTrackCues.
 *
 * @see [Spec]{@link https://html.spec.whatwg.org/multipage/embedded-content.html#texttrackcuelist}
 */
class TextTrackCueList {

  /**
   * Create an instance of this class..
   *
   * @param {Array} cues
   *        A list of cues to be initialized with
   */
  constructor(cues) {
    let list = this; // eslint-disable-line

    if (browser.IS_IE8) {
      list = document.createElement('custom');

      for (const prop in TextTrackCueList.prototype) {
        if (prop !== 'constructor') {
          list[prop] = TextTrackCueList.prototype[prop];
        }
      }
    }

    TextTrackCueList.prototype.setCues_.call(list, cues);

    /**
     * @member {number} length
     *         The current number of `TextTrackCue`s in the TextTrackCueList.
     */
    Object.defineProperty(list, 'length', {
      get() {
        return this.length_;
      }
    });

    if (browser.IS_IE8) {
      return list;
    }
  }

  /**
   * A setter for cues in this list. Creates getters
   * an an index for the cues.
   *
   * @param {Array} cues
   *        An array of cues to set
   *
   * @private
   */
  setCues_(cues) {
    const oldLength = this.length || 0;
    let i = 0;
    const l = cues.length;

    this.cues_ = cues;
    this.length_ = cues.length;

    const defineProp = function(index) {
      if (!('' + index in this)) {
        Object.defineProperty(this, '' + index, {
          get() {
            return this.cues_[index];
          }
        });
      }
    };

    if (oldLength < l) {
      i = oldLength;

      for (; i < l; i++) {
        defineProp.call(this, i);
      }
    }
  }

  /**
   * Get a `TextTrackCue` that is currently in the `TextTrackCueList` by id.
   *
   * @param {string} id
   *        The id of the cue that should be searched for.
   *
   * @return {TextTrackCue|null}
   *         A single cue or null if none was found.
   */
  getCueById(id) {
    let result = null;

    for (let i = 0, l = this.length; i < l; i++) {
      const cue = this[i];

      if (cue.id === id) {
        result = cue;
        break;
      }
    }

    return result;
  }
}

export default TextTrackCueList;
