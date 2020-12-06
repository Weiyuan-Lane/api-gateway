## Test Gateway 
To run this locally, run the following commands in the root folder
```
docker-compose up
```

----
#### #1 - Proxy route to test server 1

Make a get request to [localhost:3000/test-path-1](localhost:3000/test-path-1)



---
## TODO:
- Add [hitch](https://github.com/varnish/hitch) as a TLS proxy
- Cleanup `gateway.ts`