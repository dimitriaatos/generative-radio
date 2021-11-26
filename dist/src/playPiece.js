"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const globals_1 = require("./globals");
const loadingFunctions_1 = require("./loadingFunctions");
const delay_1 = __importDefault(require("delay"));
const smoothfade_1 = __importDefault(require("smoothfade"));
const playElement_1 = __importDefault(require("./playElement"));
class default_1 {
    constructor(piece) {
        globals_1.state.context.status != 'running' && globals_1.state.context.resume();
        this.gain = globals_1.state.context.createGain();
        this.gain.gain.setValueAtTime(0, globals_1.state.context.currentTime);
        this.gain.connect(globals_1.state.gainNode);
        this.playing = true;
        this.piece = piece;
        this.elementPlayers = [];
        this.onended = () => { };
        this.fade = (0, smoothfade_1.default)(globals_1.state.context, this.gain, { startValue: 0.001, fadeLength: this.piece.fade });
    }
    async play() {
        globals_1.state.debug && console.log('		loading piece...');
        globals_1.state.debug && console.log(`		${this.piece.elements.map((element) => (0, helpers_1.safeChain)('search.text', element) || (0, helpers_1.safeChain)('search.sound', element)).join(', ')}`);
        this.piece = await (0, loadingFunctions_1.loadPiece)(this.piece);
        globals_1.state.debug && console.log('		piece loaded!');
        if (this.playing) {
            this.elementPlayers = this.piece.elements.map((element) => new playElement_1.default(element, this.gain));
            await Promise.any(this.elementPlayers.map((e) => e.play()));
            this.fade.fadeIn({ targetValue: 1 });
            this.stop((0, helpers_1.sec2ms)(globals_1.state.context.currentTime + this.piece.duration));
        }
    }
    async stop(timestamp) {
        this.fade.fadeOut({ targetValue: 0.001, startTime: timestamp });
        await (0, delay_1.default)((0, helpers_1.sec2ms)(this.piece.duration + 2 * this.piece.fade));
        globals_1.state.debug && console.log('		piece stop');
        this.playing = false;
        this.elementPlayers.forEach((player) => player.stop());
        this.elementPlayers = [];
        this.onended(this.piece);
    }
    cut() {
        globals_1.state.debug && console.log('		piece cut');
        this.playing = false;
        this.elementPlayers.forEach((player) => player.cut());
        this.onended(this.piece);
    }
}
exports.default = default_1;
//# sourceMappingURL=playPiece.js.map