(function () {
'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var _ref = (typeof chrome === "undefined" ? "undefined" : _typeof(chrome)) ? chrome : browser,
    storage = _ref.storage,
    tabs = _ref.tabs;

var defaultOptions = {
  flagReplaced: false,
  overrideAll: false,
  overrides: []
};
/**
 * Get options.
 */

function getOptions() {
  return new Promise(function (resolve, reject) {
    return storage.sync.get(Object.keys(defaultOptions), function (items) {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);else resolve(Object.assign({}, defaultOptions, items));
    });
  });
}

var isWindows = /^Win\d+$/.test(navigator.platform);

var EMOJI_SIZE = 256; // Anything larger will causes problems in Google Chrome

var documentHead = document.getElementsByTagName("head")[0];
var PIXEL_GRID = 16; // Initialize canvas and context to render emojis

var canvas = document.createElement("canvas");
canvas.width = canvas.height = EMOJI_SIZE;
var context = typeof global !== "undefined" && global.testContext || canvas.getContext("2d");
context.font = "normal normal normal ".concat(EMOJI_SIZE, "px/").concat(EMOJI_SIZE, "px sans-serif");
context.textAlign = "center";
context.textBaseline = "middle";
var settings = {};
getOptions().then(function (options) {
  return settings = options;
});
/**
 * Given an emoji string, append it to the document head
 * @param {string} name
 * @param {boolean} shouldOverride
 */

var existingFavicon = null;
function appendFaviconLink(name, shouldOverride) {
  var href = createEmojiUrl(name);

  if (existingFavicon) {
    existingFavicon.setAttribute("href", href);
  } else {
    var link = createLink(href, EMOJI_SIZE, "image/png");
    existingFavicon = documentHead.appendChild(link);

    if (!shouldOverride) {
      var defaultLink = createLink("/favicon.ico");
      documentHead.appendChild(defaultLink);
    }
  }
}
/**
 * Removes all icon link tags
 */

function removeAllFaviconLinks() {
  Array.prototype.slice.call(document.getElementsByTagName("link")).filter(isIconLink).forEach(function (link) {
    return link.remove();
  });
  existingFavicon = null;
}
/**
 * Creates Emoji Data Url for Favicon
 * @param {string} emoji
 * @returns {string}
 */

function createEmojiUrl(emoji) {
  if (!emoji) return; // Calculate sizing

  var char = String(emoji);

  var _context$measureText = context.measureText(char),
      width = _context$measureText.width;

  var center = (EMOJI_SIZE + EMOJI_SIZE / PIXEL_GRID) / 2;
  var scale = Math.min(EMOJI_SIZE / width, 1);
  var center_scaled = center / scale; // Draw emoji

  context.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
  context.save();
  context.scale(scale, scale);
  context.fillText(char, center_scaled, center_scaled);

  if (settings.flagReplaced) {
    // Draw Flag
    var FLAG_SIZE = 30;
    context.beginPath();
    context.arc(EMOJI_SIZE - FLAG_SIZE, EMOJI_SIZE - FLAG_SIZE, FLAG_SIZE, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  }

  context.restore();
  return canvas.toDataURL("image/png");
}
/**
 * Given a url, create a favicon link
 * @param {string} href
 * @param {number=} size
 * @param {string=} type
 * @returns {HTMLLinkElement}
 */


function createLink(href, size, type) {
  var link = document.createElement("link");
  link.rel = "icon";
  link.href = href;

  if (type) {
    link.type = type;
  }

  if (size) {
    link.setAttribute("sizes", "".concat(size, "x").concat(size));
  }

  return link;
}
/**
 * Checks whether a link is an icon rel
 * @param {HTMLLinkElement} link
 * @returns {boolean}
 */


function isIconLink(link) {
  return link.rel.toLowerCase().indexOf("icon") !== -1;
}

getOptions().then(function () {
  chrome.runtime.onMessage.addListener(updateFavicon);
  chrome.runtime.sendMessage(null, "updated:tab");
});

function updateFavicon(_ref) {
  var name = _ref.name,
      shouldOverride = _ref.shouldOverride;
  if (shouldOverride) removeAllFaviconLinks();
  appendFaviconLink(name, shouldOverride);
}

}());
