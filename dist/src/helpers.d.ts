export const Fade: {
    new (context: any, gainNode: any, duration: any): {
        fadeIn(timestamp?: number): void;
        fadeOut(timestamp?: number): void;
        fadeTo(timestamp: number | undefined, target: any): void;
    };
};
export function safeChain(string: any, obj: any): any;
export function asyncPipe(...fns: any[]): (arg: any) => any;
export const NoRepetition: {
    new (max: any, waiting: any, reuse: any): {
        waiting: any;
        reuse: any;
        possible: any[];
        discarded: any[];
        next(): any;
    };
};
export function deepMerge(target: any, ...sources: any[]): any;
export function loadBuffer(url: any, context: any): Promise<any>;
export function deepClone(obj: any): any;
export function ms2sec(t: any): number;
export function sec2ms(t: any): number;
