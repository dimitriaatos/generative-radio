"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPiece = exports.loadElement = exports.formattingOptions = void 0;
const helpers_1 = require("./helpers");
const globals_1 = require("./globals");
const formattingOptions = (options) => {
    options.fields = ['username', 'name', 'duration', 'created', 'url', 'license', 'previews', 'tags'].join(',');
    if (options.filter) {
        if (options.filter.duration) {
            const dur = (i) => {
                if (i == 1 && options.filter.duration[2])
                    i = 2;
                return Number(options.filter.duration[i]) || '*';
            };
            options.filter.duration = `[${dur(0)} TO ${dur(1)}]`;
        }
        if (options.results) {
            options.page_size = (options.results > 150) ? 150 : options.results;
        }
        const filterString = Object.entries(options.filter)
            .map(([key, value]) => `${key}:${value}`).join(' ');
        options.filter = filterString;
    }
    return options;
};
exports.formattingOptions = formattingOptions;
const loadElement = async (element) => {
    if (!element.loaded) {
        element = (0, helpers_1.deepMerge)({}, globals_1.defaults.element, element);
        const options = formattingOptions((0, helpers_1.deepClone)(element.search.options));
        if (element.search.text !== undefined) {
            const { results } = await globals_1.state.freesound.textSearch(element.search.text, options);
            element.sounds = results;
        }
        else if (element.search.sound !== undefined) {
            const sound = await globals_1.state.freesound.getSound(element.search.sound);
            const { results } = await sound.getSimilar(options);
            element.sounds = results;
        }
        element.loaded = true;
    }
    return element;
};
exports.loadElement = loadElement;
const loadPiece = async (piece) => {
    if (!piece.loaded) {
        const elementPromises = piece.elements.map((element) => loadElement(element));
        const elements = await Promise.all(elementPromises);
        piece.loaded = true;
        piece.elements = elements;
    }
    return piece;
};
exports.loadPiece = loadPiece;
//# sourceMappingURL=loadingFunctions.js.map