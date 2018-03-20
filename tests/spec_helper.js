const CacheBase   = require('track-server-renderer/lib/cache_base');
const Config      = require('track-server-renderer/lib/config');
const TrackConfig = require('track-config');

Config.configure((c) => {
  c.browserMock = require('mithril/test-utils/browserMock');
  c.cache = new CacheBase();
});

TrackConfig.configure((c) => {
  c.loader = ((module) => require(`./fixtures/${module}`));
});
