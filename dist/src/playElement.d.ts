export default class _default {
    constructor(element: any, pieceGainNode: any, options?: {});
    onstarted: () => void;
    started: boolean;
    playing: boolean;
    _makePlayer(index: any, mono: any, metro: any): playSound;
    play(): Promise<any>;
    player: playSound | undefined;
    nextPlayer: playSound | undefined;
    newPlayerLoad: Promise<any> | undefined;
    metro: NodeJS.Timer | undefined;
    load(): Promise<any>;
    element: any;
    stop(): default;
    cut(): default;
}
import playSound from "./playSound";
