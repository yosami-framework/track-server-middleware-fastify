# TrackServerMiddlewareFastify
fastify for track-server.

## Installation

### npm

```shell
npm install track-server-middleware-fastify
```

## Usage

```javascript
const Server     = require('track-server');
const Middleware = require('track-server-middleware-fastify');


Server.start(new Middleware(), routes, assets);
```
