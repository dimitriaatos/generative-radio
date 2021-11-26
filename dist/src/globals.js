"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initState = exports.defaults = exports.state = void 0;
const freesound_client_1 = __importDefault(require("freesound-client"));
const state = {
    debugging: false,
    allPlayers: new Set(),
    freesound: new freesound_client_1.default(),
    ontrigger: () => { },
};
exports.state = state;
const initState = () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    state.context = new AudioContext();
    state.gainNode = state.context.createGain();
    state.gainNode.connect(state.context.destination);
};
exports.initState = initState;
const defaults = {
    element: {
        search: {
            // text: 'radio',
            options: {
                results: 150,
                filter: {
                    duration: [0, 60]
                },
                sort: 'rating_desc'
            }
        },
        structure: {
        // metro: 4
        }
    }
};
exports.defaults = defaults;
//# sourceMappingURL=globals.js.map