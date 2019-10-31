/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */!function(a){"use strict";function b(a,b,c,e){// If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
var f=b&&b.prototype instanceof d?b:d,g=Object.create(f.prototype),h=new m(e||[]);return g._invoke=i(a,c,h),g}// Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.
function c(a,b,c){try{return{type:"normal",arg:a.call(b,c)}}catch(a){return{type:"throw",arg:a}}}// Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.
function d(){}function e(){}function f(){}// This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.
// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function g(a){["next","throw","return"].forEach(function(b){a[b]=function(a){return this._invoke(b,a)}})}function h(a){function b(d,e,f,g){var h=c(a[d],a,e);if("throw"===h.type)g(h.arg);else{var i=h.arg,j=i.value;return j&&"object"===typeof j&&q.call(j,"__await")?Promise.resolve(j.__await).then(function(a){b("next",a,f,g)},function(a){b("throw",a,f,g)}):Promise.resolve(j).then(function(a){// When a yielded Promise is resolved, its final value becomes
// the .value of the Promise<{value,done}> result for the
// current iteration. If the Promise is rejected, however, the
// result for this iteration will be rejected with the same
// reason. Note that rejections of yielded Promises are not
// thrown back into the generator function, as is the case
// when an awaited Promise is rejected. This difference in
// behavior between yield and await is important, because it
// allows the consumer to decide what to do with the yielded
// rejection (swallow it and continue, manually .throw it back
// into the generator, abandon iteration, whatever). With
// await, by contrast, there is no opportunity to examine the
// rejection reason outside the generator function, so the
// only option is to throw it from the await expression, and
// let the generator function handle the exception.
i.value=a,f(i)},g)}}function d(a,c){function d(){return new Promise(function(d,e){b(a,c,d,e)})}return e=// If enqueue has been called before, then we want to wait until
// all previous Promises have been resolved before calling invoke,
// so that results are always delivered in the correct order. If
// enqueue has not been called before, then it is important to
// call invoke immediately, without waiting on a callback to fire,
// so that the async generator function has the opportunity to do
// any necessary setup in a predictable way. This predictability
// is why the Promise constructor synchronously invokes its
// executor callback, and why async functions synchronously
// execute code before the first await. Since we implement simple
// async functions in terms of async generators, it is especially
// important to get this right, even though it requires care.
e?e.then(d,// Avoid propagating failures to Promises returned by later
// invocations of the iterator.
d):d()}// Define the unified helper method that is used to implement .next,
// .throw, and .return (see defineIteratorMethods).
var e;this._invoke=d}function i(a,b,d){var e="suspendedStart";return function(f,g){if(e==="executing")throw new Error("Generator is already running");if("completed"===e){if("throw"===f)throw g;// Be forgiving, per 25.3.3.3.3 of the spec:
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
return o()}for(d.method=f,d.arg=g;;){var h=d.delegate;if(h){var i=j(h,d);if(i){if(i===x)continue;return i}}if("next"===d.method)// Setting context._sent for legacy support of Babel's
// function.sent implementation.
d.sent=d._sent=d.arg;else if("throw"===d.method){if("suspendedStart"===e)throw e="completed",d.arg;d.dispatchException(d.arg)}else"return"===d.method&&d.abrupt("return",d.arg);e="executing";var k=c(a,b,d);if("normal"===k.type){if(e=d.done?"completed":"suspendedYield",k.arg===x)continue;return{value:k.arg,done:d.done}}"throw"===k.type&&(// Dispatch the exception by looping back around to the
// context.dispatchException(context.arg) call above.
e="completed",d.method="throw",d.arg=k.arg)}}}// Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.
function j(a,b){var d=a.iterator[b.method];if(void 0===d){if(b.delegate=null,"throw"===b.method){if(a.iterator.return&&(b.method="return",b.arg=void 0,j(a,b),"throw"===b.method))// If maybeInvokeDelegate(context) changed context.method from
// "return" to "throw", let that override the TypeError below.
return x;b.method="throw",b.arg=new TypeError("The iterator does not provide a 'throw' method")}return x}var e=c(d,a.iterator,b.arg);if("throw"===e.type)return b.method="throw",b.arg=e.arg,b.delegate=null,x;var f=e.arg;if(!f)return b.method="throw",b.arg=new TypeError("iterator result is not an object"),b.delegate=null,x;if(f.done)b[a.resultName]=f.value,b.next=a.nextLoc,"return"!==b.method&&(b.method="next",b.arg=void 0);else// Re-yield the result returned by the delegate method.
return f;// The delegate iterator is finished, so forget it and continue with
// the outer generator.
return b.delegate=null,x}// Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.
function k(a){var b={tryLoc:a[0]};1 in a&&(b.catchLoc=a[1]),2 in a&&(b.finallyLoc=a[2],b.afterLoc=a[3]),this.tryEntries.push(b)}function l(a){var b=a.completion||{};b.type="normal",delete b.arg,a.completion=b}function m(a){// The root entry object (effectively a try statement without a catch
// or a finally block) gives us a place to store values thrown from
// locations where there is no enclosing try statement.
this.tryEntries=[{tryLoc:"root"}],a.forEach(k,this),this.reset(!0)}function n(a){if(a){var b=a[s];if(b)return b.call(a);if("function"===typeof a.next)return a;if(!isNaN(a.length)){var c=-1,d=function b(){for(;++c<a.length;)if(q.call(a,c))return b.value=a[c],b.done=!1,b;return b.value=void 0,b.done=!0,b};return d.next=d}}// Return an iterator with no values.
return{next:o}}function o(){return{value:void 0,done:!0}}var p=Object.prototype,q=p.hasOwnProperty,r="function"===typeof Symbol?Symbol:{},s=r.iterator||"@@iterator",t=r.asyncIterator||"@@asyncIterator",u=r.toStringTag||"@@toStringTag",v="object"===typeof module,w=a.regeneratorRuntime;if(w)// Don't bother evaluating the rest of this file if the runtime was
// already defined globally.
return void(v&&(module.exports=w));// Define the runtime globally (as expected by generated code) as either
// module.exports (if we're in a module) or a new, empty object.
w=a.regeneratorRuntime=v?module.exports:{},w.wrap=b;var x={},y={};y[s]=function(){return this};var z=Object.getPrototypeOf,A=z&&z(z(n([])));A&&A!==p&&q.call(A,s)&&(y=A);var B=f.prototype=d.prototype=Object.create(y);// Within the body of any async function, `await x` is transformed to
// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
// `hasOwn.call(value, "__await")` to determine if the yielded value is
// meant to be awaited.
// Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.
// A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.
e.prototype=B.constructor=f,f.constructor=e,f[u]=e.displayName="GeneratorFunction",w.isGeneratorFunction=function(a){var b="function"===typeof a&&a.constructor;return!!b&&(b===e||// For the native GeneratorFunction constructor, the best we can
// do is to check its .name property.
"GeneratorFunction"===(b.displayName||b.name))},w.mark=function(a){return Object.setPrototypeOf?Object.setPrototypeOf(a,f):(a.__proto__=f,!(u in a)&&(a[u]="GeneratorFunction")),a.prototype=Object.create(B),a},w.awrap=function(a){return{__await:a}},g(h.prototype),h.prototype[t]=function(){return this},w.AsyncIterator=h,w.async=function(a,c,d,e){var f=new h(b(a,c,d,e));return w.isGeneratorFunction(c)?f// If outerFn is a generator, return the full iterator.
:f.next().then(function(a){return a.done?a.value:f.next()})},g(B),B[u]="Generator",B[s]=function(){return this},B.toString=function(){return"[object Generator]"},w.keys=function(a){var b=[];for(var c in a)b.push(c);// Rather than returning an object with a next method, we keep
// things simple and return the next function itself.
return b.reverse(),function c(){for(;b.length;){var d=b.pop();if(d in a)return c.value=d,c.done=!1,c}// To avoid creating an additional object, we just hang the .value
// and .done properties off the next function object itself. This
// also ensures that the minifier will not anonymize the function.
return c.done=!0,c}},w.values=n,m.prototype={constructor:m,reset:function(a){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(l),!a)for(var b in this)// Not sure about the optimal order of these conditions:
"t"===b.charAt(0)&&q.call(this,b)&&!isNaN(+b.slice(1))&&(this[b]=void 0)},stop:function(){this.done=!0;var a=this.tryEntries[0],b=a.completion;if("throw"===b.type)throw b.arg;return this.rval},dispatchException:function(a){function b(b,d){return f.type="throw",f.arg=a,c.next=b,d&&(c.method="next",c.arg=void 0),!!d}if(this.done)throw a;for(var c=this,d=this.tryEntries.length-1;0<=d;--d){var e=this.tryEntries[d],f=e.completion;if("root"===e.tryLoc)// Exception thrown outside of any try block that could handle
// it, so set the completion value of the entire function to
// throw the exception.
return b("end");if(e.tryLoc<=this.prev){var g=q.call(e,"catchLoc"),h=q.call(e,"finallyLoc");if(g&&h){if(this.prev<e.catchLoc)return b(e.catchLoc,!0);if(this.prev<e.finallyLoc)return b(e.finallyLoc)}else if(g){if(this.prev<e.catchLoc)return b(e.catchLoc,!0);}else if(!h)throw new Error("try statement without catch or finally");else if(this.prev<e.finallyLoc)return b(e.finallyLoc)}}},abrupt:function(a,b){for(var c,d=this.tryEntries.length-1;0<=d;--d)if(c=this.tryEntries[d],c.tryLoc<=this.prev&&q.call(c,"finallyLoc")&&this.prev<c.finallyLoc){var e=c;break}e&&("break"===a||"continue"===a)&&e.tryLoc<=b&&b<=e.finallyLoc&&(e=null);var f=e?e.completion:{};return f.type=a,f.arg=b,e?(this.method="next",this.next=e.finallyLoc,x):this.complete(f)},complete:function(a,b){if("throw"===a.type)throw a.arg;return"break"===a.type||"continue"===a.type?this.next=a.arg:"return"===a.type?(this.rval=this.arg=a.arg,this.method="return",this.next="end"):"normal"===a.type&&b&&(this.next=b),x},finish:function(a){for(var b,c=this.tryEntries.length-1;0<=c;--c)if(b=this.tryEntries[c],b.finallyLoc===a)return this.complete(b.completion,b.afterLoc),l(b),x},catch:function(a){for(var b,c=this.tryEntries.length-1;0<=c;--c)if(b=this.tryEntries[c],b.tryLoc===a){var d=b.completion;if("throw"===d.type){var e=d.arg;l(b)}return e}// The context.catch method must only be called with a location
// argument that corresponds to a known catch block.
throw new Error("illegal catch attempt")},delegateYield:function(a,b,c){return this.delegate={iterator:n(a),resultName:b,nextLoc:c},"next"===this.method&&(this.arg=void 0),x}}}(// In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
function(){return this}()||Function("return this")());function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.DocumentationDependencies = {});
})(this, function (exports) {
  'use strict';
  /* **********************************************
       Begin prism-core.js
  ********************************************** */

  var _self = typeof window !== 'undefined' ? window // if in browser
  : typeof WorkerGlobalScope !== 'undefined' && _instanceof(self, WorkerGlobalScope) ? self // if in worker
  : {} // if in node js
  ;
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   * MIT license http://www.opensource.org/licenses/mit-license.php/
   * @author Lea Verou http://lea.verou.me
   */


  var Prism$1 = function (_self) {
    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;
    var _ = {
      manual: _self.Prism && _self.Prism.manual,
      disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
      util: {
        encode: function encode(tokens) {
          if (_instanceof(tokens, Token)) {
            return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
          } else if (Array.isArray(tokens)) {
            return tokens.map(_.util.encode);
          } else {
            return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
          }
        },
        type: function type(o) {
          return Object.prototype.toString.call(o).slice(8, -1);
        },
        objId: function objId(obj) {
          if (!obj['__id']) {
            Object.defineProperty(obj, '__id', {
              value: ++uniqueId
            });
          }

          return obj['__id'];
        },
        // Deep clone a language definition (e.g. to extend it)
        clone: function deepClone(o, visited) {
          var clone,
              id,
              type = _.util.type(o);

          visited = visited || {};

          switch (type) {
            case 'Object':
              id = _.util.objId(o);

              if (visited[id]) {
                return visited[id];
              }

              clone = {};
              visited[id] = clone;

              for (var key in o) {
                if (o.hasOwnProperty(key)) {
                  clone[key] = deepClone(o[key], visited);
                }
              }

              return clone;

            case 'Array':
              id = _.util.objId(o);

              if (visited[id]) {
                return visited[id];
              }

              clone = [];
              visited[id] = clone;
              o.forEach(function (v, i) {
                clone[i] = deepClone(v, visited);
              });
              return clone;

            default:
              return o;
          }
        }
      },
      languages: {
        extend: function extend(id, redef) {
          var lang = _.util.clone(_.languages[id]);

          for (var key in redef) {
            lang[key] = redef[key];
          }

          return lang;
        },

        /**
         * Insert a token before another token in a language literal
         * As this needs to recreate the object (we cannot actually insert before keys in object literals),
         * we cannot just provide an object, we need an object and a key.
         * @param inside The key (or language id) of the parent
         * @param before The key to insert before.
         * @param insert Object with the key/value pairs to insert
         * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
         */
        insertBefore: function insertBefore(inside, before, insert, root) {
          root = root || _.languages;
          var grammar = root[inside];
          var ret = {};

          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              } // Do not insert token which also occur in insert. See #1525


              if (!insert.hasOwnProperty(token)) {
                ret[token] = grammar[token];
              }
            }
          }

          var old = root[inside];
          root[inside] = ret; // Update references in other language definitions

          _.languages.DFS(_.languages, function (key, value) {
            if (value === old && key != inside) {
              this[key] = ret;
            }
          });

          return ret;
        },
        // Traverse a language definition with Depth First Search
        DFS: function DFS(o, callback, type, visited) {
          visited = visited || {};
          var objId = _.util.objId;

          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);

              var property = o[i],
                  propertyType = _.util.type(property);

              if (propertyType === 'Object' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, null, visited);
              } else if (propertyType === 'Array' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, i, visited);
              }
            }
          }
        }
      },
      plugins: {},
      highlightAll: function highlightAll(async, callback) {
        _.highlightAllUnder(document, async, callback);
      },
      highlightAllUnder: function highlightAllUnder(container, async, callback) {
        var env = {
          callback: callback,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };

        _.hooks.run('before-highlightall', env);

        var elements = container.querySelectorAll(env.selector);

        for (var i = 0, element; element = elements[i++];) {
          _.highlightElement(element, async === true, env.callback);
        }
      },
      highlightElement: function highlightElement(element, async, callback) {
        // Find language
        var language = 'none',
            grammar,
            parent = element;

        while (parent && !lang.test(parent.className)) {
          parent = parent.parentNode;
        }

        if (parent) {
          language = (parent.className.match(lang) || [, 'none'])[1].toLowerCase();
          grammar = _.languages[language];
        } // Set language on the element, if not present


        element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

        if (element.parentNode) {
          // Set language on the parent, for styling
          parent = element.parentNode;

          if (/pre/i.test(parent.nodeName)) {
            parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
          }
        }

        var code = element.textContent;
        var env = {
          element: element,
          language: language,
          grammar: grammar,
          code: code
        };

        var insertHighlightedCode = function insertHighlightedCode(highlightedCode) {
          env.highlightedCode = highlightedCode;

          _.hooks.run('before-insert', env);

          env.element.innerHTML = env.highlightedCode;

          _.hooks.run('after-highlight', env);

          _.hooks.run('complete', env);

          callback && callback.call(env.element);
        };

        _.hooks.run('before-sanity-check', env);

        if (!env.code) {
          _.hooks.run('complete', env);

          return;
        }

        _.hooks.run('before-highlight', env);

        if (!env.grammar) {
          insertHighlightedCode(_.util.encode(env.code));
          return;
        }

        if (async && _self.Worker) {
          var worker = new Worker(_.filename);

          worker.onmessage = function (evt) {
            insertHighlightedCode(evt.data);
          };

          worker.postMessage(JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true
          }));
        } else {
          insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
        }
      },
      highlight: function highlight(text, grammar, language) {
        var env = {
          code: text,
          grammar: grammar,
          language: language
        };

        _.hooks.run('before-tokenize', env);

        env.tokens = _.tokenize(env.code, env.grammar);

        _.hooks.run('after-tokenize', env);

        return Token.stringify(_.util.encode(env.tokens), env.language);
      },
      matchGrammar: function matchGrammar(text, strarr, grammar, index, startPos, oneshot, target) {
        for (var token in grammar) {
          if (!grammar.hasOwnProperty(token) || !grammar[token]) {
            continue;
          }

          if (token == target) {
            return;
          }

          var patterns = grammar[token];
          patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];

          for (var j = 0; j < patterns.length; ++j) {
            var pattern = patterns[j],
                inside = pattern.inside,
                lookbehind = !!pattern.lookbehind,
                greedy = !!pattern.greedy,
                lookbehindLength = 0,
                alias = pattern.alias;

            if (greedy && !pattern.pattern.global) {
              // Without the global flag, lastIndex won't work
              var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
              pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
            }

            pattern = pattern.pattern || pattern; // Don’t cache length as it changes during the loop

            for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
              var str = strarr[i];

              if (strarr.length > text.length) {
                // Something went terribly wrong, ABORT, ABORT!
                return;
              }

              if (_instanceof(str, Token)) {
                continue;
              }

              if (greedy && i != strarr.length - 1) {
                pattern.lastIndex = pos;
                var match = pattern.exec(text);

                if (!match) {
                  break;
                }

                var from = match.index + (lookbehind ? match[1].length : 0),
                    to = match.index + match[0].length,
                    k = i,
                    p = pos;

                for (var len = strarr.length; k < len && (p < to || !strarr[k].type && !strarr[k - 1].greedy); ++k) {
                  p += strarr[k].length; // Move the index i to the element in strarr that is closest to from

                  if (from >= p) {
                    ++i;
                    pos = p;
                  }
                } // If strarr[i] is a Token, then the match starts inside another Token, which is invalid


                if (_instanceof(strarr[i], Token)) {
                  continue;
                } // Number of tokens to delete and replace with the new match


                delNum = k - i;
                str = text.slice(pos, p);
                match.index -= pos;
              } else {
                pattern.lastIndex = 0;
                var match = pattern.exec(str),
                    delNum = 1;
              }

              if (!match) {
                if (oneshot) {
                  break;
                }

                continue;
              }

              if (lookbehind) {
                lookbehindLength = match[1] ? match[1].length : 0;
              }

              var from = match.index + lookbehindLength,
                  match = match[0].slice(lookbehindLength),
                  to = from + match.length,
                  before = str.slice(0, from),
                  after = str.slice(to);
              var args = [i, delNum];

              if (before) {
                ++i;
                pos += before.length;
                args.push(before);
              }

              var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy);
              args.push(wrapped);

              if (after) {
                args.push(after);
              }

              Array.prototype.splice.apply(strarr, args);
              if (delNum != 1) _.matchGrammar(text, strarr, grammar, i, pos, true, token);
              if (oneshot) break;
            }
          }
        }
      },
      tokenize: function tokenize(text, grammar) {
        var strarr = [text];
        var rest = grammar.rest;

        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }

          delete grammar.rest;
        }

        _.matchGrammar(text, strarr, grammar, 0, 0, false);

        return strarr;
      },
      hooks: {
        all: {},
        add: function add(name, callback) {
          var hooks = _.hooks.all;
          hooks[name] = hooks[name] || [];
          hooks[name].push(callback);
        },
        run: function run(name, env) {
          var callbacks = _.hooks.all[name];

          if (!callbacks || !callbacks.length) {
            return;
          }

          for (var i = 0, callback; callback = callbacks[i++];) {
            callback(env);
          }
        }
      },
      Token: Token
    };
    _self.Prism = _;

    function Token(type, content, alias, matchedStr, greedy) {
      this.type = type;
      this.content = content;
      this.alias = alias; // Copy of the full string this token was created from

      this.length = (matchedStr || "").length | 0;
      this.greedy = !!greedy;
    }

    Token.stringify = function (o, language) {
      if (typeof o == 'string') {
        return o;
      }

      if (Array.isArray(o)) {
        return o.map(function (element) {
          return Token.stringify(element, language);
        }).join('');
      }

      var env = {
        type: o.type,
        content: Token.stringify(o.content, language),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language
      };

      if (o.alias) {
        var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
        Array.prototype.push.apply(env.classes, aliases);
      }

      _.hooks.run('wrap', env);

      var attributes = Object.keys(env.attributes).map(function (name) {
        return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
      }).join(' ');
      return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
    };

    if (!_self.document) {
      if (!_self.addEventListener) {
        // in Node.js
        return _;
      }

      if (!_.disableWorkerMessageHandler) {
        // In worker
        _self.addEventListener('message', function (evt) {
          var message = JSON.parse(evt.data),
              lang = message.language,
              code = message.code,
              immediateClose = message.immediateClose;

          _self.postMessage(_.highlight(code, _.languages[lang], lang));

          if (immediateClose) {
            _self.close();
          }
        }, false);
      }

      return _;
    } //Get current script and highlight


    var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

    if (script) {
      _.filename = script.src;

      if (!_.manual && !script.hasAttribute('data-manual')) {
        if (document.readyState !== "loading") {
          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(_.highlightAll);
          } else {
            window.setTimeout(_.highlightAll, 16);
          }
        } else {
          document.addEventListener('DOMContentLoaded', _.highlightAll);
        }
      }
    }

    return _;
  }(_self);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prism$1;
  } // hack for components to work correctly in node.js


  if (typeof global !== 'undefined') {
    global.Prism = Prism$1;
  }
  /* **********************************************
       Begin prism-markup.js
  ********************************************** */


  Prism$1.languages.markup = {
    'comment': /<!--[\s\S]*?-->/,
    'prolog': /<\?[\s\S]+?\?>/,
    'doctype': /<!DOCTYPE[\s\S]+?>/i,
    'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
    'tag': {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
      greedy: true,
      inside: {
        'tag': {
          pattern: /^<\/?[^\s>\/]+/i,
          inside: {
            'punctuation': /^<\/?/,
            'namespace': /^[^\s>\/:]+:/
          }
        },
        'attr-value': {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
          inside: {
            'punctuation': [/^=/, {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }]
          }
        },
        'punctuation': /\/?>/,
        'attr-name': {
          pattern: /[^\s>\/]+/,
          inside: {
            'namespace': /^[^\s>\/:]+:/
          }
        }
      }
    },
    'entity': /&#?[\da-z]{1,8};/i
  };
  Prism$1.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism$1.languages.markup['entity']; // Plugin to make entity title show the real entity, idea by Roman Komarov

  Prism$1.hooks.add('wrap', function (env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
  });
  Object.defineProperty(Prism$1.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {};
      includedCdataInside['language-' + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism$1.languages[lang]
      };
      includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
      var inside = {
        'included-cdata': {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      };
      inside['language-' + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism$1.languages[lang]
      };
      var def = {};
      def[tagName] = {
        pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
        lookbehind: true,
        greedy: true,
        inside: inside
      };
      Prism$1.languages.insertBefore('markup', 'cdata', def);
    }
  });
  Prism$1.languages.xml = Prism$1.languages.extend('markup', {});
  Prism$1.languages.html = Prism$1.languages.markup;
  Prism$1.languages.mathml = Prism$1.languages.markup;
  Prism$1.languages.svg = Prism$1.languages.markup;
  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  (function (Prism) {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    Prism.languages.css = {
      'comment': /\/\*[\s\S]*?\*\//,
      'atrule': {
        pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
        inside: {
          'rule': /@[\w-]+/ // See rest below

        }
      },
      'url': {
        pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
        inside: {
          'function': /^url/i,
          'punctuation': /^\(|\)$/
        }
      },
      'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
      'string': {
        pattern: string,
        greedy: true
      },
      'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      'important': /!important\b/i,
      'function': /[-a-z0-9]+(?=\()/i,
      'punctuation': /[(){};:,]/
    };
    Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
    var markup = Prism.languages.markup;

    if (markup) {
      markup.tag.addInlined('style', 'css');
      Prism.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: markup.tag.inside
            },
            'punctuation': /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: 'language-css'
        }
      }, markup.tag);
    }
  })(Prism$1);
  /* **********************************************
       Begin prism-clike.js
  ********************************************** */


  Prism$1.languages.clike = {
    'comment': [{
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }],
    'string': {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    'class-name': {
      pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/
      }
    },
    'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    'boolean': /\b(?:true|false)\b/,
    'function': /\w+(?=\()/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    'punctuation': /[{}[\];(),.:]/
  };
  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism$1.languages.javascript = Prism$1.languages.extend('clike', {
    'class-name': [Prism$1.languages.clike['class-name'], {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: true
    }],
    'keyword': [{
      pattern: /((?:^|})\s*)(?:catch|finally)\b/,
      lookbehind: true
    }, {
      pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }],
    'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
  });
  Prism$1.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
  Prism$1.languages.insertBefore('javascript', 'keyword', {
    'regex': {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: true,
      greedy: true
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
      pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: 'function'
    },
    'parameter': [{
      pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: true,
      inside: Prism$1.languages.javascript
    }, {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
      inside: Prism$1.languages.javascript
    }, {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism$1.languages.javascript
    }, {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism$1.languages.javascript
    }],
    'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });
  Prism$1.languages.insertBefore('javascript', 'string', {
    'template-string': {
      pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string'
        },
        'interpolation': {
          pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\${|}$/,
              alias: 'punctuation'
            },
            rest: Prism$1.languages.javascript
          }
        },
        'string': /[\s\S]+/
      }
    }
  });

  if (Prism$1.languages.markup) {
    Prism$1.languages.markup.tag.addInlined('script', 'javascript');
  }

  Prism$1.languages.js = Prism$1.languages.javascript;
  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {
    if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
      return;
    }
    /**
     * @param {Element} [container=document]
     */


    self.Prism.fileHighlight = function (container) {
      container = container || document;
      var Extensions = {
        'js': 'javascript',
        'py': 'python',
        'rb': 'ruby',
        'ps1': 'powershell',
        'psm1': 'powershell',
        'sh': 'bash',
        'bat': 'batch',
        'h': 'c',
        'tex': 'latex'
      };
      Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
        // ignore if already loaded
        if (pre.hasAttribute('data-src-loaded')) {
          return;
        } // load current


        var src = pre.getAttribute('data-src');
        var language,
            parent = pre;
        var lang = /\blang(?:uage)?-([\w-]+)\b/i;

        while (parent && !lang.test(parent.className)) {
          parent = parent.parentNode;
        }

        if (parent) {
          language = (pre.className.match(lang) || [, ''])[1];
        }

        if (!language) {
          var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
          language = Extensions[extension] || extension;
        }

        var code = document.createElement('code');
        code.className = 'language-' + language;
        pre.textContent = '';
        code.textContent = 'Loading…';
        pre.appendChild(code);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);

        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status < 400 && xhr.responseText) {
              code.textContent = xhr.responseText;
              Prism$1.highlightElement(code); // mark as loaded

              pre.setAttribute('data-src-loaded', '');
            } else if (xhr.status >= 400) {
              code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
            } else {
              code.textContent = '✖ Error: File does not exist or is empty';
            }
          }
        };

        xhr.send(null);
      });

      if (Prism$1.plugins.toolbar) {
        Prism$1.plugins.toolbar.registerButton('download-file', function (env) {
          var pre = env.element.parentNode;

          if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
            return;
          }

          var src = pre.getAttribute('data-src');
          var a = document.createElement('a');
          a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
          a.setAttribute('download', '');
          a.href = src;
          return a;
        });
      }
    };

    document.addEventListener('DOMContentLoaded', function () {
      // execute inside handler, for dropping Event as argument
      self.Prism.fileHighlight();
    });
  })();
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * True if the custom elements polyfill is in use.
   */


  var isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */

  var marker = "{{lit-".concat(String(Math.random()).slice(2), "}}");
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  try {
    var options = {
      get capture() {
        return false;
      }

    }; // tslint:disable-next-line:no-any

    window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

    window.removeEventListener('test', options, options);
  } catch (_e) {}
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time


  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  if (typeof window.ShadyCSS === 'undefined') ;else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn("Incompatible ShadyCSS version detected. " + "Please update to at least @webcomponents/webcomponentsjs@2.0.2 and " + "@webcomponents/shadycss@1.3.1.");
  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  var _a;
  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */


  window.JSCompiler_renameProperty = function (prop, _obj) {
    return prop;
  };

  var defaultConverter = {
    toAttribute: function toAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value ? '' : null;

        case Object:
        case Array:
          // if the value is `null` or `undefined` pass this through
          // to allow removing/no change behavior.
          return value == null ? value : JSON.stringify(value);
      }

      return value;
    },
    fromAttribute: function fromAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value !== null;

        case Number:
          return value === null ? null : Number(value);

        case Object:
        case Array:
          return JSON.parse(value);
      }

      return value;
    }
  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */

  var notEqual = function notEqual(value, old) {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
  };

  var defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
  };
  var microtaskPromise = Promise.resolve(true);
  var STATE_HAS_UPDATED = 1;
  var STATE_UPDATE_REQUESTED = 1 << 2;
  var STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  var STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  var STATE_HAS_CONNECTED = 1 << 5;
  /**
   * The Closure JS Compiler doesn't currently have good support for static
   * property semantics where "this" is dynamic (e.g.
   * https://github.com/google/closure-compiler/issues/3177 and others) so we use
   * this hack to bypass any rewriting by the compiler.
   */

  var finalized = 'finalized';
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */

  var UpdatingElement =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(UpdatingElement, _HTMLElement);

    function UpdatingElement() {
      var _this;

      _classCallCheck(this, UpdatingElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UpdatingElement).call(this));
      _this._updateState = 0;
      _this._instanceProperties = undefined;
      _this._updatePromise = microtaskPromise;
      _this._hasConnectedResolver = undefined;
      /**
       * Map with keys for any properties that have changed since the last
       * update cycle with previous values.
       */

      _this._changedProperties = new Map();
      /**
       * Map with keys of properties that should be reflected when updated.
       */

      _this._reflectingProperties = undefined;

      _this.initialize();

      return _this;
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */


    _createClass(UpdatingElement, [{
      key: "initialize",

      /**
       * Performs element initialization. By default captures any pre-set values for
       * registered properties.
       */
      value: function initialize() {
        this._saveInstanceProperties(); // ensures first update will be caught by an early access of
        // `updateComplete`


        this._requestUpdate();
      }
      /**
       * Fixes any properties set on the instance before upgrade time.
       * Otherwise these would shadow the accessor and break these properties.
       * The properties are stored in a Map which is played back after the
       * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
       * (<=41), properties created for native platform properties like (`id` or
       * `name`) may not have default values set in the element constructor. On
       * these browsers native properties appear on instances and therefore their
       * default value will overwrite any element default (e.g. if the element sets
       * this.id = 'id' in the constructor, the 'id' will become '' since this is
       * the native platform default).
       */

    }, {
      key: "_saveInstanceProperties",
      value: function _saveInstanceProperties() {
        var _this2 = this;

        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor._classProperties.forEach(function (_v, p) {
          if (_this2.hasOwnProperty(p)) {
            var value = _this2[p];
            delete _this2[p];

            if (!_this2._instanceProperties) {
              _this2._instanceProperties = new Map();
            }

            _this2._instanceProperties.set(p, value);
          }
        });
      }
      /**
       * Applies previously saved instance properties.
       */

    }, {
      key: "_applyInstanceProperties",
      value: function _applyInstanceProperties() {
        var _this3 = this;

        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach(function (v, p) {
          return _this3[p] = v;
        });

        this._instanceProperties = undefined;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._updateState = this._updateState | STATE_HAS_CONNECTED; // Ensure first connection completes an update. Updates cannot complete
        // before connection and if one is pending connection the
        // `_hasConnectionResolver` will exist. If so, resolve it to complete the
        // update, otherwise requestUpdate.

        if (this._hasConnectedResolver) {
          this._hasConnectedResolver();

          this._hasConnectedResolver = undefined;
        }
      }
      /**
       * Allows for `super.disconnectedCallback()` in extensions while
       * reserving the possibility of making non-breaking feature additions
       * when disconnecting at some point in the future.
       */

    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {}
      /**
       * Synchronizes property values when attributes change.
       */

    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old, value) {
        if (old !== value) {
          this._attributeToProperty(name, value);
        }
      }
    }, {
      key: "_propertyToAttribute",
      value: function _propertyToAttribute(name, value) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultPropertyDeclaration;
        var ctor = this.constructor;

        var attr = ctor._attributeNameForProperty(name, options);

        if (attr !== undefined) {
          var attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


          if (attrValue === undefined) {
            return;
          } // Track if the property is being reflected to avoid
          // setting the property again via `attributeChangedCallback`. Note:
          // 1. this takes advantage of the fact that the callback is synchronous.
          // 2. will behave incorrectly if multiple attributes are in the reaction
          // stack at time of calling. However, since we process attributes
          // in `update` this should not be possible (or an extreme corner case
          // that we'd like to discover).
          // mark state reflecting


          this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

          if (attrValue == null) {
            this.removeAttribute(attr);
          } else {
            this.setAttribute(attr, attrValue);
          } // mark state not reflecting


          this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
      }
    }, {
      key: "_attributeToProperty",
      value: function _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
          return;
        }

        var ctor = this.constructor;

        var propName = ctor._attributeToPropertyMap.get(name);

        if (propName !== undefined) {
          var _options = ctor._classProperties.get(propName) || defaultPropertyDeclaration; // mark state reflecting


          this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
          this[propName] = // tslint:disable-next-line:no-any
          ctor._propertyValueFromAttribute(value, _options); // mark state not reflecting

          this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
      }
      /**
       * This private version of `requestUpdate` does not access or return the
       * `updateComplete` promise. This promise can be overridden and is therefore
       * not free to access.
       */

    }, {
      key: "_requestUpdate",
      value: function _requestUpdate(name, oldValue) {
        var shouldRequestUpdate = true; // If we have a property key, perform property update steps.

        if (name !== undefined) {
          var ctor = this.constructor;

          var _options2 = ctor._classProperties.get(name) || defaultPropertyDeclaration;

          if (ctor._valueHasChanged(this[name], oldValue, _options2.hasChanged)) {
            if (!this._changedProperties.has(name)) {
              this._changedProperties.set(name, oldValue);
            } // Add to reflecting properties set.
            // Note, it's important that every change has a chance to add the
            // property to `_reflectingProperties`. This ensures setting
            // attribute + property reflects correctly.


            if (_options2.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
              if (this._reflectingProperties === undefined) {
                this._reflectingProperties = new Map();
              }

              this._reflectingProperties.set(name, _options2);
            }
          } else {
            // Abort the request if the property should not be considered changed.
            shouldRequestUpdate = false;
          }
        }

        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
          this._enqueueUpdate();
        }
      }
      /**
       * Requests an update which is processed asynchronously. This should
       * be called when an element should update based on some state not triggered
       * by setting a property. In this case, pass no arguments. It should also be
       * called when manually implementing a property setter. In this case, pass the
       * property `name` and `oldValue` to ensure that any configured property
       * options are honored. Returns the `updateComplete` Promise which is resolved
       * when the update completes.
       *
       * @param name {PropertyKey} (optional) name of requesting property
       * @param oldValue {any} (optional) old value of requesting property
       * @returns {Promise} A Promise that is resolved when the update completes.
       */

    }, {
      key: "requestUpdate",
      value: function requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);

        return this.updateComplete;
      }
      /**
       * Sets up the element to asynchronously update.
       */

    }, {
      key: "_enqueueUpdate",
      value: function () {
        var _enqueueUpdate2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _this4 = this;

          var resolve, reject, previousUpdatePromise, result;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Mark state updating...
                  this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
                  previousUpdatePromise = this._updatePromise;
                  this._updatePromise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                  });
                  _context.prev = 3;
                  _context.next = 6;
                  return previousUpdatePromise;

                case 6:
                  _context.next = 10;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](3);

                case 10:
                  if (this._hasConnected) {
                    _context.next = 13;
                    break;
                  }

                  _context.next = 13;
                  return new Promise(function (res) {
                    return _this4._hasConnectedResolver = res;
                  });

                case 13:
                  _context.prev = 13;
                  result = this.performUpdate(); // If `performUpdate` returns a Promise, we await it. This is done to
                  // enable coordinating updates with a scheduler. Note, the result is
                  // checked to avoid delaying an additional microtask unless we need to.

                  if (!(result != null)) {
                    _context.next = 18;
                    break;
                  }

                  _context.next = 18;
                  return result;

                case 18:
                  _context.next = 23;
                  break;

                case 20:
                  _context.prev = 20;
                  _context.t1 = _context["catch"](13);
                  reject(_context.t1);

                case 23:
                  resolve(!this._hasRequestedUpdate);

                case 24:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[3, 8], [13, 20]]);
        }));

        function _enqueueUpdate() {
          return _enqueueUpdate2.apply(this, arguments);
        }

        return _enqueueUpdate;
      }()
    }, {
      key: "performUpdate",

      /**
       * Performs an element update. Note, if an exception is thrown during the
       * update, `firstUpdated` and `updated` will not be called.
       *
       * You can override this method to change the timing of updates. If this
       * method is overridden, `super.performUpdate()` must be called.
       *
       * For instance, to schedule updates to occur just before the next frame:
       *
       * ```
       * protected async performUpdate(): Promise<unknown> {
       *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
       *   super.performUpdate();
       * }
       * ```
       */
      value: function performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
          this._applyInstanceProperties();
        }

        var shouldUpdate = false;
        var changedProperties = this._changedProperties;

        try {
          shouldUpdate = this.shouldUpdate(changedProperties);

          if (shouldUpdate) {
            this.update(changedProperties);
          }
        } catch (e) {
          // Prevent `firstUpdated` and `updated` from running when there's an
          // update exception.
          shouldUpdate = false;
          throw e;
        } finally {
          // Ensure element can accept additional updates after an exception.
          this._markUpdated();
        }

        if (shouldUpdate) {
          if (!(this._updateState & STATE_HAS_UPDATED)) {
            this._updateState = this._updateState | STATE_HAS_UPDATED;
            this.firstUpdated(changedProperties);
          }

          this.updated(changedProperties);
        }
      }
    }, {
      key: "_markUpdated",
      value: function _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
      }
      /**
       * Returns a Promise that resolves when the element has completed updating.
       * The Promise value is a boolean that is `true` if the element completed the
       * update without triggering another update. The Promise result is `false` if
       * a property was set inside `updated()`. If the Promise is rejected, an
       * exception was thrown during the update.
       *
       * To await additional asynchronous work, override the `_getUpdateComplete`
       * method. For example, it is sometimes useful to await a rendered element
       * before fulfilling this Promise. To do this, first await
       * `super._getUpdateComplete()`, then any subsequent state.
       *
       * @returns {Promise} The Promise returns a boolean that indicates if the
       * update resolved without triggering another update.
       */

    }, {
      key: "_getUpdateComplete",

      /**
       * Override point for the `updateComplete` promise.
       *
       * It is not safe to override the `updateComplete` getter directly due to a
       * limitation in TypeScript which means it is not possible to call a
       * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
       * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
       * This method should be overridden instead. For example:
       *
       *   class MyElement extends LitElement {
       *     async _getUpdateComplete() {
       *       await super._getUpdateComplete();
       *       await this._myChild.updateComplete;
       *     }
       *   }
       */
      value: function _getUpdateComplete() {
        return this._updatePromise;
      }
      /**
       * Controls whether or not `update` should be called when the element requests
       * an update. By default, this method always returns `true`, but this can be
       * customized to control when to update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "shouldUpdate",
      value: function shouldUpdate(_changedProperties) {
        return true;
      }
      /**
       * Updates the element. This method reflects property values to attributes.
       * It can be overridden to render and keep updated element DOM.
       * Setting properties inside this method will *not* trigger
       * another update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "update",
      value: function update(_changedProperties) {
        var _this5 = this;

        if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
          // Use forEach so this works even if for/of loops are compiled to for
          // loops expecting arrays
          this._reflectingProperties.forEach(function (v, k) {
            return _this5._propertyToAttribute(k, _this5[k], v);
          });

          this._reflectingProperties = undefined;
        }
      }
      /**
       * Invoked whenever the element is updated. Implement to perform
       * post-updating tasks via DOM APIs, for example, focusing an element.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "updated",
      value: function updated(_changedProperties) {}
      /**
       * Invoked when the element is first updated. Implement to perform one time
       * work on the element after update.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */

    }, {
      key: "firstUpdated",
      value: function firstUpdated(_changedProperties) {}
    }, {
      key: "_hasConnected",
      get: function get() {
        return this._updateState & STATE_HAS_CONNECTED;
      }
    }, {
      key: "_hasRequestedUpdate",
      get: function get() {
        return this._updateState & STATE_UPDATE_REQUESTED;
      }
    }, {
      key: "hasUpdated",
      get: function get() {
        return this._updateState & STATE_HAS_UPDATED;
      }
    }, {
      key: "updateComplete",
      get: function get() {
        return this._getUpdateComplete();
      }
    }], [{
      key: "_ensureClassProperties",

      /**
       * Ensures the private `_classProperties` property metadata is created.
       * In addition to `finalize` this is also called in `createProperty` to
       * ensure the `@property` decorator can add property metadata.
       */

      /** @nocollapse */
      value: function _ensureClassProperties() {
        var _this6 = this;

        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
          this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

          var superProperties = Object.getPrototypeOf(this)._classProperties;

          if (superProperties !== undefined) {
            superProperties.forEach(function (v, k) {
              return _this6._classProperties.set(k, v);
            });
          }
        }
      }
      /**
       * Creates a property accessor on the element prototype if one does not exist.
       * The property setter calls the property's `hasChanged` property option
       * or uses a strict identity check to determine whether or not to request
       * an update.
       * @nocollapse
       */

    }, {
      key: "createProperty",
      value: function createProperty(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultPropertyDeclaration;

        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();

        this._classProperties.set(name, options); // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it


        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
          return;
        }

        var key = _typeof(name) === 'symbol' ? Symbol() : "__".concat(name);
        Object.defineProperty(this.prototype, name, {
          // tslint:disable-next-line:no-any no symbol in index
          get: function get() {
            return this[key];
          },
          set: function set(value) {
            var oldValue = this[name];
            this[key] = value;

            this._requestUpdate(name, oldValue);
          },
          configurable: true,
          enumerable: true
        });
      }
      /**
       * Creates property accessors for registered properties and ensures
       * any superclasses are also finalized.
       * @nocollapse
       */

    }, {
      key: "finalize",
      value: function finalize() {
        // finalize any superclasses
        var superCtor = Object.getPrototypeOf(this);

        if (!superCtor.hasOwnProperty(finalized)) {
          superCtor.finalize();
        }

        this[finalized] = true;

        this._ensureClassProperties(); // initialize Map populated in observedAttributes


        this._attributeToPropertyMap = new Map(); // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.

        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
          var props = this.properties; // support symbols in properties (IE11 does not support this)

          var propKeys = [].concat(_toConsumableArray(Object.getOwnPropertyNames(props)), _toConsumableArray(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])); // This for/of is ok because propKeys is an array

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = propKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var p = _step.value;
              // note, use of `any` is due to TypeSript lack of support for symbol in
              // index types
              // tslint:disable-next-line:no-any no symbol in index
              this.createProperty(p, props[p]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
      /**
       * Returns the property name for the given attribute `name`.
       * @nocollapse
       */

    }, {
      key: "_attributeNameForProperty",
      value: function _attributeNameForProperty(name, options) {
        var attribute = options.attribute;
        return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
      }
      /**
       * Returns true if a property should request an update.
       * Called when a property value is set and uses the `hasChanged`
       * option for the property if present or a strict identity check.
       * @nocollapse
       */

    }, {
      key: "_valueHasChanged",
      value: function _valueHasChanged(value, old) {
        var hasChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : notEqual;
        return hasChanged(value, old);
      }
      /**
       * Returns the property value for the given attribute value.
       * Called via the `attributeChangedCallback` and uses the property's
       * `converter` or `converter.fromAttribute` property option.
       * @nocollapse
       */

    }, {
      key: "_propertyValueFromAttribute",
      value: function _propertyValueFromAttribute(value, options) {
        var type = options.type;
        var converter = options.converter || defaultConverter;
        var fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
        return fromAttribute ? fromAttribute(value, type) : value;
      }
      /**
       * Returns the attribute value for the given property value. If this
       * returns undefined, the property will *not* be reflected to an attribute.
       * If this returns null, the attribute will be removed, otherwise the
       * attribute will be set to the value.
       * This uses the property's `reflect` and `type.toAttribute` property options.
       * @nocollapse
       */

    }, {
      key: "_propertyValueToAttribute",
      value: function _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
          return;
        }

        var type = options.type;
        var converter = options.converter;
        var toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
        return toAttribute(value, type);
      }
    }, {
      key: "observedAttributes",
      get: function get() {
        var _this7 = this;

        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        var attributes = []; // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays

        this._classProperties.forEach(function (v, p) {
          var attr = _this7._attributeNameForProperty(p, v);

          if (attr !== undefined) {
            _this7._attributeToPropertyMap.set(attr, p);

            attributes.push(attr);
          }
        });

        return attributes;
      }
    }]);

    return UpdatingElement;
  }(_wrapNativeSuper(HTMLElement));

  _a = finalized;
  /**
   * Marks class as having finished creating properties.
   */

  UpdatingElement[_a] = true;
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  var standardProperty = function standardProperty(options, element) {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor && !('value' in element.descriptor)) {
      return Object.assign({}, element, {
        finisher: function finisher(clazz) {
          clazz.createProperty(element.key, options);
        }
      });
    } else {
      // createProperty() takes care of defining the property, but we still
      // must return some kind of descriptor, so return a descriptor for an
      // unused prototype field. The finisher calls createProperty().
      return {
        kind: 'field',
        key: Symbol(),
        placement: 'own',
        descriptor: {},
        // When @babel/plugin-proposal-decorators implements initializers,
        // do this instead of the initializer below. See:
        // https://github.com/babel/babel/issues/9260 extras: [
        //   {
        //     kind: 'initializer',
        //     placement: 'own',
        //     initializer: descriptor.initializer,
        //   }
        // ],
        initializer: function initializer() {
          if (typeof element.initializer === 'function') {
            this[element.key] = element.initializer.call(this);
          }
        },
        finisher: function finisher(clazz) {
          clazz.createProperty(element.key, options);
        }
      };
    }
  };

  var legacyProperty = function legacyProperty(options, proto, name) {
    proto.constructor.createProperty(name, options);
  };
  /**
   * A property decorator which creates a LitElement property which reflects a
   * corresponding attribute value. A `PropertyDeclaration` may optionally be
   * supplied to configure property features.
   *
   * @ExportDecoratedItems
   */


  function property(options) {
    // tslint:disable-next-line:no-any decorator
    return function (protoOrDescriptor, name) {
      return name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
    };
  }
  /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */


  var supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time

  (window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.2.1');

  var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var EMPTY_ATTRIBUTE_RE = /([\w-]+)=\"\"/g;

  var ExampleSnippet =
  /*#__PURE__*/
  function (_UpdatingElement) {
    _inherits(ExampleSnippet, _UpdatingElement);

    function ExampleSnippet() {
      var _this8;

      _classCallCheck(this, ExampleSnippet);

      _this8 = _possibleConstructorReturn(this, _getPrototypeOf(ExampleSnippet).apply(this, arguments));
      _this8.useShadowRoot = false;
      _this8.stampTo = null;
      _this8.template = null;
      _this8.highlightAs = 'markup';
      _this8.lazy = false;
      _this8.preserveWhitespace = false;
      _this8.inertScript = false;
      _this8.stamped = false;
      return _this8;
    }

    _createClass(ExampleSnippet, [{
      key: "stamp",
      value: function stamp() {
        if (this.stampTo == null || this.template == null) {
          return;
        }

        var root = this.getRootNode();
        var stampTarget = root.getElementById(this.stampTo);

        if (stampTarget != null) {
          var parentNode;

          if (this.useShadowRoot) {
            if (stampTarget.shadowRoot == null) {
              stampTarget.attachShadow({
                mode: 'open'
              });
            }

            parentNode = stampTarget.shadowRoot;
          } else {
            parentNode = stampTarget;
          }

          var template = this.template,
              highlightAs = this.highlightAs;
          var content = template.content.cloneNode(true);

          if (this.inertScript) {
            var scripts = Array.from(content.querySelectorAll('script'));

            for (var _i = 0, _scripts = scripts; _i < _scripts.length; _i++) {
              var script = _scripts[_i];
              script.parentNode.removeChild(script);
            }
          }

          parentNode.appendChild(content);
          var pre = document.createElement('pre');
          var code = document.createElement('code');
          pre.appendChild(code);
          var snippet = template.innerHTML;
          snippet = snippet.replace('type="noexecute" ', '');

          if (!this.preserveWhitespace) {
            snippet = snippet.trim();
          }

          if (highlightAs === 'html') {
            snippet = snippet.replace(EMPTY_ATTRIBUTE_RE, '$1');
          }

          var highlighted = Prism.highlight(snippet, Prism.languages[highlightAs], highlightAs);
          code.innerHTML = highlighted;
          this.appendChild(pre);
        }
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        _get(_getPrototypeOf(ExampleSnippet.prototype), "connectedCallback", this) && _get(_getPrototypeOf(ExampleSnippet.prototype), "connectedCallback", this).call(this);
        this.template = this.querySelector('template');
      }
    }, {
      key: "createRenderRoot",
      value: function createRenderRoot() {
        return this;
      }
    }, {
      key: "updated",
      value: function updated(changedProperties) {
        _get(_getPrototypeOf(ExampleSnippet.prototype), "updated", this).call(this, changedProperties);

        if (!this.stamped && !this.lazy && (changedProperties.has('stamp-to') || changedProperties.has('template')) && this.template != null && this.stampTo != null) {
          this.stamp();
        }
      }
    }]);

    return ExampleSnippet;
  }(UpdatingElement);

  __decorate([property({
    type: Boolean,
    attribute: 'use-shadow-root'
  })], ExampleSnippet.prototype, "useShadowRoot", void 0);

  __decorate([property({
    type: String,
    attribute: 'stamp-to'
  })], ExampleSnippet.prototype, "stampTo", void 0);

  __decorate([property({
    type: Object
  })], ExampleSnippet.prototype, "template", void 0);

  __decorate([property({
    type: String,
    attribute: 'highlight-as'
  })], ExampleSnippet.prototype, "highlightAs", void 0);

  __decorate([property({
    type: Boolean,
    attribute: 'lazy'
  })], ExampleSnippet.prototype, "lazy", void 0);

  __decorate([property({
    type: Boolean
  })], ExampleSnippet.prototype, "preserveWhitespace", void 0);

  __decorate([property({
    type: Boolean,
    attribute: 'inert-script'
  })], ExampleSnippet.prototype, "inertScript", void 0);

  customElements.define('example-snippet', ExampleSnippet);
  exports.ExampleSnippet = ExampleSnippet;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});