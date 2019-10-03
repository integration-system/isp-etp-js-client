export interface Codec {
    marshal(data: any): string;
    unmarshal(data: string): any;
}
export declare class JsonCodec implements Codec {
    marshal(data: any): string;
    unmarshal(data: string): (any);
}
