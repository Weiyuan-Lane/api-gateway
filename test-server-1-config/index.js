const express = require('express');
const app = express();
const port = process.env.GATEWAY_TEST_SVC_1_PORT || '8080';

const serverName = process.env.GATEWAY_TEST_SVC_1_NAME;

const config = {
  get: [
    { path: '/test-path-1' },
    { path: '/conflict-path' },
    { path: '/test-resource-1/nested-1' },
    { path: '/test-resource-1/nested-1/nested-2' },
    { path: '/timeout-route', timeout: 1000000, tries: 0 },
    { path: '/cached-route', cacheControlHeader: 'public, max-age=10' },
    { path: '/cached-route-browser', cacheControlHeader: 'private, max-age=10' },
    { path: '/cached-route-1', cacheControlHeader: 'public' },
    { path: '/cached-route-2', cacheControlHeader: 'public, max-age=0' },
    { path: '/grace-mode-route', timeout: 100000, tries: 1, cacheControlHeader: 'public, max-age=1' },
    { path: '/grace-not-needed', cacheControlHeader: 'public, max-age=1' },
    { path: '/post-path', cacheControlHeader: 'public, max-age=1000', timeout: 700, tries: 0 }
  ],
  post: [
    { path: '/post-path', timeout: 700, tries: 0 }
  ]
}

app.disable('etag');

app.post('/post-error-path', (req, res) => {
  res.status(500).json({
    debug: {
      serverName,
      method: 'post',
      registeredPath: '/post-error-path',
      actualPath: req.path,
      ts: (new Date()).toLocaleString(),
    }
  });
});

app.get('/get-error-path', (req, res) => {
  res.status(500).json({
    debug: {
      serverName,
      method: 'get',
      registeredPath: '/get-error-path',
      actualPath: req.path,
      ts: (new Date()).toLocaleString(),
    }
  });
});

app.get('/esi-test', (req, res) => {
  res.setHeader('Surrogate-Control', 'ESI/1.0');
  res.setHeader('content-type', 'application/json');
  res.send(`{\
    "debug": {\
      "serverName": "${serverName}",\
      "method": "get",\
      "registeredPath": "/get-error-path",\
      "actualPath": "${req.path}",\
      "ts": "${(new Date()).toLocaleString()}",\
      "extraESIProperty": "<esi:include src="/esi-nested-value"/>"\
    }\
  }`);
});

app.get('/esi-nested-value', (req, res) => {
  res.send('super-secret-stuff-from-another-route');
});

Object.keys(config).forEach((method) => {
  config[method].forEach((pathConfig) => {
    app[method](pathConfig.path, (req, res) => {
      if (typeof pathConfig.callCount !== 'number') {
        pathConfig.callCount = 0;
      }

      const response = {
        debug: {
          serverName,
          method,
          registeredPath: pathConfig.path,
          actualPath: req.path,
          ts: (new Date()).toLocaleString(),
        }
      };

      if (pathConfig.cacheControlHeader) {
        res.set('Cache-control', pathConfig.cacheControlHeader);
      }

      if (pathConfig.timeout && pathConfig.callCount >= pathConfig.tries){
        setTimeout(() => {
          res.json(response);
        }, pathConfig.timeout);
      } else {
        res.json(response);
      }

      pathConfig.callCount += 1;
    });
  });
});

app.listen(port, () => {
  console.log(`Test app listening at port ${port}`)
});