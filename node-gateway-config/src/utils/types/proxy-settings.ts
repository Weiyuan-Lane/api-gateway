type ProxyServerSettings = {
  serviceName: string,
  host: string,
  port: number,
};

// Based on https://github.com/jshttp/methods/blob/v1.1.2/index.js
enum ProxyPathMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Head = 'head',
  Delete = 'delete',
  Options = 'options',
  Trace = 'trace',
  Copy = 'copy',
  Lock = 'lock',
  Mkcol = 'mkcol',
  Move = 'move',
  Purge = 'purge',
  Propfind = 'propfind',
  Proppatch = 'proppatch',
  Unlock = 'unlock',
  Report = 'report',
  Mkactivity = 'mkactivity',
  Checkout = 'checkout',
  Merge = 'merge',
  MSearch = 'm-search',
  Notify = 'notify',
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
  Patch = 'patch',
  Search = 'search',
  Connect = 'connect'
}

type ProxyPathSettings = {
  serviceName: string,
  path: string,
  methods: Array<ProxyPathMethod>,
};

export {
  ProxyServerSettings,
  ProxyPathSettings,
  ProxyPathMethod,
};
