import { Options } from "./options";
declare class EtpClient {
    private conn?;
    private readonly handlers;
    private readonly url;
    private readonly options;
    private onConn;
    private onDis;
    private onErr;
    constructor(url: string, options?: Options);
    onConnect(f: () => void): EtpClient;
    onDisconnect(f: (event: CloseEvent) => void): EtpClient;
    onError(f: (e: any) => void): EtpClient;
    on<T>(type: string, f: (data: T) => void): EtpClient;
    off(type: string): EtpClient;
    emit(type: string, payload: any, ackTimeoutMs?: number): Promise<any>;
    connect(): EtpClient;
    close(code?: number, reason?: string): EtpClient;
}
export default EtpClient;
