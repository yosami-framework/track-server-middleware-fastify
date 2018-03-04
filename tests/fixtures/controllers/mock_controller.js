const TrackController = require('track-controller');

class MockController extends TrackController {
  /**
   * Definitions of model.
   */
  static definer() {
    name('mock_controller');
    views('mock');
  }
}

module.exports = MockController;
