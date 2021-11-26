export default class _default {
    constructor(sound: any, elementGainNode: any, options?: {});
    fadeDuration: number | undefined;
    gain: any;
    onstarted: () => void;
    onended: () => void;
    source: any;
    fade: any;
    active: boolean;
    play(): Promise<any>;
    load(): Promise<any>;
    stop(): void;
}
