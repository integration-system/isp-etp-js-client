import { Codec } from './codec';
export interface Options {
    codec: Codec;
    params: object;
}
export declare function defaultOptions(): Options;
