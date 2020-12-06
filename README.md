## Test Gateway 
To run this locally with the following scenarios, run the following commands in the root folder
```
docker-compose up
```

Before running the scenarios, you can also check out `node-gateway-config/config/dev.json` for the proxy server and path settings.

----
### #1 - Proxy route to a test server

Make a get request to [localhost/test-path-1](http://localhost/test-path-1)

Nothing special, except that the response is from proxy server `test_server_1`

----
### #2 - Proxy route to a test server (another variant)

Make a get request to [localhost/test-path-2](http://localhost/test-path-2)

Nothing special, except that the response is from proxy server `test_server_2`

----
### #3 - Wildcard proxy routes 

Make a get request to [localhost/test-resource-1/nested-1](http://localhost/test-resource-1/nested-1)
Make a get request to [localhost/test-resource-1/nested-1/nested-2](http://localhost/test-resource-1/nested-1/nested-2)

The rendered responses are mapped from a wildcard route in `node-gateway-config/config/dev.json`, to proxy server `test_server_1`

The path is configured as `/test-resource-1/*`. Only one path config is required, even if supporting multiple routes to another service

----

### #4 - Conflict in path settings

Make a get request to [localhost/test-resource-1/nested-1](http://localhost/conflict-path)

The path `/conflict-path` is configured for both servers. Note that the later configuration in the list always take priority, as proxy server `test_server_2` shown returning the response

----

### #5 - Making a non-get request (Post request)

Make a post request to `localhost/post-path`

Nothing special, except that the response is from proxy server `test_server_1`

---
## TODO:
- Add [hitch](https://github.com/varnish/hitch) as a TLS proxy
- Refactor `gateway.ts`
