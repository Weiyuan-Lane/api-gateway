import express from 'express';
import HttpProxy from 'http-proxy';
import initMiddlewareList from '@modules';
import readConfigData from '@utils/read-config-data';
import { isDevelopment } from '@utils/environment';
import { 
  ProxyServerSettings,
  ProxyPathSettings,
} from '@utils/types/proxy-settings';
import { 
  BeforeMiddleware,
} from '@utils/types/middleware';

const PORT: string = process.env.GATEWAY_NODE_PORT || '8080';
const HEALTHCHECK_PATH: string = process.env.GATEWAY_HEALTHCHECK_PATH || '/x-gateway-healthcheck';
const CONFIG_FILE_PATH: string = process.env.GATEWAY_NODE_CONFIG_FILE_PATH as string;

// Initialization
const configData = readConfigData(CONFIG_FILE_PATH);
const app: express.Application = express();
app.disable('etag');

// Get middleware and register
const beforeMiddlewareList: Array<BeforeMiddleware> = initMiddlewareList(configData);
if (beforeMiddlewareList.length > 0) {
  app.use(...beforeMiddlewareList);
}

const proxyServerSettingsList = configData['servers'] as Array<ProxyServerSettings>;
const proxyPathSettingsList = configData['paths'] as Array<ProxyPathSettings>;
const proxyServerMap: Map<string, HttpProxy> = new Map();

proxyServerSettingsList.reverse().forEach((settings: ProxyServerSettings): void => {
  const { serviceName, host, port } = settings;
  const proxy = HttpProxy.createProxyServer({
    target: {
      host,
      port,
    },
  });
  // For logging error once decided on what to do so
  // proxy.on('error', function(e) {
  //
  // });
  proxyServerMap.set(serviceName, proxy);
});

proxyPathSettingsList.reverse().forEach((settings: ProxyPathSettings): void => {
  const { 
    serviceName, 
    path, 
    methods,
    timeout,
  } = settings;

  // If the serviceName doesn't exist, it is abnormal to register it as a proxy
  // Raise error to notify of possible route mismatch
  if (!proxyServerMap.has(serviceName)) {
    throw new Error(`Service Name ${serviceName} does not exist in proxyServerMap`);
  }

  const proxy: HttpProxy = proxyServerMap.get(serviceName) as HttpProxy;

  methods.forEach((method: string) => {
    app[method](path, (req: express.Request, res: express.Response): void => {
      proxy.web(req, res, {
        proxyTimeout: timeout || undefined,
      }, (e: Error) => {
        if (e && e.message === 'socket hang up') {
          res.status(504).json({ error: 'Gateway timeout' });
        }
      });
    })
  });
});

app.get(HEALTHCHECK_PATH, (_: express.Request, res: express.Response): void => {
  res.json({});
})

// Fallback for all 404 routes
app.get('*', (_: express.Request, res: express.Response): void => {
  res.status(404).json({
    error: 'gateway does not have this path mapping'
  });
});

app.listen(PORT, () => {
  if (isDevelopment()) {
    console.log(`Gateway is listening at port ${PORT}`);
  }
});
