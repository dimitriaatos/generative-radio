"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const globals_1 = require("./globals");
const playPiece_1 = __importDefault(require("./playPiece"));
class default_1 {
    constructor(pieces, playing = true) {
        this.noRepetition = new helpers_1.NoRepetition(pieces.length, 1, 1);
        this.piecePlayer;
        this.playing = playing;
        this.pieces = pieces;
        const sequence = () => {
            new Promise((resolve) => {
                globals_1.state.debug && console.log('	sequence pieces', this.playing);
                const index = this.noRepetition.next();
                this.piecePlayer = new playPiece_1.default(this.pieces[index]);
                this.piecePlayer.onended = (response) => {
                    this.pieces[index] = response;
                    resolve(resolve);
                };
                this.piecePlayer.play();
            }).then(() => { this.playing && sequence(); });
        };
        sequence();
    }
    stop() {
        globals_1.state.debug && console.log('	pieces stop');
        this.piecePlayer.stop();
        this.playing = false;
    }
    cut() {
        globals_1.state.debug && console.log('	pieces cut');
        this.piecePlayer.cut();
        this.playing = false;
    }
}
exports.default = default_1;
//# sourceMappingURL=playPieces.js.map