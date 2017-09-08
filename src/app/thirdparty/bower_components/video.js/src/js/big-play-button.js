/**
 * @file big-play-button.js
 */
import Button from './button.js';
import Component from './component.js';

/**
 * The initial play button that shows before the video has played. The hiding of the
 * `BigPlayButton` get done via CSS and `Player` states.
 *
 * @extends Button
 */
class BigPlayButton extends Button {
  constructor(player, options) {
    super(player, options);

    this.mouseused_ = false;

    this.on('mousedown', this.handleMouseDown);
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object. Always returns 'vjs-big-play-button'.
   */
  buildCSSClass() {
    return 'vjs-big-play-button';
  }

  /**
   * This gets called when a `BigPlayButton` "clicked". See {@link ClickableComponent}
   * for more detailed information on what a click can be.
   *
   * @param {EventTarget~Event} event
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   */
  handleClick(event) {
    const playPromise = this.player_.play();

    // exit early if clicked via the mouse
    if (this.mouseused_ && event.clientX && event.clientY) {
      return;
    }

    const cb = this.player_.getChild('controlBar');
    const playToggle = cb && cb.getChild('playToggle');

    if (!playToggle) {
      this.player_.focus();
      return;
    }

    const playFocus = () => playToggle.focus();

    if (playPromise && playPromise.then) {
      const ignoreRejectedPlayPromise = () => {};

      playPromise.then(playFocus, ignoreRejectedPlayPromise);
    } else {
      this.setTimeout(playFocus, 1);
    }
  }

  handleKeyPress(event) {
    this.mouseused_ = false;

    super.handleKeyPress(event);
  }

  handleMouseDown(event) {
    this.mouseused_ = true;
  }
}

/**
 * The text that should display over the `BigPlayButton`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 */
BigPlayButton.prototype.controlText_ = 'Play Video';

Component.registerComponent('BigPlayButton', BigPlayButton);
export default BigPlayButton;
