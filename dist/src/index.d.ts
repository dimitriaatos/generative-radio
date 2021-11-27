export default GenerativeRadio;
declare const GenerativeRadio: {
    new (pieces: any): {
        pieces: any;
        _playing: boolean;
        play(pieces?: boolean): any;
        player: playPieces | undefined;
        readonly playing: boolean;
        stop(): any;
        gain: any;
        token: any;
        ontrigger: any;
        debug: any;
    };
};
import playPieces from "./playPieces";
import playPiece from "./playPiece";
import playElement from "./playElement";
export { playPieces, playPiece, playElement };
