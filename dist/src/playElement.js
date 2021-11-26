"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const globals_1 = require("./globals");
const loadingFunctions_1 = require("./loadingFunctions");
const delay_1 = __importDefault(require("delay"));
const playSound_1 = __importDefault(require("./playSound"));
class default_1 {
    constructor(element, pieceGainNode, options = {}) {
        //loadPiece will resolve immediately if the piece is loaded.
        this.onstarted = () => { };
        options = { autoplay: false, ...options };
        Object.assign(this, options, { element, pieceGainNode });
        this.metro;
        this.autoplay && this.play();
        this.started = false;
        this.playing = false;
        this.player;
        this.nextPlayer;
        this.newPlayerLoad;
    }
    _makePlayer(index, mono, metro) {
        const sound = this.element.sounds[index];
        const fadeOptions = {};
        const maxDuration = mono && metro ?
            Math.min(metro, sound.duration) :
            (Math.min((0, helpers_1.safeChain)('element.search.options.filter.duration.1', this), sound.duration) || sound.duration);
        const clippedFadePrec = Math.min(this.element.structure.fade || 0, 0.5);
        if (mono && metro) {
            fadeOptions.fadeDuration = clippedFadePrec * metro;
        }
        else {
            fadeOptions.fadeDurationPrec = clippedFadePrec;
        }
        const player = new playSound_1.default(sound, this.pieceGainNode, {
            ...fadeOptions,
            maxDuration
        });
        player.onstarted = () => {
            globals_1.state.allPlayers.add(player);
            globals_1.state.ontrigger({ sound, numPlayers: globals_1.state.allPlayers.size });
            this.onstarted();
        };
        player.onended = () => {
            globals_1.state.allPlayers.delete(player);
            globals_1.state.ontrigger({ numPlayers: globals_1.state.allPlayers.size });
        };
        return player;
    }
    async play() {
        globals_1.state.debug && console.log('			element start');
        this.playing = true;
        this.element.loaded || this.load();
        const random = new helpers_1.NoRepetition(this.element.sounds.length, 1, 1);
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const { mono, metro, fade } = this.element.structure;
            if (!this.element.structure.metro) {
                this.player = this._makePlayer(random.next(), mono, metro);
                while (this.playing) {
                    await this.newPlayerLoad;
                    await this.player.play();
                    this.started || (this.started = true) && resolve(true);
                    this.nextPlayer = this._makePlayer(random.next(), mono, metro);
                    this.newPlayerLoad = this.nextPlayer.load();
                    await (0, delay_1.default)((0, helpers_1.sec2ms)(this.player.maxDuration - 1.5 * this.player.fadeDuration));
                    this.player = this.nextPlayer;
                }
            }
            else {
                const metroInterval = mono ? metro * (1 - fade) : metro;
                this.metro = setInterval(async () => {
                    const player = this._makePlayer(random.next(), mono, metro);
                    await player.play();
                    this.started || resolve(true);
                    this.started = true;
                }, (0, helpers_1.sec2ms)(metroInterval));
            }
        });
    }
    async load() {
        this.element = await (0, loadingFunctions_1.loadElement)(this.element);
        return this.element;
    }
    stop() {
        globals_1.state.debug && console.log('			element stop');
        this.started = false;
        this.playing = false;
        clearInterval(this.metro);
    }
    cut() {
        globals_1.state.debug && console.log('			element cut');
        this.started = false;
        this.playing = false;
        clearInterval(this.metro);
        globals_1.state.allPlayers.forEach((player) => { player.stop(); });
    }
}
exports.default = default_1;
//# sourceMappingURL=playElement.js.map