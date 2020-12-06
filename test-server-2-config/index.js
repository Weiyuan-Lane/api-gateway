const express = require('express');
const app = express();
const port = process.env.GATEWAY_TEST_SVC_2_PORT || '8080';

const serverName = process.env.GATEWAY_TEST_SVC_2_NAME;

const config = {
  get: [
    { path: '/test-path-2' },
    { path: '/conflict-path' },
  ]
}

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