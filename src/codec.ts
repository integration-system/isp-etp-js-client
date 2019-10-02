interface Codec {
    marshal(data: any): string,

    unmarshal(data: string): any
}

class JsonCodec implements Codec {
    marshal(data: any): string {
        return JSON.stringify(data)
    }

    unmarshal(data: string): any {
        return JSON.parse(data)
    }
}
