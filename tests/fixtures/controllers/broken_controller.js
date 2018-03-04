const TrackController = require('track-controller');

class BrokenController extends TrackController {
  /**
   * Definitions of model.
   */
  static definer() {
    name('broken_controller');
    views('mock');
  }

  oninit() {
    throw new Error('broken')
  }
}

module.exports = BrokenController;
