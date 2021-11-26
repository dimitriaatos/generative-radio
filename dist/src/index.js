"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playElement = exports.playPiece = exports.playPieces = void 0;
const globals_1 = require("./globals");
const playElement_1 = __importDefault(require("./playElement"));
exports.playElement = playElement_1.default;
const playPieces_1 = __importDefault(require("./playPieces"));
exports.playPieces = playPieces_1.default;
const playPiece_1 = __importDefault(require("./playPiece"));
exports.playPiece = playPiece_1.default;
const GenerativeRadio = class {
    constructor(pieces) {
        (0, globals_1.initState)();
        this.pieces = pieces.pieces;
        this._playing = false;
    }
    play(pieces) {
        globals_1.state.debug && console.log('generative play');
        this.pieces = pieces || this.pieces;
        if (!this._playing) {
            this.player = new playPieces_1.default(this.pieces);
            this._playing = true;
        }
        return this;
    }
    get playing() {
        return this._playing;
    }
    stop() {
        globals_1.state.debug && console.log('generative stop');
        this.player && this.player.cut();
        this._playing = false;
        return this;
    }
    set gain(newGain) {
        globals_1.state.gainNode.gain.value = newGain;
    }
    set token(newToken) {
        globals_1.state.freesound.setToken(newToken);
    }
    set ontrigger(callback) {
        globals_1.state.ontrigger = callback;
    }
    set debug(val) {
        globals_1.state.debug = val;
    }
};
exports.default = GenerativeRadio;
//# sourceMappingURL=index.js.map