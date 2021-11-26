export default class _default {
    constructor(pieces: any, playing?: boolean);
    noRepetition: {
        waiting: any;
        reuse: any;
        possible: any[];
        discarded: any[];
        next(): any;
    };
    playing: boolean;
    pieces: any;
    piecePlayer: playPiece;
    stop(): default;
    cut(): default;
}
import playPiece from "./playPiece";
