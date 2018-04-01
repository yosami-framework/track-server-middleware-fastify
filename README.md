# TrackServerMiddlewareFastify
fastify for track-server.

[![Build Status](https://travis-ci.org/yosami-framework/track-server-middleware-fastify.svg?branch=master)](https://travis-ci.org/yosami-framework/track-server-middleware-fastify)

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
