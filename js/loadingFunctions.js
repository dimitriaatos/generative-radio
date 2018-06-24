import {deepMerge} from "./helpers.js";
import {defaults, state} from "./globals.js";

const formattingOptions = options => {
  options.fields = "username,name,duration,created,url,lisence,previews";
  if (options.filter) {
    if (options.filter.duration) {
      let dur = options.filter.duration;
      options.filter.duration = `[${Math.min(...dur)} TO ${Math.max(...dur)}]`;
    }
    if (options.results) {
      let page_size = (options.results > 150) ? 150 : options.results;
      options.page_size = page_size;
    }
    var filterString = new String;
    Object.entries(options.filter).forEach(([key, value]) => {
      filterString += `${key}:${value} `;
    });
    options.filter = filterString;
  }
  return options;
}

const loadElement = element => {
  return new Promise(resolve => {
    if (!element.loaded) {
      element = deepMerge({},
        defaults.element, element);
      let options = formattingOptions(element.search.options);

      state.freesound.textSearch(
        element.search.text,
        options,
        response => {
          element.sounds = response.results;
          element.loaded = true;
          resolve(element);
        },
        () => {
          console.error("Error while searching.");
          reject();
        }
      )
    } else {
      resolve(element)
    }

  })
}

const loadPiece = piece => {
  return new Promise((resolve, reject) => {
    if (!piece.loaded) {
      let elementPromises = new Array;
      piece.elements.forEach(function(element) {
        elementPromises.push(loadElement(element));
      })
      Promise.all(elementPromises)
        .then(function(elements) {
          elements.forEach(function(element, index) {
            piece.elements[index] = element;
            piece.loaded = true;
            resolve(piece);
          })
        })
    } else {
      resolve(piece)
    }
  })
}

export {formattingOptions, loadElement, loadPiece}
