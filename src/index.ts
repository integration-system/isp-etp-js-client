export interface Options {

}

function defaultOptions(): Options {
    return {}
}

class EtpClient {
    private conn?: WebSocket;
    private codec: Codec = new JsonCodec();
    private handlers: Handlers = new HandlersImpl();
    private url: string;
    private options: Options;

    constructor(url: string, options?: Options) {
        let opts = defaultOptions();
        if (options) {
            opts = {...opts, ...options};
        }
        this.url = url;
        this.options = opts;
    }

    on(type: string, f: (data: any) => void)

}
