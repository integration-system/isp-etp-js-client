# isp-etp-js-client
* Simple event transport protocol client for Java Script for [server](https://github.com/integration-system/isp-etp-go). 
* Design API inspired by [socket.io](https://socket.io/docs/client-api/#IO).
* event payload marshaling/unmarshaling to/from `json`

## Install
```bash
yarn insatll isp-etp-js-client
```

## Example
```javascript
import ws from "isp-etp-js-client";

const cli = ws("ws://127.0.0.1:7777/isp-etp/", {
        params: {
            token: token, //will add to GET params in initial request
        }
    });
cli.onConnect(() => { //call every time when connection successfully established
    console.log("connected");
    socket.emit("some_event", {"some_payload": "yep"}); //c
});
cli.onError(err => {  //call every time when error occurred while connecting or data deserializing
    console.error(err);
});
cli.onDisconnect(evt => { //call every time when connection could not established or closed
    if (!evt.wasClean) { //indicate that connection was closed by client or server
        console.error(evt);
    }
    setTimeout(() => socket.connect(), 1000); //for automatically reconnection just call connect() once again
});
cli.on('test_event', payload => { //subscribe to any custom events
    console.log("test_event", payload);
});
cli.connect();


cli.close() //call to close connection, you can provides two params: code: number, reason: string
```

## Note
* `v1` of client not compatible with `v2` server
* `v2` js client currently not support emitWithAck/onWithAck
