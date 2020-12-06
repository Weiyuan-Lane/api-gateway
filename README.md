## Test Gateway 
To run this locally with the following scenarios, run the following commands in the root folder
```
docker-compose up
```

Before running the scenarios, you can also check out `node-gateway-config/config/dev.json` for the proxy server and path settings.

----
### #1 - Proxy route to a test server

This scenario shows a response from a proxy server

Make a get request to [localhost/test-path-1](http://localhost/test-path-1)

Nothing special, except that the response is from proxy server `test_server_1`

----
### #2 - Proxy route to a test server (another variant)

This scenario shows a response from a proxy server

Make a get request to [localhost/test-path-2](http://localhost/test-path-2)

Nothing special, except that the response is from proxy server `test_server_2`

----
### #3 - Wildcard proxy routes 

This scenario shows the configuration for a wildcard route to match entire resources for multiple paths to a service

Make a get request to [localhost/test-resource-1/nested-1](http://localhost/test-resource-1/nested-1)
Make a get request to [localhost/test-resource-1/nested-1/nested-2](http://localhost/test-resource-1/nested-1/nested-2)

The rendered responses are mapped from a wildcard route in `node-gateway-config/config/dev.json`, to proxy server `test_server_1`

The path is configured as `/test-resource-1/*`. Only one path config is required, even if supporting multiple routes to another service

---
### #4 - Matching specific routes with previously used resources

This scenario shows the configuration for a route to proxy server 2, whereby the previous resource routing is already used to proxy server 1.

Make a get request to [localhost/test-path-1](http://localhost/test-path-1)
Make a get request to [localhost/test-path-1/nested-at-2](http://localhost/test-path-1/nested-at-2)

The rendered responses are mapped from a wildcard route in `node-gateway-config/config/dev.json`, to proxy server `test_server_1`

The path is configured as `/test-resource-1/*`. Only one path config is required, even if supporting multiple routes to another service

----
### #5 - Conflict in path settings

This scenario shows what happen if a conflict in configuration occurs

Make a get request to [localhost/test-resource-1/nested-1](http://localhost/conflict-path)

The path `/conflict-path` is configured for both servers. Note that the later configuration in the list always take priority, as proxy server `test_server_2` is shown returning the response

----
### #6 - Making a non-get request (Post request)

This scenario shows a configured proxy-ed path that is not a get request

Make a post request to `localhost/post-path`

Nothing special, except that the response is from proxy server `test_server_1`

----
### #7 - Proxy timeout

This scenario shows what happens if the proxy server takes too long, and the gateway decides to return a timeout

Make a get request to [localhost/timeout-route](http://localhost/timeout-route)

Since the proxy path is configured to time out after waiting for 1 second, it shows the timeout error

----
### #8 - Caching at proxy

This scenario shows what happens when the proxy caches the responses when intended (public cache control headers returned)

Make a get request to [localhost/cached-route](http://localhost/cached-route)

Make sure you refresh and even hard-refresh a few times if you're using a browser. The `ts` should not change immediately.

Since the page is cached with 10 seconds and a public cache control header, the `ts` should only increase every hit to the server in 10 seconds.

---
### #9 - Caching at browser

This scenario shows what happens when the browser caches the responses when intended (private cache control headers returned)

Make a get request to [localhost/cached-route-browser](http://localhost/cached-route-browser)

Make sure you refresh a few times if you're using a browser. The `ts` should not change immediately.

Only when you hard-refresh, does the contents change.

----
### #10 - Grace-ful fallback

This scenario shows the grace mode of the gateway - since we intend for grace threshold as 1 minute (See `GATEWAY_VARNISH_GRACE_PERIOD` in `docker-compose.yml`), if an earlier entry was returned and the proxy server is unable to return a valid response, the gateway will return the stale entry for 1 minute. This setting can be adjusted if necessary.

Make a get request to [localhost/grace-mode-route](http://localhost/grace-mode-route)

Make sure you refresh and hard refresh, and note that the response returns as if it's cached (`ts` does not change), but degrades to a timeout around 1 minute later.

In the proxy server, the first hit is configured to always go through, while the rest will time out, and there are no cache-control headers in the response

As expected, the later entries that are timing out are not visible until 1 minute later. This allows the gateway to return stale entries, even when cached TTL is up, for better user experience in dire situations. 

----
### #11 - No grace-ful fallback

This scenario shows the grace mode of the gateway not triggering if not needed to trigger.

Make a get request to [localhost/grace-not-needed](http://localhost/grace-not-needed)

There are no special settings to the route behaviour here. Even after multiple refreshes, we see that the responses are not stale, as the proxy server is healthy.

----
### #12 - Post path failure (500 status)

This scenario shows the gateway returning failure responses as well

Make a post request to `http://localhost/post-error-path`

The error response from the backend is returned

----
### #13 - Get path failure (500 status)

This scenario shows the gateway returning failure responses as well

Make a get request to [localhost/get-error-path](http://localhost/get-error-path)

The error response from the backend is returned

----
### #14 - Edge side includes

This scenario covers the use of edge side includes for better caching policites

Make a get request to [localhost/esi-test](http://localhost/esi-test)

Check `extraESIProperty` to get replaced property from `/esi-nested-value`.

---
## TODO:
- Add [hitch](https://github.com/varnish/hitch) as a TLS proxy
- Refactor `gateway.ts`
