import {Codec, JsonCodec} from './codec'

export interface Options {
    codec: Codec;
    params: object;
}

export function defaultOptions(): Options {
    return {
        codec: new JsonCodec(),
        params: {},
    }
}
