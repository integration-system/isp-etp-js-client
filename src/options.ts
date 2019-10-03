import {Codec, JsonCodec} from './codec'

export interface Options {
    codec: Codec;
}

export function defaultOptions(): Options {
    return {
        codec: new JsonCodec()
    }
}
