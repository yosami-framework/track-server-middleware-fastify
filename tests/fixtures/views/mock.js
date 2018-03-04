const m         = require('mithril');
const TrackView = require('track-view');

/**
 * Mock
 */
class MockView extends TrackView {
  /**
   * Render
   * @return {vnode} html.
   */
  render() {
    return m('html', [
      m('head', [
        m('title', 'MockTitle'),
      ]),
      m('body', [
        m('div', {class: 'hoge'}, 'MockPage'),
        m('div', {id: 'attrs'}, JSON.stringify(this.attrs)),
      ]),
    ]);
  }
}

module.exports = MockView;
