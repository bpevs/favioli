(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_debounce = debounce;

const { storage, tabs } = (typeof chrome ? chrome : browser);


const defaultOptions = {
  flagReplaced: false,
  overrideAll: false,
  overrides: [],
};


/**
 * Get options.
 */
function getOptions() {
  return new Promise((resolve, reject) => storage.sync.get(
    Object.keys(defaultOptions),
    items => {
      if(chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(Object.assign({}, defaultOptions, items));
    }
  ));
}


/**
 * Set Options
 * @param {object} toSet
 */
function setOptions(toSet) {
  return new Promise((resolve, reject) => storage.sync.set(
    toSet,
    () => {
      if(chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve();
    }
  ));
}

/**
@license @nocompile
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(){/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var r,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value);},fa="undefined"!=typeof window&&window===this?this:"undefined"!=typeof commonjsGlobal&&null!=commonjsGlobal?commonjsGlobal:this;function ha(){ha=function(){};fa.Symbol||(fa.Symbol=ia);}var ia=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}();
function ja(){ha();var a=fa.Symbol.iterator;a||(a=fa.Symbol.iterator=fa.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ka(this)}});ja=function(){};}function ka(a){var b=0;return la(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function la(a){ja();a={next:a};a[fa.Symbol.iterator]=function(){return this};return a}function ma(a){ja();var b=a[Symbol.iterator];return b?b.call(a):ka(a)}
function na(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}var oa;if("function"==typeof Object.setPrototypeOf)oa=Object.setPrototypeOf;else{var pa;a:{var qa={Na:!0},ra={};try{ra.__proto__=qa;pa=ra.Na;break a}catch(a){}pa=!1;}oa=pa?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null;}var sa=oa;function ta(){this.f=!1;this.b=null;this.fa=void 0;this.a=1;this.G=0;this.c=null;}
function ua(a){if(a.f)throw new TypeError("Generator is already running");a.f=!0;}ta.prototype.m=function(a){this.fa=a;};function va(a,b){a.c={Qa:b,Ua:!0};a.a=a.G;}ta.prototype.return=function(a){this.c={return:a};this.a=this.G;};function wa(a,b){a.a=3;return{value:b}}function xa(a){this.a=new ta;this.b=a;}function ya(a,b){ua(a.a);var c=a.a.b;if(c)return Ba(a,"return"in c?c["return"]:function(a){return{value:a,done:!0}},b,a.a.return);a.a.return(b);return Ca(a)}
function Ba(a,b,c,d){try{var e=b.call(a.a.b,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.a.f=!1, e;var f=e.value;}catch(g){return a.a.b=null, va(a.a,g), Ca(a)}a.a.b=null;d.call(a.a,f);return Ca(a)}function Ca(a){for(;a.a.a;)try{var b=a.b(a.a);if(b)return a.a.f=!1, {value:b.value,done:!1}}catch(c){a.a.fa=void 0, va(a.a,c);}a.a.f=!1;if(a.a.c){b=a.a.c;a.a.c=null;if(b.Ua)throw b.Qa;return{value:b.return,done:!0}}return{value:void 0,done:!0}}
function Da(a){this.next=function(b){ua(a.a);a.a.b?b=Ba(a,a.a.b.next,b,a.a.m):(a.a.m(b), b=Ca(a));return b};this.throw=function(b){ua(a.a);a.a.b?b=Ba(a,a.a.b["throw"],b,a.a.m):(va(a.a,b), b=Ca(a));return b};this.return=function(b){return ya(a,b)};ja();this[Symbol.iterator]=function(){return this};}function Ea(a,b){b=new Da(new xa(b));sa&&sa(b,a.prototype);return b}
(function(){if(!function(){var a=document.createEvent("Event");a.initEvent("foo",!0,!0);a.preventDefault();return a.defaultPrevented}()){var a=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&(a.call(this), Object.defineProperty(this,"defaultPrevented",{get:function(){return!0},configurable:!0}));};}var b=/Trident/.test(navigator.userAgent);if(!window.CustomEvent||b&&"function"!==typeof window.CustomEvent)window.CustomEvent=function(a,b){b=b||{};var c=document.createEvent("CustomEvent");
c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c}, window.CustomEvent.prototype=window.Event.prototype;if(!window.Event||b&&"function"!==typeof window.Event){var c=window.Event;window.Event=function(a,b){b=b||{};var c=document.createEvent("Event");c.initEvent(a,!!b.bubbles,!!b.cancelable);return c};if(c)for(var d in c)window.Event[d]=c[d];window.Event.prototype=c.prototype;}if(!window.MouseEvent||b&&"function"!==typeof window.MouseEvent){b=window.MouseEvent;window.MouseEvent=function(a,
b){b=b||{};var c=document.createEvent("MouseEvent");c.initMouseEvent(a,!!b.bubbles,!!b.cancelable,b.view||window,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget);return c};if(b)for(d in b)window.MouseEvent[d]=b[d];window.MouseEvent.prototype=b.prototype;}Array.from||(Array.from=function(a){return[].slice.call(a)});Object.assign||(Object.assign=function(a,b){for(var c=[].slice.call(arguments,1),d=0,e;d<c.length;d++)if(e=c[d])for(var f=
a,n=e,p=Object.getOwnPropertyNames(n),G=0;G<p.length;G++)e=p[G], f[e]=n[e];return a});})(window.WebComponents);(function(){function a(){}function b(a,b){if(!a.childNodes.length)return[];switch(a.nodeType){case Node.DOCUMENT_NODE:return R.call(a,b);case Node.DOCUMENT_FRAGMENT_NODE:return yb.call(a,b);default:return w.call(a,b)}}var c="undefined"===typeof HTMLTemplateElement,d=!(document.createDocumentFragment().cloneNode()instanceof DocumentFragment),e=!1;/Trident/.test(navigator.userAgent)&&function(){function a(a,b){if(a instanceof DocumentFragment)for(var d;d=a.firstChild;)c.call(this,d,b);else c.call(this,
a,b);return a}e=!0;var b=Node.prototype.cloneNode;Node.prototype.cloneNode=function(a){a=b.call(this,a);this instanceof DocumentFragment&&(a.__proto__=DocumentFragment.prototype);return a};DocumentFragment.prototype.querySelectorAll=HTMLElement.prototype.querySelectorAll;DocumentFragment.prototype.querySelector=HTMLElement.prototype.querySelector;Object.defineProperties(DocumentFragment.prototype,{nodeType:{get:function(){return Node.DOCUMENT_FRAGMENT_NODE},configurable:!0},localName:{get:function(){},
configurable:!0},nodeName:{get:function(){return"#document-fragment"},configurable:!0}});var c=Node.prototype.insertBefore;Node.prototype.insertBefore=a;var d=Node.prototype.appendChild;Node.prototype.appendChild=function(b){b instanceof DocumentFragment?a.call(this,b,null):d.call(this,b);return b};var f=Node.prototype.removeChild,g=Node.prototype.replaceChild;Node.prototype.replaceChild=function(b,c){b instanceof DocumentFragment?(a.call(this,b,c), f.call(this,c)):g.call(this,b,c);return c};Document.prototype.createDocumentFragment=
function(){var a=this.createElement("df");a.__proto__=DocumentFragment.prototype;return a};var h=Document.prototype.importNode;Document.prototype.importNode=function(a,b){b=h.call(this,a,b||!1);a instanceof DocumentFragment&&(b.__proto__=DocumentFragment.prototype);return b};}();var f=Node.prototype.cloneNode,g=Document.prototype.createElement,h=Document.prototype.importNode,k=Node.prototype.removeChild,l=Node.prototype.appendChild,n=Node.prototype.replaceChild,p=DOMParser.prototype.parseFromString,
G=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML")||{get:function(){return this.innerHTML},set:function(a){this.innerHTML=a;}},u=Object.getOwnPropertyDescriptor(window.Node.prototype,"childNodes")||{get:function(){return this.childNodes}},w=Element.prototype.querySelectorAll,R=Document.prototype.querySelectorAll,yb=DocumentFragment.prototype.querySelectorAll,zb=function(){if(!c){var a=document.createElement("template"),b=document.createElement("template");b.content.appendChild(document.createElement("div"));
a.content.appendChild(b);a=a.cloneNode(!0);return 0===a.content.childNodes.length||0===a.content.firstChild.content.childNodes.length||d}}();if(c){var U=document.implementation.createHTMLDocument("template"),Ma=!0,q=document.createElement("style");q.textContent="template{display:none;}";var za=document.head;za.insertBefore(q,za.firstElementChild);a.prototype=Object.create(HTMLElement.prototype);var da=!document.createElement("div").hasOwnProperty("innerHTML");a.R=function(b){if(!b.content&&b.namespaceURI===
document.documentElement.namespaceURI){b.content=U.createDocumentFragment();for(var c;c=b.firstChild;)l.call(b.content,c);if(da)b.__proto__=a.prototype;else if(b.cloneNode=function(b){return a.b(this,b)}, Ma)try{m(b), y(b);}catch(Hh){Ma=!1;}a.a(b.content);}};var ba={option:["select"],thead:["table"],col:["colgroup","table"],tr:["tbody","table"],th:["tr","tbody","table"],td:["tr","tbody","table"]},m=function(b){Object.defineProperty(b,"innerHTML",{get:function(){return ea(this)},set:function(b){var c=ba[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(b)||
["",""])[1].toLowerCase()];if(c)for(var d=0;d<c.length;d++)b="<"+c[d]+">"+b+"</"+c[d]+">";U.body.innerHTML=b;for(a.a(U);this.content.firstChild;)k.call(this.content,this.content.firstChild);b=U.body;if(c)for(d=0;d<c.length;d++)b=b.lastChild;for(;b.firstChild;)l.call(this.content,b.firstChild);},configurable:!0});},y=function(a){Object.defineProperty(a,"outerHTML",{get:function(){return"<template>"+this.innerHTML+"</template>"},set:function(a){if(this.parentNode){U.body.innerHTML=a;for(a=this.ownerDocument.createDocumentFragment();U.body.firstChild;)l.call(a,
U.body.firstChild);n.call(this.parentNode,a,this);}else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");},configurable:!0});};m(a.prototype);y(a.prototype);a.a=function(c){c=b(c,"template");for(var d=0,e=c.length,f;d<e&&(f=c[d]);d++)a.R(f);};document.addEventListener("DOMContentLoaded",function(){a.a(document);});Document.prototype.createElement=function(){var b=g.apply(this,arguments);"template"===b.localName&&a.R(b);return b};DOMParser.prototype.parseFromString=
function(){var b=p.apply(this,arguments);a.a(b);return b};Object.defineProperty(HTMLElement.prototype,"innerHTML",{get:function(){return ea(this)},set:function(b){G.set.call(this,b);a.a(this);},configurable:!0,enumerable:!0});var ca=/[&\u00A0"]/g,Ab=/[&\u00A0<>]/g,Na=function(a){switch(a){case "&":return"&amp;";case "<":return"&lt;";case ">":return"&gt;";case '"':return"&quot;";case "\u00a0":return"&nbsp;"}};q=function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b};var Aa=q("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
Oa=q("style script xmp iframe noembed noframes plaintext noscript".split(" ")),ea=function(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):u.get.call(a),e=0,f=d.length,g;e<f&&(g=d[e]);e++){a:{var h=g;var k=a;var l=b;switch(h.nodeType){case Node.ELEMENT_NODE:for(var n=h.localName,m="<"+n,p=h.attributes,w=0;k=p[w];w++)m+=" "+k.name+'="'+k.value.replace(ca,Na)+'"';m+=">";h=Aa[n]?m:m+ea(h,l)+"</"+n+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&Oa[k.localName]?h:h.replace(Ab,Na);break a;
case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h), Error("not implemented");}}c+=h;}return c};}if(c||zb){a.b=function(a,b){var c=f.call(a,!1);this.R&&this.R(c);b&&(l.call(c.content,f.call(a.content,!0)), Pa(c.content,a.content));return c};var Pa=function(c,d){if(d.querySelectorAll&&(d=b(d,"template"), 0!==d.length)){c=b(c,"template");for(var e=0,f=c.length,g,h;e<f;e++)h=d[e], g=c[e], a&&a.R&&a.R(h), n.call(g.parentNode,tf.call(h,!0),g);}},tf=Node.prototype.cloneNode=
function(b){if(!e&&d&&this instanceof DocumentFragment)if(b)var c=uf.call(this.ownerDocument,this,!0);else return this.ownerDocument.createDocumentFragment();else this.nodeType===Node.ELEMENT_NODE&&"template"===this.localName&&this.namespaceURI==document.documentElement.namespaceURI?c=a.b(this,b):c=f.call(this,b);b&&Pa(c,this);return c},uf=Document.prototype.importNode=function(c,d){d=d||!1;if("template"===c.localName)return a.b(c,d);var e=h.call(this,c,d);if(d){Pa(e,c);c=b(e,'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');
for(var f,k=0;k<c.length;k++){f=c[k];d=g.call(document,"script");d.textContent=f.textContent;for(var l=f.attributes,m=0,p;m<l.length;m++)p=l[m], d.setAttribute(p.name,p.value);n.call(f.parentNode,d,f);}}return e};}c&&(window.HTMLTemplateElement=a);})();var Fa=setTimeout;function Ga(){}function Ha(a,b){return function(){a.apply(b,arguments);}}function t(a){if(!(this instanceof t))throw new TypeError("Promises must be constructed via new");if("function"!==typeof a)throw new TypeError("not a function");this.J=0;this.wa=!1;this.A=void 0;this.U=[];Ia(a,this);}
function Ja(a,b){for(;3===a.J;)a=a.A;0===a.J?a.U.push(b):(a.wa=!0, Ka(function(){var c=1===a.J?b.Wa:b.Xa;if(null===c)(1===a.J?La:Qa)(b.ra,a.A);else{try{var d=c(a.A);}catch(e){Qa(b.ra,e);return}La(b.ra,d);}}));}function La(a,b){try{if(b===a)throw new TypeError("A promise cannot be resolved with itself.");if(b&&("object"===typeof b||"function"===typeof b)){var c=b.then;if(b instanceof t){a.J=3;a.A=b;Ra(a);return}if("function"===typeof c){Ia(Ha(c,b),a);return}}a.J=1;a.A=b;Ra(a);}catch(d){Qa(a,d);}}
function Qa(a,b){a.J=2;a.A=b;Ra(a);}function Ra(a){2===a.J&&0===a.U.length&&Ka(function(){a.wa||"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",a.A);});for(var b=0,c=a.U.length;b<c;b++)Ja(a,a.U[b]);a.U=null;}function Sa(a,b,c){this.Wa="function"===typeof a?a:null;this.Xa="function"===typeof b?b:null;this.ra=c;}function Ia(a,b){var c=!1;try{a(function(a){c||(c=!0, La(b,a));},function(a){c||(c=!0, Qa(b,a));});}catch(d){c||(c=!0, Qa(b,d));}}
t.prototype["catch"]=function(a){return this.then(null,a)};t.prototype.then=function(a,b){var c=new this.constructor(Ga);Ja(this,new Sa(a,b,c));return c};t.prototype["finally"]=function(a){var b=this.constructor;return this.then(function(c){return b.resolve(a()).then(function(){return c})},function(c){return b.resolve(a()).then(function(){return b.reject(c)})})};
function Ta(a){return new t(function(b,c){function d(a,g){try{if(g&&("object"===typeof g||"function"===typeof g)){var h=g.then;if("function"===typeof h){h.call(g,function(b){d(a,b);},c);return}}e[a]=g;0===--f&&b(e);}catch(n){c(n);}}if(!a||"undefined"===typeof a.length)throw new TypeError("Promise.all accepts an array");var e=Array.prototype.slice.call(a);if(0===e.length)return b([]);for(var f=e.length,g=0;g<e.length;g++)d(g,e[g]);})}
function Ua(a){return a&&"object"===typeof a&&a.constructor===t?a:new t(function(b){b(a);})}function Va(a){return new t(function(b,c){c(a);})}function Wa(a){return new t(function(b,c){for(var d=0,e=a.length;d<e;d++)a[d].then(b,c);})}var Ka="function"===typeof setImmediate&&function(a){setImmediate(a);}||function(a){Fa(a,0);};/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
if(!window.Promise){window.Promise=t;t.prototype.then=t.prototype.then;t.all=Ta;t.race=Wa;t.resolve=Ua;t.reject=Va;var Xa=document.createTextNode(""),Ya=[];(new MutationObserver(function(){for(var a=Ya.length,b=0;b<a;b++)Ya[b]();Ya.splice(0,a);})).observe(Xa,{characterData:!0});Ka=function(a){Ya.push(a);Xa.textContent=0<Xa.textContent.length?"":"a";};}(function(a,b){if(!(b in a)){var c=typeof commonjsGlobal===typeof c?window:commonjsGlobal,d=0,e=""+Math.random(),f="__\u0001symbol@@"+e,g=a.getOwnPropertyNames,h=a.getOwnPropertyDescriptor,k=a.create,l=a.keys,n=a.freeze||a,p=a.defineProperty,G=a.defineProperties,u=h(a,"getOwnPropertyNames"),w=a.prototype,R=w.hasOwnProperty,yb=w.propertyIsEnumerable,zb=w.toString,U=function(a,b,c){R.call(a,f)||p(a,f,{enumerable:!1,configurable:!1,writable:!1,value:{}});a[f]["@@"+b]=c;},Ma=function(a,b){var c=k(a);g(b).forEach(function(a){ba.call(b,
a)&&Aa(c,a,b[a]);});return c},q=function(){},za=function(a){return a!=f&&!R.call(ca,a)},da=function(a){return a!=f&&R.call(ca,a)},ba=function(a){var b=""+a;return da(b)?R.call(this,b)&&this[f]["@@"+b]:yb.call(this,a)},m=function(b){p(w,b,{enumerable:!1,configurable:!0,get:q,set:function(a){ea(this,b,{enumerable:!1,configurable:!0,writable:!0,value:a});U(this,b,!0);}});return n(ca[b]=p(a(b),"constructor",Ab))},y=function(a){if(this&&this!==c)throw new TypeError("Symbol is not a constructor");return m("__\u0001symbol:".concat(a||
"",e,++d))},ca=k(null),Ab={value:y},Na=function(a){return ca[a]},Aa=function(a,b,c){var d=""+b;if(da(d)){b=ea;if(c.enumerable){var e=k(c);e.enumerable=!1;}else e=c;b(a,d,e);U(a,d,!!c.enumerable);}else p(a,b,c);return a},Oa=function(a){return g(a).filter(da).map(Na)};u.value=Aa;p(a,"defineProperty",u);u.value=Oa;p(a,b,u);u.value=function(a){return g(a).filter(za)};p(a,"getOwnPropertyNames",u);u.value=function(a,b){var c=Oa(b);c.length?l(b).concat(c).forEach(function(c){ba.call(b,c)&&Aa(a,c,b[c]);}):G(a,
b);return a};p(a,"defineProperties",u);u.value=ba;p(w,"propertyIsEnumerable",u);u.value=y;p(c,"Symbol",u);u.value=function(a){a="__\u0001symbol:".concat("__\u0001symbol:",a,e);return a in w?ca[a]:m(a)};p(y,"for",u);u.value=function(a){if(za(a))throw new TypeError(a+" is not a symbol");return R.call(ca,a)?a.slice(20,-e.length):void 0};p(y,"keyFor",u);u.value=function(a,b){var c=h(a,b);c&&da(b)&&(c.enumerable=ba.call(a,b));return c};p(a,"getOwnPropertyDescriptor",u);u.value=function(a,b){return 1===
arguments.length?k(a):Ma(a,b)};p(a,"create",u);u.value=function(){var a=zb.call(this);return"[object String]"===a&&da(this)?"[object Symbol]":a};p(w,"toString",u);try{var ea=k(p({},"__\u0001symbol:",{get:function(){return p(this,"__\u0001symbol:",{value:!1})["__\u0001symbol:"]}}))["__\u0001symbol:"]||p;}catch(Pa){ea=function(a,b,c){var d=h(w,b);delete w[b];p(a,b,c);p(w,b,d);};}}})(Object,"getOwnPropertySymbols");
(function(a){var b=a.defineProperty,c=a.prototype,d=c.toString,e;"iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag".split(" ").forEach(function(f){if(!(f in Symbol))switch(b(Symbol,f,{value:Symbol(f)}), f){case "toStringTag":e=a.getOwnPropertyDescriptor(c,"toString"), e.value=function(){var a=d.call(this),b=this[Symbol.toStringTag];return"undefined"===typeof b?a:"[object "+b+"]"}, b(c,"toString",e);}});})(Object,Symbol);
(function(a,b,c){function d(){return this}b[a]||(b[a]=function(){var b=0,c=this,g={next:function(){var a=c.length<=b;return a?{done:a}:{done:a,value:c[b++]}}};g[a]=d;return g});c[a]||(c[a]=function(){var b=String.fromCodePoint,c=this,g=0,h=c.length,k={next:function(){var a=h<=g,d=a?"":b(c.codePointAt(g));g+=d.length;return a?{done:a}:{done:a,value:d}}};k[a]=d;return k});})(Symbol.iterator,Array.prototype,String.prototype);/*

Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
Object.keys=function(a){return Object.getOwnPropertyNames(a).filter(function(b){return(b=Object.getOwnPropertyDescriptor(a,b))&&b.enumerable})};var Za=window.Symbol.iterator;String.prototype[Za]&&String.prototype.codePointAt||(String.prototype[Za]=function $a(){var b,c=this;return Ea($a,function(d){1==d.a&&(b=0);if(3!=d.a)return b<c.length?d=wa(d,c[b]):(d.a=0, d=void 0), d;b++;d.a=2;})});
Set.prototype[Za]||(Set.prototype[Za]=function ab(){var b,c=this,d;return Ea(ab,function(e){1==e.a&&(b=[], c.forEach(function(c){b.push(c);}), d=0);if(3!=e.a)return d<b.length?e=wa(e,b[d]):(e.a=0, e=void 0), e;d++;e.a=2;})});Map.prototype[Za]||(Map.prototype[Za]=function bb(){var b,c=this,d;return Ea(bb,function(e){1==e.a&&(b=[], c.forEach(function(c,d){b.push([d,c]);}), d=0);if(3!=e.a)return d<b.length?e=wa(e,b[d]):(e.a=0, e=void 0), e;d++;e.a=2;})});/*

 Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.WebComponents=window.WebComponents||{flags:{}};var cb=document.querySelector('script[src*="webcomponents-bundle"]'),db=/wc-(.+)/,v={};if(!v.noOpts){location.search.slice(1).split("&").forEach(function(a){a=a.split("=");var b;a[0]&&(b=a[0].match(db))&&(v[b[1]]=a[1]||!0);});if(cb)for(var eb=0,fb=void 0;fb=cb.attributes[eb];eb++)"src"!==fb.name&&(v[fb.name]=fb.value||!0);if(v.log&&v.log.split){var gb=v.log.split(",");v.log={};gb.forEach(function(a){v.log[a]=!0;});}else v.log={};}
window.WebComponents.flags=v;var hb=v.shadydom;hb&&(window.ShadyDOM=window.ShadyDOM||{}, window.ShadyDOM.force=hb);var ib=v.register||v.ce;ib&&window.customElements&&(window.customElements.forcePolyfill=ib);/*

Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function jb(){this.za=this.root=null;this.ea=!1;this.N=this.$=this.oa=this.assignedSlot=this.assignedNodes=this.S=null;this.childNodes=this.nextSibling=this.previousSibling=this.lastChild=this.firstChild=this.parentNode=this.V=void 0;this.Ea=this.ua=!1;this.Z={};}jb.prototype.toJSON=function(){return{}};function x(a){a.ma||(a.ma=new jb);return a.ma}function z(a){return a&&a.ma}var A=window.ShadyDOM||{};A.Sa=!(!Element.prototype.attachShadow||!Node.prototype.getRootNode);var kb=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild");A.K=!!(kb&&kb.configurable&&kb.get);A.qa=A.force||!A.Sa;var lb=navigator.userAgent.match("Trident"),mb=navigator.userAgent.match("Edge");void 0===A.Ba&&(A.Ba=A.K&&(lb||mb));function nb(a){return(a=z(a))&&void 0!==a.firstChild}function B(a){return"ShadyRoot"===a.Ja}function ob(a){a=a.getRootNode();if(B(a))return a}
var pb=Element.prototype,qb=pb.matches||pb.matchesSelector||pb.mozMatchesSelector||pb.msMatchesSelector||pb.oMatchesSelector||pb.webkitMatchesSelector;function rb(a,b){if(a&&b)for(var c=Object.getOwnPropertyNames(b),d=0,e=void 0;d<c.length&&(e=c[d]);d++){var f=e,g=a,h=Object.getOwnPropertyDescriptor(b,f);h&&Object.defineProperty(g,f,h);}}function sb(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];for(d=0;d<c.length;d++)rb(a,c[d]);return a}
function tb(a,b){for(var c in b)a[c]=b[c];}var ub=document.createTextNode(""),vb=0,wb=[];(new MutationObserver(function(){for(;wb.length;)try{wb.shift()();}catch(a){throw ub.textContent=vb++, a;}})).observe(ub,{characterData:!0});function xb(a){wb.push(a);ub.textContent=vb++;}var Bb=!!document.contains;function Cb(a,b){for(;b;){if(b==a)return!0;b=b.parentNode;}return!1}
function Db(a){for(var b=a.length-1;0<=b;b--){var c=a[b],d=c.getAttribute("id")||c.getAttribute("name");d&&"length"!==d&&isNaN(d)&&(a[d]=c);}a.item=function(b){return a[b]};a.namedItem=function(b){if("length"!==b&&isNaN(b)&&a[b])return a[b];for(var c=ma(a),d=c.next();!d.done;d=c.next())if(d=d.value, (d.getAttribute("id")||d.getAttribute("name"))==b)return d;return null};return a}var Eb=[],Fb;function Gb(a){Fb||(Fb=!0, xb(Hb));Eb.push(a);}function Hb(){Fb=!1;for(var a=!!Eb.length;Eb.length;)Eb.shift()();return a}Hb.list=Eb;function Ib(){this.a=!1;this.addedNodes=[];this.removedNodes=[];this.ca=new Set;}function Jb(a){a.a||(a.a=!0, xb(function(){a.flush();}));}Ib.prototype.flush=function(){if(this.a){this.a=!1;var a=this.takeRecords();a.length&&this.ca.forEach(function(b){b(a);});}};Ib.prototype.takeRecords=function(){if(this.addedNodes.length||this.removedNodes.length){var a=[{addedNodes:this.addedNodes,removedNodes:this.removedNodes}];this.addedNodes=[];this.removedNodes=[];return a}return[]};
function Kb(a,b){var c=x(a);c.S||(c.S=new Ib);c.S.ca.add(b);var d=c.S;return{Ia:b,P:d,Ka:a,takeRecords:function(){return d.takeRecords()}}}function Lb(a){var b=a&&a.P;b&&(b.ca.delete(a.Ia), b.ca.size||(x(a.Ka).S=null));}
function Mb(a,b){var c=b.getRootNode();return a.map(function(a){var b=c===a.target.getRootNode();if(b&&a.addedNodes){if(b=Array.from(a.addedNodes).filter(function(a){return c===a.getRootNode()}), b.length)return a=Object.create(a), Object.defineProperty(a,"addedNodes",{value:b,configurable:!0}), a}else if(b)return a}).filter(function(a){return a})}var Nb=Element.prototype.insertBefore,Ob=Element.prototype.replaceChild,Pb=Element.prototype.removeChild,Qb=Element.prototype.setAttribute,Rb=Element.prototype.removeAttribute,Sb=Element.prototype.cloneNode,Tb=Document.prototype.importNode,Ub=Element.prototype.addEventListener,Vb=Element.prototype.removeEventListener,Wb=Window.prototype.addEventListener,Xb=Window.prototype.removeEventListener,Yb=Element.prototype.dispatchEvent,Zb=Node.prototype.contains||HTMLElement.prototype.contains,$b=Document.prototype.getElementById,
ac=Element.prototype.querySelector,bc=DocumentFragment.prototype.querySelector,cc=Document.prototype.querySelector,dc=Element.prototype.querySelectorAll,ec=DocumentFragment.prototype.querySelectorAll,fc=Document.prototype.querySelectorAll,C={};C.appendChild=Element.prototype.appendChild;C.insertBefore=Nb;C.replaceChild=Ob;C.removeChild=Pb;C.setAttribute=Qb;C.removeAttribute=Rb;C.cloneNode=Sb;C.importNode=Tb;C.addEventListener=Ub;C.removeEventListener=Vb;C.gb=Wb;C.hb=Xb;C.dispatchEvent=Yb;
C.contains=Zb;C.getElementById=$b;C.pb=ac;C.tb=bc;C.nb=cc;C.querySelector=function(a){switch(this.nodeType){case Node.ELEMENT_NODE:return ac.call(this,a);case Node.DOCUMENT_NODE:return cc.call(this,a);default:return bc.call(this,a)}};C.qb=dc;C.ub=ec;C.ob=fc;C.querySelectorAll=function(a){switch(this.nodeType){case Node.ELEMENT_NODE:return dc.call(this,a);case Node.DOCUMENT_NODE:return fc.call(this,a);default:return ec.call(this,a)}};var gc=/[&\u00A0"]/g,hc=/[&\u00A0<>]/g;function ic(a){switch(a){case "&":return"&amp;";case "<":return"&lt;";case ">":return"&gt;";case '"':return"&quot;";case "\u00a0":return"&nbsp;"}}function jc(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}var kc=jc("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),lc=jc("style script xmp iframe noembed noframes plaintext noscript".split(" "));
function mc(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):a.childNodes,e=0,f=d.length,g=void 0;e<f&&(g=d[e]);e++){a:{var h=g;var k=a,l=b;switch(h.nodeType){case Node.ELEMENT_NODE:k=h.localName;for(var n="<"+k,p=h.attributes,G=0,u;u=p[G];G++)n+=" "+u.name+'="'+u.value.replace(gc,ic)+'"';n+=">";h=kc[k]?n:n+mc(h,l)+"</"+k+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&lc[k.localName]?h:h.replace(hc,ic);break a;case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h), Error("not implemented");}}c+=h;}return c}var D=document.createTreeWalker(document,NodeFilter.SHOW_ALL,null,!1),E=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT,null,!1);function nc(a){var b=[];D.currentNode=a;for(a=D.firstChild();a;)b.push(a), a=D.nextSibling();return b}
var F={parentNode:function(a){D.currentNode=a;return D.parentNode()},firstChild:function(a){D.currentNode=a;return D.firstChild()},lastChild:function(a){D.currentNode=a;return D.lastChild()},previousSibling:function(a){D.currentNode=a;return D.previousSibling()},nextSibling:function(a){D.currentNode=a;return D.nextSibling()}};F.childNodes=nc;F.parentElement=function(a){E.currentNode=a;return E.parentNode()};F.firstElementChild=function(a){E.currentNode=a;return E.firstChild()};
F.lastElementChild=function(a){E.currentNode=a;return E.lastChild()};F.previousElementSibling=function(a){E.currentNode=a;return E.previousSibling()};F.nextElementSibling=function(a){E.currentNode=a;return E.nextSibling()};F.children=function(a){var b=[];E.currentNode=a;for(a=E.firstChild();a;)b.push(a), a=E.nextSibling();return Db(b)};F.innerHTML=function(a){return mc(a,function(a){return nc(a)})};
F.textContent=function(a){switch(a.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:a=document.createTreeWalker(a,NodeFilter.SHOW_TEXT,null,!1);for(var b="",c;c=a.nextNode();)b+=c.nodeValue;return b;default:return a.nodeValue}};var oc=A.K,pc=[Node.prototype,Element.prototype,HTMLElement.prototype];function H(a){var b;a:{for(b=0;b<pc.length;b++){var c=pc[b];if(c.hasOwnProperty(a)){b=c;break a}}b=void 0;}if(!b)throw Error("Could not find descriptor for "+a);return Object.getOwnPropertyDescriptor(b,a)}
var I=oc?{parentNode:H("parentNode"),firstChild:H("firstChild"),lastChild:H("lastChild"),previousSibling:H("previousSibling"),nextSibling:H("nextSibling"),childNodes:H("childNodes"),parentElement:H("parentElement"),previousElementSibling:H("previousElementSibling"),nextElementSibling:H("nextElementSibling"),innerHTML:H("innerHTML"),textContent:H("textContent"),firstElementChild:H("firstElementChild"),lastElementChild:H("lastElementChild"),children:H("children")}:{},qc=oc?{firstElementChild:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,
"firstElementChild"),lastElementChild:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,"lastElementChild"),children:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,"children")}:{},rc=oc?{firstElementChild:Object.getOwnPropertyDescriptor(Document.prototype,"firstElementChild"),lastElementChild:Object.getOwnPropertyDescriptor(Document.prototype,"lastElementChild"),children:Object.getOwnPropertyDescriptor(Document.prototype,"children")}:{},sc={ya:I,sb:qc,mb:rc,parentNode:function(a){return I.parentNode.get.call(a)},
firstChild:function(a){return I.firstChild.get.call(a)},lastChild:function(a){return I.lastChild.get.call(a)},previousSibling:function(a){return I.previousSibling.get.call(a)},nextSibling:function(a){return I.nextSibling.get.call(a)},childNodes:function(a){return Array.prototype.slice.call(I.childNodes.get.call(a))},parentElement:function(a){return I.parentElement.get.call(a)},previousElementSibling:function(a){return I.previousElementSibling.get.call(a)},nextElementSibling:function(a){return I.nextElementSibling.get.call(a)},
innerHTML:function(a){return I.innerHTML.get.call(a)},textContent:function(a){return I.textContent.get.call(a)},children:function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return qc.children.get.call(a);case Node.DOCUMENT_NODE:return rc.children.get.call(a);default:return I.children.get.call(a)}},firstElementChild:function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return qc.firstElementChild.get.call(a);case Node.DOCUMENT_NODE:return rc.firstElementChild.get.call(a);default:return I.firstElementChild.get.call(a)}},
lastElementChild:function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return qc.lastElementChild.get.call(a);case Node.DOCUMENT_NODE:return rc.lastElementChild.get.call(a);default:return I.lastElementChild.get.call(a)}}};var J=A.Ba?sc:F;function tc(a){for(;a.firstChild;)a.removeChild(a.firstChild);}
var uc=A.K,vc=document.implementation.createHTMLDocument("inert"),wc=Object.getOwnPropertyDescriptor(Node.prototype,"isConnected"),xc=wc&&wc.get,yc=Object.getOwnPropertyDescriptor(Document.prototype,"activeElement"),zc={parentElement:{get:function(){var a=z(this);(a=a&&a.parentNode)&&a.nodeType!==Node.ELEMENT_NODE&&(a=null);return void 0!==a?a:J.parentElement(this)},configurable:!0},parentNode:{get:function(){var a=z(this);a=a&&a.parentNode;return void 0!==a?a:J.parentNode(this)},configurable:!0},
nextSibling:{get:function(){var a=z(this);a=a&&a.nextSibling;return void 0!==a?a:J.nextSibling(this)},configurable:!0},previousSibling:{get:function(){var a=z(this);a=a&&a.previousSibling;return void 0!==a?a:J.previousSibling(this)},configurable:!0},nextElementSibling:{get:function(){var a=z(this);if(a&&void 0!==a.nextSibling){for(a=this.nextSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}return J.nextElementSibling(this)},configurable:!0},previousElementSibling:{get:function(){var a=
z(this);if(a&&void 0!==a.previousSibling){for(a=this.previousSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}return J.previousElementSibling(this)},configurable:!0}},Ac={className:{get:function(){return this.getAttribute("class")||""},set:function(a){this.setAttribute("class",a);},configurable:!0}},Bc={childNodes:{get:function(){if(nb(this)){var a=z(this);if(!a.childNodes){a.childNodes=[];for(var b=this.firstChild;b;b=b.nextSibling)a.childNodes.push(b);}var c=a.childNodes;}else c=
J.childNodes(this);c.item=function(a){return c[a]};return c},configurable:!0},childElementCount:{get:function(){return this.children.length},configurable:!0},firstChild:{get:function(){var a=z(this);a=a&&a.firstChild;return void 0!==a?a:J.firstChild(this)},configurable:!0},lastChild:{get:function(){var a=z(this);a=a&&a.lastChild;return void 0!==a?a:J.lastChild(this)},configurable:!0},textContent:{get:function(){if(nb(this)){for(var a=[],b=0,c=this.childNodes,d;d=c[b];b++)d.nodeType!==Node.COMMENT_NODE&&
a.push(d.textContent);return a.join("")}return J.textContent(this)},set:function(a){if("undefined"===typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:if(!nb(this)&&uc){var b=this.firstChild;(b!=this.lastChild||b&&b.nodeType!=Node.TEXT_NODE)&&tc(this);sc.ya.textContent.set.call(this,a);}else tc(this), (0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.appendChild(document.createTextNode(a));break;default:this.nodeValue=a;}},configurable:!0},firstElementChild:{get:function(){var a=
z(this);if(a&&void 0!==a.firstChild){for(a=this.firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}return J.firstElementChild(this)},configurable:!0},lastElementChild:{get:function(){var a=z(this);if(a&&void 0!==a.lastChild){for(a=this.lastChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}return J.lastElementChild(this)},configurable:!0},children:{get:function(){return nb(this)?Db(Array.prototype.filter.call(this.childNodes,function(a){return a.nodeType===Node.ELEMENT_NODE})):
J.children(this)},configurable:!0},innerHTML:{get:function(){return nb(this)?mc("template"===this.localName?this.content:this):J.innerHTML(this)},set:function(a){var b="template"===this.localName?this.content:this;tc(b);var c=this.localName||"div";c=this.namespaceURI&&this.namespaceURI!==vc.namespaceURI?vc.createElementNS(this.namespaceURI,c):vc.createElement(c);uc?sc.ya.innerHTML.set.call(c,a):c.innerHTML=a;for(a="template"===this.localName?c.content:c;a.firstChild;)b.appendChild(a.firstChild);},
configurable:!0}},Cc={shadowRoot:{get:function(){var a=z(this);return a&&a.za||null},configurable:!0}},Dc={activeElement:{get:function(){var a=yc&&yc.get?yc.get.call(document):A.K?void 0:document.activeElement;if(a&&a.nodeType){var b=!!B(this);if(this===document||b&&this.host!==a&&C.contains.call(this.host,a)){for(b=ob(a);b&&b!==this;)a=b.host, b=ob(a);a=this===document?b?null:a:b===this?a:null;}else a=null;}else a=null;return a},set:function(){},configurable:!0}};
function K(a,b,c){for(var d in b){var e=Object.getOwnPropertyDescriptor(a,d);e&&e.configurable||!e&&c?Object.defineProperty(a,d,b[d]):c&&console.warn("Could not define",d,"on",a);}}function Ec(a){K(a,zc);K(a,Ac);K(a,Bc);K(a,Dc);}
function Fc(){var a=Gc.prototype;a.__proto__=DocumentFragment.prototype;K(a,zc,!0);K(a,Bc,!0);K(a,Dc,!0);Object.defineProperties(a,{nodeType:{value:Node.DOCUMENT_FRAGMENT_NODE,configurable:!0},nodeName:{value:"#document-fragment",configurable:!0},nodeValue:{value:null,configurable:!0}});["localName","namespaceURI","prefix"].forEach(function(b){Object.defineProperty(a,b,{value:void 0,configurable:!0});});["ownerDocument","baseURI","isConnected"].forEach(function(b){Object.defineProperty(a,b,{get:function(){return this.host[b]},
configurable:!0});});}var Hc=A.K?function(){}:function(a){var b=x(a);b.ua||(b.ua=!0, K(a,zc,!0), K(a,Ac,!0));},Ic=A.K?function(){}:function(a){x(a).Ea||(K(a,Bc,!0), K(a,Cc,!0));};var Jc=J.childNodes;function Kc(a,b,c){Ic(b);var d=x(b);void 0!==d.firstChild&&(d.childNodes=null);if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){d=a.childNodes;for(var e=0;e<d.length;e++)Lc(d[e],b,c);a=x(a);b=void 0!==a.firstChild?null:void 0;a.firstChild=a.lastChild=b;a.childNodes=b;}else Lc(a,b,c);}
function Lc(a,b,c){Hc(a);c=c||null;var d=x(a),e=x(b),f=c?x(c):null;d.previousSibling=c?f.previousSibling:b.lastChild;if(f=z(d.previousSibling))f.nextSibling=a;if(f=z(d.nextSibling=c))f.previousSibling=a;d.parentNode=b;c?c===e.firstChild&&(e.firstChild=a):(e.lastChild=a, e.firstChild||(e.firstChild=a));e.childNodes=null;}
function Mc(a,b){var c=x(a);b=x(b);a===b.firstChild&&(b.firstChild=c.nextSibling);a===b.lastChild&&(b.lastChild=c.previousSibling);a=c.previousSibling;var d=c.nextSibling;a&&(x(a).nextSibling=d);d&&(x(d).previousSibling=a);c.parentNode=c.previousSibling=c.nextSibling=void 0;void 0!==b.childNodes&&(b.childNodes=null);}
function Nc(a){var b=x(a);if(void 0===b.firstChild){b.childNodes=null;var c=Jc(a);b.firstChild=c[0]||null;b.lastChild=c[c.length-1]||null;Ic(a);for(b=0;b<c.length;b++){var d=c[b],e=x(d);e.parentNode=a;e.nextSibling=c[b+1]||null;e.previousSibling=c[b-1]||null;Hc(d);}}}var Oc=J.parentNode;
function Pc(a,b,c){if(b===a)throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");if(c){var d=z(c);d=d&&d.parentNode;if(void 0!==d&&d!==a||void 0===d&&Oc(c)!==a)throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");}if(c===b)return b;var e=[],f=Qc,g=ob(a),h=g?g.host.localName:"";if(b.parentNode){var k=Rc(b);Sc(b.parentNode,b,!!g||!(b.getRootNode()instanceof ShadowRoot));
f=function(a,b){Tc()&&(Uc(a,k), Qc(a,b));};}d=!0;var l=!Vc(b,h);!g||b.__noInsertionPoint&&!l||Wc(b,function(a){"slot"===a.localName&&e.push(a);l&&f(a,h);});e.length&&Xc(g,e);("slot"===a.localName||e.length)&&g&&Yc(g);nb(a)&&(Kc(b,a,c), g=z(a), Zc(a)?(Yc(g.root), d=!1):g.root&&(d=!1));d?(d=B(a)?a.host:a, c?(c=$c(c), C.insertBefore.call(d,b,c)):C.appendChild.call(d,b)):b.ownerDocument!==a.ownerDocument&&a.ownerDocument.adoptNode(b);ad(a,b);return b}
function Sc(a,b,c){c=void 0===c?!1:c;if(b.parentNode!==a)throw Error("The node to be removed is not a child of this node: "+b);var d=ob(b),e=z(a);if(nb(a)&&(Mc(b,a), Zc(a))){Yc(e.root);var f=!0;}if(Tc()&&!c&&d){var g=Rc(b);Wc(b,function(a){Uc(a,g);});}bd(b);if(d){var h=a&&"slot"===a.localName;h&&(f=!0);((c=cd(d,b))||h)&&Yc(d);}f||(f=B(a)?a.host:a, (!e.root&&"slot"!==b.localName||f===Oc(b))&&C.removeChild.call(f,b));ad(a,null,b);return b}
function bd(a){var b=z(a);if(b&&void 0!==b.V){b=a.childNodes;for(var c=0,d=b.length,e=void 0;c<d&&(e=b[c]);c++)bd(e);}if(a=z(a))a.V=void 0;}function $c(a){var b=a;a&&"slot"===a.localName&&(b=(b=(b=z(a))&&b.N)&&b.length?b[0]:$c(a.nextSibling));return b}function Zc(a){return(a=(a=z(a))&&a.root)&&dd(a)}
function ed(a,b){if("slot"===b)a=a.parentNode, Zc(a)&&Yc(z(a).root);else if("slot"===a.localName&&"name"===b&&(b=ob(a))){if(b.o){fd(b);var c=a.Ha,d=gd(a);if(d!==c){c=b.w[c];var e=c.indexOf(a);0<=e&&c.splice(e,1);c=b.w[d]||(b.w[d]=[]);c.push(a);1<c.length&&(b.w[d]=hd(c));}}Yc(b);}}function ad(a,b,c){if(a=(a=z(a))&&a.S)b&&a.addedNodes.push(b), c&&a.removedNodes.push(c), Jb(a);}
function id(a){if(a&&a.nodeType){var b=x(a),c=b.V;void 0===c&&(B(a)?(c=a, b.V=c):(c=(c=a.parentNode)?id(c):a, C.contains.call(document.documentElement,a)&&(b.V=c)));return c}}function jd(a,b,c){var d=[];kd(a.childNodes,b,c,d);return d}function kd(a,b,c,d){for(var e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++){var h;if(h=g.nodeType===Node.ELEMENT_NODE){h=g;var k=b,l=c,n=d,p=k(h);p&&n.push(h);l&&l(p)?h=p:(kd(h.childNodes,k,l,n), h=void 0);}if(h)break}}var ld=null;
function Tc(){ld||(ld=window.ShadyCSS&&window.ShadyCSS.ScopingShim);return ld||null}function md(a,b,c){var d=Tc();d&&"class"===b?d.setElementClass(a,c):(C.setAttribute.call(a,b,c), ed(a,b));}function nd(a,b){if(a.ownerDocument!==document||"template"===a.localName)return C.importNode.call(document,a,b);var c=C.importNode.call(document,a,!1);if(b){a=a.childNodes;b=0;for(var d;b<a.length;b++)d=nd(a[b],!0), c.appendChild(d);}return c}function Qc(a,b){var c=Tc();c&&c.scopeNode(a,b);}
function Uc(a,b){var c=Tc();c&&c.unscopeNode(a,b);}function Vc(a,b){var c=Tc();if(!c)return!0;if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){c=!0;for(var d=0;c&&d<a.childNodes.length;d++)c=c&&Vc(a.childNodes[d],b);return c}return a.nodeType!==Node.ELEMENT_NODE?!0:c.currentScopeForNode(a)===b}function Rc(a){if(a.nodeType!==Node.ELEMENT_NODE)return"";var b=Tc();return b?b.currentScopeForNode(a):""}
function Wc(a,b){if(a){a.nodeType===Node.ELEMENT_NODE&&b(a);for(var c=0,d;c<a.childNodes.length;c++)d=a.childNodes[c], d.nodeType===Node.ELEMENT_NODE&&Wc(d,b);}}var od="__eventWrappers"+Date.now(),pd=function(){var a=Object.getOwnPropertyDescriptor(Event.prototype,"composed");return a?function(b){return a.get.call(b)}:null}(),qd={blur:!0,focus:!0,focusin:!0,focusout:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseout:!0,mouseover:!0,mouseup:!0,wheel:!0,beforeinput:!0,input:!0,keydown:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,touchstart:!0,touchend:!0,touchmove:!0,touchcancel:!0,pointerover:!0,
pointerenter:!0,pointerdown:!0,pointermove:!0,pointerup:!0,pointercancel:!0,pointerout:!0,pointerleave:!0,gotpointercapture:!0,lostpointercapture:!0,dragstart:!0,drag:!0,dragenter:!0,dragleave:!0,dragover:!0,drop:!0,dragend:!0,DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,keypress:!0},rd={DOMAttrModified:!0,DOMAttributeNameChanged:!0,DOMCharacterDataModified:!0,DOMElementNameChanged:!0,DOMNodeInserted:!0,DOMNodeInsertedIntoDocument:!0,DOMNodeRemoved:!0,DOMNodeRemovedFromDocument:!0,DOMSubtreeModified:!0};
function sd(a,b){var c=[],d=a;for(a=a===window?window:a.getRootNode();d;)c.push(d), d=d.assignedSlot?d.assignedSlot:d.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&d.host&&(b||d!==a)?d.host:d.parentNode;c[c.length-1]===document&&c.push(window);return c}function td(a,b){if(!B)return a;a=sd(a,!0);for(var c=0,d,e=void 0,f,g=void 0;c<b.length;c++)if(d=b[c], f=d===window?window:d.getRootNode(), f!==e&&(g=a.indexOf(f), e=f), !B(f)||-1<g)return d}
var ud={get composed(){void 0===this.Y&&(pd?this.Y="focusin"===this.type||"focusout"===this.type||pd(this):!1!==this.isTrusted&&(this.Y=qd[this.type]));return this.Y||!1},composedPath:function(){this.ta||(this.ta=sd(this.__target,this.composed));return this.ta},get target(){return td(this.currentTarget||this.__previousCurrentTarget,this.composedPath())},get relatedTarget(){if(!this.la)return null;this.va||(this.va=sd(this.la,!0));return td(this.currentTarget||this.__previousCurrentTarget,this.va)},
stopPropagation:function(){Event.prototype.stopPropagation.call(this);this.ka=!0;},stopImmediatePropagation:function(){Event.prototype.stopImmediatePropagation.call(this);this.ka=this.Da=!0;}};function vd(a){function b(b,d){b=new a(b,d);b.Y=d&&!!d.composed;return b}tb(b,a);b.prototype=a.prototype;return b}var wd={focus:!0,blur:!0};function xd(a){return a.__target!==a.target||a.la!==a.relatedTarget}
function yd(a,b,c){if(c=b.__handlers&&b.__handlers[a.type]&&b.__handlers[a.type][c])for(var d=0,e;(e=c[d])&&(!xd(a)||a.target!==a.relatedTarget)&&(e.call(b,a), !a.Da);d++);}
function zd(a){var b=a.composedPath();Object.defineProperty(a,"currentTarget",{get:function(){return d},configurable:!0});for(var c=b.length-1;0<=c;c--){var d=b[c];yd(a,d,"capture");if(a.ka)return}Object.defineProperty(a,"eventPhase",{get:function(){return Event.AT_TARGET}});var e;for(c=0;c<b.length;c++){d=b[c];var f=z(d);f=f&&f.root;if(0===c||f&&f===e)if(yd(a,d,"bubble"), d!==window&&(e=d.getRootNode()), a.ka)break}}
function Ad(a,b,c,d,e,f){for(var g=0;g<a.length;g++){var h=a[g],k=h.type,l=h.capture,n=h.once,p=h.passive;if(b===h.node&&c===k&&d===l&&e===n&&f===p)return g}return-1}
function Bd(a,b,c){if(b){var d=typeof b;if("function"===d||"object"===d)if("object"!==d||b.handleEvent&&"function"===typeof b.handleEvent){var e=this instanceof Window?C.gb:C.addEventListener;if(rd[a])return e.call(this,a,b,c);if(c&&"object"===typeof c){var f=!!c.capture;var g=!!c.once;var h=!!c.passive;}else f=!!c, h=g=!1;var k=c&&c.na||this,l=b[od];if(l){if(-1<Ad(l,k,a,f,g,h))return}else b[od]=[];l=function(e){g&&this.removeEventListener(a,b,c);e.__target||Cd(e);if(k!==this){var f=Object.getOwnPropertyDescriptor(e,
"currentTarget");Object.defineProperty(e,"currentTarget",{get:function(){return k},configurable:!0});}e.__previousCurrentTarget=e.currentTarget;if(!B(k)||-1!=e.composedPath().indexOf(k))if(e.composed||-1<e.composedPath().indexOf(k))if(xd(e)&&e.target===e.relatedTarget)e.eventPhase===Event.BUBBLING_PHASE&&e.stopImmediatePropagation();else if(e.eventPhase===Event.CAPTURING_PHASE||e.bubbles||e.target===k||k instanceof Window){var h="function"===d?b.call(k,e):b.handleEvent&&b.handleEvent(e);k!==this&&
(f?(Object.defineProperty(e,"currentTarget",f), f=null):delete e.currentTarget);return h}};b[od].push({node:k,type:a,capture:f,once:g,passive:h,ib:l});wd[a]?(this.__handlers=this.__handlers||{}, this.__handlers[a]=this.__handlers[a]||{capture:[],bubble:[]}, this.__handlers[a][f?"capture":"bubble"].push(l)):e.call(this,a,l,c);}}}
function Dd(a,b,c){if(b){var d=this instanceof Window?C.hb:C.removeEventListener;if(rd[a])return d.call(this,a,b,c);if(c&&"object"===typeof c){var e=!!c.capture;var f=!!c.once;var g=!!c.passive;}else e=!!c, g=f=!1;var h=c&&c.na||this,k=void 0;var l=null;try{l=b[od];}catch(n){}l&&(f=Ad(l,h,a,e,f,g), -1<f&&(k=l.splice(f,1)[0].ib, l.length||(b[od]=void 0)));d.call(this,a,k||b,c);k&&wd[a]&&this.__handlers&&this.__handlers[a]&&(a=this.__handlers[a][e?"capture":"bubble"], k=a.indexOf(k), -1<k&&a.splice(k,1));}}
function Ed(){for(var a in wd)window.addEventListener(a,function(a){a.__target||(Cd(a), zd(a));},!0);}function Cd(a){a.__target=a.target;a.la=a.relatedTarget;if(A.K){var b=Object.getPrototypeOf(a);if(!b.hasOwnProperty("__patchProto")){var c=Object.create(b);c.jb=b;rb(c,ud);b.__patchProto=c;}a.__proto__=b.__patchProto;}else rb(a,ud);}var Fd=vd(window.Event),Gd=vd(window.CustomEvent),Hd=vd(window.MouseEvent);
function Id(){window.Event=Fd;window.CustomEvent=Gd;window.MouseEvent=Hd;Ed();if(!pd&&Object.getOwnPropertyDescriptor(Event.prototype,"isTrusted")){var a=function(){var a=new MouseEvent("click",{bubbles:!0,cancelable:!0,composed:!0});this.dispatchEvent(a);};Element.prototype.click?Element.prototype.click=a:HTMLElement.prototype.click&&(HTMLElement.prototype.click=a);}}function Jd(a,b){return{index:a,W:[],ba:b}}
function Kd(a,b,c,d){var e=0,f=0,g=0,h=0,k=Math.min(b-e,d-f);if(0==e&&0==f)a:{for(g=0;g<k;g++)if(a[g]!==c[g])break a;g=k;}if(b==a.length&&d==c.length){h=a.length;for(var l=c.length,n=0;n<k-g&&Ld(a[--h],c[--l]);)n++;h=n;}e+=g;f+=g;b-=h;d-=h;if(0==b-e&&0==d-f)return[];if(e==b){for(b=Jd(e,0);f<d;)b.W.push(c[f++]);return[b]}if(f==d)return[Jd(e,b-e)];k=e;g=f;d=d-g+1;h=b-k+1;b=Array(d);for(l=0;l<d;l++)b[l]=Array(h), b[l][0]=l;for(l=0;l<h;l++)b[0][l]=l;for(l=1;l<d;l++)for(n=1;n<h;n++)if(a[k+n-1]===c[g+l-1])b[l][n]=
b[l-1][n-1];else{var p=b[l-1][n]+1,G=b[l][n-1]+1;b[l][n]=p<G?p:G;}k=b.length-1;g=b[0].length-1;d=b[k][g];for(a=[];0<k||0<g;)0==k?(a.push(2), g--):0==g?(a.push(3), k--):(h=b[k-1][g-1], l=b[k-1][g], n=b[k][g-1], p=l<n?l<h?l:h:n<h?n:h, p==h?(h==d?a.push(0):(a.push(1), d=h), k--, g--):p==l?(a.push(3), k--, d=l):(a.push(2), g--, d=n));a.reverse();b=void 0;k=[];for(g=0;g<a.length;g++)switch(a[g]){case 0:b&&(k.push(b), b=void 0);e++;f++;break;case 1:b||(b=Jd(e,0));b.ba++;e++;b.W.push(c[f]);f++;break;case 2:b||(b=Jd(e,
0));b.ba++;e++;break;case 3:b||(b=Jd(e,0)), b.W.push(c[f]), f++;}b&&k.push(b);return k}function Ld(a,b){return a===b}var Md=J.parentNode,Nd=J.childNodes,Od={},Pd=A.deferConnectionCallbacks&&"loading"===document.readyState,Qd;function Rd(a){var b=[];do b.unshift(a);while(a=a.parentNode);return b}
function Gc(a,b,c){if(a!==Od)throw new TypeError("Illegal constructor");this.Ja="ShadyRoot";this.host=b;this.c=c&&c.mode;Nc(b);a=x(b);a.root=this;a.za="closed"!==this.c?this:null;a=x(this);a.firstChild=a.lastChild=a.parentNode=a.nextSibling=a.previousSibling=null;a.childNodes=[];this.b=this.aa=!1;this.a=this.w=this.o=null;Yc(this);}function Yc(a){a.aa||(a.aa=!0, Gb(function(){return Sd(a)}));}
function Sd(a){for(var b;a;){a.aa&&(b=a);a:{var c=a;a=c.host.getRootNode();if(B(a))for(var d=c.host.childNodes,e=0;e<d.length;e++)if(c=d[e], "slot"==c.localName)break a;a=void 0;}}b&&b._renderRoot();}
Gc.prototype._renderRoot=function(){var a=Pd;Pd=!0;this.aa=!1;if(this.o){fd(this);for(var b=0,c;b<this.o.length;b++){c=this.o[b];var d=z(c),e=d.assignedNodes;d.assignedNodes=[];d.N=[];if(d.oa=e)for(d=0;d<e.length;d++){var f=z(e[d]);f.$=f.assignedSlot;f.assignedSlot===c&&(f.assignedSlot=null);}}for(b=this.host.firstChild;b;b=b.nextSibling)Td(this,b);for(b=0;b<this.o.length;b++){c=this.o[b];e=z(c);if(!e.assignedNodes.length)for(d=c.firstChild;d;d=d.nextSibling)Td(this,d,c);(d=(d=z(c.parentNode))&&d.root)&&
dd(d)&&d._renderRoot();Ud(this,e.N,e.assignedNodes);if(d=e.oa){for(f=0;f<d.length;f++)z(d[f]).$=null;e.oa=null;d.length>e.assignedNodes.length&&(e.ea=!0);}e.ea&&(e.ea=!1, Vd(this,c));}c=this.o;b=[];for(e=0;e<c.length;e++)d=c[e].parentNode, (f=z(d))&&f.root||!(0>b.indexOf(d))||b.push(d);for(c=0;c<b.length;c++){f=b[c];e=f===this?this.host:f;d=[];f=f.childNodes;for(var g=0;g<f.length;g++){var h=f[g];if("slot"==h.localName){h=z(h).N;for(var k=0;k<h.length;k++)d.push(h[k]);}else d.push(h);}f=Nd(e);g=Kd(d,d.length,
f,f.length);k=h=0;for(var l=void 0;h<g.length&&(l=g[h]);h++){for(var n=0,p=void 0;n<l.W.length&&(p=l.W[n]);n++)Md(p)===e&&C.removeChild.call(e,p), f.splice(l.index+k,1);k-=l.ba;}k=0;for(l=void 0;k<g.length&&(l=g[k]);k++)for(h=f[l.index], n=l.index;n<l.index+l.ba;n++)p=d[n], C.insertBefore.call(e,p,h), f.splice(n,0,p);}}if(!this.b)for(b=this.host.childNodes, c=0, e=b.length;c<e;c++)d=b[c], f=z(d), Md(d)!==this.host||"slot"!==d.localName&&f.assignedSlot||C.removeChild.call(this.host,d);this.b=!0;Pd=a;Qd&&Qd();};
function Td(a,b,c){var d=x(b),e=d.$;d.$=null;c||(c=(a=a.w[b.slot||"__catchall"])&&a[0]);c?(x(c).assignedNodes.push(b), d.assignedSlot=c):d.assignedSlot=void 0;e!==d.assignedSlot&&d.assignedSlot&&(x(d.assignedSlot).ea=!0);}function Ud(a,b,c){for(var d=0,e=void 0;d<c.length&&(e=c[d]);d++)if("slot"==e.localName){var f=z(e).assignedNodes;f&&f.length&&Ud(a,b,f);}else b.push(c[d]);}function Vd(a,b){C.dispatchEvent.call(b,new Event("slotchange"));b=z(b);b.assignedSlot&&Vd(a,b.assignedSlot);}
function Xc(a,b){a.a=a.a||[];a.o=a.o||[];a.w=a.w||{};a.a.push.apply(a.a,b instanceof Array?b:na(ma(b)));}function fd(a){if(a.a&&a.a.length){for(var b=a.a,c,d=0;d<b.length;d++){var e=b[d];Nc(e);Nc(e.parentNode);var f=gd(e);a.w[f]?(c=c||{}, c[f]=!0, a.w[f].push(e)):a.w[f]=[e];a.o.push(e);}if(c)for(var g in c)a.w[g]=hd(a.w[g]);a.a=[];}}function gd(a){var b=a.name||a.getAttribute("name")||"__catchall";return a.Ha=b}
function hd(a){return a.sort(function(a,c){a=Rd(a);for(var b=Rd(c),e=0;e<a.length;e++){c=a[e];var f=b[e];if(c!==f)return a=Array.from(c.parentNode.childNodes), a.indexOf(c)-a.indexOf(f)}})}function cd(a,b){if(a.o){fd(a);var c=a.w,d;for(d in c)for(var e=c[d],f=0;f<e.length;f++){var g=e[f];if(Cb(b,g)){e.splice(f,1);var h=a.o.indexOf(g);0<=h&&a.o.splice(h,1);f--;g=z(g);if(h=g.N)for(var k=0;k<h.length;k++){var l=h[k],n=Md(l);n&&C.removeChild.call(n,l);}g.N=[];g.assignedNodes=[];h=!0;}}return h}}
function dd(a){fd(a);return!(!a.o||!a.o.length)}
if(window.customElements&&A.qa){var Wd=new Map;Qd=function(){var a=Array.from(Wd);Wd.clear();a=ma(a);for(var b=a.next();!b.done;b=a.next()){b=ma(b.value);var c=b.next().value;b.next().value?c.Fa():c.Ga();}};Pd&&document.addEventListener("readystatechange",function(){Pd=!1;Qd();},{once:!0});var Xd=function(a,b,c){var d=0,e="__isConnected"+d++;if(b||c)a.prototype.connectedCallback=a.prototype.Fa=function(){Pd?Wd.set(this,!0):this[e]||(this[e]=!0, b&&b.call(this));}, a.prototype.disconnectedCallback=a.prototype.Ga=
function(){Pd?this.isConnected||Wd.set(this,!1):this[e]&&(this[e]=!1, c&&c.call(this));};return a},define=window.customElements.define;Object.defineProperty(window.CustomElementRegistry.prototype,"define",{value:function(a,b){var c=b.prototype.connectedCallback,d=b.prototype.disconnectedCallback;define.call(window.customElements,a,Xd(b,c,d));b.prototype.connectedCallback=c;b.prototype.disconnectedCallback=d;}});}function Yd(a){var b=a.getRootNode();B(b)&&Sd(b);return(a=z(a))&&a.assignedSlot||null}
var Zd={addEventListener:Bd.bind(window),removeEventListener:Dd.bind(window)},$d={addEventListener:Bd,removeEventListener:Dd,appendChild:function(a){return Pc(this,a)},insertBefore:function(a,b){return Pc(this,a,b)},removeChild:function(a){return Sc(this,a)},replaceChild:function(a,b){Pc(this,a,b);Sc(this,b);return a},cloneNode:function(a){if("template"==this.localName)var b=C.cloneNode.call(this,a);else if(b=C.cloneNode.call(this,!1), a&&b.nodeType!==Node.ATTRIBUTE_NODE){a=this.childNodes;for(var c=
0,d;c<a.length;c++)d=a[c].cloneNode(!0), b.appendChild(d);}return b},getRootNode:function(){return id(this)},contains:function(a){return Cb(this,a)},dispatchEvent:function(a){Hb();return C.dispatchEvent.call(this,a)}};
Object.defineProperties($d,{isConnected:{get:function(){if(xc&&xc.call(this))return!0;if(this.nodeType==Node.DOCUMENT_FRAGMENT_NODE)return!1;var a=this.ownerDocument;if(Bb){if(C.contains.call(a,this))return!0}else if(a.documentElement&&C.contains.call(a.documentElement,this))return!0;for(a=this;a&&!(a instanceof Document);)a=a.parentNode||(B(a)?a.host:void 0);return!!(a&&a instanceof Document)},configurable:!0}});
var ae={get assignedSlot(){return Yd(this)}},be={querySelector:function(a){return jd(this,function(b){return qb.call(b,a)},function(a){return!!a})[0]||null},querySelectorAll:function(a,b){if(b){b=Array.prototype.slice.call(C.querySelectorAll.call(this,a));var c=this.getRootNode();return b.filter(function(a){return a.getRootNode()==c})}return jd(this,function(b){return qb.call(b,a)})}},ce={assignedNodes:function(a){if("slot"===this.localName){var b=this.getRootNode();B(b)&&Sd(b);return(b=z(this))?
(a&&a.flatten?b.N:b.assignedNodes)||[]:[]}}},de=sb({setAttribute:function(a,b){md(this,a,b);},removeAttribute:function(a){C.removeAttribute.call(this,a);ed(this,a);},attachShadow:function(a){if(!this)throw"Must provide a host.";if(!a)throw"Not enough arguments.";return new Gc(Od,this,a)},get slot(){return this.getAttribute("slot")},set slot(a){md(this,"slot",a);},get assignedSlot(){return Yd(this)}},be,ce);Object.defineProperties(de,Cc);
var ee=sb({importNode:function(a,b){return nd(a,b)},getElementById:function(a){return jd(this,function(b){return b.id==a},function(a){return!!a})[0]||null}},be);Object.defineProperties(ee,{_activeElement:Dc.activeElement});
for(var fe=HTMLElement.prototype.blur,ge={blur:function(){var a=z(this);(a=(a=a&&a.root)&&a.activeElement)?a.blur():fe.call(this);}},he={},ie=ma(Object.getOwnPropertyNames(Document.prototype)),je=ie.next();!je.done;he={H:he.H}, je=ie.next())he.H=je.value, "on"===he.H.substring(0,2)&&Object.defineProperty(ge,he.H,{set:function(a){return function(b){var c=x(this),d=a.H.substring(2);c.Z[a.H]&&this.removeEventListener(d,c.Z[a.H]);this.addEventListener(d,b,{});c.Z[a.H]=b;}}(he),get:function(a){return function(){var b=
z(this);return b&&b.Z[a.H]}}(he),configurable:!0});var ke={addEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.na=this;this.host.addEventListener(a,b,c);},removeEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.na=this;this.host.removeEventListener(a,b,c);},getElementById:function(a){return jd(this,function(b){return b.id==a},function(a){return!!a})[0]||null}};
function L(a,b){for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){var e=c[d],f=Object.getOwnPropertyDescriptor(b,e);f.value?a[e]=f.value:Object.defineProperty(a,e,f);}}if(A.qa){var ShadyDOM={inUse:A.qa,patch:function(a){Ic(a);Hc(a);return a},isShadyRoot:B,enqueue:Gb,flush:Hb,settings:A,filterMutations:Mb,observeChildren:Kb,unobserveChildren:Lb,nativeMethods:C,nativeTree:J,deferConnectionCallbacks:A.deferConnectionCallbacks,handlesDynamicScoping:!0};window.ShadyDOM=ShadyDOM;Id();var le=window.customElements&&window.customElements.nativeHTMLElement||HTMLElement;L(Gc.prototype,ke);L(window.Node.prototype,$d);L(window.Window.prototype,Zd);L(window.Text.prototype,ae);
L(window.DocumentFragment.prototype,be);L(window.Element.prototype,de);L(window.Document.prototype,ee);window.HTMLSlotElement&&L(window.HTMLSlotElement.prototype,ce);L(le.prototype,ge);A.K&&(Ec(window.Node.prototype), Ec(window.Text.prototype), Ec(window.DocumentFragment.prototype), Ec(window.Element.prototype), Ec(le.prototype), Ec(window.Document.prototype), window.HTMLSlotElement&&Ec(window.HTMLSlotElement.prototype));Fc();window.ShadowRoot=Gc;}var me=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function ne(a){var b=me.has(a);a=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);return!b&&a}function M(a){var b=a.isConnected;if(void 0!==b)return b;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return!(!a||!(a.__CE_isImportDocument||a instanceof Document))}
function oe(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
function pe(a,b,c){c=void 0===c?new Set:c;for(var d=a;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;b(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d), d=d.firstChild;d;d=d.nextSibling)pe(d,b,c);d=oe(a,e);continue}else if("template"===f){d=oe(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)pe(e,b,c);}d=d.firstChild?d.firstChild:oe(a,d);}}function N(a,b,c){a[b]=c;}function qe(){this.a=new Map;this.m=new Map;this.f=[];this.c=!1;}function re(a,b,c){a.a.set(b,c);a.m.set(c.constructor,c);}function se(a,b){a.c=!0;a.f.push(b);}function te(a,b){a.c&&pe(b,function(b){return a.b(b)});}qe.prototype.b=function(a){if(this.c&&!a.__CE_patched){a.__CE_patched=!0;for(var b=0;b<this.f.length;b++)this.f[b](a);}};function O(a,b){var c=[];pe(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state?a.connectedCallback(d):ue(a,d);}}
function P(a,b){var c=[];pe(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state&&a.disconnectedCallback(d);}}
function Q(a,b,c){c=void 0===c?{}:c;var d=c.fb||new Set,e=c.ia||function(b){return ue(a,b)},f=[];pe(b,function(b){if("link"===b.localName&&"import"===b.getAttribute("rel")){var c=b.import;c instanceof Node&&(c.__CE_isImportDocument=!0, c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:b.addEventListener("load",function(){var c=b.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);Q(a,c,{fb:f,ia:e});}});}else f.push(b);},d);
if(a.c)for(b=0;b<f.length;b++)a.b(f[b]);for(b=0;b<f.length;b++)e(f[b]);}
function ue(a,b){if(void 0===b.__CE_state){var c=b.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=a.a.get(b.localName)){c.constructionStack.push(b);var d=c.constructor;try{try{if(new d!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop();}}catch(g){throw b.__CE_state=2, g;}b.__CE_state=1;b.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes, d=0;d<c.length;d++){var e=c[d],
f=b.getAttribute(e);null!==f&&a.attributeChangedCallback(b,e,null,f,null);}M(b)&&a.connectedCallback(b);}}}qe.prototype.connectedCallback=function(a){var b=a.__CE_definition;b.connectedCallback&&b.connectedCallback.call(a);};qe.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;b.disconnectedCallback&&b.disconnectedCallback.call(a);};
qe.prototype.attributeChangedCallback=function(a,b,c,d,e){var f=a.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b)&&f.attributeChangedCallback.call(a,b,c,d,e);};function ve(a){var b=document;this.b=a;this.a=b;this.P=void 0;Q(this.b,this.a);"loading"===this.a.readyState&&(this.P=new MutationObserver(this.c.bind(this)), this.P.observe(this.a,{childList:!0,subtree:!0}));}function we(a){a.P&&a.P.disconnect();}ve.prototype.c=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||we(this);for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,d=0;d<c.length;d++)Q(this.b,c[d]);};function xe(){var a=this;this.a=this.A=void 0;this.b=new Promise(function(b){a.a=b;a.A&&b(a.A);});}xe.prototype.resolve=function(a){if(this.A)throw Error("Already resolved.");this.A=a;this.a&&this.a(a);};function S(a){this.c=!1;this.a=a;this.G=new Map;this.f=function(a){return a()};this.b=!1;this.m=[];this.fa=new ve(a);}r=S.prototype;
r.define=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!ne(a))throw new SyntaxError("The element name '"+a+"' is not valid.");if(this.a.a.get(a))throw Error("A custom element with name '"+a+"' has already been defined.");if(this.c)throw Error("A custom element is already being defined.");this.c=!0;try{var d=function(a){var b=e[a];if(void 0!==b&&!(b instanceof Function))throw Error("The '"+a+"' callback must be a function.");
return b},e=b.prototype;if(!(e instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var f=d("connectedCallback");var g=d("disconnectedCallback");var h=d("adoptedCallback");var k=d("attributeChangedCallback");var l=b.observedAttributes||[];}catch(n){return}finally{this.c=!1;}b={localName:a,constructor:b,connectedCallback:f,disconnectedCallback:g,adoptedCallback:h,attributeChangedCallback:k,observedAttributes:l,constructionStack:[]};re(this.a,a,b);this.m.push(b);
this.b||(this.b=!0, this.f(function(){return ye(c)}));};r.ia=function(a){Q(this.a,a);};function ye(a){if(!1!==a.b){a.b=!1;for(var b=a.m,c=[],d=new Map,e=0;e<b.length;e++)d.set(b[e].localName,[]);Q(a.a,document,{ia:function(b){if(void 0===b.__CE_state){var e=b.localName,f=d.get(e);f?f.push(b):a.a.a.get(e)&&c.push(b);}}});for(e=0;e<c.length;e++)ue(a.a,c[e]);for(;0<b.length;){var f=b.shift();e=f.localName;f=d.get(f.localName);for(var g=0;g<f.length;g++)ue(a.a,f[g]);(e=a.G.get(e))&&e.resolve(void 0);}}}
r.get=function(a){if(a=this.a.a.get(a))return a.constructor};r.Ca=function(a){if(!ne(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.G.get(a);if(b)return b.b;b=new xe;this.G.set(a,b);this.a.a.get(a)&&!this.m.some(function(b){return b.localName===a})&&b.resolve(void 0);return b.b};r.Ya=function(a){we(this.fa);var b=this.f;this.f=function(c){return a(function(){return b(c)})};};window.CustomElementRegistry=S;S.prototype.define=S.prototype.define;
S.prototype.upgrade=S.prototype.ia;S.prototype.get=S.prototype.get;S.prototype.whenDefined=S.prototype.Ca;S.prototype.polyfillWrapFlushCallback=S.prototype.Ya;var ze=window.Document.prototype.createElement,Ae=window.Document.prototype.createElementNS,Be=window.Document.prototype.importNode,Ce=window.Document.prototype.prepend,De=window.Document.prototype.append,Ee=window.DocumentFragment.prototype.prepend,Fe=window.DocumentFragment.prototype.append,Ge=window.Node.prototype.cloneNode,He=window.Node.prototype.appendChild,Ie=window.Node.prototype.insertBefore,Je=window.Node.prototype.removeChild,Ke=window.Node.prototype.replaceChild,Le=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),Me=window.Element.prototype.attachShadow,Ne=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Oe=window.Element.prototype.getAttribute,Pe=window.Element.prototype.setAttribute,Qe=window.Element.prototype.removeAttribute,Re=window.Element.prototype.getAttributeNS,Se=window.Element.prototype.setAttributeNS,Te=window.Element.prototype.removeAttributeNS,Ue=window.Element.prototype.insertAdjacentElement,Ve=window.Element.prototype.insertAdjacentHTML,We=window.Element.prototype.prepend,
Xe=window.Element.prototype.append,Ye=window.Element.prototype.before,Ze=window.Element.prototype.after,$e=window.Element.prototype.replaceWith,af=window.Element.prototype.remove,bf=window.HTMLElement,cf=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),df=window.HTMLElement.prototype.insertAdjacentElement,ef=window.HTMLElement.prototype.insertAdjacentHTML;var ff=new function(){};function gf(){var a=hf;window.HTMLElement=function(){function b(){var b=this.constructor,d=a.m.get(b);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(0===e.length)return e=ze.call(document,d.localName), Object.setPrototypeOf(e,b.prototype), e.__CE_state=1, e.__CE_definition=d, a.b(e), e;d=e.length-1;var f=e[d];if(f===ff)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[d]=ff;Object.setPrototypeOf(f,b.prototype);a.b(f);return f}b.prototype=bf.prototype;Object.defineProperty(b.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});return b}();}function jf(a,b,c){function d(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var f=[],l=0;l<d.length;l++){var n=d[l];n instanceof Element&&M(n)&&f.push(n);if(n instanceof DocumentFragment)for(n=n.firstChild;n;n=n.nextSibling)e.push(n);else e.push(n);}b.apply(this,d);for(d=0;d<f.length;d++)P(a,f[d]);if(M(this))for(d=0;d<e.length;d++)f=e[d], f instanceof Element&&O(a,f);}}void 0!==c.ha&&(b.prepend=d(c.ha));void 0!==c.append&&(b.append=d(c.append));}function kf(){var a=hf;N(Document.prototype,"createElement",function(b){if(this.__CE_hasRegistry){var c=a.a.get(b);if(c)return new c.constructor}b=ze.call(this,b);a.b(b);return b});N(Document.prototype,"importNode",function(b,c){b=Be.call(this,b,c);this.__CE_hasRegistry?Q(a,b):te(a,b);return b});N(Document.prototype,"createElementNS",function(b,c){if(this.__CE_hasRegistry&&(null===b||"http://www.w3.org/1999/xhtml"===b)){var d=a.a.get(c);if(d)return new d.constructor}b=Ae.call(this,b,c);a.b(b);return b});
jf(a,Document.prototype,{ha:Ce,append:De});}function lf(){function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var c=void 0;if(this.firstChild){var e=this.childNodes,h=e.length;if(0<h&&M(this)){c=Array(h);for(var k=0;k<h;k++)c[k]=e[k];}}d.set.call(this,a);if(c)for(a=0;a<c.length;a++)P(b,c[a]);}}});}var b=hf;N(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);
a=Ie.call(this,a,d);if(M(this))for(d=0;d<c.length;d++)O(b,c[d]);return a}c=M(a);d=Ie.call(this,a,d);c&&P(b,a);M(this)&&O(b,a);return d});N(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=He.call(this,a);if(M(this))for(var e=0;e<c.length;e++)O(b,c[e]);return a}c=M(a);e=He.call(this,a);c&&P(b,a);M(this)&&O(b,a);return e});N(Node.prototype,"cloneNode",function(a){a=Ge.call(this,a);this.ownerDocument.__CE_hasRegistry?Q(b,a):
te(b,a);return a});N(Node.prototype,"removeChild",function(a){var c=M(a),e=Je.call(this,a);c&&P(b,a);return e});N(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=Ke.call(this,a,d);if(M(this))for(P(b,d), d=0;d<c.length;d++)O(b,c[d]);return a}c=M(a);var f=Ke.call(this,a,d),g=M(this);g&&P(b,d);c&&P(b,a);g&&O(b,a);return f});Le&&Le.get?a(Node.prototype,Le):se(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=
[],b=0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)Je.call(this,this.firstChild);He.call(this,document.createTextNode(a));}});});}function mf(a){function b(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var h=[],k=0;k<d.length;k++){var l=d[k];l instanceof Element&&M(l)&&h.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)e.push(l);else e.push(l);}b.apply(this,d);for(d=0;d<h.length;d++)P(a,h[d]);if(M(this))for(d=0;d<e.length;d++)h=e[d], h instanceof Element&&O(a,h);}}var c=Element.prototype;void 0!==Ye&&(c.before=b(Ye));void 0!==Ye&&(c.after=b(Ze));void 0!==$e&&
N(c,"replaceWith",function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var g=[],h=0;h<c.length;h++){var k=c[h];k instanceof Element&&M(k)&&g.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)d.push(k);else d.push(k);}h=M(this);$e.apply(this,c);for(c=0;c<g.length;c++)P(a,g[c]);if(h)for(P(a,this), c=0;c<d.length;c++)g=d[c], g instanceof Element&&O(a,g);});void 0!==af&&N(c,"remove",function(){var b=M(this);af.call(this);b&&P(a,this);});}function nf(){function a(a,b){Object.defineProperty(a,"innerHTML",{enumerable:b.enumerable,configurable:!0,get:b.get,set:function(a){var c=this,e=void 0;M(this)&&(e=[], pe(this,function(a){a!==c&&e.push(a);}));b.set.call(this,a);if(e)for(var f=0;f<e.length;f++){var g=e[f];1===g.__CE_state&&d.disconnectedCallback(g);}this.ownerDocument.__CE_hasRegistry?Q(d,this):te(d,this);return a}});}function b(a,b){N(a,"insertAdjacentElement",function(a,c){var e=M(c);a=b.call(this,a,c);e&&P(d,c);M(a)&&O(d,c);return a});}
function c(a,b){function c(a,b){for(var c=[];a!==b;a=a.nextSibling)c.push(a);for(b=0;b<c.length;b++)Q(d,c[b]);}N(a,"insertAdjacentHTML",function(a,d){a=a.toLowerCase();if("beforebegin"===a){var e=this.previousSibling;b.call(this,a,d);c(e||this.parentNode.firstChild,this);}else if("afterbegin"===a)e=this.firstChild, b.call(this,a,d), c(this.firstChild,e);else if("beforeend"===a)e=this.lastChild, b.call(this,a,d), c(e||this.firstChild,null);else if("afterend"===a)e=this.nextSibling, b.call(this,a,d), c(this.nextSibling,
e);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");});}var d=hf;Me&&N(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=Me.call(this,a)});Ne&&Ne.get?a(Element.prototype,Ne):cf&&cf.get?a(HTMLElement.prototype,cf):se(d,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return Ge.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName,c=b?this.content:this,d=Ae.call(document,
this.namespaceURI,this.localName);for(d.innerHTML=a;0<c.childNodes.length;)Je.call(c,c.childNodes[0]);for(a=b?d.content:d;0<a.childNodes.length;)He.call(c,a.childNodes[0]);}});});N(Element.prototype,"setAttribute",function(a,b){if(1!==this.__CE_state)return Pe.call(this,a,b);var c=Oe.call(this,a);Pe.call(this,a,b);b=Oe.call(this,a);d.attributeChangedCallback(this,a,c,b,null);});N(Element.prototype,"setAttributeNS",function(a,b,c){if(1!==this.__CE_state)return Se.call(this,a,b,c);var e=Re.call(this,a,
b);Se.call(this,a,b,c);c=Re.call(this,a,b);d.attributeChangedCallback(this,b,e,c,a);});N(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return Qe.call(this,a);var b=Oe.call(this,a);Qe.call(this,a);null!==b&&d.attributeChangedCallback(this,a,b,null,null);});N(Element.prototype,"removeAttributeNS",function(a,b){if(1!==this.__CE_state)return Te.call(this,a,b);var c=Re.call(this,a,b);Te.call(this,a,b);var e=Re.call(this,a,b);c!==e&&d.attributeChangedCallback(this,b,c,e,a);});df?b(HTMLElement.prototype,
df):Ue?b(Element.prototype,Ue):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");ef?c(HTMLElement.prototype,ef):Ve?c(Element.prototype,Ve):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");jf(d,Element.prototype,{ha:We,append:Xe});mf(d);}var of=window.customElements;if(!of||of.forcePolyfill||"function"!=typeof of.define||"function"!=typeof of.get){var hf=new qe;gf();kf();jf(hf,DocumentFragment.prototype,{ha:Ee,append:Fe});lf();nf();document.__CE_hasRegistry=!0;var customElements=new S(hf);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements});}function pf(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName="";}
function qf(a){a=a.replace(rf,"").replace(sf,"");var b=vf,c=a,d=new pf;d.start=0;d.end=c.length;for(var e=d,f=0,g=c.length;f<g;f++)if("{"===c[f]){e.rules||(e.rules=[]);var h=e,k=h.rules[h.rules.length-1]||null;e=new pf;e.start=f+1;e.parent=h;e.previous=k;h.rules.push(e);}else"}"===c[f]&&(e.end=f+1, e=e.parent||d);return b(d,a)}
function vf(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1), c=wf(c), c=c.replace(xf," "), c=c.substring(c.lastIndexOf(";")+1), c=a.parsedSelector=a.selector=c.trim(), a.atRule=0===c.indexOf("@"), a.atRule?0===c.indexOf("@media")?a.type=yf:c.match(zf)&&(a.type=Af, a.keyframesName=a.selector.split(xf).pop()):a.type=0===c.indexOf("--")?Bf:Cf);if(c=a.rules)for(var d=0,e=c.length,f=void 0;d<e&&(f=c[d]);d++)vf(f,
b);return a}function wf(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a="0"+a;return"\\"+a})}
function Df(a,b,c){c=void 0===c?"":c;var d="";if(a.cssText||a.rules){var e=a.rules,f;if(f=e)f=e[0], f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var g=e.length,h=void 0;f<g&&(h=e[f]);f++)d=Df(h,b,d);}else b?b=a.cssText:(b=a.cssText, b=b.replace(Ef,"").replace(Ff,""), b=b.replace(Gf,"").replace(Hf,"")), (d=b.trim())&&(d="  "+d+"\n");}d&&(a.selector&&(c+=a.selector+" {\n"), c+=d, a.selector&&(c+="}\n\n"));return c}
var Cf=1,Af=7,yf=4,Bf=1E3,rf=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,sf=/@import[^;]*;/gim,Ef=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,Ff=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,Gf=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,Hf=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,zf=/^@[^\s]*keyframes/,xf=/\s+/g;var T=!(window.ShadyDOM&&window.ShadyDOM.inUse),If;function Jf(a){If=a&&a.shimcssproperties?!1:T||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"));}window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?If=window.ShadyCSS.nativeCss:window.ShadyCSS?(Jf(window.ShadyCSS), window.ShadyCSS=void 0):Jf(window.WebComponents&&window.WebComponents.flags);var V=If;var Kf=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,Lf=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,Mf=/(--[\w-]+)\s*([:,;)]|$)/gi,Nf=/(animation\s*:)|(animation-name\s*:)/,Of=/@media\s(.*)/,Pf=/\{[^}]*\}/g;var Qf=new Set;function Rf(a,b){if(!a)return"";"string"===typeof a&&(a=qf(a));b&&Sf(a,b);return Df(a,V)}function Tf(a){!a.__cssRules&&a.textContent&&(a.__cssRules=qf(a.textContent));return a.__cssRules||null}function Uf(a){return!!a.parent&&a.parent.type===Af}function Sf(a,b,c,d){if(a){var e=!1,f=a.type;if(d&&f===yf){var g=a.selector.match(Of);g&&(window.matchMedia(g[1]).matches||(e=!0));}f===Cf?b(a):c&&f===Af?c(a):f===Bf&&(e=!0);if((a=a.rules)&&!e)for(e=0, f=a.length, g=void 0;e<f&&(g=a[e]);e++)Sf(g,b,c,d);}}
function Vf(a,b,c,d){var e=document.createElement("style");b&&e.setAttribute("scope",b);e.textContent=a;Wf(e,c,d);return e}var Xf=null;function Yf(a){a=document.createComment(" Shady DOM styles for "+a+" ");var b=document.head;b.insertBefore(a,(Xf?Xf.nextSibling:null)||b.firstChild);return Xf=a}function Wf(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);Xf?a.compareDocumentPosition(Xf)===Node.DOCUMENT_POSITION_PRECEDING&&(Xf=a):Xf=a;}
function Zf(a,b){for(var c=0,d=a.length;b<d;b++)if("("===a[b])c++;else if(")"===a[b]&&0===--c)return b;return-1}function $f(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");var d=Zf(a,c+3),e=a.substring(c+4,d);c=a.substring(0,c);a=$f(a.substring(d+1),b);d=e.indexOf(",");return-1===d?b(c,e.trim(),"",a):b(c,e.substring(0,d).trim(),e.substring(d+1).trim(),a)}function ag(a,b){T?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b);}
function bg(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b, b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is, c=a.extends);return{is:b,X:c}}function cg(a){for(var b=[],c="",d=0;0<=d&&d<a.length;d++)if("("===a[d]){var e=Zf(a,d);c+=a.slice(d,e+1);d=e;}else","===a[d]?(b.push(c), c=""):c+=a[d];c&&b.push(c);return b}
function dg(a){if(void 0===a.ja){var b=a.getAttribute("css-build");if(b)a.ja=b;else{a:{b="template"===a.localName?a.content.firstChild:a.firstChild;if(b instanceof Comment&&(b=b.textContent.trim().split(":"), "css-build"===b[0])){b=b[1];break a}b="";}if(""!==b){var c="template"===a.localName?a.content.firstChild:a.firstChild;c.parentNode.removeChild(c);}a.ja=b;}}return a.ja||""}function eg(){}function fg(a,b){gg(W,a,function(a){hg(a,b||"");});}function gg(a,b,c){b.nodeType===Node.ELEMENT_NODE&&c(b);if(b="template"===b.localName?(b.content||b.kb||b).childNodes:b.children||b.childNodes)for(var d=0;d<b.length;d++)gg(a,b[d],c);}
function hg(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"), a.classList.remove(b)):(a.classList.add("style-scope"), a.classList.add(b));else if(a.getAttribute){var d=a.getAttribute(ig);c?d&&(b=d.replace("style-scope","").replace(b,""), ag(a,b)):ag(a,(d?d+" ":"")+"style-scope "+b);}}function jg(a,b,c){gg(W,a,function(a){hg(a,b,!0);hg(a,c);});}function kg(a,b){gg(W,a,function(a){hg(a,b||"",!0);});}
function lg(a,b,c,d){var e=W;T||"shady"===(void 0===d?"":d)?b=Rf(b,c):(a=bg(a), b=mg(e,b,a.is,a.X,c)+"\n\n");return b.trim()}function mg(a,b,c,d,e){var f=ng(c,d);c=c?og+c:"";return Rf(b,function(b){b.c||(b.selector=b.F=pg(a,b,a.b,c,f), b.c=!0);e&&e(b,c,f);})}function ng(a,b){return b?"[is="+a+"]":a}function pg(a,b,c,d,e){var f=cg(b.selector);if(!Uf(b)){b=0;for(var g=f.length,h=void 0;b<g&&(h=f[b]);b++)f[b]=c.call(a,h,d,e);}return f.filter(function(a){return!!a}).join(qg)}
function rg(a){return a.replace(sg,function(a,c,d){-1<d.indexOf("+")?d=d.replace(/\+/g,"___"):-1<d.indexOf("___")&&(d=d.replace(/___/g,"+"));return":"+c+"("+d+")"})}function tg(a){for(var b=[],c;c=a.match(ug);){var d=c.index,e=Zf(a,d);if(-1===e)throw Error(c.input+" selector missing ')'");c=a.slice(d,e+1);a=a.replace(c,"\ue000");b.push(c);}return{sa:a,matches:b}}function vg(a,b){var c=a.split("\ue000");return b.reduce(function(a,b,f){return a+b+c[f+1]},c[0])}
eg.prototype.b=function(a,b,c){var d=!1;a=a.trim();var e=sg.test(a);e&&(a=a.replace(sg,function(a,b,c){return":"+b+"("+c.replace(/\s/g,"")+")"}), a=rg(a));var f=ug.test(a);if(f){var g=tg(a);a=g.sa;g=g.matches;}a=a.replace(wg,xg+" $1");a=a.replace(yg,function(a,e,f){d||(a=zg(f,e,b,c), d=d||a.stop, e=a.Oa, f=a.value);return e+f});f&&(a=vg(a,g));e&&(a=rg(a));return a};
function zg(a,b,c,d){var e=a.indexOf(Ag);0<=a.indexOf(xg)?a=Bg(a,d):0!==e&&(a=c?Cg(a,c):a);c=!1;0<=e&&(b="", c=!0);if(c){var f=!0;c&&(a=a.replace(Dg,function(a,b){return" > "+b}));}a=a.replace(Eg,function(a,b,c){return'[dir="'+c+'"] '+b+", "+b+'[dir="'+c+'"]'});return{value:a,Oa:b,stop:f}}function Cg(a,b){a=a.split(Fg);a[0]+=b;return a.join(Fg)}
function Bg(a,b){var c=a.match(Gg);return(c=c&&c[2].trim()||"")?c[0].match(Hg)?a.replace(Gg,function(a,c,f){return b+f}):c.split(Hg)[0]===b?c:Ig:a.replace(xg,b)}function Jg(a){a.selector===Kg&&(a.selector="html");}eg.prototype.c=function(a){return a.match(xg)?"":a.match(Ag)?this.b(a,Lg):Cg(a.trim(),Lg)};fa.Object.defineProperties(eg.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"style-scope"}}});
var sg=/:(nth[-\w]+)\(([^)]+)\)/,Lg=":not(.style-scope)",qg=",",yg=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,Hg=/[[.:#*]/,xg=":host",Kg=":root",Ag="::slotted",wg=new RegExp("^("+Ag+")"),Gg=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Dg=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Eg=/(.*):dir\((?:(ltr|rtl))\)/,og=".",Fg=":",ig="class",Ig="should_not_match",ug=/:(?:matches|any|-(?:webkit|moz)-any)/,W=new eg;function Mg(a,b,c,d,e){this.M=a||null;this.b=b||null;this.c=c||[];this.T=null;this.da=e||"";this.X=d||"";this.a=this.I=this.O=null;}function X(a){return a?a.__styleInfo:null}function Ng(a,b){return a.__styleInfo=b}Mg.prototype.f=function(){return this.M};Mg.prototype._getStyleRules=Mg.prototype.f;function Og(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var Pg=navigator.userAgent.match("Trident");function Qg(){}function Rg(a){var b={},c=[],d=0;Sf(a,function(a){Sg(a);a.index=d++;a=a.B.cssText;for(var c;c=Mf.exec(a);){var e=c[1];":"!==c[2]&&(b[e]=!0);}},function(a){c.push(a);});a.b=c;a=[];for(var e in b)a.push(e);return a}
function Sg(a){if(!a.B){var b={},c={};Tg(a,c)&&(b.L=c, a.rules=null);b.cssText=a.parsedCssText.replace(Pf,"").replace(Kf,"");a.B=b;}}function Tg(a,b){var c=a.B;if(c){if(c.L)return Object.assign(b,c.L), !0}else{c=a.parsedCssText;for(var d;a=Kf.exec(c);){d=(a[2]||a[3]).trim();if("inherit"!==d||"unset"!==d)b[a[1].trim()]=d;d=!0;}return d}}
function Ug(a,b,c){b&&(b=0<=b.indexOf(";")?Vg(a,b,c):$f(b,function(b,e,f,g){if(!e)return b+g;(e=Ug(a,c[e],c))&&"initial"!==e?"apply-shim-inherit"===e&&(e="inherit"):e=Ug(a,c[f]||f,c)||f;return b+(e||"")+g}));return b&&b.trim()||""}
function Vg(a,b,c){b=b.split(";");for(var d=0,e,f;d<b.length;d++)if(e=b[d]){Lf.lastIndex=0;if(f=Lf.exec(e))e=Ug(a,c[f[1]],c);else if(f=e.indexOf(":"), -1!==f){var g=e.substring(f);g=g.trim();g=Ug(a,g,c)||g;e=e.substring(0,f)+g;}b[d]=e&&e.lastIndexOf(";")===e.length-1?e.slice(0,-1):e||"";}return b.join(";")}
function Wg(a,b){var c={},d=[];Sf(a,function(a){a.B||Sg(a);var e=a.F||a.parsedSelector;b&&a.B.L&&e&&Og.call(b,e)&&(Tg(a,c), a=a.index, e=parseInt(a/32,10), d[e]=(d[e]||0)|1<<a%32);},null,!0);return{L:c,key:d}}
function Xg(a,b,c,d){b.B||Sg(b);if(b.B.L){var e=bg(a);a=e.is;e=e.X;e=a?ng(a,e):"html";var f=b.parsedSelector,g=":host > *"===f||"html"===f,h=0===f.indexOf(":host")&&!g;"shady"===c&&(g=f===e+" > *."+e||-1!==f.indexOf("html"), h=!g&&0===f.indexOf(e));if(g||h)c=e, h&&(b.F||(b.F=pg(W,b,W.b,a?og+a:"",e)), c=b.F||e), d({sa:c,Va:h,vb:g});}}function Yg(a,b,c){var d={},e={};Sf(b,function(b){Xg(a,b,c,function(c){Og.call(a.lb||a,c.sa)&&(c.Va?Tg(b,d):Tg(b,e));});},null,!0);return{Za:e,Ta:d}}
function Zg(a,b,c,d){var e=bg(b),f=ng(e.is,e.X),g=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])"),h=X(b);e=h.M;h=h.da;var k=$g(e,d);return lg(b,e,function(b){var e="";b.B||Sg(b);b.B.cssText&&(e=Vg(a,b.B.cssText,c));b.cssText=e;if(!T&&!Uf(b)&&b.cssText){var h=e=b.cssText;null==b.xa&&(b.xa=Nf.test(e));if(b.xa)if(null==b.ga){b.ga=[];for(var l in k)h=k[l], h=h(e), e!==h&&(e=h, b.ga.push(l));}else{for(l=0;l<b.ga.length;++l)h=k[b.ga[l]], e=h(e);h=e;}b.cssText=h;b.F=b.F||b.selector;
e="."+d;l=cg(b.F);h=0;for(var u=l.length,w=void 0;h<u&&(w=l[h]);h++)l[h]=w.match(g)?w.replace(f,e):e+" "+w;b.selector=l.join(",");}},h)}function $g(a,b){a=a.b;var c={};if(!T&&a)for(var d=0,e=a[d];d<a.length;e=a[++d]){var f=e,g=b;f.f=new RegExp("\\b"+f.keyframesName+"(?!\\B|-)","g");f.a=f.keyframesName+"-"+g;f.F=f.F||f.selector;f.selector=f.F.replace(f.keyframesName,f.a);c[e.keyframesName]=ah(e);}return c}function ah(a){return function(b){return b.replace(a.f,a.a)}}
function bh(a,b){var c=ch,d=Tf(a);a.textContent=Rf(d,function(a){var d=a.cssText=a.parsedCssText;a.B&&a.B.cssText&&(d=d.replace(Ef,"").replace(Ff,""), a.cssText=Vg(c,d,b));});}fa.Object.defineProperties(Qg.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"x-scope"}}});var ch=new Qg;var dh={},eh=window.customElements;if(eh&&!T){var fh=eh.define;eh.define=function(a,b,c){dh[a]||(dh[a]=Yf(a));fh.call(eh,a,b,c);};}function gh(){this.cache={};}gh.prototype.store=function(a,b,c,d){var e=this.cache[a]||[];e.push({L:b,styleElement:c,I:d});100<e.length&&e.shift();this.cache[a]=e;};gh.prototype.fetch=function(a,b,c){if(a=this.cache[a])for(var d=a.length-1;0<=d;d--){var e=a[d],f;a:{for(f=0;f<c.length;f++){var g=c[f];if(e.L[g]!==b[g]){f=!1;break a}}f=!0;}if(f)return e}};function hh(){}function ih(a){var b=[];a.classList?b=Array.from(a.classList):a instanceof window.SVGElement&&a.hasAttribute("class")&&(b=a.getAttribute("class").split(/\s+/));a=b;b=a.indexOf(W.a);return-1<b?a[b+1]:""}function jh(a){var b=a.getRootNode();return b===a||b===a.ownerDocument?"":(a=b.host)?bg(a).is:""}
function kh(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var d=0;d<c.addedNodes.length;d++){var e=c.addedNodes[d];if(e.nodeType===Node.ELEMENT_NODE){var f=e.getRootNode(),g=ih(e);if(g&&f===e.ownerDocument&&("style"!==e.localName&&"template"!==e.localName||""===dg(e)))kg(e,g);else if(f instanceof ShadowRoot)for(f=jh(e), f!==g&&jg(e,g,f), e=window.ShadyDOM.nativeMethods.querySelectorAll.call(e,":not(."+W.a+")"), g=0;g<e.length;g++){f=e[g];
var h=jh(f);h&&hg(f,h);}}}}}
if(!(T||window.ShadyDOM&&window.ShadyDOM.handlesDynamicScoping)){var lh=new MutationObserver(kh),mh=function(a){lh.observe(a,{childList:!0,subtree:!0});};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)mh(document);else{var nh=function(){mh(document.body);};window.HTMLImports?window.HTMLImports.whenReady(nh):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){nh();document.removeEventListener("readystatechange",a);};document.addEventListener("readystatechange",
a);}else nh();});}hh=function(){kh(lh.takeRecords());};}var oh=hh;var ph={};var qh=Promise.resolve();function rh(a){if(a=ph[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0, a._applyShimValidatingVersion=a._applyShimValidatingVersion||0, a._applyShimNextVersion=(a._applyShimNextVersion||0)+1;}function sh(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function th(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a.b||(a.b=!0, qh.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a.b=!1;}));}var uh=new gh;function Y(){this.G={};this.c=document.documentElement;var a=new pf;a.rules=[];this.f=Ng(this.c,new Mg(a));this.m=!1;this.b=this.a=null;}r=Y.prototype;r.flush=function(){oh();};r.Ra=function(a){return Tf(a)};r.cb=function(a){return Rf(a)};r.prepareTemplate=function(a,b,c){this.prepareTemplateDom(a,b);this.prepareTemplateStyles(a,b,c);};
r.prepareTemplateStyles=function(a,b,c){if(!a.m){T||dh[b]||(dh[b]=Yf(b));a.m=!0;a.name=b;a.extends=c;ph[b]=a;var d=dg(a);var e=[];for(var f=a.content.querySelectorAll("style"),g=0;g<f.length;g++){var h=f[g];if(h.hasAttribute("shady-unscoped")){if(!T){var k=h.textContent;Qf.has(k)||(Qf.add(k), k=h.cloneNode(!0), document.head.appendChild(k));h.parentNode.removeChild(h);}}else e.push(h.textContent), h.parentNode.removeChild(h);}e=e.join("").trim();c={is:b,extends:c};vh(this);if(f=""===dg(a))f=Lf.test(e)||
Kf.test(e), Lf.lastIndex=0, Kf.lastIndex=0;e=qf(e);f&&V&&this.a&&this.a.transformRules(e,b);a._styleAst=e;e=[];V||(e=Rg(a._styleAst));if(!e.length||V)f=T?a.content:null, b=dh[b]||null, d=lg(c,a._styleAst,null,d), d=d.length?Vf(d,c.is,f,b):void 0, a.a=d;a.f=e;}};r.prepareTemplateDom=function(a,b){var c=dg(a);T||"shady"===c||a.c||(a.c=!0, fg(a.content,b));};
function wh(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface, a.b.transformCallback=function(b){a.Aa(b);}, a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.m)&&a.flushCustomStyles();});});}function vh(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim, a.a.invalidCallback=rh);wh(a);}
r.flushCustomStyles=function(){vh(this);if(this.b){var a=this.b.processStyles();if(this.b.enqueued){if(V)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&V&&this.a){var d=Tf(c);vh(this);this.a.transformRules(d);c.textContent=Rf(d);}}else for(xh(this,this.c,this.f), b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&bh(c,this.f.O);this.b.enqueued=!1;this.m&&!V&&this.styleDocument();}}};
r.styleElement=function(a,b){var c=X(a);if(!c){var d=bg(a);c=d.is;d=d.X;var e=dh[c]||null;c=ph[c];if(c){var f=c._styleAst;var g=c.f;var h=dg(c);}f=new Mg(f,e,g,d,h);c&&Ng(a,f);c=f;}a!==this.c&&(this.m=!0);b&&(c.T=c.T||{}, Object.assign(c.T,b));if(V){b=c;f=bg(a).is;if(b.T){g=b.T;for(var k in g)null===k?a.style.removeProperty(k):a.style.setProperty(k,g[k]);}if(!(!(k=ph[f])&&a!==this.c||k&&""!==dg(k))&&k&&k.a&&!sh(k)){if(sh(k)||k._applyShimValidatingVersion!==k._applyShimNextVersion)vh(this), this.a&&this.a.transformRules(k._styleAst,
f), k.a.textContent=lg(a,b.M), th(k);T&&(f=a.shadowRoot)&&(f=f.querySelector("style"))&&(f.textContent=lg(a,b.M));b.M=k._styleAst;}}else if(k=c, this.flush(), xh(this,a,k), k.c&&k.c.length){b=bg(a).is;c=(f=uh.fetch(b,k.O,k.c))?f.styleElement:null;g=k.I;(h=f&&f.I)||(h=this.G[b]=(this.G[b]||0)+1, h=b+"-"+h);k.I=h;h=k.I;d=ch;d=c?c.textContent||"":Zg(d,a,k.O,h);e=X(a);var l=e.a;l&&!T&&l!==c&&(l._useCount--, 0>=l._useCount&&l.parentNode&&l.parentNode.removeChild(l));T?e.a?(e.a.textContent=d, c=e.a):d&&(c=Vf(d,
h,a.shadowRoot,e.b)):c?c.parentNode||(Pg&&-1<d.indexOf("@media")&&(c.textContent=d), Wf(c,null,e.b)):d&&(c=Vf(d,h,null,e.b));c&&(c._useCount=c._useCount||0, e.a!=c&&c._useCount++, e.a=c);h=c;T||(c=k.I, e=d=a.getAttribute("class")||"", g&&(e=d.replace(new RegExp("\\s*x-scope\\s*"+g+"\\s*","g")," ")), e+=(e?" ":"")+"x-scope "+c, d!==e&&ag(a,e));f||uh.store(b,k.O,h,k.I);}};function yh(a,b){return(b=b.getRootNode().host)?X(b)?b:yh(a,b):a.c}
function xh(a,b,c){a=yh(a,b);var d=X(a);a=Object.create(d.O||null);var e=Yg(b,c.M,c.da);b=Wg(d.M,b).L;Object.assign(a,e.Ta,b,e.Za);b=c.T;for(var f in b)if((e=b[f])||0===e)a[f]=e;f=ch;b=Object.getOwnPropertyNames(a);for(e=0;e<b.length;e++)d=b[e], a[d]=Ug(f,a[d],a);c.O=a;}r.styleDocument=function(a){this.styleSubtree(this.c,a);};
r.styleSubtree=function(a,b){var c=a.shadowRoot;(c||a===this.c)&&this.styleElement(a,b);if(b=c&&(c.children||c.childNodes))for(a=0;a<b.length;a++)this.styleSubtree(b[a]);else if(a=a.children||a.childNodes)for(b=0;b<a.length;b++)this.styleSubtree(a[b]);};
r.Aa=function(a){var b=this,c=Tf(a),d=dg(a);d!==this.f.da&&(this.f.da=d);Sf(c,function(a){if(T)Jg(a);else{var c=W;a.selector=a.parsedSelector;Jg(a);a.selector=a.F=pg(c,a,c.c,void 0,void 0);}V&&""===d&&(vh(b), b.a&&b.a.transformRule(a));});V?a.textContent=Rf(c):this.f.M.rules.push(c);};r.getComputedStyleValue=function(a,b){var c;V||(c=(X(a)||X(yh(this,a))).O[b]);return(c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};
r.bb=function(a,b){var c=a.getRootNode();b=b?b.split(/\s/):[];c=c.host&&c.host.localName;if(!c){var d=a.getAttribute("class");if(d){d=d.split(/\s/);for(var e=0;e<d.length;e++)if(d[e]===W.a){c=d[e+1];break}}}c&&b.push(W.a,c);V||(c=X(a))&&c.I&&b.push(ch.a,c.I);ag(a,b.join(" "));};r.La=function(a){return X(a)};r.ab=function(a,b){hg(a,b);};r.eb=function(a,b){hg(a,b,!0);};r.$a=function(a){return jh(a)};r.Pa=function(a){return ih(a)};Y.prototype.flush=Y.prototype.flush;Y.prototype.prepareTemplate=Y.prototype.prepareTemplate;
Y.prototype.styleElement=Y.prototype.styleElement;Y.prototype.styleDocument=Y.prototype.styleDocument;Y.prototype.styleSubtree=Y.prototype.styleSubtree;Y.prototype.getComputedStyleValue=Y.prototype.getComputedStyleValue;Y.prototype.setElementClass=Y.prototype.bb;Y.prototype._styleInfoForNode=Y.prototype.La;Y.prototype.transformCustomStyleForDocument=Y.prototype.Aa;Y.prototype.getStyleAst=Y.prototype.Ra;Y.prototype.styleAstToString=Y.prototype.cb;Y.prototype.flushCustomStyles=Y.prototype.flushCustomStyles;
Y.prototype.scopeNode=Y.prototype.ab;Y.prototype.unscopeNode=Y.prototype.eb;Y.prototype.scopeForNode=Y.prototype.$a;Y.prototype.currentScopeForNode=Y.prototype.Pa;Object.defineProperties(Y.prototype,{nativeShadow:{get:function(){return T}},nativeCss:{get:function(){return V}}});var Z=new Y,zh,Ah;window.ShadyCSS&&(zh=window.ShadyCSS.ApplyShim, Ah=window.ShadyCSS.CustomStyleInterface);
window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplate(a,b,c);},prepareTemplateDom:function(a,b){Z.prepareTemplateDom(a,b);},prepareTemplateStyles:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplateStyles(a,b,c);},styleSubtree:function(a,b){Z.flushCustomStyles();Z.styleSubtree(a,b);},styleElement:function(a){Z.flushCustomStyles();Z.styleElement(a);},styleDocument:function(a){Z.flushCustomStyles();Z.styleDocument(a);},flushCustomStyles:function(){Z.flushCustomStyles();},
getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:V,nativeShadow:T};zh&&(window.ShadyCSS.ApplyShim=zh);Ah&&(window.ShadyCSS.CustomStyleInterface=Ah);(function(a){function b(a){""==a&&(f.call(this), this.i=!0);return a.toLowerCase()}function c(a){var b=a.charCodeAt(0);return 32<b&&127>b&&-1==[34,35,60,62,63,96].indexOf(b)?a:encodeURIComponent(a)}function d(a){var b=a.charCodeAt(0);return 32<b&&127>b&&-1==[34,35,60,62,96].indexOf(b)?a:encodeURIComponent(a)}function e(a,e,g){function h(a){}var k=e||"scheme start",w=0,q="",u=!1,R=!1;a:for(;(void 0!=a[w-1]||0==w)&&!this.i;){var m=a[w];switch(k){case "scheme start":if(m&&p.test(m))q+=
m.toLowerCase(), k="scheme";else if(e){break a}else{q="";k="no scheme";continue}break;case "scheme":if(m&&G.test(m))q+=m.toLowerCase();else if(":"==m){this.h=q;q="";if(e)break a;void 0!==l[this.h]&&(this.D=!0);k="file"==this.h?"relative":this.D&&g&&g.h==this.h?"relative or authority":this.D?"authority first slash":"scheme data";}else if(e){break a}else{q="";w=0;k="no scheme";continue}break;case "scheme data":"?"==m?(this.u="?", k="query"):"#"==m?(this.C="#", k="fragment"):void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.pa+=c(m));break;case "no scheme":if(g&&void 0!==l[g.h]){k="relative";continue}else f.call(this), this.i=!0;break;case "relative or authority":if("/"==m&&"/"==a[w+1])k="authority ignore slashes";else{k="relative";continue}break;case "relative":this.D=!0;"file"!=this.h&&(this.h=g.h);if(void 0==m){this.j=g.j;this.s=g.s;this.l=g.l.slice();this.u=g.u;this.v=g.v;this.g=g.g;
break a}else if("/"==m||"\\"==m)k="relative slash";else if("?"==m)this.j=g.j, this.s=g.s, this.l=g.l.slice(), this.u="?", this.v=g.v, this.g=g.g, k="query";else if("#"==m)this.j=g.j, this.s=g.s, this.l=g.l.slice(), this.u=g.u, this.C="#", this.v=g.v, this.g=g.g, k="fragment";else{k=a[w+1];var y=a[w+2];if("file"!=this.h||!p.test(m)||":"!=k&&"|"!=k||void 0!=y&&"/"!=y&&"\\"!=y&&"?"!=y&&"#"!=y)this.j=g.j, this.s=g.s, this.v=g.v, this.g=g.g, this.l=g.l.slice(), this.l.pop();k=
"relative path";continue}break;case "relative slash":if("/"==m||"\\"==m)k="file"==this.h?"file host":"authority ignore slashes";else{"file"!=this.h&&(this.j=g.j, this.s=g.s, this.v=g.v, this.g=g.g);k="relative path";continue}break;case "authority first slash":if("/"==m)k="authority second slash";else{k="authority ignore slashes";continue}break;case "authority second slash":k="authority ignore slashes";if("/"!=m){continue}break;case "authority ignore slashes":if("/"!=m&&"\\"!=m){k="authority";continue}else h("Expected authority, got: "+m);break;case "authority":if("@"==m){u&&(q+="%40");u=!0;for(m=0;m<q.length;m++)y=q[m], "\t"==y||"\n"==y||"\r"==y?h("Invalid whitespace in authority."):":"==y&&null===this.g?this.g="":(y=c(y), null!==this.g?this.g+=y:this.v+=y);q="";}else if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){w-=q.length;q="";k="host";continue}else q+=m;break;case "file host":if(void 0==
m||"/"==m||"\\"==m||"?"==m||"#"==m){2!=q.length||!p.test(q[0])||":"!=q[1]&&"|"!=q[1]?(0!=q.length&&(this.j=b.call(this,q), q=""), k="relative path start"):k="relative path";continue}else"\t"==m||"\n"==m||"\r"==m?h("Invalid whitespace in file host."):q+=m;break;case "host":case "hostname":if(":"!=m||R)if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){this.j=b.call(this,q);q="";k="relative path start";if(e)break a;continue}else"\t"!=m&&"\n"!=m&&"\r"!=m?("["==m?R=!0:"]"==m&&(R=!1), q+=m):h("Invalid code point in host/hostname: "+
m);else if(this.j=b.call(this,q), q="", k="port", "hostname"==e)break a;break;case "port":if(/[0-9]/.test(m))q+=m;else if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m||e){""!=q&&(q=parseInt(q,10), q!=l[this.h]&&(this.s=q+""), q="");if(e)break a;k="relative path start";continue}else"\t"==m||"\n"==m||"\r"==m?h("Invalid code point in port: "+m):(f.call(this), this.i=!0);break;case "relative path start":k="relative path";if("/"!=m&&"\\"!=m)continue;break;case "relative path":if(void 0!=
m&&"/"!=m&&"\\"!=m&&(e||"?"!=m&&"#"!=m))"\t"!=m&&"\n"!=m&&"\r"!=m&&(q+=c(m));else{if(y=n[q.toLowerCase()])q=y;".."==q?(this.l.pop(), "/"!=m&&"\\"!=m&&this.l.push("")):"."==q&&"/"!=m&&"\\"!=m?this.l.push(""):"."!=q&&("file"==this.h&&0==this.l.length&&2==q.length&&p.test(q[0])&&"|"==q[1]&&(q=q[0]+":"), this.l.push(q));q="";"?"==m?(this.u="?", k="query"):"#"==m&&(this.C="#", k="fragment");}break;case "query":e||"#"!=m?void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.u+=
d(m)):(this.C="#", k="fragment");break;case "fragment":void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.C+=m);}w++;}}function f(){this.v=this.pa=this.h="";this.g=null;this.s=this.j="";this.l=[];this.C=this.u="";this.D=this.i=!1;}function g(a,b){void 0===b||b instanceof g||(b=new g(String(b)));this.Ma=a;f.call(this);a=a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g,"");e.call(this,a,null,b);}var h=!1;if(!a.rb)try{var k=new URL("b","http://a");k.pathname="c%20d";h="http://a/c%20d"===k.href;}catch(w){}if(!h){var l=Object.create(null);
l.ftp=21;l.file=0;l.gopher=70;l.http=80;l.https=443;l.ws=80;l.wss=443;var n=Object.create(null);n["%2e"]=".";n[".%2e"]="..";n["%2e."]="..";n["%2e%2e"]="..";var p=/[a-zA-Z]/,G=/[a-zA-Z0-9\+\-\.]/;g.prototype={toString:function(){return this.href},get href(){if(this.i)return this.Ma;var a="";if(""!=this.v||null!=this.g)a=this.v+(null!=this.g?":"+this.g:"")+"@";return this.protocol+(this.D?"//"+a+this.host:"")+this.pathname+this.u+this.C},set href(a){f.call(this);e.call(this,a);},get protocol(){return this.h+
":"},set protocol(a){this.i||e.call(this,a+":","scheme start");},get host(){return this.i?"":this.s?this.j+":"+this.s:this.j},set host(a){!this.i&&this.D&&e.call(this,a,"host");},get hostname(){return this.j},set hostname(a){!this.i&&this.D&&e.call(this,a,"hostname");},get port(){return this.s},set port(a){!this.i&&this.D&&e.call(this,a,"port");},get pathname(){return this.i?"":this.D?"/"+this.l.join("/"):this.pa},set pathname(a){!this.i&&this.D&&(this.l=[], e.call(this,a,"relative path start"));},get search(){return this.i||
!this.u||"?"==this.u?"":this.u},set search(a){!this.i&&this.D&&(this.u="?", "?"==a[0]&&(a=a.slice(1)), e.call(this,a,"query"));},get hash(){return this.i||!this.C||"#"==this.C?"":this.C},set hash(a){this.i||(this.C="#", "#"==a[0]&&(a=a.slice(1)), e.call(this,a,"fragment"));},get origin(){var a;if(this.i||!this.h)return"";switch(this.h){case "data":case "file":case "javascript":case "mailto":return"null"}return(a=this.host)?this.h+"://"+a:""}};var u=a.URL;u&&(g.createObjectURL=function(a){return u.createObjectURL.apply(u,
arguments)}, g.revokeObjectURL=function(a){u.revokeObjectURL(a);});a.URL=g;}})(window);Object.getOwnPropertyDescriptor(Node.prototype,"baseURI")||Object.defineProperty(Node.prototype,"baseURI",{get:function(){var a=(this.ownerDocument||this).querySelector("base[href]");return a&&a.href||window.location.href},configurable:!0,enumerable:!0});var Bh=document.createElement("style");Bh.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var Ch=document.querySelector("head");Ch.insertBefore(Bh,Ch.firstChild);var Dh=window.customElements,Eh=!1,Fh=null;Dh.polyfillWrapFlushCallback&&Dh.polyfillWrapFlushCallback(function(a){Fh=a;Eh&&a();});function Gh(){window.HTMLTemplateElement.bootstrap&&window.HTMLTemplateElement.bootstrap(window.document);Fh&&Fh();Eh=!0;window.WebComponents.ready=!0;document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}));}
"complete"!==document.readyState?(window.addEventListener("load",Gh), window.addEventListener("DOMContentLoaded",function(){window.removeEventListener("load",Gh);Gh();})):Gh();}).call(commonjsGlobal);

(function(){
/**
 * The template that is used for the shadow root for every copy of your element,
 * which houses the styles and layout for the element.
 */
const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: table;
        }

        div {
            height: 2px;
            background-color: var(--fun-tabs-color, var(--secondary-color, #673AB7));
            width: 0px;
        }
    </style>
    <slot></slot>
    <div></div>
`;

/**
 * This is the class that controls each instance of your custom element.
 */
class FunTabs extends HTMLElement {
    /**
     * Part of the custom element spec. Returns an array of strings that are 
     * the names of attributes that this element observes/listens to.
     * 
     * @returns {Array} an array of strings, each of which representing an 
     *  attribute.
     */
    static get observedAttributes() {
        return ['selected'];
    };

    constructor() {
        super();

        // create shadow root for any children context
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // add any initial variables here

        this.tabWidth = 0;
        this.oldValue = 0;
        this.isInitial = true;
    }

    /**
     * Part of the custom element spec. Called after your element is attached to
     * the DOM. Do anything related to the element or its children here in most
     * cases.
     */
    connectedCallback() {
        let tabs = this.querySelectorAll('fun-tab');
        let self = this;
        for(let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', () => {
                self.changeSelectedTab(i);
            });
        }
        
        let initialIndex = this.getAttribute('selected') || 0;

        window.requestAnimationFrame(() => {
            this.tabWidth = this.offsetWidth / tabs.length;
            this.div = this.shadowRoot.querySelector('div');
            this.div.style.marginLeft = `${this.tabWidth*initialIndex}px`;
            this.div.style.width = `${this.tabWidth}px`;
            this.div.style.transition = 'ease all 0.15s';
            this.setSelectedTab(initialIndex);
            this.addEventListener('resize', this.adjustWidth);
        });
        
    }

    /**
     * Part of the custom element spec. Called after your element is remove from
     * the DOM. Disconnect any listeners or anything else here.
     */
    disconnectedCallback() {

    }

    /**
     * Part of the custom element spec. Called when one of the observed
     * attributes changes, either via setAttribute() or with the attribute being
     * manually set in the HTML.
     * 
     * @param {String} name the name of the attribute that changed
     * @param {Mixed} oldValue the previous value of the attribute
     * @param {Mixed} newValue the new value of the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // respond to a changed attribute here
        if(name === 'selected' && this.div) {
            this.setSelectedTab(newValue);
        }
    }

    changeSelectedTab(i) {
        this.oldValue = this.getAttribute('selected');
        this.setAttribute('selected', i);
    }

    setSelectedTab(newValue) {
        this.moveHighLight(newValue);
        let tabs = this.querySelectorAll('fun-tab');
        for(let i = 0; i < tabs.length; i++) {
            tabs[i].className = '';
        }
        tabs[newValue].className = 'selected';
    }

    moveHighLight(i) {

        if(this.isInitial) {
            this.div.style.marginLeft = `${this.tabWidth*i}px`;
            this.div.style.width = `${this.tabWidth}px`;
            this.isInitial = false;
            
        }else if(i < this.oldValue) {
            let diff =  this.oldValue - i + 1;
            this.div.style.marginLeft = `${this.tabWidth*i}px`;
            this.div.style.width = `${this.tabWidth*diff}px`;
            setTimeout(() => {
                this.div.style.width = `${this.tabWidth}px`;
            }, 150);

        }else if( i > this.oldValue) {
            let diff = i - this.oldValue + 1;
            this.div.style.width = `${this.tabWidth*diff+1}px`;
            setTimeout(() => {
                this.div.style.marginLeft = `${this.tabWidth*i}px`;
                this.div.style.width = `${this.tabWidth}px`;
            }, 150);
        }

        
    }
}

customElements.define("fun-tabs", FunTabs);

const tabTemplate = document.createElement("template");
tabTemplate.innerHTML = `
    <style>
        :host {
            display: table;
            opacity: 0.8;
            transition: opacity ease 0.3s;
            cursor: pointer;
            padding: 10px 15px;
            display: inline-block;
            text-align: center;
        }


        :host(:hover), :host(.selected) {
            opacity: 1;
        }

    </style>
    <slot></slot>
`;

/**
 * This is the class that controls each instance of your custom element.
 */
class FunTab extends HTMLElement {
    /**
     * Part of the custom element spec. Returns an array of strings that are 
     * the names of attributes that this element observes/listens to.
     * 
     * @returns {Array} an array of strings, each of which representing an 
     *  attribute.
     */

    constructor() {
        super();

        // create shadow root for any children context
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(tabTemplate.content.cloneNode(true));
    }

    /**
     * Part of the custom element spec. Called after your element is attached to
     * the DOM. Do anything related to the element or its children here in most
     * cases.
     */
    connectedCallback() {
    }

    /**
     * Part of the custom element spec. Called after your element is remove from
     * the DOM. Disconnect any listeners or anything else here.
     */
    disconnectedCallback() {

    }

    /**
     * Part of the custom element spec. Called when one of the observed
     * attributes changes, either via setAttribute() or with the attribute being
     * manually set in the HTML.
     * 
     * @param {String} name the name of the attribute that changed
     * @param {Mixed} oldValue the previous value of the attribute
     * @param {Mixed} newValue the new value of the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // respond to a changed attribute here
    }

}

customElements.define("fun-tab", FunTab);
})();

/*! @source https://github.com/Kiricon/emoji-selector */

const emojis = [
  {
    "name": "grinning",
    "keywords": ["face", "smile", "happy", "joy", ":D", "grin"],
    "char": "😀",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "grimacing",
    "keywords": ["face", "grimace", "teeth"],
    "char": "😬",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "grin",
    "keywords": ["face", "happy", "smile", "joy", "kawaii"],
    "char": "😁",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "joy",
    "keywords": ["face", "cry", "tears", "weep", "happy", "happytears", "haha"],
    "char": "😂",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "rofl",
    "keywords": ["face", "rolling", "floor", "laughing", "lol", "haha"],
    "char": "🤣",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smiley",
    "keywords": ["face", "happy", "joy", "haha", ":D", ":)", "smile", "funny"],
    "char": "😃",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smile",
    "keywords": ["face", "happy", "joy", "funny", "haha", "laugh", "like", ":D", ":)"],
    "char": "😄",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sweat_smile",
    "keywords": ["face", "hot", "happy", "laugh", "sweat", "smile", "relief"],
    "char": "😅",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "laughing",
    "keywords": ["happy", "joy", "lol", "satisfied", "haha", "face", "glad", "XD", "laugh"],
    "char": "😆",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "innocent",
    "keywords": ["face", "angel", "heaven", "halo"],
    "char": "😇",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "wink",
    "keywords": ["face", "happy", "mischievous", "secret", ";)", "smile", "eye"],
    "char": "😉",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "blush",
    "keywords": ["face", "smile", "happy", "flushed", "crush", "embarrassed", "shy", "joy"],
    "char": "😊",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "slightly_smiling_face",
    "keywords": ["face", "smile"],
    "char": "🙂",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "upside_down_face",
    "keywords": ["face", "flipped", "silly", "smile"],
    "char": "🙃",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "relaxed",
    "keywords": ["face", "blush", "massage", "happiness"],
    "char": "☺️",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "yum",
    "keywords": ["happy", "joy", "tongue", "smile", "face", "silly", "yummy", "nom", "delicious", "savouring"],
    "char": "😋",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "relieved",
    "keywords": ["face", "relaxed", "phew", "massage", "happiness"],
    "char": "😌",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "heart_eyes",
    "keywords": ["face", "love", "like", "affection", "valentines", "infatuation", "crush", "heart"],
    "char": "😍",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kissing_heart",
    "keywords": ["face", "love", "like", "affection", "valentines", "infatuation", "kiss"],
    "char": "😘",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kissing",
    "keywords": ["love", "like", "face", "3", "valentines", "infatuation", "kiss"],
    "char": "😗",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kissing_smiling_eyes",
    "keywords": ["face", "affection", "valentines", "infatuation", "kiss"],
    "char": "😙",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kissing_closed_eyes",
    "keywords": ["face", "love", "like", "affection", "valentines", "infatuation", "kiss"],
    "char": "😚",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "stuck_out_tongue_winking_eye",
    "keywords": ["face", "prank", "childish", "playful", "mischievous", "smile", "wink", "tongue"],
    "char": "😜",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "stuck_out_tongue_closed_eyes",
    "keywords": ["face", "prank", "playful", "mischievous", "smile", "tongue"],
    "char": "😝",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "stuck_out_tongue",
    "keywords": ["face", "prank", "childish", "playful", "mischievous", "smile", "tongue"],
    "char": "😛",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "money_mouth_face",
    "keywords": ["face", "rich", "dollar", "money"],
    "char": "🤑",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "nerd_face",
    "keywords": ["face", "nerdy", "geek", "dork"],
    "char": "🤓",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sunglasses",
    "keywords": ["face", "cool", "smile", "summer", "beach", "sunglass"],
    "char": "😎",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "clown_face",
    "keywords": ["face"],
    "char": "🤡",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "cowboy_hat_face",
    "keywords": ["face", "cowgirl", "hat"],
    "char": "🤠",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "hugs",
    "keywords": ["face", "smile", "hug"],
    "char": "🤗",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smirk",
    "keywords": ["face", "smile", "mean", "prank", "smug", "sarcasm"],
    "char": "😏",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "no_mouth",
    "keywords": ["face", "hellokitty"],
    "char": "😶",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "neutral_face",
    "keywords": ["indifference", "meh", ":|", "neutral"],
    "char": "😐",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "expressionless",
    "keywords": ["face", "indifferent", "-_-", "meh", "deadpan"],
    "char": "😑",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "unamused",
    "keywords": ["indifference", "bored", "straight face", "serious", "sarcasm"],
    "char": "😒",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "roll_eyes",
    "keywords": ["face", "eyeroll", "frustrated"],
    "char": "🙄",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "thinking",
    "keywords": ["face", "hmmm", "think", "consider"],
    "char": "🤔",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "lying_face",
    "keywords": ["face", "lie", "pinocchio"],
    "char": "🤥",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "flushed",
    "keywords": ["face", "blush", "shy", "flattered"],
    "char": "😳",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "disappointed",
    "keywords": ["face", "sad", "upset", "depressed", ":("],
    "char": "😞",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "worried",
    "keywords": ["face", "concern", "nervous", ":("],
    "char": "😟",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "angry",
    "keywords": ["mad", "face", "annoyed", "frustrated"],
    "char": "😠",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "rage",
    "keywords": ["angry", "mad", "hate", "despise"],
    "char": "😡",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "pensive",
    "keywords": ["face", "sad", "depressed", "upset"],
    "char": "😔",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "confused",
    "keywords": ["face", "indifference", "huh", "weird", "hmmm", ":/"],
    "char": "😕",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "slightly_frowning_face",
    "keywords": ["face", "frowning", "disappointed", "sad", "upset"],
    "char": "🙁",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "persevere",
    "keywords": ["face", "sick", "no", "upset", "oops"],
    "char": "😣",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "confounded",
    "keywords": ["face", "confused", "sick", "unwell", "oops", ":S"],
    "char": "😖",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "tired_face",
    "keywords": ["sick", "whine", "upset", "frustrated"],
    "char": "😫",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "weary",
    "keywords": ["face", "tired", "sleepy", "sad", "frustrated", "upset"],
    "char": "😩",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "triumph",
    "keywords": ["face", "gas", "phew", "proud", "pride"],
    "char": "😤",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "open_mouth",
    "keywords": ["face", "surprise", "impressed", "wow", "whoa", ":O"],
    "char": "😮",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "scream",
    "keywords": ["face", "munch", "scared", "omg"],
    "char": "😱",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "fearful",
    "keywords": ["face", "scared", "terrified", "nervous", "oops", "huh"],
    "char": "😨",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "cold_sweat",
    "keywords": ["face", "nervous", "sweat"],
    "char": "😰",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "hushed",
    "keywords": ["face", "woo", "shh"],
    "char": "😯",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "frowning",
    "keywords": ["face", "aw", "what"],
    "char": "😦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "anguished",
    "keywords": ["face", "stunned", "nervous"],
    "char": "😧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "cry",
    "keywords": ["face", "tears", "sad", "depressed", "upset", ":'("],
    "char": "😢",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "disappointed_relieved",
    "keywords": ["face", "phew", "sweat", "nervous"],
    "char": "😥",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "drooling_face",
    "keywords": ["face"],
    "char": "🤤",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sleepy",
    "keywords": ["face", "tired", "rest", "nap"],
    "char": "😪",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sweat",
    "keywords": ["face", "hot", "sad", "tired", "exercise"],
    "char": "😓",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sob",
    "keywords": ["face", "cry", "tears", "sad", "upset", "depressed"],
    "char": "😭",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "dizzy_face",
    "keywords": ["spent", "unconscious", "xox", "dizzy"],
    "char": "😵",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "astonished",
    "keywords": ["face", "xox", "surprised", "poisoned"],
    "char": "😲",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "zipper_mouth_face",
    "keywords": ["face", "sealed", "zipper", "secret"],
    "char": "🤐",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "nauseated_face",
    "keywords": ["face", "vomit", "gross", "green", "sick", "throw up", "ill"],
    "char": "🤢",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sneezing_face",
    "keywords": ["face", "gesundheit", "sneeze", "sick", "allergy"],
    "char": "🤧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "mask",
    "keywords": ["face", "sick", "ill", "disease"],
    "char": "😷",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "face_with_thermometer",
    "keywords": ["sick", "temperature", "thermometer", "cold", "fever"],
    "char": "🤒",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "face_with_head_bandage",
    "keywords": ["injured", "clumsy", "bandage", "hurt"],
    "char": "🤕",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sleeping",
    "keywords": ["face", "tired", "sleepy", "night", "zzz"],
    "char": "😴",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "zzz",
    "keywords": ["sleepy", "tired", "dream"],
    "char": "💤",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "poop",
    "keywords": ["hankey", "shitface", "fail", "turd", "shit"],
    "char": "💩",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smiling_imp",
    "keywords": ["devil", "horns"],
    "char": "😈",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "imp",
    "keywords": ["devil", "angry", "horns"],
    "char": "👿",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "japanese_ogre",
    "keywords": ["monster", "red", "mask", "halloween", "scary", "creepy", "devil", "demon", "japanese", "ogre"],
    "char": "👹",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "japanese_goblin",
    "keywords": ["red", "evil", "mask", "monster", "scary", "creepy", "japanese", "goblin"],
    "char": "👺",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "skull",
    "keywords": ["dead", "skeleton", "creepy", "death"],
    "char": "💀",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "ghost",
    "keywords": ["halloween", "spooky", "scary"],
    "char": "👻",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "alien",
    "keywords": ["UFO", "paul", "weird", "outer_space"],
    "char": "👽",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "robot",
    "keywords": ["computer", "machine", "bot"],
    "char": "🤖",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smiley_cat",
    "keywords": ["animal", "cats", "happy", "smile"],
    "char": "😺",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smile_cat",
    "keywords": ["animal", "cats", "smile"],
    "char": "😸",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "joy_cat",
    "keywords": ["animal", "cats", "haha", "happy", "tears"],
    "char": "😹",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "heart_eyes_cat",
    "keywords": ["animal", "love", "like", "affection", "cats", "valentines", "heart"],
    "char": "😻",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "smirk_cat",
    "keywords": ["animal", "cats", "smirk"],
    "char": "😼",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kissing_cat",
    "keywords": ["animal", "cats", "kiss"],
    "char": "😽",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "scream_cat",
    "keywords": ["animal", "cats", "munch", "scared", "scream"],
    "char": "🙀",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "crying_cat_face",
    "keywords": ["animal", "tears", "weep", "sad", "cats", "upset", "cry"],
    "char": "😿",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "pouting_cat",
    "keywords": ["animal", "cats"],
    "char": "😾",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "raised_hands",
    "keywords": ["gesture", "hooray", "yea", "celebration", "hands"],
    "char": "🙌",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "clap",
    "keywords": ["hands", "praise", "applause", "congrats", "yay"],
    "char": "👏",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "wave",
    "keywords": ["hands", "gesture", "goodbye", "solong", "farewell", "hello", "hi", "palm"],
    "char": "👋",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "call_me_hand",
    "keywords": ["hands", "gesture"],
    "char": "🤙",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "+1",
    "keywords": ["thumbsup", "yes", "awesome", "good", "agree", "accept", "cool", "hand", "like"],
    "char": "👍",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "-1",
    "keywords": ["thumbsdown", "no", "dislike", "hand"],
    "char": "👎",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "facepunch",
    "keywords": ["angry", "violence", "fist", "hit", "attack", "hand"],
    "char": "👊",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "fist",
    "keywords": ["fingers", "hand", "grasp"],
    "char": "✊",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "fist_left",
    "keywords": ["hand", "fistbump"],
    "char": "🤛",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "fist_right",
    "keywords": ["hand", "fistbump"],
    "char": "🤜",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "v",
    "keywords": ["fingers", "ohyeah", "hand", "peace", "victory", "two"],
    "char": "✌",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "ok_hand",
    "keywords": ["fingers", "limbs", "perfect", "ok", "okay"],
    "char": "👌",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "raised_hand",
    "keywords": ["fingers", "stop", "highfive", "palm", "ban"],
    "char": "✋",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "raised_back_of_hand",
    "keywords": ["fingers", "raised", "backhand"],
    "char": "🤚",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "open_hands",
    "keywords": ["fingers", "butterfly", "hands", "open"],
    "char": "👐",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "muscle",
    "keywords": ["arm", "flex", "hand", "summer", "strong", "biceps"],
    "char": "💪",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "pray",
    "keywords": ["please", "hope", "wish", "namaste", "highfive"],
    "char": "🙏",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "handshake",
    "keywords": ["agreement", "shake"],
    "char": "🤝",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "point_up",
    "keywords": ["hand", "fingers", "direction", "up"],
    "char": "☝",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "point_up_2",
    "keywords": ["fingers", "hand", "direction", "up"],
    "char": "👆",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "point_down",
    "keywords": ["fingers", "hand", "direction", "down"],
    "char": "👇",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "point_left",
    "keywords": ["direction", "fingers", "hand", "left"],
    "char": "👈",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "point_right",
    "keywords": ["fingers", "hand", "direction", "right"],
    "char": "👉",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "fu",
    "keywords": ["hand", "fingers", "rude", "middle", "flipping"],
    "char": "🖕",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "raised_hand_with_fingers_splayed",
    "keywords": ["hand", "fingers", "palm"],
    "char": "🖐",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "metal",
    "keywords": ["hand", "fingers", "evil_eye", "sign_of_horns", "rock_on"],
    "char": "🤘",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "crossed_fingers",
    "keywords": ["good", "lucky"],
    "char": "🤞",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "vulcan_salute",
    "keywords": ["hand", "fingers", "spock", "star trek"],
    "char": "🖖",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "writing_hand",
    "keywords": ["lower_left_ballpoint_pen", "stationery", "write", "compose"],
    "char": "✍",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "selfie",
    "keywords": ["camera", "phone"],
    "char": "🤳",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "nail_care",
    "keywords": ["beauty", "manicure", "finger", "fashion", "nail"],
    "char": "💅",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "lips",
    "keywords": ["mouth", "kiss"],
    "char": "👄",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "tongue",
    "keywords": ["mouth", "playful"],
    "char": "👅",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "ear",
    "keywords": ["face", "hear", "sound", "listen"],
    "char": "👂",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "nose",
    "keywords": ["smell", "sniff"],
    "char": "👃",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "eye",
    "keywords": ["face", "look", "see", "watch", "stare"],
    "char": "👁",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "eyes",
    "keywords": ["look", "watch", "stalk", "peek", "see"],
    "char": "👀",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "bust_in_silhouette",
    "keywords": ["user", "person", "human"],
    "char": "👤",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "busts_in_silhouette",
    "keywords": ["user", "person", "human", "group", "team"],
    "char": "👥",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "speaking_head",
    "keywords": ["user", "person", "human", "sing", "say", "talk"],
    "char": "🗣",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "baby",
    "keywords": ["child", "boy", "girl", "toddler"],
    "char": "👶",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "boy",
    "keywords": ["man", "male", "guy", "teenager"],
    "char": "👦",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "girl",
    "keywords": ["female", "woman", "teenager"],
    "char": "👧",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man",
    "keywords": ["mustache", "father", "dad", "guy", "classy", "sir", "moustache"],
    "char": "👨",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman",
    "keywords": ["female", "girls", "lady"],
    "char": "👩",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "blonde_woman",
    "keywords": ["woman", "female", "girl", "blonde", "person"],
    "char": "👱‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "blonde_man",
    "keywords": ["man", "male", "boy", "blonde", "guy", "person"],
    "char": "👱",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "older_man",
    "keywords": ["human", "male", "men", "old", "elder", "senior"],
    "char": "👴",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "older_woman",
    "keywords": ["human", "female", "women", "lady", "old", "elder", "senior"],
    "char": "👵",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_with_gua_pi_mao",
    "keywords": ["male", "boy", "chinese"],
    "char": "👲",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_with_turban",
    "keywords": ["female", "indian", "hinduism", "arabs", "woman"],
    "char": "👳‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_with_turban",
    "keywords": ["male", "indian", "hinduism", "arabs"],
    "char": "👳",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "policewoman",
    "keywords": ["woman", "police", "law", "legal", "enforcement", "arrest", "911", "female"],
    "char": "👮‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "policeman",
    "keywords": ["man", "police", "law", "legal", "enforcement", "arrest", "911"],
    "char": "👮",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "construction_worker_woman",
    "keywords": ["female", "human", "wip", "build", "construction", "worker", "labor", "woman"],
    "char": "👷‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "construction_worker_man",
    "keywords": ["male", "human", "wip", "guy", "build", "construction", "worker", "labor"],
    "char": "👷",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "guardswoman",
    "keywords": ["uk", "gb", "british", "female", "royal", "woman"],
    "char": "💂‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "guardsman",
    "keywords": ["uk", "gb", "british", "male", "guy", "royal"],
    "char": "💂",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "female_detective",
    "keywords": ["human", "spy", "detective", "female", "woman"],
    "char": "🕵️‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "male_detective",
    "keywords": ["human", "spy", "detective"],
    "char": "🕵",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_health_worker",
    "keywords": ["doctor", "nurse", "therapist", "healthcare", "woman", "human"],
    "char": "👩‍⚕️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_health_worker",
    "keywords": ["doctor", "nurse", "therapist", "healthcare", "man", "human"],
    "char": "👨‍⚕️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_farmer",
    "keywords": ["rancher", "gardener", "woman", "human"],
    "char": "👩‍🌾",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_farmer",
    "keywords": ["rancher", "gardener", "man", "human"],
    "char": "👨‍🌾",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_cook",
    "keywords": ["chef", "woman", "human"],
    "char": "👩‍🍳",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_cook",
    "keywords": ["chef", "man", "human"],
    "char": "👨‍🍳",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_student",
    "keywords": ["graduate", "woman", "human"],
    "char": "👩‍🎓",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_student",
    "keywords": ["graduate", "man", "human"],
    "char": "👨‍🎓",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_singer",
    "keywords": ["rockstar", "entertainer", "woman", "human"],
    "char": "👩‍🎤",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_singer",
    "keywords": ["rockstar", "entertainer", "man", "human"],
    "char": "👨‍🎤",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_teacher",
    "keywords": ["instructor", "professor", "woman", "human"],
    "char": "👩‍🏫",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_teacher",
    "keywords": ["instructor", "professor", "man", "human"],
    "char": "👨‍🏫",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_factory_worker",
    "keywords": ["assembly", "industrial", "woman", "human"],
    "char": "👩‍🏭",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_factory_worker",
    "keywords": ["assembly", "industrial", "man", "human"],
    "char": "👨‍🏭",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_technologist",
    "keywords": ["coder", "developer", "engineer", "programmer", "software", "woman", "human", "laptop", "computer"],
    "char": "👩‍💻",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_technologist",
    "keywords": ["coder", "developer", "engineer", "programmer", "software", "man", "human", "laptop", "computer"],
    "char": "👨‍💻",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_office_worker",
    "keywords": ["business", "manager", "woman", "human"],
    "char": "👩‍💼",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_office_worker",
    "keywords": ["business", "manager", "man", "human"],
    "char": "👨‍💼",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_mechanic",
    "keywords": ["plumber", "woman", "human", "wrench"],
    "char": "👩‍🔧",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_mechanic",
    "keywords": ["plumber", "man", "human", "wrench"],
    "char": "👨‍🔧",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_scientist",
    "keywords": ["biologist", "chemist", "engineer", "physicist", "woman", "human"],
    "char": "👩‍🔬",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_scientist",
    "keywords": ["biologist", "chemist", "engineer", "physicist", "man", "human"],
    "char": "👨‍🔬",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_artist",
    "keywords": ["painter", "woman", "human"],
    "char": "👩‍🎨",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_artist",
    "keywords": ["painter", "man", "human"],
    "char": "👨‍🎨",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_firefighter",
    "keywords": ["fireman", "woman", "human"],
    "char": "👩‍🚒",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_firefighter",
    "keywords": ["fireman", "man", "human"],
    "char": "👨‍🚒",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_pilot",
    "keywords": ["aviator", "plane", "woman", "human"],
    "char": "👩‍✈️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_pilot",
    "keywords": ["aviator", "plane", "man", "human"],
    "char": "👨‍✈️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_astronaut",
    "keywords": ["space", "rocket", "woman", "human"],
    "char": "👩‍🚀",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_astronaut",
    "keywords": ["space", "rocket", "man", "human"],
    "char": "👨‍🚀",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_judge",
    "keywords": ["justice", "court", "woman", "human"],
    "char": "👩‍⚖️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_judge",
    "keywords": ["justice", "court", "man", "human"],
    "char": "👨‍⚖️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "mrs_claus",
    "keywords": ["woman", "female", "xmas", "mother christmas"],
    "char": "🤶",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "santa",
    "keywords": ["festival", "man", "male", "xmas", "father christmas"],
    "char": "🎅",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "angel",
    "keywords": ["heaven", "wings", "halo"],
    "char": "👼",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "pregnant_woman",
    "keywords": ["baby"],
    "char": "🤰",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "princess",
    "keywords": ["girl", "woman", "female", "blond", "crown", "royal", "queen"],
    "char": "👸",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "prince",
    "keywords": ["boy", "man", "male", "crown", "royal", "king"],
    "char": "🤴",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "bride_with_veil",
    "keywords": ["couple", "marriage", "wedding", "woman", "bride"],
    "char": "👰",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_in_tuxedo",
    "keywords": ["couple", "marriage", "wedding", "groom"],
    "char": "🤵",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "running_woman",
    "keywords": ["woman", "walking", "exercise", "race", "running", "female"],
    "char": "🏃‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "running_man",
    "keywords": ["man", "walking", "exercise", "race", "running"],
    "char": "🏃",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "walking_woman",
    "keywords": ["human", "feet", "steps", "woman", "female"],
    "char": "🚶‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "walking_man",
    "keywords": ["human", "feet", "steps"],
    "char": "🚶",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "dancer",
    "keywords": ["female", "girl", "woman", "fun"],
    "char": "💃",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_dancing",
    "keywords": ["male", "boy", "fun", "dancer"],
    "char": "🕺",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "dancing_women",
    "keywords": ["female", "bunny", "women", "girls"],
    "char": "👯",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "dancing_men",
    "keywords": ["male", "bunny", "men", "boys"],
    "char": "👯‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "couple",
    "keywords": ["pair", "people", "human", "love", "date", "dating", "like", "affection", "valentines", "marriage"],
    "char": "👫",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "two_men_holding_hands",
    "keywords": ["pair", "couple", "love", "like", "bromance", "friendship", "people", "human"],
    "char": "👬",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "two_women_holding_hands",
    "keywords": ["pair", "friendship", "couple", "love", "like", "female", "people", "human"],
    "char": "👭",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "bowing_woman",
    "keywords": ["woman", "female", "girl"],
    "char": "🙇‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "bowing_man",
    "keywords": ["man", "male", "boy"],
    "char": "🙇",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_facepalming",
    "keywords": ["man", "male", "boy", "disbelief"],
    "char": "🤦",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_facepalming",
    "keywords": ["woman", "female", "girl", "disbelief"],
    "char": "🤦‍♀️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "woman_shrugging",
    "keywords": ["woman", "female", "girl", "confused", "indifferent", "doubt"],
    "char": "🤷",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "man_shrugging",
    "keywords": ["man", "male", "boy", "confused", "indifferent", "doubt"],
    "char": "🤷‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "tipping_hand_woman",
    "keywords": ["female", "girl", "woman", "human", "information"],
    "char": "💁",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "tipping_hand_man",
    "keywords": ["male", "boy", "man", "human", "information"],
    "char": "💁‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "no_good_woman",
    "keywords": ["female", "girl", "woman", "nope"],
    "char": "🙅",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "no_good_man",
    "keywords": ["male", "boy", "man", "nope"],
    "char": "🙅‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "ok_woman",
    "keywords": ["women", "girl", "female", "pink", "human", "woman"],
    "char": "🙆",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "ok_man",
    "keywords": ["men", "boy", "male", "blue", "human", "man"],
    "char": "🙆‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "raising_hand_woman",
    "keywords": ["female", "girl", "woman"],
    "char": "🙋",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "raising_hand_man",
    "keywords": ["male", "boy", "man"],
    "char": "🙋‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "pouting_woman",
    "keywords": ["female", "girl", "woman"],
    "char": "🙎",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "pouting_man",
    "keywords": ["male", "boy", "man"],
    "char": "🙎‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "frowning_woman",
    "keywords": ["female", "girl", "woman", "sad", "depressed", "discouraged", "unhappy"],
    "char": "🙍",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "frowning_man",
    "keywords": ["male", "boy", "man", "sad", "depressed", "discouraged", "unhappy"],
    "char": "🙍‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "haircut_woman",
    "keywords": ["female", "girl", "woman"],
    "char": "💇",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "haircut_man",
    "keywords": ["male", "boy", "man"],
    "char": "💇‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "massage_woman",
    "keywords": ["female", "girl", "woman", "head"],
    "char": "💆",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "massage_man",
    "keywords": ["male", "boy", "man", "head"],
    "char": "💆‍♂️",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "couple_with_heart_woman_man",
    "keywords": ["pair", "love", "like", "affection", "human", "dating", "valentines", "marriage"],
    "char": "💑",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "couple_with_heart_woman_woman",
    "keywords": ["pair", "love", "like", "affection", "human", "dating", "valentines", "marriage"],
    "char": "👩‍❤️‍👩",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "couple_with_heart_man_man",
    "keywords": ["pair", "love", "like", "affection", "human", "dating", "valentines", "marriage"],
    "char": "👨‍❤️‍👨",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "couplekiss_man_woman",
    "keywords": ["pair", "valentines", "love", "like", "dating", "marriage"],
    "char": "💏",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "couplekiss_woman_woman",
    "keywords": ["pair", "valentines", "love", "like", "dating", "marriage"],
    "char": "👩‍❤️‍💋‍👩",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "couplekiss_man_man",
    "keywords": ["pair", "valentines", "love", "like", "dating", "marriage"],
    "char": "👨‍❤️‍💋‍👨",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_woman_boy",
    "keywords": ["home", "parents", "child", "mom", "dad", "father", "mother", "people", "human"],
    "char": "👪",
    "fitzpatrick_scale": true,
    "category": "people"
  },
  {
    "name": "family_man_woman_girl",
    "keywords": ["home", "parents", "people", "human", "child"],
    "char": "👨‍👩‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_woman_girl_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👩‍👧‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_woman_boy_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👩‍👦‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_woman_girl_girl",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👩‍👧‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_woman_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👩‍👩‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_woman_girl",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👩‍👩‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_woman_girl_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👩‍👩‍👧‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_woman_boy_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👩‍👩‍👦‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_woman_girl_girl",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👩‍👩‍👧‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_man_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👨‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_man_girl",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👨‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_man_girl_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👨‍👧‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_man_boy_boy",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👨‍👦‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_man_girl_girl",
    "keywords": ["home", "parents", "people", "human", "children"],
    "char": "👨‍👨‍👧‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_boy",
    "keywords": ["home", "parent", "people", "human", "child"],
    "char": "👩‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_girl",
    "keywords": ["home", "parent", "people", "human", "child"],
    "char": "👩‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_girl_boy",
    "keywords": ["home", "parent", "people", "human", "children"],
    "char": "👩‍👧‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_boy_boy",
    "keywords": ["home", "parent", "people", "human", "children"],
    "char": "👩‍👦‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_woman_girl_girl",
    "keywords": ["home", "parent", "people", "human", "children"],
    "char": "👩‍👧‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_boy",
    "keywords": ["home", "parent", "people", "human", "child"],
    "char": "👨‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_girl",
    "keywords": ["home", "parent", "people", "human", "child"],
    "char": "👨‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_girl_boy",
    "keywords": ["home", "parent", "people", "human", "children"],
    "char": "👨‍👧‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_boy_boy",
    "keywords": ["home", "parent", "people", "human", "children"],
    "char": "👨‍👦‍👦",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "family_man_girl_girl",
    "keywords": ["home", "parent", "people", "human", "children"],
    "char": "👨‍👧‍👧",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "womans_clothes",
    "keywords": ["fashion", "shopping_bags", "female"],
    "char": "👚",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "tshirt",
    "keywords": ["fashion", "cloth", "casual", "shirt", "tee"],
    "char": "👕",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "jeans",
    "keywords": ["fashion", "shopping"],
    "char": "👖",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "necktie",
    "keywords": ["shirt", "suitup", "formal", "fashion", "cloth", "business"],
    "char": "👔",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "dress",
    "keywords": ["clothes", "fashion", "shopping"],
    "char": "👗",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "bikini",
    "keywords": ["swimming", "female", "woman", "girl", "fashion", "beach", "summer"],
    "char": "👙",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kimono",
    "keywords": ["dress", "fashion", "women", "female", "japanese"],
    "char": "👘",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "lipstick",
    "keywords": ["female", "girl", "fashion", "woman"],
    "char": "💄",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "kiss",
    "keywords": ["face", "lips", "love", "like", "affection", "valentines"],
    "char": "💋",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "footprints",
    "keywords": ["feet", "tracking", "walking", "beach"],
    "char": "👣",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "high_heel",
    "keywords": ["fashion", "shoes", "female", "pumps", "stiletto"],
    "char": "👠",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "sandal",
    "keywords": ["shoes", "fashion", "flip flops"],
    "char": "👡",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "boot",
    "keywords": ["shoes", "fashion"],
    "char": "👢",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "mans_shoe",
    "keywords": ["fashion", "male"],
    "char": "👞",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "athletic_shoe",
    "keywords": ["shoes", "sports", "sneakers"],
    "char": "👟",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "womans_hat",
    "keywords": ["fashion", "accessories", "female", "lady", "spring"],
    "char": "👒",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "tophat",
    "keywords": ["magic", "gentleman", "classy", "circus"],
    "char": "🎩",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "rescue_worker_helmet",
    "keywords": ["construction", "build"],
    "char": "⛑",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "mortar_board",
    "keywords": ["school", "college", "degree", "university", "graduation", "cap", "hat", "legal", "learn", "education"],
    "char": "🎓",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "crown",
    "keywords": ["king", "kod", "leader", "royalty", "lord"],
    "char": "👑",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "school_satchel",
    "keywords": ["student", "education", "bag", "backpack"],
    "char": "🎒",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "pouch",
    "keywords": ["bag", "accessories", "shopping"],
    "char": "👝",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "purse",
    "keywords": ["fashion", "accessories", "money", "sales", "shopping"],
    "char": "👛",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "handbag",
    "keywords": ["fashion", "accessory", "accessories", "shopping"],
    "char": "👜",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "briefcase",
    "keywords": ["business", "documents", "work", "law", "legal", "job", "career"],
    "char": "💼",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "eyeglasses",
    "keywords": ["fashion", "accessories", "eyesight", "nerdy", "dork", "geek"],
    "char": "👓",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "dark_sunglasses",
    "keywords": ["face", "cool", "accessories"],
    "char": "🕶",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "ring",
    "keywords": ["wedding", "propose", "marriage", "valentines", "diamond", "fashion", "jewelry", "gem", "engagement"],
    "char": "💍",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "closed_umbrella",
    "keywords": ["weather", "rain", "drizzle"],
    "char": "🌂",
    "fitzpatrick_scale": false,
    "category": "people"
  },
  {
    "name": "dog",
    "keywords": ["animal", "friend", "nature", "woof", "puppy", "pet", "faithful"],
    "char": "🐶",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cat",
    "keywords": ["animal", "meow", "nature", "pet", "kitten"],
    "char": "🐱",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "mouse",
    "keywords": ["animal", "nature", "cheese_wedge", "rodent"],
    "char": "🐭",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "hamster",
    "keywords": ["animal", "nature"],
    "char": "🐹",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "rabbit",
    "keywords": ["animal", "nature", "pet", "spring", "magic", "bunny"],
    "char": "🐰",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "fox_face",
    "keywords": ["animal", "nature", "face"],
    "char": "🦊",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "bear",
    "keywords": ["animal", "nature", "wild"],
    "char": "🐻",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "panda_face",
    "keywords": ["animal", "nature", "panda"],
    "char": "🐼",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "koala",
    "keywords": ["animal", "nature"],
    "char": "🐨",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "tiger",
    "keywords": ["animal", "cat", "danger", "wild", "nature", "roar"],
    "char": "🐯",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "lion",
    "keywords": ["animal", "nature"],
    "char": "🦁",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cow",
    "keywords": ["beef", "ox", "animal", "nature", "moo", "milk"],
    "char": "🐮",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "pig",
    "keywords": ["animal", "oink", "nature"],
    "char": "🐷",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "pig_nose",
    "keywords": ["animal", "oink"],
    "char": "🐽",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "frog",
    "keywords": ["animal", "nature", "croak", "toad"],
    "char": "🐸",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "squid",
    "keywords": ["animal", "nature", "ocean", "sea"],
    "char": "🦑",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "octopus",
    "keywords": ["animal", "creature", "ocean", "sea", "nature", "beach"],
    "char": "🐙",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "shrimp",
    "keywords": ["animal", "ocean", "nature", "seafood"],
    "char": "🦐",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "monkey_face",
    "keywords": ["animal", "nature", "circus"],
    "char": "🐵",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "gorilla",
    "keywords": ["animal", "nature", "circus"],
    "char": "🦍",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "see_no_evil",
    "keywords": ["monkey", "animal", "nature", "haha"],
    "char": "🙈",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "hear_no_evil",
    "keywords": ["animal", "monkey", "nature"],
    "char": "🙉",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "speak_no_evil",
    "keywords": ["monkey", "animal", "nature", "omg"],
    "char": "🙊",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "monkey",
    "keywords": ["animal", "nature", "banana", "circus"],
    "char": "🐒",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "chicken",
    "keywords": ["animal", "cluck", "nature", "bird"],
    "char": "🐔",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "penguin",
    "keywords": ["animal", "nature"],
    "char": "🐧",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "bird",
    "keywords": ["animal", "nature", "fly", "tweet", "spring"],
    "char": "🐦",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "baby_chick",
    "keywords": ["animal", "chicken", "bird"],
    "char": "🐤",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "hatching_chick",
    "keywords": ["animal", "chicken", "egg", "born", "baby", "bird"],
    "char": "🐣",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "hatched_chick",
    "keywords": ["animal", "chicken", "baby", "bird"],
    "char": "🐥",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "duck",
    "keywords": ["animal", "nature", "bird", "mallard"],
    "char": "🦆",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "eagle",
    "keywords": ["animal", "nature", "bird"],
    "char": "🦅",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "owl",
    "keywords": ["animal", "nature", "bird", "hoot"],
    "char": "🦉",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "bat",
    "keywords": ["animal", "nature", "blind", "vampire"],
    "char": "🦇",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "wolf",
    "keywords": ["animal", "nature", "wild"],
    "char": "🐺",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "boar",
    "keywords": ["animal", "nature"],
    "char": "🐗",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "horse",
    "keywords": ["animal", "brown", "nature"],
    "char": "🐴",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "unicorn",
    "keywords": ["animal", "nature", "mystical"],
    "char": "🦄",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "honeybee",
    "keywords": ["animal", "insect", "nature", "bug", "spring", "honey"],
    "char": "🐝",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "bug",
    "keywords": ["animal", "insect", "nature", "worm"],
    "char": "🐛",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "butterfly",
    "keywords": ["animal", "insect", "nature", "caterpillar"],
    "char": "🦋",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "snail",
    "keywords": ["slow", "animal", "shell"],
    "char": "🐌",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "beetle",
    "keywords": ["animal", "insect", "nature", "ladybug"],
    "char": "🐞",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "ant",
    "keywords": ["animal", "insect", "nature", "bug"],
    "char": "🐜",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "spider",
    "keywords": ["animal", "arachnid"],
    "char": "🕷",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "scorpion",
    "keywords": ["animal", "arachnid"],
    "char": "🦂",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "crab",
    "keywords": ["animal", "crustacean"],
    "char": "🦀",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "snake",
    "keywords": ["animal", "evil", "nature", "hiss", "python"],
    "char": "🐍",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "lizard",
    "keywords": ["animal", "nature", "reptile"],
    "char": "🦎",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "turtle",
    "keywords": ["animal", "slow", "nature", "tortoise"],
    "char": "🐢",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "tropical_fish",
    "keywords": ["animal", "swim", "ocean", "beach", "nemo"],
    "char": "🐠",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "fish",
    "keywords": ["animal", "food", "nature"],
    "char": "🐟",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "blowfish",
    "keywords": ["animal", "nature", "food", "sea", "ocean"],
    "char": "🐡",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dolphin",
    "keywords": ["animal", "nature", "fish", "sea", "ocean", "flipper", "fins", "beach"],
    "char": "🐬",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "shark",
    "keywords": ["animal", "nature", "fish", "sea", "ocean", "jaws", "fins", "beach"],
    "char": "🦈",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "whale",
    "keywords": ["animal", "nature", "sea", "ocean"],
    "char": "🐳",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "whale2",
    "keywords": ["animal", "nature", "sea", "ocean"],
    "char": "🐋",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "crocodile",
    "keywords": ["animal", "nature", "reptile", "lizard", "alligator"],
    "char": "🐊",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "leopard",
    "keywords": ["animal", "nature"],
    "char": "🐆",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "tiger2",
    "keywords": ["animal", "nature", "roar"],
    "char": "🐅",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "water_buffalo",
    "keywords": ["animal", "nature", "ox", "cow"],
    "char": "🐃",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "ox",
    "keywords": ["animal", "cow", "beef"],
    "char": "🐂",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cow2",
    "keywords": ["beef", "ox", "animal", "nature", "moo", "milk"],
    "char": "🐄",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "deer",
    "keywords": ["animal", "nature", "horns", "venison"],
    "char": "🦌",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dromedary_camel",
    "keywords": ["animal", "hot", "desert", "hump"],
    "char": "🐪",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "camel",
    "keywords": ["animal", "nature", "hot", "desert", "hump"],
    "char": "🐫",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "elephant",
    "keywords": ["animal", "nature", "nose", "th", "circus"],
    "char": "🐘",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "rhinoceros",
    "keywords": ["animal", "nature", "horn"],
    "char": "🦏",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "goat",
    "keywords": ["animal", "nature"],
    "char": "🐐",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "ram",
    "keywords": ["animal", "sheep", "nature"],
    "char": "🐏",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sheep",
    "keywords": ["animal", "nature", "wool", "shipit"],
    "char": "🐑",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "racehorse",
    "keywords": ["animal", "gamble", "luck"],
    "char": "🐎",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "pig2",
    "keywords": ["animal", "nature"],
    "char": "🐖",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "rat",
    "keywords": ["animal", "mouse", "rodent"],
    "char": "🐀",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "mouse2",
    "keywords": ["animal", "nature", "rodent"],
    "char": "🐁",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "rooster",
    "keywords": ["animal", "nature", "chicken"],
    "char": "🐓",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "turkey",
    "keywords": ["animal", "bird"],
    "char": "🦃",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dove",
    "keywords": ["animal", "bird"],
    "char": "🕊",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dog2",
    "keywords": ["animal", "nature", "friend", "doge", "pet", "faithful"],
    "char": "🐕",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "poodle",
    "keywords": ["dog", "animal", "101", "nature", "pet"],
    "char": "🐩",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cat2",
    "keywords": ["animal", "meow", "pet", "cats"],
    "char": "🐈",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "rabbit2",
    "keywords": ["animal", "nature", "pet", "magic", "spring"],
    "char": "🐇",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "chipmunk",
    "keywords": ["animal", "nature", "rodent", "squirrel"],
    "char": "🐿",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "paw_prints",
    "keywords": ["animal", "tracking", "footprints", "dog", "cat", "pet", "feet"],
    "char": "🐾",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dragon",
    "keywords": ["animal", "myth", "nature", "chinese", "green"],
    "char": "🐉",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dragon_face",
    "keywords": ["animal", "myth", "nature", "chinese", "green"],
    "char": "🐲",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cactus",
    "keywords": ["vegetable", "plant", "nature"],
    "char": "🌵",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "christmas_tree",
    "keywords": ["festival", "vacation", "december", "xmas", "celebration"],
    "char": "🎄",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "evergreen_tree",
    "keywords": ["plant", "nature"],
    "char": "🌲",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "deciduous_tree",
    "keywords": ["plant", "nature"],
    "char": "🌳",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "palm_tree",
    "keywords": ["plant", "vegetable", "nature", "summer", "beach", "mojito", "tropical"],
    "char": "🌴",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "seedling",
    "keywords": ["plant", "nature", "grass", "lawn", "spring"],
    "char": "🌱",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "herb",
    "keywords": ["vegetable", "plant", "medicine", "weed", "grass", "lawn"],
    "char": "🌿",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "shamrock",
    "keywords": ["vegetable", "plant", "nature", "irish", "clover"],
    "char": "☘",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "four_leaf_clover",
    "keywords": ["vegetable", "plant", "nature", "lucky", "irish"],
    "char": "🍀",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "bamboo",
    "keywords": ["plant", "nature", "vegetable", "panda", "pine_decoration"],
    "char": "🎍",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "tanabata_tree",
    "keywords": ["plant", "nature", "branch", "summer"],
    "char": "🎋",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "leaves",
    "keywords": ["nature", "plant", "tree", "vegetable", "grass", "lawn", "spring"],
    "char": "🍃",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "fallen_leaf",
    "keywords": ["nature", "plant", "vegetable", "leaves"],
    "char": "🍂",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "maple_leaf",
    "keywords": ["nature", "plant", "vegetable", "ca", "fall"],
    "char": "🍁",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "ear_of_rice",
    "keywords": ["nature", "plant"],
    "char": "🌾",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "hibiscus",
    "keywords": ["plant", "vegetable", "flowers", "beach"],
    "char": "🌺",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sunflower",
    "keywords": ["nature", "plant", "fall"],
    "char": "🌻",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "rose",
    "keywords": ["flowers", "valentines", "love", "spring"],
    "char": "🌹",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "wilted_flower",
    "keywords": ["plant", "nature", "flower"],
    "char": "🥀",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "tulip",
    "keywords": ["flowers", "plant", "nature", "summer", "spring"],
    "char": "🌷",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "blossom",
    "keywords": ["nature", "flowers", "yellow"],
    "char": "🌼",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cherry_blossom",
    "keywords": ["nature", "plant", "spring", "flower"],
    "char": "🌸",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "bouquet",
    "keywords": ["flowers", "nature", "spring"],
    "char": "💐",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "mushroom",
    "keywords": ["plant", "vegetable"],
    "char": "🍄",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "chestnut",
    "keywords": ["food", "squirrel"],
    "char": "🌰",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "jack_o_lantern",
    "keywords": ["halloween", "light", "pumpkin", "creepy", "fall"],
    "char": "🎃",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "shell",
    "keywords": ["nature", "sea", "beach"],
    "char": "🐚",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "spider_web",
    "keywords": ["animal", "insect", "arachnid", "silk"],
    "char": "🕸",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "earth_americas",
    "keywords": ["globe", "world", "USA", "international"],
    "char": "🌎",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "earth_africa",
    "keywords": ["globe", "world", "international"],
    "char": "🌍",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "earth_asia",
    "keywords": ["globe", "world", "east", "international"],
    "char": "🌏",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "full_moon",
    "keywords": ["nature", "yellow", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌕",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "waning_gibbous_moon",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep", "waxing_gibbous_moon"],
    "char": "🌖",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "last_quarter_moon",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌗",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "waning_crescent_moon",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌘",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "new_moon",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌑",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "waxing_crescent_moon",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌒",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "first_quarter_moon",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌓",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "waxing_gibbous_moon",
    "keywords": ["nature", "night", "sky", "gray", "twilight", "planet", "space", "evening", "sleep"],
    "char": "🌔",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "new_moon_with_face",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌚",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "full_moon_with_face",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌝",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "first_quarter_moon_with_face",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌛",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "last_quarter_moon_with_face",
    "keywords": ["nature", "twilight", "planet", "space", "night", "evening", "sleep"],
    "char": "🌜",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sun_with_face",
    "keywords": ["nature", "morning", "sky"],
    "char": "🌞",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "crescent_moon",
    "keywords": ["night", "sleep", "sky", "evening", "magic"],
    "char": "🌙",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "star",
    "keywords": ["night", "yellow"],
    "char": "⭐",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "star2",
    "keywords": ["night", "sparkle", "awesome", "good", "magic"],
    "char": "🌟",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dizzy",
    "keywords": ["star", "sparkle", "shoot", "magic"],
    "char": "💫",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sparkles",
    "keywords": ["stars", "shine", "shiny", "cool", "awesome", "good", "magic"],
    "char": "✨",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "comet",
    "keywords": ["space"],
    "char": "☄",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sunny",
    "keywords": ["weather", "nature", "brightness", "summer", "beach", "spring"],
    "char": "☀️",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sun_behind_small_cloud",
    "keywords": ["weather"],
    "char": "🌤",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "partly_sunny",
    "keywords": ["weather", "nature", "cloudy", "morning", "fall", "spring"],
    "char": "⛅",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sun_behind_large_cloud",
    "keywords": ["weather"],
    "char": "🌥",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sun_behind_rain_cloud",
    "keywords": ["weather"],
    "char": "🌦",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cloud",
    "keywords": ["weather", "sky"],
    "char": "☁️",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cloud_with_rain",
    "keywords": ["weather"],
    "char": "🌧",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cloud_with_lightning_and_rain",
    "keywords": ["weather", "lightning"],
    "char": "⛈",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cloud_with_lightning",
    "keywords": ["weather", "thunder"],
    "char": "🌩",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "zap",
    "keywords": ["thunder", "weather", "lightning bolt", "fast"],
    "char": "⚡",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "fire",
    "keywords": ["hot", "cook", "flame"],
    "char": "🔥",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "boom",
    "keywords": ["bomb", "explode", "explosion", "collision", "blown"],
    "char": "💥",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "snowflake",
    "keywords": ["winter", "season", "cold", "weather", "christmas", "xmas"],
    "char": "❄️",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "cloud_with_snow",
    "keywords": ["weather"],
    "char": "🌨",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "snowman",
    "keywords": ["winter", "season", "cold", "weather", "christmas", "xmas", "frozen", "without_snow"],
    "char": "⛄",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "wind_face",
    "keywords": ["gust", "air"],
    "char": "🌬",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "dash",
    "keywords": ["wind", "air", "fast", "shoo", "fart", "smoke", "puff"],
    "char": "💨",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "tornado",
    "keywords": ["weather", "cyclone", "twister"],
    "char": "🌪",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "fog",
    "keywords": ["weather"],
    "char": "🌫",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "open_umbrella",
    "keywords": ["weather", "spring"],
    "char": "☂",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "umbrella",
    "keywords": ["rainy", "weather", "spring"],
    "char": "☔",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "droplet",
    "keywords": ["water", "drip", "faucet", "spring"],
    "char": "💧",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "sweat_drops",
    "keywords": ["water", "drip", "oops"],
    "char": "💦",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "ocean",
    "keywords": ["sea", "water", "wave", "nature", "tsunami", "disaster"],
    "char": "🌊",
    "fitzpatrick_scale": false,
    "category": "animals_and_nature"
  },
  {
    "name": "green_apple",
    "keywords": ["fruit", "nature"],
    "char": "🍏",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "apple",
    "keywords": ["fruit", "mac", "school"],
    "char": "🍎",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "pear",
    "keywords": ["fruit", "nature", "food"],
    "char": "🍐",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "tangerine",
    "keywords": ["food", "fruit", "nature", "orange"],
    "char": "🍊",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "lemon",
    "keywords": ["fruit", "nature"],
    "char": "🍋",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "banana",
    "keywords": ["fruit", "food", "monkey"],
    "char": "🍌",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "watermelon",
    "keywords": ["fruit", "food", "picnic", "summer"],
    "char": "🍉",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "grapes",
    "keywords": ["fruit", "food", "wine"],
    "char": "🍇",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "strawberry",
    "keywords": ["fruit", "food", "nature"],
    "char": "🍓",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "melon",
    "keywords": ["fruit", "nature", "food"],
    "char": "🍈",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "cherries",
    "keywords": ["food", "fruit"],
    "char": "🍒",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "peach",
    "keywords": ["fruit", "nature", "food"],
    "char": "🍑",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "pineapple",
    "keywords": ["fruit", "nature", "food"],
    "char": "🍍",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "kiwi_fruit",
    "keywords": ["fruit", "food"],
    "char": "🥝",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "avocado",
    "keywords": ["fruit", "food"],
    "char": "🥑",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "tomato",
    "keywords": ["fruit", "vegetable", "nature", "food"],
    "char": "🍅",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "eggplant",
    "keywords": ["vegetable", "nature", "food", "aubergine"],
    "char": "🍆",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "cucumber",
    "keywords": ["fruit", "food", "pickle"],
    "char": "🥒",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "carrot",
    "keywords": ["vegetable", "food", "orange"],
    "char": "🥕",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "hot_pepper",
    "keywords": ["food", "spicy", "chilli", "chili"],
    "char": "🌶",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "potato",
    "keywords": ["food", "tuber", "vegatable", "starch"],
    "char": "🥔",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "corn",
    "keywords": ["food", "vegetable", "plant"],
    "char": "🌽",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "sweet_potato",
    "keywords": ["food", "nature"],
    "char": "🍠",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "peanuts",
    "keywords": ["food", "nut"],
    "char": "🥜",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "honey_pot",
    "keywords": ["bees", "sweet", "kitchen"],
    "char": "🍯",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "croissant",
    "keywords": ["food", "bread", "french"],
    "char": "🥐",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "bread",
    "keywords": ["food", "wheat", "breakfast", "toast"],
    "char": "🍞",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "baguette_bread",
    "keywords": ["food", "bread", "french"],
    "char": "🥖",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "cheese",
    "keywords": ["food", "chadder"],
    "char": "🧀",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "egg",
    "keywords": ["food", "chicken", "breakfast"],
    "char": "🥚",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "bacon",
    "keywords": ["food", "breakfast", "pork", "pig", "meat"],
    "char": "🥓",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "pancakes",
    "keywords": ["food", "breakfast", "flapjacks", "hotcakes"],
    "char": "🥞",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "poultry_leg",
    "keywords": ["food", "meat", "drumstick", "bird", "chicken", "turkey"],
    "char": "🍗",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "meat_on_bone",
    "keywords": ["good", "food", "drumstick"],
    "char": "🍖",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "fried_shrimp",
    "keywords": ["food", "animal", "appetizer", "summer"],
    "char": "🍤",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "fried_egg",
    "keywords": ["food", "breakfast", "kitchen", "egg"],
    "char": "🍳",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "hamburger",
    "keywords": ["meat", "fast food", "beef", "cheeseburger", "mcdonalds", "burger king"],
    "char": "🍔",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "fries",
    "keywords": ["chips", "snack", "fast food"],
    "char": "🍟",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "stuffed_flatbread",
    "keywords": ["food", "flatbread", "stuffed", "gyro"],
    "char": "🥙",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "hotdog",
    "keywords": ["food", "frankfurter"],
    "char": "🌭",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "pizza",
    "keywords": ["food", "party"],
    "char": "🍕",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "spaghetti",
    "keywords": ["food", "italian", "noodle"],
    "char": "🍝",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "taco",
    "keywords": ["food", "mexican"],
    "char": "🌮",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "burrito",
    "keywords": ["food", "mexican"],
    "char": "🌯",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "green_salad",
    "keywords": ["food", "healthy", "lettuce"],
    "char": "🥗",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "shallow_pan_of_food",
    "keywords": ["food", "cooking", "casserole", "paella"],
    "char": "🥘",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "ramen",
    "keywords": ["food", "japanese", "noodle", "chopsticks"],
    "char": "🍜",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "stew",
    "keywords": ["food", "meat", "soup"],
    "char": "🍲",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "fish_cake",
    "keywords": ["food", "japan", "sea", "beach", "narutomaki", "pink", "swirl", "kamaboko", "surimi", "ramen"],
    "char": "🍥",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "sushi",
    "keywords": ["food", "fish", "japanese", "rice"],
    "char": "🍣",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "bento",
    "keywords": ["food", "japanese", "box"],
    "char": "🍱",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "curry",
    "keywords": ["food", "spicy", "hot", "indian"],
    "char": "🍛",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "rice_ball",
    "keywords": ["food", "japanese"],
    "char": "🍙",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "rice",
    "keywords": ["food", "china", "asian"],
    "char": "🍚",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "rice_cracker",
    "keywords": ["food", "japanese"],
    "char": "🍘",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "oden",
    "keywords": ["food", "japanese"],
    "char": "🍢",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "dango",
    "keywords": ["food", "dessert", "sweet", "japanese", "barbecue", "meat"],
    "char": "🍡",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "shaved_ice",
    "keywords": ["hot", "dessert", "summer"],
    "char": "🍧",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "ice_cream",
    "keywords": ["food", "hot", "dessert"],
    "char": "🍨",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "icecream",
    "keywords": ["food", "hot", "dessert", "summer"],
    "char": "🍦",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "cake",
    "keywords": ["food", "dessert"],
    "char": "🍰",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "birthday",
    "keywords": ["food", "dessert", "cake"],
    "char": "🎂",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "custard",
    "keywords": ["dessert", "food"],
    "char": "🍮",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "candy",
    "keywords": ["snack", "dessert", "sweet", "lolly"],
    "char": "🍬",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "lollipop",
    "keywords": ["food", "snack", "candy", "sweet"],
    "char": "🍭",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "chocolate_bar",
    "keywords": ["food", "snack", "dessert", "sweet"],
    "char": "🍫",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "popcorn",
    "keywords": ["food", "movie theater", "films", "snack"],
    "char": "🍿",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "doughnut",
    "keywords": ["food", "dessert", "snack", "sweet", "donut"],
    "char": "🍩",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "cookie",
    "keywords": ["food", "snack", "oreo", "chocolate", "sweet", "dessert"],
    "char": "🍪",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "milk_glass",
    "keywords": ["beverage", "drink", "cow"],
    "char": "🥛",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "beer",
    "keywords": ["relax", "beverage", "drink", "drunk", "party", "pub", "summer", "alcohol", "booze"],
    "char": "🍺",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "beers",
    "keywords": ["relax", "beverage", "drink", "drunk", "party", "pub", "summer", "alcohol", "booze"],
    "char": "🍻",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "clinking_glasses",
    "keywords": ["beverage", "drink", "party", "alcohol", "celebrate", "cheers"],
    "char": "🥂",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "wine_glass",
    "keywords": ["drink", "beverage", "drunk", "alcohol", "booze"],
    "char": "🍷",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "tumbler_glass",
    "keywords": ["drink", "beverage", "drunk", "alcohol", "liquor", "booze", "bourbon", "scotch", "whisky", "glass", "shot"],
    "char": "🥃",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "cocktail",
    "keywords": ["drink", "drunk", "alcohol", "beverage", "booze", "mojito"],
    "char": "🍸",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "tropical_drink",
    "keywords": ["beverage", "cocktail", "summer", "beach", "alcohol", "booze", "mojito"],
    "char": "🍹",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "champagne",
    "keywords": ["drink", "wine", "bottle", "celebration"],
    "char": "🍾",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "sake",
    "keywords": ["wine", "drink", "drunk", "beverage", "japanese", "alcohol", "booze"],
    "char": "🍶",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "tea",
    "keywords": ["drink", "bowl", "breakfast", "green", "british"],
    "char": "🍵",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "coffee",
    "keywords": ["beverage", "caffeine", "latte", "espresso"],
    "char": "☕",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "baby_bottle",
    "keywords": ["food", "container", "milk"],
    "char": "🍼",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "spoon",
    "keywords": ["cutlery", "kitchen", "tableware"],
    "char": "🥄",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "fork_and_knife",
    "keywords": ["cutlery", "kitchen"],
    "char": "🍴",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "plate_with_cutlery",
    "keywords": ["food", "eat", "meal", "lunch", "dinner", "restaurant"],
    "char": "🍽",
    "fitzpatrick_scale": false,
    "category": "food_and_drink"
  },
  {
    "name": "soccer",
    "keywords": ["sports", "football"],
    "char": "⚽",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "basketball",
    "keywords": ["sports", "balls", "NBA"],
    "char": "🏀",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "football",
    "keywords": ["sports", "balls", "NFL"],
    "char": "🏈",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "baseball",
    "keywords": ["sports", "balls"],
    "char": "⚾",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "tennis",
    "keywords": ["sports", "balls", "green"],
    "char": "🎾",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "volleyball",
    "keywords": ["sports", "balls"],
    "char": "🏐",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "rugby_football",
    "keywords": ["sports", "team"],
    "char": "🏉",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "8ball",
    "keywords": ["pool", "hobby", "game", "luck", "magic"],
    "char": "🎱",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "golf",
    "keywords": ["sports", "business", "flag", "hole", "summer"],
    "char": "⛳",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "golfing_woman",
    "keywords": ["sports", "business", "woman", "female"],
    "char": "🏌️‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "golfing_man",
    "keywords": ["sports", "business"],
    "char": "🏌",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "ping_pong",
    "keywords": ["sports", "pingpong"],
    "char": "🏓",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "badminton",
    "keywords": ["sports"],
    "char": "🏸",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "goal_net",
    "keywords": ["sports"],
    "char": "🥅",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "ice_hockey",
    "keywords": ["sports"],
    "char": "🏒",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "field_hockey",
    "keywords": ["sports"],
    "char": "🏑",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "cricket",
    "keywords": ["sports"],
    "char": "🏏",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "ski",
    "keywords": ["sports", "winter", "cold", "snow"],
    "char": "🎿",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "skier",
    "keywords": ["sports", "winter", "snow"],
    "char": "⛷",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "snowboarder",
    "keywords": ["sports", "winter"],
    "char": "🏂",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "person_fencing",
    "keywords": ["sports", "fencing", "sword"],
    "char": "🤺",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "women_wrestling",
    "keywords": ["sports", "wrestlers"],
    "char": "🤼‍♀️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "men_wrestling",
    "keywords": ["sports", "wrestlers"],
    "char": "🤼‍♂️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "woman_cartwheeling",
    "keywords": ["gymnastics"],
    "char": "🤸‍♀️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "man_cartwheeling",
    "keywords": ["gymnastics"],
    "char": "🤸‍♂️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "woman_playing_handball",
    "keywords": ["sports"],
    "char": "🤾‍♀️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "man_playing_handball",
    "keywords": ["sports"],
    "char": "🤾‍♂️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "ice_skate",
    "keywords": ["sports"],
    "char": "⛸",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "bow_and_arrow",
    "keywords": ["sports"],
    "char": "🏹",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "fishing_pole_and_fish",
    "keywords": ["food", "hobby", "summer"],
    "char": "🎣",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "boxing_glove",
    "keywords": ["sports", "fighting"],
    "char": "🥊",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "martial_arts_uniform",
    "keywords": ["judo", "karate", "taekwondo"],
    "char": "🥋",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "rowing_woman",
    "keywords": ["sports", "hobby", "water", "ship", "woman", "female"],
    "char": "🚣‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "rowing_man",
    "keywords": ["sports", "hobby", "water", "ship"],
    "char": "🚣",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "swimming_woman",
    "keywords": ["sports", "exercise", "human", "athlete", "water", "summer", "woman", "female"],
    "char": "🏊‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "swimming_man",
    "keywords": ["sports", "exercise", "human", "athlete", "water", "summer"],
    "char": "🏊",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "woman_playing_water_polo",
    "keywords": ["sports", "pool"],
    "char": "🤽‍♀️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "man_playing_water_polo",
    "keywords": ["sports", "pool"],
    "char": "🤽‍♂️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "surfing_woman",
    "keywords": ["sports", "ocean", "sea", "summer", "beach", "woman", "female"],
    "char": "🏄‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "surfing_man",
    "keywords": ["sports", "ocean", "sea", "summer", "beach"],
    "char": "🏄",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "bath",
    "keywords": ["clean", "shower", "bathroom"],
    "char": "🛀",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "basketball_woman",
    "keywords": ["sports", "human", "woman", "female"],
    "char": "⛹️‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "basketball_man",
    "keywords": ["sports", "human"],
    "char": "⛹",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "weight_lifting_woman",
    "keywords": ["sports", "training", "exercise", "woman", "female"],
    "char": "🏋️‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "weight_lifting_man",
    "keywords": ["sports", "training", "exercise"],
    "char": "🏋",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "biking_woman",
    "keywords": ["sports", "bike", "exercise", "hipster", "woman", "female"],
    "char": "🚴‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "biking_man",
    "keywords": ["sports", "bike", "exercise", "hipster"],
    "char": "🚴",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "mountain_biking_woman",
    "keywords": ["transportation", "sports", "human", "race", "bike", "woman", "female"],
    "char": "🚵‍♀️",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "mountain_biking_man",
    "keywords": ["transportation", "sports", "human", "race", "bike"],
    "char": "🚵",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "horse_racing",
    "keywords": ["animal", "betting", "competition", "gambling", "luck"],
    "char": "🏇",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "business_suit_levitating",
    "keywords": ["suit", "business", "levitate", "hover", "jump"],
    "char": "🕴",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "trophy",
    "keywords": ["win", "award", "contest", "place", "ftw", "ceremony"],
    "char": "🏆",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "running_shirt_with_sash",
    "keywords": ["play", "pageant"],
    "char": "🎽",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "medal_sports",
    "keywords": ["award", "winning"],
    "char": "🏅",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "medal_military",
    "keywords": ["award", "winning", "army"],
    "char": "🎖",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "1st_place_medal",
    "keywords": ["award", "winning", "first"],
    "char": "🥇",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "2nd_place_medal",
    "keywords": ["award", "second"],
    "char": "🥈",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "3rd_place_medal",
    "keywords": ["award", "third"],
    "char": "🥉",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "reminder_ribbon",
    "keywords": ["sports", "cause", "support", "awareness"],
    "char": "🎗",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "rosette",
    "keywords": ["flower", "decoration", "military"],
    "char": "🏵",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "ticket",
    "keywords": ["event", "concert", "pass"],
    "char": "🎫",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "tickets",
    "keywords": ["sports", "concert", "entrance"],
    "char": "🎟",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "performing_arts",
    "keywords": ["acting", "theater", "drama"],
    "char": "🎭",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "art",
    "keywords": ["design", "paint", "draw", "colors"],
    "char": "🎨",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "circus_tent",
    "keywords": ["festival", "carnival", "party"],
    "char": "🎪",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "woman_juggling",
    "keywords": ["juggle", "balance", "skill", "multitask"],
    "char": "🤹‍♀️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "man_juggling",
    "keywords": ["juggle", "balance", "skill", "multitask"],
    "char": "🤹‍♂️",
    "fitzpatrick_scale": true,
    "category": "activity"
  },
  {
    "name": "microphone",
    "keywords": ["sound", "music", "PA", "sing", "talkshow"],
    "char": "🎤",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "headphones",
    "keywords": ["music", "score", "gadgets"],
    "char": "🎧",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "musical_score",
    "keywords": ["treble", "clef", "compose"],
    "char": "🎼",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "musical_keyboard",
    "keywords": ["piano", "instrument", "compose"],
    "char": "🎹",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "drum",
    "keywords": ["music", "instrument", "drumsticks"],
    "char": "🥁",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "saxophone",
    "keywords": ["music", "instrument", "jazz", "blues"],
    "char": "🎷",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "trumpet",
    "keywords": ["music", "brass"],
    "char": "🎺",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "guitar",
    "keywords": ["music", "instrument"],
    "char": "🎸",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "violin",
    "keywords": ["music", "instrument", "orchestra", "symphony"],
    "char": "🎻",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "clapper",
    "keywords": ["movie", "film", "record"],
    "char": "🎬",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "video_game",
    "keywords": ["play", "console", "PS4", "controller"],
    "char": "🎮",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "space_invader",
    "keywords": ["game", "arcade", "play"],
    "char": "👾",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "dart",
    "keywords": ["game", "play", "bar"],
    "char": "🎯",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "game_die",
    "keywords": ["dice", "random", "tabletop", "play", "luck"],
    "char": "🎲",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "slot_machine",
    "keywords": ["bet", "gamble", "vegas", "fruit machine", "luck", "casino"],
    "char": "🎰",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "bowling",
    "keywords": ["sports", "fun", "play"],
    "char": "🎳",
    "fitzpatrick_scale": false,
    "category": "activity"
  },
  {
    "name": "red_car",
    "keywords": ["red", "transportation", "vehicle"],
    "char": "🚗",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "taxi",
    "keywords": ["uber", "vehicle", "cars", "transportation"],
    "char": "🚕",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "blue_car",
    "keywords": ["transportation", "vehicle"],
    "char": "🚙",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "bus",
    "keywords": ["car", "vehicle", "transportation"],
    "char": "🚌",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "trolleybus",
    "keywords": ["bart", "transportation", "vehicle"],
    "char": "🚎",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "racing_car",
    "keywords": ["sports", "race", "fast", "formula", "f1"],
    "char": "🏎",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "police_car",
    "keywords": ["vehicle", "cars", "transportation", "law", "legal", "enforcement"],
    "char": "🚓",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "ambulance",
    "keywords": ["health", "911", "hospital"],
    "char": "🚑",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "fire_engine",
    "keywords": ["transportation", "cars", "vehicle"],
    "char": "🚒",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "minibus",
    "keywords": ["vehicle", "car", "transportation"],
    "char": "🚐",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "truck",
    "keywords": ["cars", "transportation"],
    "char": "🚚",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "articulated_lorry",
    "keywords": ["vehicle", "cars", "transportation", "express"],
    "char": "🚛",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "tractor",
    "keywords": ["vehicle", "car", "farming", "agriculture"],
    "char": "🚜",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "kick_scooter",
    "keywords": ["vehicle", "kick", "razor"],
    "char": "🛴",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "motorcycle",
    "keywords": ["race", "sports", "fast"],
    "char": "🏍",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "bike",
    "keywords": ["sports", "bicycle", "exercise", "hipster"],
    "char": "🚲",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "motor_scooter",
    "keywords": ["vehicle", "vespa", "sasha"],
    "char": "🛵",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "rotating_light",
    "keywords": ["police", "ambulance", "911", "emergency", "alert", "error", "pinged", "law", "legal"],
    "char": "🚨",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "oncoming_police_car",
    "keywords": ["vehicle", "law", "legal", "enforcement", "911"],
    "char": "🚔",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "oncoming_bus",
    "keywords": ["vehicle", "transportation"],
    "char": "🚍",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "oncoming_automobile",
    "keywords": ["car", "vehicle", "transportation"],
    "char": "🚘",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "oncoming_taxi",
    "keywords": ["vehicle", "cars", "uber"],
    "char": "🚖",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "aerial_tramway",
    "keywords": ["transportation", "vehicle", "ski"],
    "char": "🚡",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "mountain_cableway",
    "keywords": ["transportation", "vehicle", "ski"],
    "char": "🚠",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "suspension_railway",
    "keywords": ["vehicle", "transportation"],
    "char": "🚟",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "railway_car",
    "keywords": ["transportation", "vehicle"],
    "char": "🚃",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "train",
    "keywords": ["transportation", "vehicle", "carriage", "public", "travel"],
    "char": "🚋",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "monorail",
    "keywords": ["transportation", "vehicle"],
    "char": "🚝",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "bullettrain_side",
    "keywords": ["transportation", "vehicle"],
    "char": "🚄",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "bullettrain_front",
    "keywords": ["transportation", "vehicle", "speed", "fast", "public", "travel"],
    "char": "🚅",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "light_rail",
    "keywords": ["transportation", "vehicle"],
    "char": "🚈",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "mountain_railway",
    "keywords": ["transportation", "vehicle"],
    "char": "🚞",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "steam_locomotive",
    "keywords": ["transportation", "vehicle", "train"],
    "char": "🚂",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "train2",
    "keywords": ["transportation", "vehicle"],
    "char": "🚆",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "metro",
    "keywords": ["transportation", "blue-square", "mrt", "underground", "tube"],
    "char": "🚇",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "tram",
    "keywords": ["transportation", "vehicle"],
    "char": "🚊",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "station",
    "keywords": ["transportation", "vehicle", "public"],
    "char": "🚉",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "helicopter",
    "keywords": ["transportation", "vehicle", "fly"],
    "char": "🚁",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "small_airplane",
    "keywords": ["flight", "transportation", "fly", "vehicle"],
    "char": "🛩",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "airplane",
    "keywords": ["vehicle", "transportation", "flight", "fly"],
    "char": "✈️",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "flight_departure",
    "keywords": ["airport", "flight", "landing"],
    "char": "🛫",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "flight_arrival",
    "keywords": ["airport", "flight", "boarding"],
    "char": "🛬",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "sailboat",
    "keywords": ["ship", "summer", "transportation", "water", "sailing"],
    "char": "⛵",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "motor_boat",
    "keywords": ["ship"],
    "char": "🛥",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "speedboat",
    "keywords": ["ship", "transportation", "vehicle", "summer"],
    "char": "🚤",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "ferry",
    "keywords": ["boat", "ship", "yacht"],
    "char": "⛴",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "passenger_ship",
    "keywords": ["yacht", "cruise", "ferry"],
    "char": "🛳",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "rocket",
    "keywords": ["launch", "ship", "staffmode", "NASA", "outer space", "outer_space", "fly"],
    "char": "🚀",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "artificial_satellite",
    "keywords": ["communication", "gps", "orbit", "spaceflight", "NASA", "ISS"],
    "char": "🛰",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "seat",
    "keywords": ["sit", "airplane", "transport", "bus", "flight", "fly"],
    "char": "💺",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "canoe",
    "keywords": ["boat", "paddle", "water", "ship"],
    "char": "🛶",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "anchor",
    "keywords": ["ship", "ferry", "sea", "boat"],
    "char": "⚓",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "construction",
    "keywords": ["wip", "progress", "caution", "warning"],
    "char": "🚧",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "fuelpump",
    "keywords": ["gas station", "petroleum"],
    "char": "⛽",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "busstop",
    "keywords": ["transportation", "wait"],
    "char": "🚏",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "vertical_traffic_light",
    "keywords": ["transportation", "driving"],
    "char": "🚦",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "traffic_light",
    "keywords": ["transportation", "signal"],
    "char": "🚥",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "checkered_flag",
    "keywords": ["contest", "finishline", "race", "gokart"],
    "char": "🏁",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "ship",
    "keywords": ["transportation", "titanic", "deploy"],
    "char": "🚢",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "ferris_wheel",
    "keywords": ["photo", "carnival", "londoneye"],
    "char": "🎡",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "roller_coaster",
    "keywords": ["carnival", "playground", "photo", "fun"],
    "char": "🎢",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "carousel_horse",
    "keywords": ["photo", "carnival"],
    "char": "🎠",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "building_construction",
    "keywords": ["wip", "working", "progress"],
    "char": "🏗",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "foggy",
    "keywords": ["photo", "mountain"],
    "char": "🌁",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "tokyo_tower",
    "keywords": ["photo", "japanese"],
    "char": "🗼",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "factory",
    "keywords": ["building", "industry", "pollution", "smoke"],
    "char": "🏭",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "fountain",
    "keywords": ["photo", "summer", "water", "fresh"],
    "char": "⛲",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "rice_scene",
    "keywords": ["photo", "japan", "asia", "tsukimi"],
    "char": "🎑",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "mountain",
    "keywords": ["photo", "nature", "environment"],
    "char": "⛰",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "mountain_snow",
    "keywords": ["photo", "nature", "environment", "winter", "cold"],
    "char": "🏔",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "mount_fuji",
    "keywords": ["photo", "mountain", "nature", "japanese"],
    "char": "🗻",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "volcano",
    "keywords": ["photo", "nature", "disaster"],
    "char": "🌋",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "japan",
    "keywords": ["nation", "country", "japanese", "asia"],
    "char": "🗾",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "camping",
    "keywords": ["photo", "outdoors", "tent"],
    "char": "🏕",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "tent",
    "keywords": ["photo", "camping", "outdoors"],
    "char": "⛺",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "national_park",
    "keywords": ["photo", "environment", "nature"],
    "char": "🏞",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "motorway",
    "keywords": ["road", "cupertino", "interstate", "highway"],
    "char": "🛣",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "railway_track",
    "keywords": ["train", "transportation"],
    "char": "🛤",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "sunrise",
    "keywords": ["morning", "view", "vacation", "photo"],
    "char": "🌅",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "sunrise_over_mountains",
    "keywords": ["view", "vacation", "photo"],
    "char": "🌄",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "desert",
    "keywords": ["photo", "warm", "saharah"],
    "char": "🏜",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "beach_umbrella",
    "keywords": ["weather", "summer", "sunny", "sand", "mojito"],
    "char": "🏖",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "desert_island",
    "keywords": ["photo", "tropical", "mojito"],
    "char": "🏝",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "city_sunrise",
    "keywords": ["photo", "good morning", "dawn"],
    "char": "🌇",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "city_sunset",
    "keywords": ["photo", "evening", "sky", "buildings"],
    "char": "🌆",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "cityscape",
    "keywords": ["photo", "night life", "urban"],
    "char": "🏙",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "night_with_stars",
    "keywords": ["evening", "city", "downtown"],
    "char": "🌃",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "bridge_at_night",
    "keywords": ["photo", "sanfrancisco"],
    "char": "🌉",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "milky_way",
    "keywords": ["photo", "space", "stars"],
    "char": "🌌",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "stars",
    "keywords": ["night", "photo"],
    "char": "🌠",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "sparkler",
    "keywords": ["stars", "night", "shine"],
    "char": "🎇",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "fireworks",
    "keywords": ["photo", "festival", "carnival", "congratulations"],
    "char": "🎆",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "rainbow",
    "keywords": ["nature", "happy", "unicorn_face", "photo", "sky", "spring"],
    "char": "🌈",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "houses",
    "keywords": ["buildings", "photo"],
    "char": "🏘",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "european_castle",
    "keywords": ["building", "royalty", "history"],
    "char": "🏰",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "japanese_castle",
    "keywords": ["photo", "building"],
    "char": "🏯",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "stadium",
    "keywords": ["photo", "place", "sports", "concert", "venue"],
    "char": "🏟",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "statue_of_liberty",
    "keywords": ["american", "newyork"],
    "char": "🗽",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "house",
    "keywords": ["building", "home"],
    "char": "🏠",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "house_with_garden",
    "keywords": ["home", "plant", "nature"],
    "char": "🏡",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "derelict_house",
    "keywords": ["abandon", "evict", "broken", "building"],
    "char": "🏚",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "office",
    "keywords": ["building", "bureau", "work"],
    "char": "🏢",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "department_store",
    "keywords": ["building", "shopping", "mall"],
    "char": "🏬",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "post_office",
    "keywords": ["building", "envelope", "communication"],
    "char": "🏣",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "european_post_office",
    "keywords": ["building", "email"],
    "char": "🏤",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "hospital",
    "keywords": ["building", "health", "surgery", "doctor"],
    "char": "🏥",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "bank",
    "keywords": ["building", "money", "sales", "cash", "business", "enterprise"],
    "char": "🏦",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "hotel",
    "keywords": ["building", "accomodation", "checkin"],
    "char": "🏨",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "convenience_store",
    "keywords": ["building", "shopping", "groceries"],
    "char": "🏪",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "school",
    "keywords": ["building", "student", "education", "learn", "teach"],
    "char": "🏫",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "love_hotel",
    "keywords": ["like", "affection", "dating"],
    "char": "🏩",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "wedding",
    "keywords": ["love", "like", "affection", "couple", "marriage", "bride", "groom"],
    "char": "💒",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "classical_building",
    "keywords": ["art", "culture", "history"],
    "char": "🏛",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "church",
    "keywords": ["building", "religion", "christ"],
    "char": "⛪",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "mosque",
    "keywords": ["islam", "worship", "minaret"],
    "char": "🕌",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "synagogue",
    "keywords": ["judaism", "worship", "temple", "jewish"],
    "char": "🕍",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "kaaba",
    "keywords": ["mecca", "mosque", "islam"],
    "char": "🕋",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "shinto_shrine",
    "keywords": ["temple", "japan", "kyoto"],
    "char": "⛩",
    "fitzpatrick_scale": false,
    "category": "travel_and_places"
  },
  {
    "name": "watch",
    "keywords": ["time", "accessories"],
    "char": "⌚",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "iphone",
    "keywords": ["technology", "apple", "gadgets", "dial"],
    "char": "📱",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "calling",
    "keywords": ["iphone", "incoming"],
    "char": "📲",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "computer",
    "keywords": ["technology", "laptop", "screen", "display", "monitor"],
    "char": "💻",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "keyboard",
    "keywords": ["technology", "computer", "type", "input", "text"],
    "char": "⌨",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "desktop_computer",
    "keywords": ["technology", "computing", "screen"],
    "char": "🖥",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "printer",
    "keywords": ["paper", "ink"],
    "char": "🖨",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "computer_mouse",
    "keywords": ["click"],
    "char": "🖱",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "trackball",
    "keywords": ["technology", "trackpad"],
    "char": "🖲",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "joystick",
    "keywords": ["game", "play"],
    "char": "🕹",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "clamp",
    "keywords": ["tool"],
    "char": "🗜",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "minidisc",
    "keywords": ["technology", "record", "data", "disk", "90s"],
    "char": "💽",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "floppy_disk",
    "keywords": ["oldschool", "technology", "save", "90s", "80s"],
    "char": "💾",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "cd",
    "keywords": ["technology", "dvd", "disk", "disc", "90s"],
    "char": "💿",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "dvd",
    "keywords": ["cd", "disk", "disc"],
    "char": "📀",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "vhs",
    "keywords": ["record", "video", "oldschool", "90s", "80s"],
    "char": "📼",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "camera",
    "keywords": ["gadgets", "photography"],
    "char": "📷",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "camera_flash",
    "keywords": ["photography", "gadgets"],
    "char": "📸",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "video_camera",
    "keywords": ["film", "record"],
    "char": "📹",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "movie_camera",
    "keywords": ["film", "record"],
    "char": "🎥",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "film_projector",
    "keywords": ["video", "tape", "record", "movie"],
    "char": "📽",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "film_strip",
    "keywords": ["movie"],
    "char": "🎞",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "telephone_receiver",
    "keywords": ["technology", "communication", "dial"],
    "char": "📞",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "phone",
    "keywords": ["technology", "communication", "dial", "telephone"],
    "char": "☎️",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pager",
    "keywords": ["bbcall", "oldschool", "90s"],
    "char": "📟",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "fax",
    "keywords": ["communication", "technology"],
    "char": "📠",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "tv",
    "keywords": ["technology", "program", "oldschool", "show", "television"],
    "char": "📺",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "radio",
    "keywords": ["communication", "music", "podcast", "program"],
    "char": "📻",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "studio_microphone",
    "keywords": ["sing", "recording", "artist", "talkshow"],
    "char": "🎙",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "level_slider",
    "keywords": ["scale"],
    "char": "🎚",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "control_knobs",
    "keywords": ["dial"],
    "char": "🎛",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "stopwatch",
    "keywords": ["time", "deadline"],
    "char": "⏱",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "timer_clock",
    "keywords": ["alarm"],
    "char": "⏲",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "alarm_clock",
    "keywords": ["time", "wake"],
    "char": "⏰",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mantelpiece_clock",
    "keywords": ["time"],
    "char": "🕰",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hourglass_flowing_sand",
    "keywords": ["oldschool", "time", "countdown"],
    "char": "⏳",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hourglass",
    "keywords": ["time", "clock", "oldschool", "limit", "exam", "quiz", "test"],
    "char": "⌛",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "satellite",
    "keywords": ["communication", "future", "radio", "space"],
    "char": "📡",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "battery",
    "keywords": ["power", "energy", "sustain"],
    "char": "🔋",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "electric_plug",
    "keywords": ["charger", "power"],
    "char": "🔌",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bulb",
    "keywords": ["light", "electricity", "idea"],
    "char": "💡",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "flashlight",
    "keywords": ["dark", "camping", "sight", "night"],
    "char": "🔦",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "candle",
    "keywords": ["fire", "wax"],
    "char": "🕯",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "wastebasket",
    "keywords": ["bin", "trash", "rubbish", "garbage", "toss"],
    "char": "🗑",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "oil_drum",
    "keywords": ["barrell"],
    "char": "🛢",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "money_with_wings",
    "keywords": ["dollar", "bills", "payment", "sale"],
    "char": "💸",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "dollar",
    "keywords": ["money", "sales", "bill", "currency"],
    "char": "💵",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "yen",
    "keywords": ["money", "sales", "japanese", "dollar", "currency"],
    "char": "💴",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "euro",
    "keywords": ["money", "sales", "dollar", "currency"],
    "char": "💶",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pound",
    "keywords": ["british", "sterling", "money", "sales", "bills", "uk", "england", "currency"],
    "char": "💷",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "moneybag",
    "keywords": ["dollar", "payment", "coins", "sale"],
    "char": "💰",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "credit_card",
    "keywords": ["money", "sales", "dollar", "bill", "payment", "shopping"],
    "char": "💳",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "gem",
    "keywords": ["blue", "ruby", "diamond", "jewelry"],
    "char": "💎",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "balance_scale",
    "keywords": ["law", "fairness", "weight"],
    "char": "⚖",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "wrench",
    "keywords": ["tools", "diy", "ikea", "fix", "maintainer"],
    "char": "🔧",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hammer",
    "keywords": ["tools", "build", "create"],
    "char": "🔨",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hammer_and_pick",
    "keywords": ["tools", "build", "create"],
    "char": "⚒",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hammer_and_wrench",
    "keywords": ["tools", "build", "create"],
    "char": "🛠",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pick",
    "keywords": ["tools", "dig"],
    "char": "⛏",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "nut_and_bolt",
    "keywords": ["handy", "tools", "fix"],
    "char": "🔩",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "gear",
    "keywords": ["cog"],
    "char": "⚙",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "chains",
    "keywords": ["lock", "arrest"],
    "char": "⛓",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "gun",
    "keywords": ["violence", "weapon", "pistol", "revolver"],
    "char": "🔫",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bomb",
    "keywords": ["boom", "explode", "explosion", "terrorism"],
    "char": "💣",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hocho",
    "keywords": ["knife", "blade", "cutlery", "kitchen", "weapon"],
    "char": "🔪",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "dagger",
    "keywords": ["weapon"],
    "char": "🗡",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "crossed_swords",
    "keywords": ["weapon"],
    "char": "⚔",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "shield",
    "keywords": ["protection", "security"],
    "char": "🛡",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "smoking",
    "keywords": ["kills", "tobacco", "cigarette", "joint", "smoke"],
    "char": "🚬",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "skull_and_crossbones",
    "keywords": ["poison", "danger", "deadly", "scary", "death", "pirate", "evil"],
    "char": "☠",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "coffin",
    "keywords": ["vampire", "dead", "die", "death", "rip", "graveyard", "cemetery", "casket", "funeral", "box"],
    "char": "⚰",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "funeral_urn",
    "keywords": ["dead", "die", "death", "rip", "ashes"],
    "char": "⚱",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "amphora",
    "keywords": ["vase", "jar"],
    "char": "🏺",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "crystal_ball",
    "keywords": ["disco", "party", "magic", "circus", "fortune_teller"],
    "char": "🔮",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "prayer_beads",
    "keywords": ["dhikr", "religious"],
    "char": "📿",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "barber",
    "keywords": ["hair", "salon", "style"],
    "char": "💈",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "alembic",
    "keywords": ["distilling", "science", "experiment", "chemistry"],
    "char": "⚗",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "telescope",
    "keywords": ["stars", "space", "zoom", "science", "astronomy"],
    "char": "🔭",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "microscope",
    "keywords": ["laboratory", "experiment", "zoomin", "science", "study"],
    "char": "🔬",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "hole",
    "keywords": ["embarrassing"],
    "char": "🕳",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pill",
    "keywords": ["health", "medicine", "doctor", "pharmacy", "drug"],
    "char": "💊",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "syringe",
    "keywords": ["health", "hospital", "drugs", "blood", "medicine", "needle", "doctor", "nurse"],
    "char": "💉",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "thermometer",
    "keywords": ["weather", "temperature", "hot", "cold"],
    "char": "🌡",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "label",
    "keywords": ["sale", "tag"],
    "char": "🏷",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bookmark",
    "keywords": ["favorite", "label", "save"],
    "char": "🔖",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "toilet",
    "keywords": ["restroom", "wc", "washroom", "bathroom", "potty"],
    "char": "🚽",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "shower",
    "keywords": ["clean", "water", "bathroom"],
    "char": "🚿",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bathtub",
    "keywords": ["clean", "shower", "bathroom"],
    "char": "🛁",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "key",
    "keywords": ["lock", "door", "password"],
    "char": "🔑",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "old_key",
    "keywords": ["lock", "door", "password"],
    "char": "🗝",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "couch_and_lamp",
    "keywords": ["read", "chill"],
    "char": "🛋",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "sleeping_bed",
    "keywords": ["bed", "rest"],
    "char": "🛌",
    "fitzpatrick_scale": true,
    "category": "objects"
  },
  {
    "name": "bed",
    "keywords": ["sleep", "rest"],
    "char": "🛏",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "door",
    "keywords": ["house", "entry", "exit"],
    "char": "🚪",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bellhop_bell",
    "keywords": ["service"],
    "char": "🛎",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "framed_picture",
    "keywords": ["photography"],
    "char": "🖼",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "world_map",
    "keywords": ["location", "direction"],
    "char": "🗺",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "parasol_on_ground",
    "keywords": ["weather", "summer"],
    "char": "⛱",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "moyai",
    "keywords": ["rock", "easter island", "moai"],
    "char": "🗿",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "shopping",
    "keywords": ["mall", "buy", "purchase"],
    "char": "🛍",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "shopping_cart",
    "keywords": ["trolley"],
    "char": "🛒",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "balloon",
    "keywords": ["party", "celebration", "birthday", "circus"],
    "char": "🎈",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "flags",
    "keywords": ["fish", "japanese", "koinobori", "carp", "banner"],
    "char": "🎏",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "ribbon",
    "keywords": ["decoration", "pink", "girl", "bowtie"],
    "char": "🎀",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "gift",
    "keywords": ["present", "birthday", "christmas", "xmas"],
    "char": "🎁",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "confetti_ball",
    "keywords": ["festival", "party", "birthday", "circus"],
    "char": "🎊",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "tada",
    "keywords": ["party", "congratulations", "birthday", "magic", "circus", "celebration"],
    "char": "🎉",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "dolls",
    "keywords": ["japanese", "toy", "kimono"],
    "char": "🎎",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "wind_chime",
    "keywords": ["nature", "ding", "spring", "bell"],
    "char": "🎐",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "crossed_flags",
    "keywords": ["japanese", "nation", "country", "border"],
    "char": "🎌",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "izakaya_lantern",
    "keywords": ["light", "paper", "halloween", "spooky"],
    "char": "🏮",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "email",
    "keywords": ["letter", "postal", "inbox", "communication"],
    "char": "✉️",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "envelope_with_arrow",
    "keywords": ["email", "communication"],
    "char": "📩",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "incoming_envelope",
    "keywords": ["email", "inbox"],
    "char": "📨",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "e-mail",
    "keywords": ["communication", "inbox"],
    "char": "📧",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "love_letter",
    "keywords": ["email", "like", "affection", "envelope", "valentines"],
    "char": "💌",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "postbox",
    "keywords": ["email", "letter", "envelope"],
    "char": "📮",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mailbox_closed",
    "keywords": ["email", "communication", "inbox"],
    "char": "📪",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mailbox",
    "keywords": ["email", "inbox", "communication"],
    "char": "📫",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mailbox_with_mail",
    "keywords": ["email", "inbox", "communication"],
    "char": "📬",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mailbox_with_no_mail",
    "keywords": ["email", "inbox"],
    "char": "📭",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "package",
    "keywords": ["mail", "gift", "cardboard", "box", "moving"],
    "char": "📦",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "postal_horn",
    "keywords": ["instrument", "music"],
    "char": "📯",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "inbox_tray",
    "keywords": ["email", "documents"],
    "char": "📥",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "outbox_tray",
    "keywords": ["inbox", "email"],
    "char": "📤",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "scroll",
    "keywords": ["documents", "ancient", "history", "paper"],
    "char": "📜",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "page_with_curl",
    "keywords": ["documents", "office", "paper"],
    "char": "📃",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bookmark_tabs",
    "keywords": ["favorite", "save", "order", "tidy"],
    "char": "📑",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "bar_chart",
    "keywords": ["graph", "presentation", "stats"],
    "char": "📊",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "chart_with_upwards_trend",
    "keywords": ["graph", "presentation", "stats", "recovery", "business", "economics", "money", "sales", "good", "success"],
    "char": "📈",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "chart_with_downwards_trend",
    "keywords": ["graph", "presentation", "stats", "recession", "business", "economics", "money", "sales", "bad", "failure"],
    "char": "📉",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "page_facing_up",
    "keywords": ["documents", "office", "paper", "information"],
    "char": "📄",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "date",
    "keywords": ["calendar", "schedule"],
    "char": "📅",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "calendar",
    "keywords": ["schedule", "date", "planning"],
    "char": "📆",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "spiral_calendar",
    "keywords": ["date", "schedule", "planning"],
    "char": "🗓",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "card_index",
    "keywords": ["business", "stationery"],
    "char": "📇",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "card_file_box",
    "keywords": ["business", "stationery"],
    "char": "🗃",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "ballot_box",
    "keywords": ["election", "vote"],
    "char": "🗳",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "file_cabinet",
    "keywords": ["filing", "organizing"],
    "char": "🗄",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "clipboard",
    "keywords": ["stationery", "documents"],
    "char": "📋",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "spiral_notepad",
    "keywords": ["memo", "stationery"],
    "char": "🗒",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "file_folder",
    "keywords": ["documents", "business", "office"],
    "char": "📁",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "open_file_folder",
    "keywords": ["documents", "load"],
    "char": "📂",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "card_index_dividers",
    "keywords": ["organizing", "business", "stationery"],
    "char": "🗂",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "newspaper_roll",
    "keywords": ["press", "headline"],
    "char": "🗞",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "newspaper",
    "keywords": ["press", "headline"],
    "char": "📰",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "notebook",
    "keywords": ["stationery", "record", "notes", "paper", "study"],
    "char": "📓",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "closed_book",
    "keywords": ["read", "library", "knowledge", "textbook", "learn"],
    "char": "📕",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "green_book",
    "keywords": ["read", "library", "knowledge", "study"],
    "char": "📗",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "blue_book",
    "keywords": ["read", "library", "knowledge", "learn", "study"],
    "char": "📘",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "orange_book",
    "keywords": ["read", "library", "knowledge", "textbook", "study"],
    "char": "📙",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "notebook_with_decorative_cover",
    "keywords": ["classroom", "notes", "record", "paper", "study"],
    "char": "📔",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "ledger",
    "keywords": ["notes", "paper"],
    "char": "📒",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "books",
    "keywords": ["literature", "library", "study"],
    "char": "📚",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "open_book",
    "keywords": ["book", "read", "library", "knowledge", "literature", "learn", "study"],
    "char": "📖",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "link",
    "keywords": ["rings", "url"],
    "char": "🔗",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "paperclip",
    "keywords": ["documents", "stationery"],
    "char": "📎",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "paperclips",
    "keywords": ["documents", "stationery"],
    "char": "🖇",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "scissors",
    "keywords": ["stationery", "cut"],
    "char": "✂️",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "triangular_ruler",
    "keywords": ["stationery", "math", "architect", "sketch"],
    "char": "📐",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "straight_ruler",
    "keywords": ["stationery", "calculate", "length", "math", "school", "drawing", "architect", "sketch"],
    "char": "📏",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pushpin",
    "keywords": ["stationery", "mark", "here"],
    "char": "📌",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "round_pushpin",
    "keywords": ["stationery", "location", "map", "here"],
    "char": "📍",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "triangular_flag_on_post",
    "keywords": ["mark", "milestone", "place"],
    "char": "🚩",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "white_flag",
    "keywords": ["losing", "loser", "lost", "surrender", "give up", "fail"],
    "char": "🏳",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "black_flag",
    "keywords": ["pirate"],
    "char": "🏴",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "rainbow_flag",
    "keywords": ["flag", "rainbow", "pride", "gay", "lgbt", "glbt", "queer", "homosexual", "lesbian", "bisexual", "transgender"],
    "char": "🏳️‍🌈",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "closed_lock_with_key",
    "keywords": ["security", "privacy"],
    "char": "🔐",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "lock",
    "keywords": ["security", "password", "padlock"],
    "char": "🔒",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "unlock",
    "keywords": ["privacy", "security"],
    "char": "🔓",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "lock_with_ink_pen",
    "keywords": ["security", "secret"],
    "char": "🔏",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pen",
    "keywords": ["stationery", "writing", "write"],
    "char": "🖊",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "fountain_pen",
    "keywords": ["stationery", "writing", "write"],
    "char": "🖋",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "black_nib",
    "keywords": ["pen", "stationery", "writing", "write"],
    "char": "✒️",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "memo",
    "keywords": ["write", "documents", "stationery", "pencil", "paper", "writing", "legal", "exam", "quiz", "test", "study", "compose"],
    "char": "📝",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "pencil2",
    "keywords": ["stationery", "write", "paper", "writing", "school", "study"],
    "char": "✏️",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "crayon",
    "keywords": ["drawing", "creativity"],
    "char": "🖍",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "paintbrush",
    "keywords": ["drawing", "creativity", "art"],
    "char": "🖌",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mag",
    "keywords": ["search", "zoom", "find", "detective"],
    "char": "🔍",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "mag_right",
    "keywords": ["search", "zoom", "find", "detective"],
    "char": "🔎",
    "fitzpatrick_scale": false,
    "category": "objects"
  },
  {
    "name": "heart",
    "keywords": ["love", "like", "valentines"],
    "char": "❤️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "yellow_heart",
    "keywords": ["love", "like", "affection", "valentines"],
    "char": "💛",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "green_heart",
    "keywords": ["love", "like", "affection", "valentines"],
    "char": "💚",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "blue_heart",
    "keywords": ["love", "like", "affection", "valentines"],
    "char": "💙",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "purple_heart",
    "keywords": ["love", "like", "affection", "valentines"],
    "char": "💜",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_heart",
    "keywords": ["evil"],
    "char": "🖤",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "broken_heart",
    "keywords": ["sad", "sorry", "break", "heart", "heartbreak"],
    "char": "💔",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_heart_exclamation",
    "keywords": ["decoration", "love"],
    "char": "❣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "two_hearts",
    "keywords": ["love", "like", "affection", "valentines", "heart"],
    "char": "💕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "revolving_hearts",
    "keywords": ["love", "like", "affection", "valentines"],
    "char": "💞",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heartbeat",
    "keywords": ["love", "like", "affection", "valentines", "pink", "heart"],
    "char": "💓",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heartpulse",
    "keywords": ["like", "love", "affection", "valentines", "pink"],
    "char": "💗",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "sparkling_heart",
    "keywords": ["love", "like", "affection", "valentines"],
    "char": "💖",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "cupid",
    "keywords": ["love", "like", "heart", "affection", "valentines"],
    "char": "💘",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "gift_heart",
    "keywords": ["love", "valentines"],
    "char": "💝",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heart_decoration",
    "keywords": ["purple-square", "love", "like"],
    "char": "💟",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "peace_symbol",
    "keywords": ["hippie"],
    "char": "☮",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "latin_cross",
    "keywords": ["christianity"],
    "char": "✝",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "star_and_crescent",
    "keywords": ["islam"],
    "char": "☪",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "om",
    "keywords": ["hinduism", "buddhism", "sikhism", "jainism"],
    "char": "🕉",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "wheel_of_dharma",
    "keywords": ["hinduism", "buddhism", "sikhism", "jainism"],
    "char": "☸",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "star_of_david",
    "keywords": ["judaism"],
    "char": "✡",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "six_pointed_star",
    "keywords": ["purple-square", "religion", "jewish", "hexagram"],
    "char": "🔯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "menorah",
    "keywords": ["hanukkah", "candles", "jewish"],
    "char": "🕎",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "yin_yang",
    "keywords": ["balance"],
    "char": "☯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "orthodox_cross",
    "keywords": ["suppedaneum", "religion"],
    "char": "☦",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "place_of_worship",
    "keywords": ["religion", "church", "temple", "prayer"],
    "char": "🛐",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "ophiuchus",
    "keywords": ["sign", "purple-square", "constellation", "astrology"],
    "char": "⛎",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "aries",
    "keywords": ["sign", "purple-square", "zodiac", "astrology"],
    "char": "♈",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "taurus",
    "keywords": ["purple-square", "sign", "zodiac", "astrology"],
    "char": "♉",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "gemini",
    "keywords": ["sign", "zodiac", "purple-square", "astrology"],
    "char": "♊",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "cancer",
    "keywords": ["sign", "zodiac", "purple-square", "astrology"],
    "char": "♋",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "leo",
    "keywords": ["sign", "purple-square", "zodiac", "astrology"],
    "char": "♌",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "virgo",
    "keywords": ["sign", "zodiac", "purple-square", "astrology"],
    "char": "♍",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "libra",
    "keywords": ["sign", "purple-square", "zodiac", "astrology"],
    "char": "♎",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "scorpius",
    "keywords": ["sign", "zodiac", "purple-square", "astrology", "scorpio"],
    "char": "♏",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "sagittarius",
    "keywords": ["sign", "zodiac", "purple-square", "astrology"],
    "char": "♐",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "capricorn",
    "keywords": ["sign", "zodiac", "purple-square", "astrology"],
    "char": "♑",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "aquarius",
    "keywords": ["sign", "purple-square", "zodiac", "astrology"],
    "char": "♒",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "pisces",
    "keywords": ["purple-square", "sign", "zodiac", "astrology"],
    "char": "♓",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "id",
    "keywords": ["purple-square", "words"],
    "char": "🆔",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "atom_symbol",
    "keywords": ["science", "physics", "chemistry"],
    "char": "⚛",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u7a7a",
    "keywords": ["kanji", "japanese", "chinese", "empty", "sky", "blue-square"],
    "char": "🈳",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u5272",
    "keywords": ["cut", "divide", "chinese", "kanji", "pink-square"],
    "char": "🈹",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "radioactive",
    "keywords": ["nuclear", "danger"],
    "char": "☢",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "biohazard",
    "keywords": ["danger"],
    "char": "☣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "mobile_phone_off",
    "keywords": ["mute", "orange-square", "silence", "quiet"],
    "char": "📴",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "vibration_mode",
    "keywords": ["orange-square", "phone"],
    "char": "📳",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u6709",
    "keywords": ["orange-square", "chinese", "have", "kanji"],
    "char": "🈶",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u7121",
    "keywords": ["nothing", "chinese", "kanji", "japanese", "orange-square"],
    "char": "🈚",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u7533",
    "keywords": ["chinese", "japanese", "kanji", "orange-square"],
    "char": "🈸",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u55b6",
    "keywords": ["japanese", "opening hours", "orange-square"],
    "char": "🈺",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u6708",
    "keywords": ["chinese", "month", "moon", "japanese", "orange-square", "kanji"],
    "char": "🈷️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "eight_pointed_black_star",
    "keywords": ["orange-square", "shape", "polygon"],
    "char": "✴️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "vs",
    "keywords": ["words", "orange-square"],
    "char": "🆚",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "accept",
    "keywords": ["ok", "good", "chinese", "kanji", "agree", "yes", "orange-circle"],
    "char": "🉑",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_flower",
    "keywords": ["japanese", "spring"],
    "char": "💮",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "ideograph_advantage",
    "keywords": ["chinese", "kanji", "obtain", "get", "circle"],
    "char": "🉐",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "secret",
    "keywords": ["privacy", "chinese", "sshh", "kanji", "red-circle"],
    "char": "㊙️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "congratulations",
    "keywords": ["chinese", "kanji", "japanese", "red-circle"],
    "char": "㊗️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u5408",
    "keywords": ["japanese", "chinese", "join", "kanji", "red-square"],
    "char": "🈴",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u6e80",
    "keywords": ["full", "chinese", "japanese", "red-square", "kanji"],
    "char": "🈵",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u7981",
    "keywords": ["kanji", "japanese", "chinese", "forbidden", "limit", "restricted", "red-square"],
    "char": "🈲",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "a",
    "keywords": ["red-square", "alphabet", "letter"],
    "char": "🅰️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "b",
    "keywords": ["red-square", "alphabet", "letter"],
    "char": "🅱️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "ab",
    "keywords": ["red-square", "alphabet"],
    "char": "🆎",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "cl",
    "keywords": ["alphabet", "words", "red-square"],
    "char": "🆑",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "o2",
    "keywords": ["alphabet", "red-square", "letter"],
    "char": "🅾️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "sos",
    "keywords": ["help", "red-square", "words", "emergency", "911"],
    "char": "🆘",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_entry",
    "keywords": ["limit", "security", "privacy", "bad", "denied", "stop", "circle"],
    "char": "⛔",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "name_badge",
    "keywords": ["fire", "forbid"],
    "char": "📛",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_entry_sign",
    "keywords": ["forbid", "stop", "limit", "denied", "disallow", "circle"],
    "char": "🚫",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "x",
    "keywords": ["no", "delete", "remove", "cancel"],
    "char": "❌",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "o",
    "keywords": ["circle", "round"],
    "char": "⭕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "stop_sign",
    "keywords": ["stop"],
    "char": "🛑",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "anger",
    "keywords": ["angry", "mad"],
    "char": "💢",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "hotsprings",
    "keywords": ["bath", "warm", "relax"],
    "char": "♨️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_pedestrians",
    "keywords": ["rules", "crossing", "walking", "circle"],
    "char": "🚷",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "do_not_litter",
    "keywords": ["trash", "bin", "garbage", "circle"],
    "char": "🚯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_bicycles",
    "keywords": ["cyclist", "prohibited", "circle"],
    "char": "🚳",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "non-potable_water",
    "keywords": ["drink", "faucet", "tap", "circle"],
    "char": "🚱",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "underage",
    "keywords": ["18", "drink", "pub", "night", "minor", "circle"],
    "char": "🔞",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_mobile_phones",
    "keywords": ["iphone", "mute", "circle"],
    "char": "📵",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "exclamation",
    "keywords": ["heavy_exclamation_mark", "danger", "surprise", "punctuation", "wow", "warning"],
    "char": "❗",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "grey_exclamation",
    "keywords": ["surprise", "punctuation", "gray", "wow", "warning"],
    "char": "❕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "question",
    "keywords": ["doubt", "confused"],
    "char": "❓",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "grey_question",
    "keywords": ["doubts", "gray", "huh", "confused"],
    "char": "❔",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "bangbang",
    "keywords": ["exclamation", "surprise"],
    "char": "‼️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "interrobang",
    "keywords": ["wat", "punctuation", "surprise"],
    "char": "⁉️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "100",
    "keywords": ["score", "perfect", "numbers", "century", "exam", "quiz", "test", "pass", "hundred"],
    "char": "💯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "low_brightness",
    "keywords": ["sun", "afternoon", "warm", "summer"],
    "char": "🔅",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "high_brightness",
    "keywords": ["sun", "light"],
    "char": "🔆",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "trident",
    "keywords": ["weapon", "spear"],
    "char": "🔱",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "fleur_de_lis",
    "keywords": ["decorative", "scout"],
    "char": "⚜",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "part_alternation_mark",
    "keywords": ["graph", "presentation", "stats", "business", "economics", "bad"],
    "char": "〽️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "warning",
    "keywords": ["exclamation", "wip", "alert", "error", "problem", "issue"],
    "char": "⚠️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "children_crossing",
    "keywords": ["school", "warning", "danger", "sign", "driving", "yellow-diamond"],
    "char": "🚸",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "beginner",
    "keywords": ["badge", "shield"],
    "char": "🔰",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "recycle",
    "keywords": ["arrow", "environment", "garbage", "trash"],
    "char": "♻️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "u6307",
    "keywords": ["chinese", "point", "green-square", "kanji"],
    "char": "🈯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "chart",
    "keywords": ["green-square", "graph", "presentation", "stats"],
    "char": "💹",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "sparkle",
    "keywords": ["stars", "green-square", "awesome", "good", "fireworks"],
    "char": "❇️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "eight_spoked_asterisk",
    "keywords": ["star", "sparkle", "green-square"],
    "char": "✳️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "negative_squared_cross_mark",
    "keywords": ["x", "green-square", "no", "deny"],
    "char": "❎",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_check_mark",
    "keywords": ["green-square", "ok", "agree", "vote", "election", "answer", "tick"],
    "char": "✅",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "diamond_shape_with_a_dot_inside",
    "keywords": ["jewel", "blue", "gem", "crystal", "fancy"],
    "char": "💠",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "cyclone",
    "keywords": ["weather", "swirl", "blue", "cloud", "vortex", "spiral", "whirlpool", "spin", "tornado", "hurricane", "typhoon"],
    "char": "🌀",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "loop",
    "keywords": ["tape", "cassette"],
    "char": "➿",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "globe_with_meridians",
    "keywords": ["earth", "international", "world", "internet", "interweb", "i18n"],
    "char": "🌐",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "m",
    "keywords": ["alphabet", "blue-circle", "letter"],
    "char": "Ⓜ️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "atm",
    "keywords": ["money", "sales", "cash", "blue-square", "payment", "bank"],
    "char": "🏧",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "sa",
    "keywords": ["japanese", "blue-square", "katakana"],
    "char": "🈂️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "passport_control",
    "keywords": ["custom", "blue-square"],
    "char": "🛂",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "customs",
    "keywords": ["passport", "border", "blue-square"],
    "char": "🛃",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "baggage_claim",
    "keywords": ["blue-square", "airport", "transport"],
    "char": "🛄",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "left_luggage",
    "keywords": ["blue-square", "travel"],
    "char": "🛅",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "wheelchair",
    "keywords": ["blue-square", "disabled", "a11y", "accessibility"],
    "char": "♿",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_smoking",
    "keywords": ["cigarette", "blue-square", "smell", "smoke"],
    "char": "🚭",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "wc",
    "keywords": ["toilet", "restroom", "blue-square"],
    "char": "🚾",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "parking",
    "keywords": ["cars", "blue-square", "alphabet", "letter"],
    "char": "🅿️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "potable_water",
    "keywords": ["blue-square", "liquid", "restroom", "cleaning", "faucet"],
    "char": "🚰",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "mens",
    "keywords": ["toilet", "restroom", "wc", "blue-square", "gender", "male"],
    "char": "🚹",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "womens",
    "keywords": ["purple-square", "woman", "female", "toilet", "loo", "restroom", "gender"],
    "char": "🚺",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "baby_symbol",
    "keywords": ["orange-square", "child"],
    "char": "🚼",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "restroom",
    "keywords": ["blue-square", "toilet", "refresh", "wc", "gender"],
    "char": "🚻",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "put_litter_in_its_place",
    "keywords": ["blue-square", "sign", "human", "info"],
    "char": "🚮",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "cinema",
    "keywords": ["blue-square", "record", "film", "movie", "curtain", "stage", "theater"],
    "char": "🎦",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "signal_strength",
    "keywords": ["blue-square", "reception", "phone", "internet", "connection", "wifi", "bluetooth", "bars"],
    "char": "📶",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "koko",
    "keywords": ["blue-square", "here", "katakana", "japanese", "destination"],
    "char": "🈁",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "ng",
    "keywords": ["blue-square", "words", "shape", "icon"],
    "char": "🆖",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "ok",
    "keywords": ["good", "agree", "yes", "blue-square"],
    "char": "🆗",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "up",
    "keywords": ["blue-square", "above", "high"],
    "char": "🆙",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "cool",
    "keywords": ["words", "blue-square"],
    "char": "🆒",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "new",
    "keywords": ["blue-square", "words", "start"],
    "char": "🆕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "free",
    "keywords": ["blue-square", "words"],
    "char": "🆓",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "zero",
    "keywords": ["0", "numbers", "blue-square", "null"],
    "char": "0️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "one",
    "keywords": ["blue-square", "numbers", "1"],
    "char": "1️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "two",
    "keywords": ["numbers", "2", "prime", "blue-square"],
    "char": "2️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "three",
    "keywords": ["3", "numbers", "prime", "blue-square"],
    "char": "3️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "four",
    "keywords": ["4", "numbers", "blue-square"],
    "char": "4️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "five",
    "keywords": ["5", "numbers", "blue-square", "prime"],
    "char": "5️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "six",
    "keywords": ["6", "numbers", "blue-square"],
    "char": "6️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "seven",
    "keywords": ["7", "numbers", "blue-square", "prime"],
    "char": "7️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "eight",
    "keywords": ["8", "blue-square", "numbers"],
    "char": "8️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "nine",
    "keywords": ["blue-square", "numbers", "9"],
    "char": "9️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "keycap_ten",
    "keywords": ["numbers", "10", "blue-square"],
    "char": "🔟",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "asterisk",
    "keywords": ["star", "keycap"],
    "char": "*⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "1234",
    "keywords": ["numbers", "blue-square"],
    "char": "🔢",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_forward",
    "keywords": ["blue-square", "right", "direction", "play"],
    "char": "▶️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "pause_button",
    "keywords": ["pause", "blue-square"],
    "char": "⏸",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "next_track_button",
    "keywords": ["forward", "next", "blue-square"],
    "char": "⏭",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "stop_button",
    "keywords": ["blue-square"],
    "char": "⏹",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "record_button",
    "keywords": ["blue-square"],
    "char": "⏺",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "play_or_pause_button",
    "keywords": ["blue-square", "play", "pause"],
    "char": "⏯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "previous_track_button",
    "keywords": ["backward"],
    "char": "⏮",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "fast_forward",
    "keywords": ["blue-square", "play", "speed", "continue"],
    "char": "⏩",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "rewind",
    "keywords": ["play", "blue-square"],
    "char": "⏪",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "twisted_rightwards_arrows",
    "keywords": ["blue-square", "shuffle", "music", "random"],
    "char": "🔀",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "repeat",
    "keywords": ["loop", "record"],
    "char": "🔁",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "repeat_one",
    "keywords": ["blue-square", "loop"],
    "char": "🔂",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_backward",
    "keywords": ["blue-square", "left", "direction"],
    "char": "◀️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_up_small",
    "keywords": ["blue-square", "triangle", "direction", "point", "forward", "top"],
    "char": "🔼",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_down_small",
    "keywords": ["blue-square", "direction", "bottom"],
    "char": "🔽",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_double_up",
    "keywords": ["blue-square", "direction", "top"],
    "char": "⏫",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_double_down",
    "keywords": ["blue-square", "direction", "bottom"],
    "char": "⏬",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_right",
    "keywords": ["blue-square", "next"],
    "char": "➡️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_left",
    "keywords": ["blue-square", "previous", "back"],
    "char": "⬅️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_up",
    "keywords": ["blue-square", "continue", "top", "direction"],
    "char": "⬆️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_down",
    "keywords": ["blue-square", "direction", "bottom"],
    "char": "⬇️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_upper_right",
    "keywords": ["blue-square", "point", "direction", "diagonal", "northeast"],
    "char": "↗️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_lower_right",
    "keywords": ["blue-square", "direction", "diagonal", "southeast"],
    "char": "↘️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_lower_left",
    "keywords": ["blue-square", "direction", "diagonal", "southwest"],
    "char": "↙️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_upper_left",
    "keywords": ["blue-square", "point", "direction", "diagonal", "northwest"],
    "char": "↖️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_up_down",
    "keywords": ["blue-square", "direction", "way", "vertical"],
    "char": "↕️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "left_right_arrow",
    "keywords": ["shape", "direction", "horizontal", "sideways"],
    "char": "↔️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrows_counterclockwise",
    "keywords": ["blue-square", "sync", "cycle"],
    "char": "🔄",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_right_hook",
    "keywords": ["blue-square", "return", "rotate", "direction"],
    "char": "↪️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "leftwards_arrow_with_hook",
    "keywords": ["back", "return", "blue-square", "undo", "enter"],
    "char": "↩️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_heading_up",
    "keywords": ["blue-square", "direction", "top"],
    "char": "⤴️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrow_heading_down",
    "keywords": ["blue-square", "direction", "bottom"],
    "char": "⤵️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "hash",
    "keywords": ["symbol", "blue-square", "twitter"],
    "char": "#️⃣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "information_source",
    "keywords": ["blue-square", "alphabet", "letter"],
    "char": "ℹ️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "abc",
    "keywords": ["blue-square", "alphabet"],
    "char": "🔤",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "abcd",
    "keywords": ["blue-square", "alphabet"],
    "char": "🔡",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "capital_abcd",
    "keywords": ["alphabet", "words", "blue-square"],
    "char": "🔠",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "symbols",
    "keywords": ["blue-square", "music", "note", "ampersand", "percent", "glyphs", "characters"],
    "char": "🔣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "musical_note",
    "keywords": ["score", "tone", "sound"],
    "char": "🎵",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "notes",
    "keywords": ["music", "score"],
    "char": "🎶",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "wavy_dash",
    "keywords": ["draw", "line", "moustache", "mustache", "squiggle", "scribble"],
    "char": "〰️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "curly_loop",
    "keywords": ["scribble", "draw", "shape", "squiggle"],
    "char": "➰",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_check_mark",
    "keywords": ["ok", "nike", "answer", "yes", "tick"],
    "char": "✔️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "arrows_clockwise",
    "keywords": ["sync", "cycle", "round", "repeat"],
    "char": "🔃",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_plus_sign",
    "keywords": ["math", "calculation", "addition", "more", "increase"],
    "char": "➕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_minus_sign",
    "keywords": ["math", "calculation", "subtract", "less"],
    "char": "➖",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_division_sign",
    "keywords": ["divide", "math", "calculation"],
    "char": "➗",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_multiplication_x",
    "keywords": ["math", "calculation"],
    "char": "✖️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "heavy_dollar_sign",
    "keywords": ["money", "sales", "payment", "currency", "buck"],
    "char": "💲",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "currency_exchange",
    "keywords": ["money", "sales", "dollar", "travel"],
    "char": "💱",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "copyright",
    "keywords": ["ip", "license", "circle", "law", "legal"],
    "char": "©️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "registered",
    "keywords": ["alphabet", "circle"],
    "char": "®️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "tm",
    "keywords": ["trademark", "brand", "law", "legal"],
    "char": "™️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "end",
    "keywords": ["words", "arrow"],
    "char": "🔚",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "back",
    "keywords": ["arrow", "words", "return"],
    "char": "🔙",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "on",
    "keywords": ["arrow", "words"],
    "char": "🔛",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "top",
    "keywords": ["words", "blue-square"],
    "char": "🔝",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "soon",
    "keywords": ["arrow", "words"],
    "char": "🔜",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "ballot_box_with_check",
    "keywords": ["ok", "agree", "confirm", "black-square", "vote", "election", "yes", "tick"],
    "char": "☑️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "radio_button",
    "keywords": ["input", "old", "music", "circle"],
    "char": "🔘",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_circle",
    "keywords": ["shape", "round"],
    "char": "⚪",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_circle",
    "keywords": ["shape", "button", "round"],
    "char": "⚫",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "red_circle",
    "keywords": ["shape", "error", "danger"],
    "char": "🔴",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "large_blue_circle",
    "keywords": ["shape", "icon", "button"],
    "char": "🔵",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "small_orange_diamond",
    "keywords": ["shape", "jewel", "gem"],
    "char": "🔸",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "small_blue_diamond",
    "keywords": ["shape", "jewel", "gem"],
    "char": "🔹",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "large_orange_diamond",
    "keywords": ["shape", "jewel", "gem"],
    "char": "🔶",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "large_blue_diamond",
    "keywords": ["shape", "jewel", "gem"],
    "char": "🔷",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "small_red_triangle",
    "keywords": ["shape", "direction", "up", "top"],
    "char": "🔺",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_small_square",
    "keywords": ["shape", "icon"],
    "char": "▪️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_small_square",
    "keywords": ["shape", "icon"],
    "char": "▫️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_large_square",
    "keywords": ["shape", "icon", "button"],
    "char": "⬛",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_large_square",
    "keywords": ["shape", "icon", "stone", "button"],
    "char": "⬜",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "small_red_triangle_down",
    "keywords": ["shape", "direction", "bottom"],
    "char": "🔻",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_medium_square",
    "keywords": ["shape", "button", "icon"],
    "char": "◼️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_medium_square",
    "keywords": ["shape", "stone", "icon"],
    "char": "◻️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_medium_small_square",
    "keywords": ["icon", "shape", "button"],
    "char": "◾",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_medium_small_square",
    "keywords": ["shape", "stone", "icon", "button"],
    "char": "◽",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_square_button",
    "keywords": ["shape", "input", "frame"],
    "char": "🔲",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "white_square_button",
    "keywords": ["shape", "input"],
    "char": "🔳",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "speaker",
    "keywords": ["sound", "volume", "silence", "broadcast"],
    "char": "🔈",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "sound",
    "keywords": ["volume", "speaker", "broadcast"],
    "char": "🔉",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "loud_sound",
    "keywords": ["volume", "noise", "noisy", "speaker", "broadcast"],
    "char": "🔊",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "mute",
    "keywords": ["sound", "volume", "silence", "quiet"],
    "char": "🔇",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "mega",
    "keywords": ["sound", "speaker", "volume"],
    "char": "📣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "loudspeaker",
    "keywords": ["volume", "sound"],
    "char": "📢",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "bell",
    "keywords": ["sound", "notification", "christmas", "xmas", "chime"],
    "char": "🔔",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "no_bell",
    "keywords": ["sound", "volume", "mute", "quiet", "silent"],
    "char": "🔕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "black_joker",
    "keywords": ["poker", "cards", "game", "play", "magic"],
    "char": "🃏",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "mahjong",
    "keywords": ["game", "play", "chinese", "kanji"],
    "char": "🀄",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "spades",
    "keywords": ["poker", "cards", "suits", "magic"],
    "char": "♠️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clubs",
    "keywords": ["poker", "cards", "magic", "suits"],
    "char": "♣️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "hearts",
    "keywords": ["poker", "cards", "magic", "suits"],
    "char": "♥️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "diamonds",
    "keywords": ["poker", "cards", "magic", "suits"],
    "char": "♦️",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "flower_playing_cards",
    "keywords": ["game", "sunset", "red"],
    "char": "🎴",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "thought_balloon",
    "keywords": ["bubble", "cloud", "speech", "thinking", "dream"],
    "char": "💭",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "right_anger_bubble",
    "keywords": ["caption", "speech", "thinking", "mad"],
    "char": "🗯",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "speech_balloon",
    "keywords": ["bubble", "words", "message", "talk", "chatting"],
    "char": "💬",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "left_speech_bubble",
    "keywords": ["words", "message", "talk", "chatting"],
    "char": "🗨",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock1",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕐",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock2",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕑",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock3",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕒",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock4",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕓",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock5",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕔",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock6",
    "keywords": ["time", "late", "early", "schedule", "dawn", "dusk"],
    "char": "🕕",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock7",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕖",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock8",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕗",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock9",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕘",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock10",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕙",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock11",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕚",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock12",
    "keywords": ["time", "noon", "midnight", "midday", "late", "early", "schedule"],
    "char": "🕛",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock130",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕜",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock230",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕝",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock330",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕞",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock430",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕟",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock530",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕠",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock630",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕡",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock730",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕢",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock830",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕣",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock930",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕤",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock1030",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕥",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock1130",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕦",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "clock1230",
    "keywords": ["time", "late", "early", "schedule"],
    "char": "🕧",
    "fitzpatrick_scale": false,
    "category": "symbols"
  },
  {
    "name": "afghanistan",
    "keywords": ["af", "flag", "nation", "country", "banner"],
    "char": "🇦🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "aland_islands",
    "keywords": ["Åland", "islands", "flag", "nation", "country", "banner"],
    "char": "🇦🇽",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "albania",
    "keywords": ["al", "flag", "nation", "country", "banner"],
    "char": "🇦🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "algeria",
    "keywords": ["dz", "flag", "nation", "country", "banner"],
    "char": "🇩🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "american_samoa",
    "keywords": ["american", "ws", "flag", "nation", "country", "banner"],
    "char": "🇦🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "andorra",
    "keywords": ["ad", "flag", "nation", "country", "banner"],
    "char": "🇦🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "angola",
    "keywords": ["ao", "flag", "nation", "country", "banner"],
    "char": "🇦🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "anguilla",
    "keywords": ["ai", "flag", "nation", "country", "banner"],
    "char": "🇦🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "antarctica",
    "keywords": ["aq", "flag", "nation", "country", "banner"],
    "char": "🇦🇶",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "antigua_barbuda",
    "keywords": ["antigua", "barbuda", "flag", "nation", "country", "banner"],
    "char": "🇦🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "argentina",
    "keywords": ["ar", "flag", "nation", "country", "banner"],
    "char": "🇦🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "armenia",
    "keywords": ["am", "flag", "nation", "country", "banner"],
    "char": "🇦🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "aruba",
    "keywords": ["aw", "flag", "nation", "country", "banner"],
    "char": "🇦🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "australia",
    "keywords": ["au", "flag", "nation", "country", "banner"],
    "char": "🇦🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "austria",
    "keywords": ["at", "flag", "nation", "country", "banner"],
    "char": "🇦🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "azerbaijan",
    "keywords": ["az", "flag", "nation", "country", "banner"],
    "char": "🇦🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bahamas",
    "keywords": ["bs", "flag", "nation", "country", "banner"],
    "char": "🇧🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bahrain",
    "keywords": ["bh", "flag", "nation", "country", "banner"],
    "char": "🇧🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bangladesh",
    "keywords": ["bd", "flag", "nation", "country", "banner"],
    "char": "🇧🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "barbados",
    "keywords": ["bb", "flag", "nation", "country", "banner"],
    "char": "🇧🇧",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "belarus",
    "keywords": ["by", "flag", "nation", "country", "banner"],
    "char": "🇧🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "belgium",
    "keywords": ["be", "flag", "nation", "country", "banner"],
    "char": "🇧🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "belize",
    "keywords": ["bz", "flag", "nation", "country", "banner"],
    "char": "🇧🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "benin",
    "keywords": ["bj", "flag", "nation", "country", "banner"],
    "char": "🇧🇯",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bermuda",
    "keywords": ["bm", "flag", "nation", "country", "banner"],
    "char": "🇧🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bhutan",
    "keywords": ["bt", "flag", "nation", "country", "banner"],
    "char": "🇧🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bolivia",
    "keywords": ["bo", "flag", "nation", "country", "banner"],
    "char": "🇧🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "caribbean_netherlands",
    "keywords": ["bonaire", "flag", "nation", "country", "banner"],
    "char": "🇧🇶",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bosnia_herzegovina",
    "keywords": ["bosnia", "herzegovina", "flag", "nation", "country", "banner"],
    "char": "🇧🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "botswana",
    "keywords": ["bw", "flag", "nation", "country", "banner"],
    "char": "🇧🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "brazil",
    "keywords": ["br", "flag", "nation", "country", "banner"],
    "char": "🇧🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "british_indian_ocean_territory",
    "keywords": ["british", "indian", "ocean", "territory", "flag", "nation", "country", "banner"],
    "char": "🇮🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "british_virgin_islands",
    "keywords": ["british", "virgin", "islands", "bvi", "flag", "nation", "country", "banner"],
    "char": "🇻🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "brunei",
    "keywords": ["bn", "darussalam", "flag", "nation", "country", "banner"],
    "char": "🇧🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "bulgaria",
    "keywords": ["bg", "flag", "nation", "country", "banner"],
    "char": "🇧🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "burkina_faso",
    "keywords": ["burkina", "faso", "flag", "nation", "country", "banner"],
    "char": "🇧🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "burundi",
    "keywords": ["bi", "flag", "nation", "country", "banner"],
    "char": "🇧🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cape_verde",
    "keywords": ["cabo", "verde", "flag", "nation", "country", "banner"],
    "char": "🇨🇻",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cambodia",
    "keywords": ["kh", "flag", "nation", "country", "banner"],
    "char": "🇰🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cameroon",
    "keywords": ["cm", "flag", "nation", "country", "banner"],
    "char": "🇨🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "canada",
    "keywords": ["ca", "flag", "nation", "country", "banner"],
    "char": "🇨🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "canary_islands",
    "keywords": ["canary", "islands", "flag", "nation", "country", "banner"],
    "char": "🇮🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cayman_islands",
    "keywords": ["cayman", "islands", "flag", "nation", "country", "banner"],
    "char": "🇰🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "central_african_republic",
    "keywords": ["central", "african", "republic", "flag", "nation", "country", "banner"],
    "char": "🇨🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "chad",
    "keywords": ["td", "flag", "nation", "country", "banner"],
    "char": "🇹🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "chile",
    "keywords": ["flag", "nation", "country", "banner"],
    "char": "🇨🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cn",
    "keywords": ["china", "chinese", "prc", "flag", "country", "nation", "banner"],
    "char": "🇨🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "christmas_island",
    "keywords": ["christmas", "island", "flag", "nation", "country", "banner"],
    "char": "🇨🇽",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cocos_islands",
    "keywords": ["cocos", "keeling", "islands", "flag", "nation", "country", "banner"],
    "char": "🇨🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "colombia",
    "keywords": ["co", "flag", "nation", "country", "banner"],
    "char": "🇨🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "comoros",
    "keywords": ["km", "flag", "nation", "country", "banner"],
    "char": "🇰🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "congo_brazzaville",
    "keywords": ["congo", "flag", "nation", "country", "banner"],
    "char": "🇨🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "congo_kinshasa",
    "keywords": ["congo", "democratic", "republic", "flag", "nation", "country", "banner"],
    "char": "🇨🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cook_islands",
    "keywords": ["cook", "islands", "flag", "nation", "country", "banner"],
    "char": "🇨🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "costa_rica",
    "keywords": ["costa", "rica", "flag", "nation", "country", "banner"],
    "char": "🇨🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "croatia",
    "keywords": ["hr", "flag", "nation", "country", "banner"],
    "char": "🇭🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cuba",
    "keywords": ["cu", "flag", "nation", "country", "banner"],
    "char": "🇨🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "curacao",
    "keywords": ["curaçao", "flag", "nation", "country", "banner"],
    "char": "🇨🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cyprus",
    "keywords": ["cy", "flag", "nation", "country", "banner"],
    "char": "🇨🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "czech_republic",
    "keywords": ["cz", "flag", "nation", "country", "banner"],
    "char": "🇨🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "denmark",
    "keywords": ["dk", "flag", "nation", "country", "banner"],
    "char": "🇩🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "djibouti",
    "keywords": ["dj", "flag", "nation", "country", "banner"],
    "char": "🇩🇯",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "dominica",
    "keywords": ["dm", "flag", "nation", "country", "banner"],
    "char": "🇩🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "dominican_republic",
    "keywords": ["dominican", "republic", "flag", "nation", "country", "banner"],
    "char": "🇩🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "ecuador",
    "keywords": ["ec", "flag", "nation", "country", "banner"],
    "char": "🇪🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "egypt",
    "keywords": ["eg", "flag", "nation", "country", "banner"],
    "char": "🇪🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "el_salvador",
    "keywords": ["el", "salvador", "flag", "nation", "country", "banner"],
    "char": "🇸🇻",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "equatorial_guinea",
    "keywords": ["equatorial", "gn", "flag", "nation", "country", "banner"],
    "char": "🇬🇶",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "eritrea",
    "keywords": ["er", "flag", "nation", "country", "banner"],
    "char": "🇪🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "estonia",
    "keywords": ["ee", "flag", "nation", "country", "banner"],
    "char": "🇪🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "ethiopia",
    "keywords": ["et", "flag", "nation", "country", "banner"],
    "char": "🇪🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "eu",
    "keywords": ["european", "union", "flag", "banner"],
    "char": "🇪🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "falkland_islands",
    "keywords": ["falkland", "islands", "malvinas", "flag", "nation", "country", "banner"],
    "char": "🇫🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "faroe_islands",
    "keywords": ["faroe", "islands", "flag", "nation", "country", "banner"],
    "char": "🇫🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "fiji",
    "keywords": ["fj", "flag", "nation", "country", "banner"],
    "char": "🇫🇯",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "finland",
    "keywords": ["fi", "flag", "nation", "country", "banner"],
    "char": "🇫🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "fr",
    "keywords": ["banner", "flag", "nation", "france", "french", "country"],
    "char": "🇫🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "french_guiana",
    "keywords": ["french", "guiana", "flag", "nation", "country", "banner"],
    "char": "🇬🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "french_polynesia",
    "keywords": ["french", "polynesia", "flag", "nation", "country", "banner"],
    "char": "🇵🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "french_southern_territories",
    "keywords": ["french", "southern", "territories", "flag", "nation", "country", "banner"],
    "char": "🇹🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "gabon",
    "keywords": ["ga", "flag", "nation", "country", "banner"],
    "char": "🇬🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "gambia",
    "keywords": ["gm", "flag", "nation", "country", "banner"],
    "char": "🇬🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "georgia",
    "keywords": ["ge", "flag", "nation", "country", "banner"],
    "char": "🇬🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "de",
    "keywords": ["german", "nation", "flag", "country", "banner"],
    "char": "🇩🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "ghana",
    "keywords": ["gh", "flag", "nation", "country", "banner"],
    "char": "🇬🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "gibraltar",
    "keywords": ["gi", "flag", "nation", "country", "banner"],
    "char": "🇬🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "greece",
    "keywords": ["gr", "flag", "nation", "country", "banner"],
    "char": "🇬🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "greenland",
    "keywords": ["gl", "flag", "nation", "country", "banner"],
    "char": "🇬🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "grenada",
    "keywords": ["gd", "flag", "nation", "country", "banner"],
    "char": "🇬🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guadeloupe",
    "keywords": ["gp", "flag", "nation", "country", "banner"],
    "char": "🇬🇵",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guam",
    "keywords": ["gu", "flag", "nation", "country", "banner"],
    "char": "🇬🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guatemala",
    "keywords": ["gt", "flag", "nation", "country", "banner"],
    "char": "🇬🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guernsey",
    "keywords": ["gg", "flag", "nation", "country", "banner"],
    "char": "🇬🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guinea",
    "keywords": ["gn", "flag", "nation", "country", "banner"],
    "char": "🇬🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guinea_bissau",
    "keywords": ["gw", "bissau", "flag", "nation", "country", "banner"],
    "char": "🇬🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "guyana",
    "keywords": ["gy", "flag", "nation", "country", "banner"],
    "char": "🇬🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "haiti",
    "keywords": ["ht", "flag", "nation", "country", "banner"],
    "char": "🇭🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "honduras",
    "keywords": ["hn", "flag", "nation", "country", "banner"],
    "char": "🇭🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "hong_kong",
    "keywords": ["hong", "kong", "flag", "nation", "country", "banner"],
    "char": "🇭🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "hungary",
    "keywords": ["hu", "flag", "nation", "country", "banner"],
    "char": "🇭🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "iceland",
    "keywords": ["is", "flag", "nation", "country", "banner"],
    "char": "🇮🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "india",
    "keywords": ["in", "flag", "nation", "country", "banner"],
    "char": "🇮🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "indonesia",
    "keywords": ["flag", "nation", "country", "banner"],
    "char": "🇮🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "iran",
    "keywords": ["iran,", "islamic", "republic", "flag", "nation", "country", "banner"],
    "char": "🇮🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "iraq",
    "keywords": ["iq", "flag", "nation", "country", "banner"],
    "char": "🇮🇶",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "ireland",
    "keywords": ["ie", "flag", "nation", "country", "banner"],
    "char": "🇮🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "isle_of_man",
    "keywords": ["isle", "man", "flag", "nation", "country", "banner"],
    "char": "🇮🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "israel",
    "keywords": ["il", "flag", "nation", "country", "banner"],
    "char": "🇮🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "it",
    "keywords": ["italy", "flag", "nation", "country", "banner"],
    "char": "🇮🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "cote_divoire",
    "keywords": ["ivory", "coast", "flag", "nation", "country", "banner"],
    "char": "🇨🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "jamaica",
    "keywords": ["jm", "flag", "nation", "country", "banner"],
    "char": "🇯🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "jp",
    "keywords": ["japanese", "nation", "flag", "country", "banner"],
    "char": "🇯🇵",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "jersey",
    "keywords": ["je", "flag", "nation", "country", "banner"],
    "char": "🇯🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "jordan",
    "keywords": ["jo", "flag", "nation", "country", "banner"],
    "char": "🇯🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kazakhstan",
    "keywords": ["kz", "flag", "nation", "country", "banner"],
    "char": "🇰🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kenya",
    "keywords": ["ke", "flag", "nation", "country", "banner"],
    "char": "🇰🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kiribati",
    "keywords": ["ki", "flag", "nation", "country", "banner"],
    "char": "🇰🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kosovo",
    "keywords": ["xk", "flag", "nation", "country", "banner"],
    "char": "🇽🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kuwait",
    "keywords": ["kw", "flag", "nation", "country", "banner"],
    "char": "🇰🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kyrgyzstan",
    "keywords": ["kg", "flag", "nation", "country", "banner"],
    "char": "🇰🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "laos",
    "keywords": ["lao", "democratic", "republic", "flag", "nation", "country", "banner"],
    "char": "🇱🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "latvia",
    "keywords": ["lv", "flag", "nation", "country", "banner"],
    "char": "🇱🇻",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "lebanon",
    "keywords": ["lb", "flag", "nation", "country", "banner"],
    "char": "🇱🇧",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "lesotho",
    "keywords": ["ls", "flag", "nation", "country", "banner"],
    "char": "🇱🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "liberia",
    "keywords": ["lr", "flag", "nation", "country", "banner"],
    "char": "🇱🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "libya",
    "keywords": ["ly", "flag", "nation", "country", "banner"],
    "char": "🇱🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "liechtenstein",
    "keywords": ["li", "flag", "nation", "country", "banner"],
    "char": "🇱🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "lithuania",
    "keywords": ["lt", "flag", "nation", "country", "banner"],
    "char": "🇱🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "luxembourg",
    "keywords": ["lu", "flag", "nation", "country", "banner"],
    "char": "🇱🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "macau",
    "keywords": ["macao", "flag", "nation", "country", "banner"],
    "char": "🇲🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "macedonia",
    "keywords": ["macedonia,", "flag", "nation", "country", "banner"],
    "char": "🇲🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "madagascar",
    "keywords": ["mg", "flag", "nation", "country", "banner"],
    "char": "🇲🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "malawi",
    "keywords": ["mw", "flag", "nation", "country", "banner"],
    "char": "🇲🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "malaysia",
    "keywords": ["my", "flag", "nation", "country", "banner"],
    "char": "🇲🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "maldives",
    "keywords": ["mv", "flag", "nation", "country", "banner"],
    "char": "🇲🇻",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mali",
    "keywords": ["ml", "flag", "nation", "country", "banner"],
    "char": "🇲🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "malta",
    "keywords": ["mt", "flag", "nation", "country", "banner"],
    "char": "🇲🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "marshall_islands",
    "keywords": ["marshall", "islands", "flag", "nation", "country", "banner"],
    "char": "🇲🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "martinique",
    "keywords": ["mq", "flag", "nation", "country", "banner"],
    "char": "🇲🇶",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mauritania",
    "keywords": ["mr", "flag", "nation", "country", "banner"],
    "char": "🇲🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mauritius",
    "keywords": ["mu", "flag", "nation", "country", "banner"],
    "char": "🇲🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mayotte",
    "keywords": ["yt", "flag", "nation", "country", "banner"],
    "char": "🇾🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mexico",
    "keywords": ["mx", "flag", "nation", "country", "banner"],
    "char": "🇲🇽",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "micronesia",
    "keywords": ["micronesia,", "federated", "states", "flag", "nation", "country", "banner"],
    "char": "🇫🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "moldova",
    "keywords": ["moldova,", "republic", "flag", "nation", "country", "banner"],
    "char": "🇲🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "monaco",
    "keywords": ["mc", "flag", "nation", "country", "banner"],
    "char": "🇲🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mongolia",
    "keywords": ["mn", "flag", "nation", "country", "banner"],
    "char": "🇲🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "montenegro",
    "keywords": ["me", "flag", "nation", "country", "banner"],
    "char": "🇲🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "montserrat",
    "keywords": ["ms", "flag", "nation", "country", "banner"],
    "char": "🇲🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "morocco",
    "keywords": ["ma", "flag", "nation", "country", "banner"],
    "char": "🇲🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "mozambique",
    "keywords": ["mz", "flag", "nation", "country", "banner"],
    "char": "🇲🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "myanmar",
    "keywords": ["mm", "flag", "nation", "country", "banner"],
    "char": "🇲🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "namibia",
    "keywords": ["na", "flag", "nation", "country", "banner"],
    "char": "🇳🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "nauru",
    "keywords": ["nr", "flag", "nation", "country", "banner"],
    "char": "🇳🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "nepal",
    "keywords": ["np", "flag", "nation", "country", "banner"],
    "char": "🇳🇵",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "netherlands",
    "keywords": ["nl", "flag", "nation", "country", "banner"],
    "char": "🇳🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "new_caledonia",
    "keywords": ["new", "caledonia", "flag", "nation", "country", "banner"],
    "char": "🇳🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "new_zealand",
    "keywords": ["new", "zealand", "flag", "nation", "country", "banner"],
    "char": "🇳🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "nicaragua",
    "keywords": ["ni", "flag", "nation", "country", "banner"],
    "char": "🇳🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "niger",
    "keywords": ["ne", "flag", "nation", "country", "banner"],
    "char": "🇳🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "nigeria",
    "keywords": ["flag", "nation", "country", "banner"],
    "char": "🇳🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "niue",
    "keywords": ["nu", "flag", "nation", "country", "banner"],
    "char": "🇳🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "norfolk_island",
    "keywords": ["norfolk", "island", "flag", "nation", "country", "banner"],
    "char": "🇳🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "northern_mariana_islands",
    "keywords": ["northern", "mariana", "islands", "flag", "nation", "country", "banner"],
    "char": "🇲🇵",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "north_korea",
    "keywords": ["north", "korea", "nation", "flag", "country", "banner"],
    "char": "🇰🇵",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "norway",
    "keywords": ["no", "flag", "nation", "country", "banner"],
    "char": "🇳🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "oman",
    "keywords": ["om_symbol", "flag", "nation", "country", "banner"],
    "char": "🇴🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "pakistan",
    "keywords": ["pk", "flag", "nation", "country", "banner"],
    "char": "🇵🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "palau",
    "keywords": ["pw", "flag", "nation", "country", "banner"],
    "char": "🇵🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "palestinian_territories",
    "keywords": ["palestine", "palestinian", "territories", "flag", "nation", "country", "banner"],
    "char": "🇵🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "panama",
    "keywords": ["pa", "flag", "nation", "country", "banner"],
    "char": "🇵🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "papua_new_guinea",
    "keywords": ["papua", "new", "guinea", "flag", "nation", "country", "banner"],
    "char": "🇵🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "paraguay",
    "keywords": ["py", "flag", "nation", "country", "banner"],
    "char": "🇵🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "peru",
    "keywords": ["pe", "flag", "nation", "country", "banner"],
    "char": "🇵🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "philippines",
    "keywords": ["ph", "flag", "nation", "country", "banner"],
    "char": "🇵🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "pitcairn_islands",
    "keywords": ["pitcairn", "flag", "nation", "country", "banner"],
    "char": "🇵🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "poland",
    "keywords": ["pl", "flag", "nation", "country", "banner"],
    "char": "🇵🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "portugal",
    "keywords": ["pt", "flag", "nation", "country", "banner"],
    "char": "🇵🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "puerto_rico",
    "keywords": ["puerto", "rico", "flag", "nation", "country", "banner"],
    "char": "🇵🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "qatar",
    "keywords": ["qa", "flag", "nation", "country", "banner"],
    "char": "🇶🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "reunion",
    "keywords": ["réunion", "flag", "nation", "country", "banner"],
    "char": "🇷🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "romania",
    "keywords": ["ro", "flag", "nation", "country", "banner"],
    "char": "🇷🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "ru",
    "keywords": ["russian", "federation", "flag", "nation", "country", "banner"],
    "char": "🇷🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "rwanda",
    "keywords": ["rw", "flag", "nation", "country", "banner"],
    "char": "🇷🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "st_barthelemy",
    "keywords": ["saint", "barthélemy", "flag", "nation", "country", "banner"],
    "char": "🇧🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "st_helena",
    "keywords": ["saint", "helena", "ascension", "tristan", "cunha", "flag", "nation", "country", "banner"],
    "char": "🇸🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "st_kitts_nevis",
    "keywords": ["saint", "kitts", "nevis", "flag", "nation", "country", "banner"],
    "char": "🇰🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "st_lucia",
    "keywords": ["saint", "lucia", "flag", "nation", "country", "banner"],
    "char": "🇱🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "st_pierre_miquelon",
    "keywords": ["saint", "pierre", "miquelon", "flag", "nation", "country", "banner"],
    "char": "🇵🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "st_vincent_grenadines",
    "keywords": ["saint", "vincent", "grenadines", "flag", "nation", "country", "banner"],
    "char": "🇻🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "samoa",
    "keywords": ["ws", "flag", "nation", "country", "banner"],
    "char": "🇼🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "san_marino",
    "keywords": ["san", "marino", "flag", "nation", "country", "banner"],
    "char": "🇸🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "sao_tome_principe",
    "keywords": ["sao", "tome", "principe", "flag", "nation", "country", "banner"],
    "char": "🇸🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "saudi_arabia",
    "keywords": ["flag", "nation", "country", "banner"],
    "char": "🇸🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "senegal",
    "keywords": ["sn", "flag", "nation", "country", "banner"],
    "char": "🇸🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "serbia",
    "keywords": ["rs", "flag", "nation", "country", "banner"],
    "char": "🇷🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "seychelles",
    "keywords": ["sc", "flag", "nation", "country", "banner"],
    "char": "🇸🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "sierra_leone",
    "keywords": ["sierra", "leone", "flag", "nation", "country", "banner"],
    "char": "🇸🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "singapore",
    "keywords": ["sg", "flag", "nation", "country", "banner"],
    "char": "🇸🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "sint_maarten",
    "keywords": ["sint", "maarten", "dutch", "flag", "nation", "country", "banner"],
    "char": "🇸🇽",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "slovakia",
    "keywords": ["sk", "flag", "nation", "country", "banner"],
    "char": "🇸🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "slovenia",
    "keywords": ["si", "flag", "nation", "country", "banner"],
    "char": "🇸🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "solomon_islands",
    "keywords": ["solomon", "islands", "flag", "nation", "country", "banner"],
    "char": "🇸🇧",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "somalia",
    "keywords": ["so", "flag", "nation", "country", "banner"],
    "char": "🇸🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "south_africa",
    "keywords": ["south", "africa", "flag", "nation", "country", "banner"],
    "char": "🇿🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "south_georgia_south_sandwich_islands",
    "keywords": ["south", "georgia", "sandwich", "islands", "flag", "nation", "country", "banner"],
    "char": "🇬🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "kr",
    "keywords": ["south", "korea", "nation", "flag", "country", "banner"],
    "char": "🇰🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "south_sudan",
    "keywords": ["south", "sd", "flag", "nation", "country", "banner"],
    "char": "🇸🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "es",
    "keywords": ["spain", "flag", "nation", "country", "banner"],
    "char": "🇪🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "sri_lanka",
    "keywords": ["sri", "lanka", "flag", "nation", "country", "banner"],
    "char": "🇱🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "sudan",
    "keywords": ["sd", "flag", "nation", "country", "banner"],
    "char": "🇸🇩",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "suriname",
    "keywords": ["sr", "flag", "nation", "country", "banner"],
    "char": "🇸🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "swaziland",
    "keywords": ["sz", "flag", "nation", "country", "banner"],
    "char": "🇸🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "sweden",
    "keywords": ["se", "flag", "nation", "country", "banner"],
    "char": "🇸🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "switzerland",
    "keywords": ["ch", "flag", "nation", "country", "banner"],
    "char": "🇨🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "syria",
    "keywords": ["syrian", "arab", "republic", "flag", "nation", "country", "banner"],
    "char": "🇸🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "taiwan",
    "keywords": ["tw", "flag", "nation", "country", "banner"],
    "char": "🇹🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tajikistan",
    "keywords": ["tj", "flag", "nation", "country", "banner"],
    "char": "🇹🇯",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tanzania",
    "keywords": ["tanzania,", "united", "republic", "flag", "nation", "country", "banner"],
    "char": "🇹🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "thailand",
    "keywords": ["th", "flag", "nation", "country", "banner"],
    "char": "🇹🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "timor_leste",
    "keywords": ["timor", "leste", "flag", "nation", "country", "banner"],
    "char": "🇹🇱",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "togo",
    "keywords": ["tg", "flag", "nation", "country", "banner"],
    "char": "🇹🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tokelau",
    "keywords": ["tk", "flag", "nation", "country", "banner"],
    "char": "🇹🇰",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tonga",
    "keywords": ["to", "flag", "nation", "country", "banner"],
    "char": "🇹🇴",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "trinidad_tobago",
    "keywords": ["trinidad", "tobago", "flag", "nation", "country", "banner"],
    "char": "🇹🇹",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tunisia",
    "keywords": ["tn", "flag", "nation", "country", "banner"],
    "char": "🇹🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tr",
    "keywords": ["turkey", "flag", "nation", "country", "banner"],
    "char": "🇹🇷",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "turkmenistan",
    "keywords": ["flag", "nation", "country", "banner"],
    "char": "🇹🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "turks_caicos_islands",
    "keywords": ["turks", "caicos", "islands", "flag", "nation", "country", "banner"],
    "char": "🇹🇨",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "tuvalu",
    "keywords": ["flag", "nation", "country", "banner"],
    "char": "🇹🇻",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "uganda",
    "keywords": ["ug", "flag", "nation", "country", "banner"],
    "char": "🇺🇬",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "ukraine",
    "keywords": ["ua", "flag", "nation", "country", "banner"],
    "char": "🇺🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "united_arab_emirates",
    "keywords": ["united", "arab", "emirates", "flag", "nation", "country", "banner"],
    "char": "🇦🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "uk",
    "keywords": ["united", "kingdom", "great", "britain", "northern", "ireland", "flag", "nation", "country", "banner", "british", "UK", "english", "england", "union jack"],
    "char": "🇬🇧",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "us",
    "keywords": ["united", "states", "america", "flag", "nation", "country", "banner"],
    "char": "🇺🇸",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "us_virgin_islands",
    "keywords": ["virgin", "islands", "us", "flag", "nation", "country", "banner"],
    "char": "🇻🇮",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "uruguay",
    "keywords": ["uy", "flag", "nation", "country", "banner"],
    "char": "🇺🇾",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "uzbekistan",
    "keywords": ["uz", "flag", "nation", "country", "banner"],
    "char": "🇺🇿",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "vanuatu",
    "keywords": ["vu", "flag", "nation", "country", "banner"],
    "char": "🇻🇺",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "vatican_city",
    "keywords": ["vatican", "city", "flag", "nation", "country", "banner"],
    "char": "🇻🇦",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "venezuela",
    "keywords": ["ve", "bolivarian", "republic", "flag", "nation", "country", "banner"],
    "char": "🇻🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "vietnam",
    "keywords": ["viet", "nam", "flag", "nation", "country", "banner"],
    "char": "🇻🇳",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "wallis_futuna",
    "keywords": ["wallis", "futuna", "flag", "nation", "country", "banner"],
    "char": "🇼🇫",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "western_sahara",
    "keywords": ["western", "sahara", "flag", "nation", "country", "banner"],
    "char": "🇪🇭",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "yemen",
    "keywords": ["ye", "flag", "nation", "country", "banner"],
    "char": "🇾🇪",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "zambia",
    "keywords": ["zm", "flag", "nation", "country", "banner"],
    "char": "🇿🇲",
    "fitzpatrick_scale": false,
    "category": "flags"
  },
  {
    "name": "zimbabwe",
    "keywords": ["zw", "flag", "nation", "country", "banner"],
    "char": "🇿🇼",
    "fitzpatrick_scale": false,
    "category": "flags"
  }
];

const styles = `
  #emojiPopup {
    background: white;
    border-radius: 150px;
    box-shadow:
      0 3px 6px rgba(0,0,0,0.16),
      0 3px 6px rgba(0,0,0,0.23);
    height: 0px;
    margin-left: 150px;
    margin-top: 150px;
    overflow: hidden;
    position: absolute;
    transition: all ease 0.5s;
    width: 0px;
    will-change: opacity, margin, height, width;
    z-index: 2;
  }

  #emojiPopup.open {
    border-radius: 3px;
    display: block;
    height: 16em;
    margin-left: 0px;
    margin-top: 0px;
    width: 16em;
  }

  #emojiPopup.open .container, #emojiPopup.open fun-tabs {
    opacity: 1;
    transition-delay: 0.5s;
  }

  .content {
    height: 14em;
    width: 16em;
    overflow:hidden;
    text-align: center;
  }

  .container {
    display: none;
    height: calc(100% - 1.6em);
    opacity: 0;
    overflow-y: auto;
    padding: 0.8em 1em 2em 1em;
    text-align: left;
    transition: ease opacity 0.3s;
  }

  .container.selected  {
    display: block;
  }

  .emoji,
  fun-tab {
    background: white;
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    height: 1em;
    padding: 0.2em;
    line-height: 1;
    text-align: center;
    transition: ease background 0.2s;
    user-select: none;
    width: 1em;
  }

  fun-tabs {
    border-bottom: solid 1px #eee;
    height: 1.5em;
    margin: 0px auto;
    opacity: 0;
    transition: ease opacity 0.2s;
    width: 16em;
  }

  fun-tab {
    padding: 0.45em 0.5em 0.5em 0.5em;
  }

  fun-tab:hover,
  .emoji:hover {
    background: #eee;
  }

  button {
    background: #eee;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 1rem;
    height: 32px;
    line-height: 1;
    margin-top: 0;
    padding: 4px 0;
    transition: background ease 0.2s;
    user-select: none;
    vertical-align: middle;
    width: 1.3rem;
  }


  button:hover, button:focus {
    background: #ddd;
  }
`;

/*! @source Based off: https://github.com/Kiricon/emoji-selector */

const template = document.createElement("template");
const contentContainers = {};
const createdTabs = {};
let tabTemplate = ``;

emojis.forEach(emoji => {
  const { category, char } = emoji;

  if(createdTabs[category] === undefined) {
    createdTabs[category] = true;
    contentContainers[category] = "<div class='container'>";
    tabTemplate += `<fun-tab>${char}</fun-tab>`;
  }

  contentContainers[category] += `<div class="emoji">${char}</div>`;
});

let contentTemplate = ``;
for(let categoryName in contentContainers) {
  contentTemplate += `${contentContainers[categoryName]}</div>`;
}

template.innerHTML = `
  <style>${styles}</style>
  <button>😀</button>
  <div id="emojiPopup">
    <fun-tabs selected="0">${tabTemplate}</fun-tabs>
    <div class="content">${contentTemplate}</div>
  </div>
`;

class EmojiSelector extends HTMLElement {
  constructor() {
    super();

    // Create shadow root for any children context
    this.attachShadow({ mode: "open" });

    if (!this.shadowRoot) return;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.openButton = this.shadowRoot.querySelector("button");
    this.popupWindow = this.shadowRoot.querySelector("#emojiPopup");
    this.svg = this.shadowRoot.querySelector("svg");
    this.tabContainer = this.shadowRoot.querySelector("fun-tabs");

    this.containers = this.shadowRoot.querySelectorAll(".container");
    this.emojis = this.shadowRoot.querySelectorAll(".emoji");
    this.tabs = this.shadowRoot.querySelectorAll("fun-tab");

    if (
      this.attributes.defaultValue &&
      this.attributes.defaultValue.value
  ) {
      this.openButton.innerHTML = this.attributes.defaultValue.value;
      this.attributes.value = { value: this.attributes.defaultValue.value };
    }
  }

  // Called after your element is attached to the DOM
  connectedCallback() {
    this.containers[0].className = "container selected";

    for (let index = 0; index < this.tabs.length; index++) {
      const currentContainer = this.containers[index];
      const currentTab = this.tabs[index];

      currentTab.addEventListener("click", this.tabSelected.bind(this, currentContainer));
      currentContainer.addEventListener("click", this.emojiSelected.bind(this));
    }

    window.addEventListener("click", e => {
      const isNotEmojiSelector = e && e.target !== this;
      if (isNotEmojiSelector) this.hide();
    });
    this.openButton.addEventListener("click", (...args) => {
      const isOpen = this.popupWindow.className.length > 0;
      isOpen ? this.hide() : this.show.apply(this, args);
    }, true);
    this.popupWindow.addEventListener("click", e => e.stopPropagation());


    const size = this.getAttribute("size");
    if (size != null) {
      this.openButton.style.height = size;
      this.openButton.style.width = size;

      const sizeInt = size.replace("px", "");
      this.svg.style.height = sizeInt;
      this.svg.style.height = sizeInt;
    }
  }

  emojiSelected(event) {
    if (event.target.innerHTML.length > 20) return;
    this.openButton.innerHTML = event.target.innerHTML;
    this.attributes.value.value = event.target.innerHTML;
    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: event.target.innerHTML
    }));
    this.hide();
  }

  tabSelected(container, event) {
    this.containers.forEach(container => container.className = "container");
    container.className += " selected";
  }

  show(e) {
    const left = `${e.clientX - 150}px`;
    const top = `${e.clientY - 150}px`;
    Object.assign(this.popupWindow, {
      className: "open",
      style: { left, top },
    });
  }

  hide(e) {
    this.popupWindow.className = "";
  }
}

customElements.define("emoji-selector", EmojiSelector);

function createEmojiSelector(filter, emoji) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <input class="site-selector" type="text" value="${filter}" />
    <emoji-selector class="emoji-selector" defaultValue="${emoji}"></emoji-selector>
    <button class="remove-button">X</button>
  `;
  return wrapper;
}

/**
 * Determines whether a string is in the shape of a regex
 * @param {string} filter
 * @return {boolean}
 */

function isRegexString(filter) {
  return filter.length > 2
    && filter.startsWith("/")
    && filter.endsWith("/");
}

// Defaults for when we create a new emoji selector
const DEFAULT_EMOJI = "😀";
const DEFAULT_FILTER = "";


// UI Elements on options.html
const el = {
  emojiSelectors: [],
  navLinks: Array.from(document.getElementsByClassName("navlink")),
  pages: Array.from(document.getElementsByClassName("page")),
  overrides: document.getElementsByClassName("override-inputs")[0],
  settings: document.getElementsByClassName("settings")[0],
  status: document.getElementById("status"),
};


/**
 * Add an emoji override UI element from an emoji/filter pair. If someone starts
 * to type a filter, we should create another override.
 * @param {object} override
 * @param {Array<object>} overrides
 */
function appendOverride(override, overrides) {
  const { emoji, filter } = override;
  const overrideEl = createEmojiSelector(filter, emoji);
  const [ urlFilterEl, emojiEl, deleteEl ] = overrideEl.children;

  el.emojiSelectors.push(emojiEl);
  el.overrides.appendChild(overrideEl);
  urlFilterEl.style.color = isRegexString(urlFilterEl.value) ? "green" : "black";

  deleteEl.addEventListener("click", () => {
    const index = overrides.indexOf(override);
    overrideEl.remove();
    el.emojiSelectors.splice(index, 1);
    overrides.splice(index, 1);
  });

  urlFilterEl.addEventListener("input", lodash_debounce(updated.bind(this), 100));
  emojiEl.addEventListener("change", lodash_debounce(updated.bind(this), 100));

  function updated() {
    const index = overrides.indexOf(override);
    const shouldAdd = index === (overrides.length - 1);
    const emoji = emojiEl.attributes.value.value;
    const filter = urlFilterEl.value;

    if (shouldAdd) {
      const emptyOverride = {
        emoji: DEFAULT_EMOJI,
        filter: DEFAULT_FILTER,
      };

      overrides.push(emptyOverride);
      el.emojiSelectors.push(appendOverride(emptyOverride, overrides));
    }

    if (filter !== overrides[index].filter) {
      overrides[index].filter = filter;
      urlFilterEl.style.color = isRegexString(filter) ? "green" : "black";
    }

    if (emoji !== overrides[index].emoji) {
      overrides[index].emoji = emoji;
    }
  }

  return emojiEl;
}


/**
 * Switch between the different pages in the UI, determined by their id.
 * Also, highlight the active page in the navbar
 * @param {string} pageName
 */
function changeRoute(pageName) {
  el.pages.forEach(page => {
    const matches = page.className.indexOf(pageName) !== -1;
    page.style.display = matches ? "block" : "none";
  });

  el.navLinks.forEach(navLink => {
    const matches = navLink.textContent.toLowerCase().indexOf(pageName) !== -1;
    navLink.className = matches ? "navlink active" : "navlink";
  });
}


/**
 * Restore options page UI state from the preferences stored in chrome.storage
 */
async function restoreOptions() {
  const options = await getOptions();
  options.overrides.push({
    emoji: DEFAULT_EMOJI,
    filter: DEFAULT_FILTER,
  });

  if (options.flagReplaced) {
    document.getElementById("flag").setAttribute("checked", options.flagReplaced);
  }

  return options;
}


/**
 * Save options to Chrome storage, and inform the user that we did.
 * @param {object} options
 */
async function saveOptions(options) {
  await setOptions(options);

  // Update status to let user know options were saved.
  el.status.textContent = "Successfully saved.";
  setTimeout(() => el.status.textContent = "", 1000);

  chrome.runtime.sendMessage("updated:options");
}

const INITIAL_ROUTE = "overrides";
const CURRENT_ROUTE = window.location.hash.substr(1);

const el$1 = {
  flagSelector: document.getElementById("flag"),
  navLinks: Array.from(document.getElementsByClassName("navlink")),
  saveButtons: Array.from(document.getElementsByClassName("save")),
};

changeRoute(CURRENT_ROUTE || INITIAL_ROUTE);

document.addEventListener("DOMContentLoaded", async function () {
  const options = await restoreOptions();

  // Append override UI elements
  options.overrides.forEach(override => appendOverride(override, options.overrides));

  // Navlinks change routes
  el$1.navLinks.forEach(navLink => {
    const pageName = navLink.textContent.toLowerCase();
    navLink.addEventListener("click", () => changeRoute(pageName));
  });

  // Save buttons save settings
  el$1.saveButtons.forEach(save => save.addEventListener("click", () => {
    const flagReplaced = el$1.flagSelector.checked;
    const overrides = options.overrides.slice(0, options.overrides.length - 1);
    saveOptions({ overrides, flagReplaced });
  }));
});

}());
