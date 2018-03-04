const fastify        = require('fastify');
const fastifyStatic  = require('fastify-static');
const path           = require('path');
const MiddlewareBase = require('track-server/lib/middleware_base');
const TrackRequest   = require('track-server-renderer/lib/request');

/**
 * Fastify middleware.
 */
class TrackServerMiddlewareFastify extends MiddlewareBase {
  /**
   * Initialize.
   */
  constructor() {
    super();
    this._fastify = fastify();
  }

  /**
   * Listen.
   * @override
   * @param {string}  bind Binding address.
   * @param {integer} port Port of server.
   * @return {promise} ready listener promise.
   */
  listen(bind, port) {
    return new Promise((resolve, reject) => {
      this._fastify.listen(port, bind, function(error) {
        if (error) {
          reject(error);
        } else {
          console.log(`[fastify] Running on ${bind}:${port}`);
          resolve();
        }
      });
    });
  }

  /**
   * Register route.
   * @override
   * @param {string}              path     Path.
   * @param {TrackServerRenderer} renderer Renderer.
   */
  register(path, renderer) {
    this._fastify.get(path, (request, result) => {
      result.type('text/html; charset=utf-8');

      renderer.render(this._toTrackRequest(request))
              .then(result.send.bind(result))
              .catch((error) => this._handleError(error, result));
    });
  }

  /**
   * Set static directory
   * @override
   * @param {string} root Path.
   */
  static(root) {
    // @note Deliver only `${path}/assets`
    // @see  fastify issue#539
    const assetPath = path.resolve(root, 'assets');

    this._fastify.register(fastifyStatic, {
      root:   assetPath,
      prefix: '/assets',
    });

    console.log(`[fastify] Serve static files: ${assetPath}`);
  }

  /**
   * Get TrackRequest.
   * @param {TrackRequest} request fastify request.
   * @return {TrackRequest} request
   */
  _toTrackRequest(request) {
    const host = request.headers.host.split(':');
    const url  = [
      request.headers['x-forwarded-proto'] || 'http',
      '://',
      (host[1] == 80 || host[1] == 443) ? host[0] : request.headers.host,
      request.req.url,
    ].join('');

    const params = Object.assign(
      Object.assign({}, request.params), request.query
    );

    return new TrackRequest(url, params);
  }

  /**
   * Handle error.
   * @param {Error}  error  error.
   * @param {Result} result result.
   */
  _handleError(error, result) {
    const code = error.code || 500;

    if (code == 500) {
      console.error(`ERROR [${new Date()}]: ${code},${error.message}`, error);
    }

    result.type('text');
    result.code(code).send(`${code} Error`);
  }
}

module.exports = TrackServerMiddlewareFastify;
