export interface Handlers {
    subs: {
        [type: string]: (data: any) => void;
    };
    on(type: string, f: (data: any) => void): void;
    off(type: string): void;
    get(type: string): ((data: any) => void) | null;
}
export declare class HandlersImpl implements Handlers {
    subs: {
        [p: string]: (data: any) => void;
    };
    get(type: string): ((data: any) => void) | null;
    off(type: string): void;
    on(type: string, f: (data: any) => void): void;
}
