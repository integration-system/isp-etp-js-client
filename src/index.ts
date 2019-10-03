import {defaultOptions, Options} from "./options";
import {Codec} from "./codec";
import {HandlersImpl, Handlers} from "./handlers";

const bodySplitter = '||';

function encodeEvent(codec: Codec, type: string, payload: any): string {
    const data = codec.marshal(payload);
    return data + bodySplitter + data;
}

function decodeEvent(codec: Codec, data: string): { type: string, payload: any } {
    let parts = data.split(bodySplitter, 1);
    if (parts.length < 2) {
        throw "invalid message received. Splitter || expected";
    }
    const payload = codec.unmarshal(parts[1]);
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
        let data = encodeEvent(this.options.codec, type, payload);
        this.conn.send(data);
        return Promise.resolve()
    }

    connect(): EtpClient {
        const ws = new WebSocket(this.url);
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
            const event = decodeEvent(this.options.codec, message.data);
            const handler = this.handlers.get(event.type);
            if (handler) {
                handler(event.payload);
            }
        };
        this.conn = ws;
        return this;
    }

    close(): EtpClient {
        if (this.conn) {
            this.conn.close();
            this.conn = undefined;
        }
        return this;
    }

}

export default EtpClient;
