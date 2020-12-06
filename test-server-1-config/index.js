const express = require('express');
const app = express();
const port = process.env.GATEWAY_TEST_SVC_1_PORT || '8080';

const serverName = process.env.GATEWAY_TEST_SVC_1_NAME;

const config = {
  get: [
    { path: '/test-path-1' }
  ]
}

Object.keys(config).forEach((method) => {
  config[method].forEach((pathConfig) => {
    app[method](pathConfig.path, (req, res) => {
      res.json({
        debug: {
          serverName,
          method,
          registeredPath: pathConfig.path,
          actualPath: req.path,
        }
      })
    });
  });
});

app.listen(port, () => {
  console.log(`Test app listening at port ${port}`)
});