import {defaultOptions, Options} from "./options";
import {Codec, JsonCodec} from "./codec";
import {HandlersImpl, Handlers} from "./handlers";

const bodySplitter = '||';

function encodeGetParams(params: object): string {
    return Object.entries(params).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
}

function encodeEvent(codec: Codec, type: string, payload: any): string {
    let data = "";
    if (payload) {
        data = codec.marshal(payload);
    }
    return `${type}${bodySplitter}0${bodySplitter}${data}`;
}

function split(value: string, bodySplitter: string, limit: number) : string[] {
    let res = []
    let prevIndex = 0
    for (let i = 1; i < limit+1; i++) {
        let currIndex = value.indexOf(bodySplitter, prevIndex)
        res.push(value.substring(prevIndex, i != limit ? currIndex : value.length))
        prevIndex = currIndex+2
    }

    return res
}

function decodeEvent(codec: Codec, data: string): { type: string, payload?: any } {
    let parts = split(data, bodySplitter, 3);
    if (parts.length < 3) {
        throw "invalid message received. Splitter || expected";
    }
    let payload = undefined;
    if (parts[2]) {
        payload = codec.unmarshal(parts[2]);
    }
    return {
        type: parts[0], payload: payload,
    }
}

class EtpClient {
    private conn?: WebSocket;
    private readonly handlers: Handlers = new HandlersImpl();
    private readonly url: string;
    private readonly options: Options;
    private onConn: () => void = () => {
    };
    private onDis: (evt: CloseEvent) => void = evt => {
    };
    private onErr: (err: any) => void = err => {
    };

    constructor(url: string, options?: Options) {
        let opts = defaultOptions();
        if (options) {
            opts = {...opts, ...options};
        }
        this.url = url;
        this.options = opts;
    }

    onConnect(f: () => void): EtpClient {
        this.onConn = f;
        return this;
    }

    onDisconnect(f: (event: CloseEvent) => void): EtpClient {
        this.onDis = f;
        return this;
    }

    onError(f: (e: any) => void): EtpClient {
        this.onErr = f;
        return this;
    }

    on<T>(type: string, f: (data: T) => void): EtpClient {
        this.handlers.on(type, f);
        return this;
    }

    off(type: string): EtpClient {
        this.handlers.off(type);
        return this;
    }

    emit(type: string, payload: any, ackTimeoutMs?: number): Promise<any> {
        if (!this.conn || this.conn.readyState !== this.conn.OPEN) {
            return Promise.reject("connection not initialized")
        }
        let data = encodeEvent(this.options.codec || new JsonCodec(), type, payload);
        this.conn.send(data);
        return Promise.resolve()
    }

    connect(): EtpClient {
        let url = this.url;
        if (this.options.params && Object.keys(this.options.params).length > 0) {
            url = url + "?" + encodeGetParams(this.options.params);
        }
        const ws = new WebSocket(url);
        ws.onopen = () => {
            this.onConn();
        };
        ws.onclose = (evt: CloseEvent) => {
            this.onDis(evt);
        };
        ws.onerror = err => {
            this.onErr(err);
        };
        ws.onmessage = message => {
            try {
                const event = decodeEvent(this.options.codec || new JsonCodec(), message.data);
                const handler = this.handlers.get(event.type);
                if (handler) {
                    handler(event.payload);
                }
            } catch (e) {
                this.onErr(e);
            }
        };
        this.conn = ws;
        return this;
    }

    close(code?: number, reason?: string): EtpClient {
        if (this.conn) {
            this.conn.close(code, reason);
            this.conn = undefined;
        }
        return this;
    }

}

export default EtpClient;
