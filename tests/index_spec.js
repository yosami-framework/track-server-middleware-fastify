require('./spec_helper');
const t                            = require('track-spec');
const path                         = require('path');
const Cheerio                      = require('cheerio');
const TrackServerRenderer          = require('track-server-renderer');
const Asset                        = require('track-server-renderer/lib/asset');
const TrackServerMiddlewareFastify = require('../lib/index');
const MockController               = require('./fixtures/controllers/mock_controller');
const BrokenController             = require('./fixtures/controllers/broken_controller');

t.describe('TrackServerRenderer', () => {
  let middleware = null;

  t.beforeEach(() => {
    middleware = new TrackServerMiddlewareFastify();

    const publicDir = path.resolve(__dirname, 'fixtures');
    asset = new Asset(publicDir, 'assets/mock.js', 'assets/mock.css');

    middleware.register('/', new TrackServerRenderer(MockController, asset));
    middleware.register('/broken', new TrackServerRenderer(BrokenController, asset));
    middleware.static(asset.directory);
  });

  t.describe('GET', () => {
    const subject = (() => {
      return middleware._fastify.inject({
        method:  'get',
        url:     url,
        headers: {'X-Forwarded-Proto': 'https'},
      });
    });
    let url = null;

    t.beforeEach(() => {
      url = 'https://localhost/?hoge=fuga&foo=bar';
    });

    t.it('Return 200', () => {
      return subject().then((response) => {
        t.expect(response.statusCode).equals(200);
      });
    });

    t.it('Render html', () => {
      return subject().then((response) => {
        const dom = Cheerio.load(response.payload);
        t.expect(JSON.parse(dom('#attrs').text())).deepEquals({
          'X-SERVER-PARAMS': {hoge: 'fuga', foo: 'bar'},
          'X-SERVER-URL':    'https://localhost/?hoge=fuga&foo=bar',
          'X-SERVER-ASSETS': {
            js:  '/assets/mock.js?720e86eb7e65b9e335363d9831524168',
            css: '/assets/mock.css?d67eb08e3d122fdd4d7054dd6d25fb33',
          },
        });
      });
    });

    t.context('When url is not exists', () => {
      t.beforeEach(() => {
        url = '/not-exists.html';
      });

      t.it('Return 404', () => {
        return subject().then((response) => {
          t.expect(response.statusCode).equals(404);
        });
      });
    });

    t.context('When controller is broken', () => {
      t.beforeEach(() => {
        url = '/broken';
      });

      t.it('Return 500', () => {
        return subject().then((response) => {
          t.expect(response.statusCode).equals(500);
        });
      });
    });

    t.context('When static file', () => {
      t.beforeEach(() => {
        url = '/assets/mock.js';
      });

      t.it('Return 200', () => {
        return subject().then((response) => {
          t.expect(response.statusCode).equals(200);
        });
      });

      t.it('Deliver file', () => {
        return subject().then((response) => {
          t.expect(response.payload).equals('var hoge = \'fuga\';\n');
        });
      });
    });
  });
});
