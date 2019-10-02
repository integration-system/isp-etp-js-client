interface Handlers {
    subs: { [type: string]: (data: any) => void };

    on(type: string, f: (data: any) => void): void

    off(type: string): void

    get(type: string): ((data: any) => void) | null
}

class HandlersImpl implements Handlers {
    subs: { [p: string]: (data: any) => void } = {};

    get(type: string): ((data: any) => void) | null {
        const h = this.subs[type];
        return h ? h : null
    }

    off(type: string): void {
        delete this.subs[type]
    }

    on(type: string, f: (data: any) => void): void {
        this.subs[type] = f
    }
}
