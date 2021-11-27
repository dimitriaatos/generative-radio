"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const globals_1 = require("./globals");
const delay_1 = __importDefault(require("delay"));
class default_1 {
    constructor(sound, elementGainNode, options = {}) {
        options = {
            autoplay: false,
            fadeDurationPrec: 0,
            fadeDuration: 0,
            maxDuration: sound.duration,
            ...options
        };
        Object.assign(this, options, { sound, elementGainNode });
        if (this.fadeDurationPrec)
            this.fadeDuration = this.maxDuration * this.fadeDurationPrec;
        this.gain = globals_1.state.context.createGain();
        this.gain.gain.setValueAtTime(0.001, globals_1.state.context.currentTime);
        this.onstarted = () => { };
        this.onended = () => { };
        this.source = globals_1.state.context.createBufferSource();
        this.fade = new helpers_1.Fade(globals_1.state.context, this.gain, this.fadeDuration);
        this.source.onended = () => {
            this.active = false;
            this.onended();
        };
        this.source.connect(this.gain);
        this.gain.connect(this.elementGainNode);
        this.autoplay && this.play();
    }
    async play() {
        this.active = true;
        this.source.buffer || await this.load();
        globals_1.state.debug && console.log('				sound start');
        this.source.start(0);
        this.fade.fadeIn();
        (0, delay_1.default)((0, helpers_1.sec2ms)(this.maxDuration - this.fadeDuration)).then(() => {
            this.fade.fadeOut();
        });
        (0, delay_1.default)((0, helpers_1.sec2ms)(this.maxDuration)).then(this.stop);
        this.onstarted();
        return this.source;
    }
    async load() {
        let buffer;
        globals_1.state.debug && console.log('				loading sound...');
        if (!this.source.buffer)
            buffer = await (0, helpers_1.loadBuffer)(this.sound.previews['preview-lq-mp3'], globals_1.state.context);
        if (!this.source.buffer)
            this.source.buffer = buffer;
        globals_1.state.debug && console.log('				sound loaded!');
        return this.source;
    }
    stop() {
        if (this) {
            globals_1.state.debug && console.log('				sound stop');
            this.active = false;
            this.source.stop();
            this.onended();
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=playSound.js.map