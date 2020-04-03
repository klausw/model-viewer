(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.DocumentationDependencies = {}));
}(this, (function (exports) { 'use strict';

	/* **********************************************
	     Begin prism-core.js
	********************************************** */

	var _self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);

	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */

	var Prism$1 = (function (_self){

	// Private helper vars
	var lang = /\blang(?:uage)?-([\w-]+)\b/i;
	var uniqueId = 0;


	var _ = {
		manual: _self.Prism && _self.Prism.manual,
		disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (Array.isArray(tokens)) {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			type: function (o) {
				return Object.prototype.toString.call(o).slice(8, -1);
			},

			objId: function (obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function deepClone(o, visited) {
				var clone, id, type = _.util.type(o);
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
			},

			/**
			 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
			 *
			 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
			 *
			 * @param {Element} element
			 * @returns {string}
			 */
			getLanguage: function (element) {
				while (element && !lang.test(element.className)) {
					element = element.parentElement;
				}
				if (element) {
					return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
				}
				return 'none';
			},

			/**
			 * Returns the script element that is currently executing.
			 *
			 * This does __not__ work for line script element.
			 *
			 * @returns {HTMLScriptElement | null}
			 */
			currentScript: function () {
				if (typeof document === 'undefined') {
					return null;
				}
				if ('currentScript' in document) {
					return document.currentScript;
				}

				// IE11 workaround
				// we'll get the src of the current script by parsing IE11's error stack trace
				// this will not work for inline scripts

				try {
					throw new Error();
				} catch (err) {
					// Get file src url from stack. Specifically works with the format of stack traces in IE.
					// A stack will look like this:
					//
					// Error
					//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
					//    at Global code (http://localhost/components/prism-core.js:606:1)

					var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
					if (src) {
						var scripts = document.getElementsByTagName('script');
						for (var i in scripts) {
							if (scripts[i].src == src) {
								return scripts[i];
							}
						}
					}
					return null;
				}
			}
		},

		languages: {
			extend: function (id, redef) {
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
			insertBefore: function (inside, before, insert, root) {
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
						}

						// Do not insert token which also occur in insert. See #1525
						if (!insert.hasOwnProperty(token)) {
							ret[token] = grammar[token];
						}
					}
				}

				var old = root[inside];
				root[inside] = ret;

				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
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
						}
						else if (propertyType === 'Array' && !visited[objId(property)]) {
							visited[objId(property)] = true;
							DFS(property, callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},

		highlightAll: function(async, callback) {
			_.highlightAllUnder(document, async, callback);
		},

		highlightAllUnder: function(container, async, callback) {
			var env = {
				callback: callback,
				container: container,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};

			_.hooks.run('before-highlightall', env);

			env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

			_.hooks.run('before-all-elements-highlight', env);

			for (var i = 0, element; element = env.elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},

		highlightElement: function(element, async, callback) {
			// Find language
			var language = _.util.getLanguage(element);
			var grammar = _.languages[language];

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			// Set language on the parent, for styling
			var parent = element.parentNode;
			if (parent && parent.nodeName.toLowerCase() === 'pre') {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}

			var code = element.textContent;

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			function insertHighlightedCode(highlightedCode) {
				env.highlightedCode = highlightedCode;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
				callback && callback.call(env.element);
			}

			_.hooks.run('before-sanity-check', env);

			if (!env.code) {
				_.hooks.run('complete', env);
				callback && callback.call(env.element);
				return;
			}

			_.hooks.run('before-highlight', env);

			if (!env.grammar) {
				insertHighlightedCode(_.util.encode(env.code));
				return;
			}

			if (async && _self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function(evt) {
					insertHighlightedCode(evt.data);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			}
			else {
				insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
			}
		},

		highlight: function (text, grammar, language) {
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

		matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
			for (var token in grammar) {
				if (!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				var patterns = grammar[token];
				patterns = Array.isArray(patterns) ? patterns : [patterns];

				for (var j = 0; j < patterns.length; ++j) {
					if (target && target == token + ',' + j) {
						return;
					}

					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						greedy = !!pattern.greedy,
						lookbehindLength = 0,
						alias = pattern.alias;

					if (greedy && !pattern.pattern.global) {
						// Without the global flag, lastIndex won't work
						var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
						pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
					}

					pattern = pattern.pattern || pattern;

					// Don’t cache length as it changes during the loop
					for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

						var str = strarr[i];

						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							return;
						}

						if (str instanceof Token) {
							continue;
						}

						if (greedy && i != strarr.length - 1) {
							pattern.lastIndex = pos;
							var match = pattern.exec(text);
							if (!match) {
								break;
							}

							var from = match.index + (lookbehind && match[1] ? match[1].length : 0),
							    to = match.index + match[0].length,
							    k = i,
							    p = pos;

							for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
								p += strarr[k].length;
								// Move the index i to the element in strarr that is closest to from
								if (from >= p) {
									++i;
									pos = p;
								}
							}

							// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
							if (strarr[i] instanceof Token) {
								continue;
							}

							// Number of tokens to delete and replace with the new match
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

						if(lookbehind) {
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

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);

						if (delNum != 1)
							_.matchGrammar(text, strarr, grammar, i, pos, true, token + ',' + j);

						if (oneshot)
							break;
					}
				}
			}
		},

		tokenize: function(text, grammar) {
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

			add: function (name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function (name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i=0, callback; callback = callbacks[i++];) {
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
		this.alias = alias;
		// Copy of the full string this token was created from
		this.length = (matchedStr || '').length|0;
		this.greedy = !!greedy;
	}

	Token.stringify = function(o, language) {
		if (typeof o == 'string') {
			return o;
		}

		if (Array.isArray(o)) {
			return o.map(function(element) {
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

		var attributes = Object.keys(env.attributes).map(function(name) {
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
	}

	//Get current script and highlight
	var script = _.util.currentScript();

	if (script) {
		_.filename = script.src;

		if (script.hasAttribute('data-manual')) {
			_.manual = true;
		}
	}

	if (!_.manual) {
		function highlightAutomaticallyCallback() {
			if (!_.manual) {
				_.highlightAll();
			}
		}

		// If the document state is "loading", then we'll use DOMContentLoaded.
		// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
		// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
		// might take longer one animation frame to execute which can create a race condition where only some plugins have
		// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
		// See https://github.com/PrismJS/prism/issues/2102
		var readyState = document.readyState;
		if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
			document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
		} else {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(highlightAutomaticallyCallback);
			} else {
				window.setTimeout(highlightAutomaticallyCallback, 16);
			}
		}
	}

	return _;

	})(_self);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism$1;
	}

	// hack for components to work correctly in node.js
	if (typeof global !== 'undefined') {
		global.Prism = Prism$1;
	}


	/* **********************************************
	     Begin prism-markup.js
	********************************************** */

	Prism$1.languages.markup = {
		'comment': /<!--[\s\S]*?-->/,
		'prolog': /<\?[\s\S]+?\?>/,
		'doctype': {
			pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
			greedy: true
		},
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
						'punctuation': [
							/^=/,
							{
								pattern: /^(\s*)["']|["']$/,
								lookbehind: true
							}
						]
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

	Prism$1.languages.markup['tag'].inside['attr-value'].inside['entity'] =
		Prism$1.languages.markup['entity'];

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism$1.hooks.add('wrap', function(env) {

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
					'rule': /@[\w-]+/
					// See rest below
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

	}(Prism$1));


	/* **********************************************
	     Begin prism-clike.js
	********************************************** */

	Prism$1.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'string': {
			pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'class-name': {
			pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
			lookbehind: true,
			inside: {
				'punctuation': /[.\\]/
			}
		},
		'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		'boolean': /\b(?:true|false)\b/,
		'function': /\w+(?=\()/,
		'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
		'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
		'punctuation': /[{}[\];(),.:]/
	};


	/* **********************************************
	     Begin prism-javascript.js
	********************************************** */

	Prism$1.languages.javascript = Prism$1.languages.extend('clike', {
		'class-name': [
			Prism$1.languages.clike['class-name'],
			{
				pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
				lookbehind: true
			}
		],
		'keyword': [
			{
				pattern: /((?:^|})\s*)(?:catch|finally)\b/,
				lookbehind: true
			},
			{
				pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
				lookbehind: true
			},
		],
		'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
		'operator': /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
	});

	Prism$1.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

	Prism$1.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*(?:$|[\r\n,.;})\]]))/,
			lookbehind: true,
			greedy: true
		},
		// This must be declared before keyword because we use "function" inside the look-forward
		'function-variable': {
			pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
			alias: 'function'
		},
		'parameter': [
			{
				pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
				lookbehind: true,
				inside: Prism$1.languages.javascript
			},
			{
				pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
				inside: Prism$1.languages.javascript
			},
			{
				pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
				lookbehind: true,
				inside: Prism$1.languages.javascript
			},
			{
				pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
				lookbehind: true,
				inside: Prism$1.languages.javascript
			}
		],
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
		self.Prism.fileHighlight = function(container) {
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
				}

				// load current
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
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

							Prism$1.highlightElement(code);
							// mark as loaded
							pre.setAttribute('data-src-loaded', '');
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
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
	 * An expression marker with embedded unique key to avoid collision with
	 * possible text in templates.
	 */
	const marker = `{{lit-${String(Math.random()).slice(2)}}}`;

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
	// Detect event listener options support. If the `capture` property is read
	// from the options object, then options are supported. If not, then the thrid
	// argument to add/removeEventListener is interpreted as the boolean capture
	// value so we should only pass the `capture` property.
	let eventOptionsSupported = false;
	try {
	    const options = {
	        get capture() {
	            eventOptionsSupported = true;
	            return false;
	        }
	    };
	    // tslint:disable-next-line:no-any
	    window.addEventListener('test', options, options);
	    // tslint:disable-next-line:no-any
	    window.removeEventListener('test', options, options);
	}
	catch (_e) {
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
	if (typeof window.ShadyCSS === 'undefined') ;
	else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
	    console.warn(`Incompatible ShadyCSS version detected. ` +
	        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
	        `@webcomponents/shadycss@1.3.1.`);
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
	window.JSCompiler_renameProperty =
	    (prop, _obj) => prop;
	const defaultConverter = {
	    toAttribute(value, type) {
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
	    fromAttribute(value, type) {
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
	const notEqual = (value, old) => {
	    // This ensures (old==NaN, value==NaN) always returns false
	    return old !== value && (old === old || value === value);
	};
	const defaultPropertyDeclaration = {
	    attribute: true,
	    type: String,
	    converter: defaultConverter,
	    reflect: false,
	    hasChanged: notEqual
	};
	const microtaskPromise = Promise.resolve(true);
	const STATE_HAS_UPDATED = 1;
	const STATE_UPDATE_REQUESTED = 1 << 2;
	const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
	const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
	const STATE_HAS_CONNECTED = 1 << 5;
	/**
	 * The Closure JS Compiler doesn't currently have good support for static
	 * property semantics where "this" is dynamic (e.g.
	 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
	 * this hack to bypass any rewriting by the compiler.
	 */
	const finalized = 'finalized';
	/**
	 * Base element class which manages element properties and attributes. When
	 * properties change, the `update` method is asynchronously called. This method
	 * should be supplied by subclassers to render updates as desired.
	 */
	class UpdatingElement extends HTMLElement {
	    constructor() {
	        super();
	        this._updateState = 0;
	        this._instanceProperties = undefined;
	        this._updatePromise = microtaskPromise;
	        this._hasConnectedResolver = undefined;
	        /**
	         * Map with keys for any properties that have changed since the last
	         * update cycle with previous values.
	         */
	        this._changedProperties = new Map();
	        /**
	         * Map with keys of properties that should be reflected when updated.
	         */
	        this._reflectingProperties = undefined;
	        this.initialize();
	    }
	    /**
	     * Returns a list of attributes corresponding to the registered properties.
	     * @nocollapse
	     */
	    static get observedAttributes() {
	        // note: piggy backing on this to ensure we're finalized.
	        this.finalize();
	        const attributes = [];
	        // Use forEach so this works even if for/of loops are compiled to for loops
	        // expecting arrays
	        this._classProperties.forEach((v, p) => {
	            const attr = this._attributeNameForProperty(p, v);
	            if (attr !== undefined) {
	                this._attributeToPropertyMap.set(attr, p);
	                attributes.push(attr);
	            }
	        });
	        return attributes;
	    }
	    /**
	     * Ensures the private `_classProperties` property metadata is created.
	     * In addition to `finalize` this is also called in `createProperty` to
	     * ensure the `@property` decorator can add property metadata.
	     */
	    /** @nocollapse */
	    static _ensureClassProperties() {
	        // ensure private storage for property declarations.
	        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
	            this._classProperties = new Map();
	            // NOTE: Workaround IE11 not supporting Map constructor argument.
	            const superProperties = Object.getPrototypeOf(this)._classProperties;
	            if (superProperties !== undefined) {
	                superProperties.forEach((v, k) => this._classProperties.set(k, v));
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
	    static createProperty(name, options = defaultPropertyDeclaration) {
	        // Note, since this can be called by the `@property` decorator which
	        // is called before `finalize`, we ensure storage exists for property
	        // metadata.
	        this._ensureClassProperties();
	        this._classProperties.set(name, options);
	        // Do not generate an accessor if the prototype already has one, since
	        // it would be lost otherwise and that would never be the user's intention;
	        // Instead, we expect users to call `requestUpdate` themselves from
	        // user-defined accessors. Note that if the super has an accessor we will
	        // still overwrite it
	        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
	            return;
	        }
	        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
	        Object.defineProperty(this.prototype, name, {
	            // tslint:disable-next-line:no-any no symbol in index
	            get() {
	                return this[key];
	            },
	            set(value) {
	                const oldValue = this[name];
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
	    static finalize() {
	        // finalize any superclasses
	        const superCtor = Object.getPrototypeOf(this);
	        if (!superCtor.hasOwnProperty(finalized)) {
	            superCtor.finalize();
	        }
	        this[finalized] = true;
	        this._ensureClassProperties();
	        // initialize Map populated in observedAttributes
	        this._attributeToPropertyMap = new Map();
	        // make any properties
	        // Note, only process "own" properties since this element will inherit
	        // any properties defined on the superClass, and finalization ensures
	        // the entire prototype chain is finalized.
	        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
	            const props = this.properties;
	            // support symbols in properties (IE11 does not support this)
	            const propKeys = [
	                ...Object.getOwnPropertyNames(props),
	                ...(typeof Object.getOwnPropertySymbols === 'function') ?
	                    Object.getOwnPropertySymbols(props) :
	                    []
	            ];
	            // This for/of is ok because propKeys is an array
	            for (const p of propKeys) {
	                // note, use of `any` is due to TypeSript lack of support for symbol in
	                // index types
	                // tslint:disable-next-line:no-any no symbol in index
	                this.createProperty(p, props[p]);
	            }
	        }
	    }
	    /**
	     * Returns the property name for the given attribute `name`.
	     * @nocollapse
	     */
	    static _attributeNameForProperty(name, options) {
	        const attribute = options.attribute;
	        return attribute === false ?
	            undefined :
	            (typeof attribute === 'string' ?
	                attribute :
	                (typeof name === 'string' ? name.toLowerCase() : undefined));
	    }
	    /**
	     * Returns true if a property should request an update.
	     * Called when a property value is set and uses the `hasChanged`
	     * option for the property if present or a strict identity check.
	     * @nocollapse
	     */
	    static _valueHasChanged(value, old, hasChanged = notEqual) {
	        return hasChanged(value, old);
	    }
	    /**
	     * Returns the property value for the given attribute value.
	     * Called via the `attributeChangedCallback` and uses the property's
	     * `converter` or `converter.fromAttribute` property option.
	     * @nocollapse
	     */
	    static _propertyValueFromAttribute(value, options) {
	        const type = options.type;
	        const converter = options.converter || defaultConverter;
	        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
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
	    static _propertyValueToAttribute(value, options) {
	        if (options.reflect === undefined) {
	            return;
	        }
	        const type = options.type;
	        const converter = options.converter;
	        const toAttribute = converter && converter.toAttribute ||
	            defaultConverter.toAttribute;
	        return toAttribute(value, type);
	    }
	    /**
	     * Performs element initialization. By default captures any pre-set values for
	     * registered properties.
	     */
	    initialize() {
	        this._saveInstanceProperties();
	        // ensures first update will be caught by an early access of
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
	    _saveInstanceProperties() {
	        // Use forEach so this works even if for/of loops are compiled to for loops
	        // expecting arrays
	        this.constructor
	            ._classProperties.forEach((_v, p) => {
	            if (this.hasOwnProperty(p)) {
	                const value = this[p];
	                delete this[p];
	                if (!this._instanceProperties) {
	                    this._instanceProperties = new Map();
	                }
	                this._instanceProperties.set(p, value);
	            }
	        });
	    }
	    /**
	     * Applies previously saved instance properties.
	     */
	    _applyInstanceProperties() {
	        // Use forEach so this works even if for/of loops are compiled to for loops
	        // expecting arrays
	        // tslint:disable-next-line:no-any
	        this._instanceProperties.forEach((v, p) => this[p] = v);
	        this._instanceProperties = undefined;
	    }
	    connectedCallback() {
	        this._updateState = this._updateState | STATE_HAS_CONNECTED;
	        // Ensure first connection completes an update. Updates cannot complete
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
	    disconnectedCallback() {
	    }
	    /**
	     * Synchronizes property values when attributes change.
	     */
	    attributeChangedCallback(name, old, value) {
	        if (old !== value) {
	            this._attributeToProperty(name, value);
	        }
	    }
	    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
	        const ctor = this.constructor;
	        const attr = ctor._attributeNameForProperty(name, options);
	        if (attr !== undefined) {
	            const attrValue = ctor._propertyValueToAttribute(value, options);
	            // an undefined value does not change the attribute.
	            if (attrValue === undefined) {
	                return;
	            }
	            // Track if the property is being reflected to avoid
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
	            }
	            else {
	                this.setAttribute(attr, attrValue);
	            }
	            // mark state not reflecting
	            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
	        }
	    }
	    _attributeToProperty(name, value) {
	        // Use tracking info to avoid deserializing attribute value if it was
	        // just set from a property setter.
	        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
	            return;
	        }
	        const ctor = this.constructor;
	        const propName = ctor._attributeToPropertyMap.get(name);
	        if (propName !== undefined) {
	            const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
	            // mark state reflecting
	            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
	            this[propName] =
	                // tslint:disable-next-line:no-any
	                ctor._propertyValueFromAttribute(value, options);
	            // mark state not reflecting
	            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
	        }
	    }
	    /**
	     * This private version of `requestUpdate` does not access or return the
	     * `updateComplete` promise. This promise can be overridden and is therefore
	     * not free to access.
	     */
	    _requestUpdate(name, oldValue) {
	        let shouldRequestUpdate = true;
	        // If we have a property key, perform property update steps.
	        if (name !== undefined) {
	            const ctor = this.constructor;
	            const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
	            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
	                if (!this._changedProperties.has(name)) {
	                    this._changedProperties.set(name, oldValue);
	                }
	                // Add to reflecting properties set.
	                // Note, it's important that every change has a chance to add the
	                // property to `_reflectingProperties`. This ensures setting
	                // attribute + property reflects correctly.
	                if (options.reflect === true &&
	                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
	                    if (this._reflectingProperties === undefined) {
	                        this._reflectingProperties = new Map();
	                    }
	                    this._reflectingProperties.set(name, options);
	                }
	            }
	            else {
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
	    requestUpdate(name, oldValue) {
	        this._requestUpdate(name, oldValue);
	        return this.updateComplete;
	    }
	    /**
	     * Sets up the element to asynchronously update.
	     */
	    async _enqueueUpdate() {
	        // Mark state updating...
	        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
	        let resolve;
	        let reject;
	        const previousUpdatePromise = this._updatePromise;
	        this._updatePromise = new Promise((res, rej) => {
	            resolve = res;
	            reject = rej;
	        });
	        try {
	            // Ensure any previous update has resolved before updating.
	            // This `await` also ensures that property changes are batched.
	            await previousUpdatePromise;
	        }
	        catch (e) {
	            // Ignore any previous errors. We only care that the previous cycle is
	            // done. Any error should have been handled in the previous update.
	        }
	        // Make sure the element has connected before updating.
	        if (!this._hasConnected) {
	            await new Promise((res) => this._hasConnectedResolver = res);
	        }
	        try {
	            const result = this.performUpdate();
	            // If `performUpdate` returns a Promise, we await it. This is done to
	            // enable coordinating updates with a scheduler. Note, the result is
	            // checked to avoid delaying an additional microtask unless we need to.
	            if (result != null) {
	                await result;
	            }
	        }
	        catch (e) {
	            reject(e);
	        }
	        resolve(!this._hasRequestedUpdate);
	    }
	    get _hasConnected() {
	        return (this._updateState & STATE_HAS_CONNECTED);
	    }
	    get _hasRequestedUpdate() {
	        return (this._updateState & STATE_UPDATE_REQUESTED);
	    }
	    get hasUpdated() {
	        return (this._updateState & STATE_HAS_UPDATED);
	    }
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
	    performUpdate() {
	        // Mixin instance properties once, if they exist.
	        if (this._instanceProperties) {
	            this._applyInstanceProperties();
	        }
	        let shouldUpdate = false;
	        const changedProperties = this._changedProperties;
	        try {
	            shouldUpdate = this.shouldUpdate(changedProperties);
	            if (shouldUpdate) {
	                this.update(changedProperties);
	            }
	        }
	        catch (e) {
	            // Prevent `firstUpdated` and `updated` from running when there's an
	            // update exception.
	            shouldUpdate = false;
	            throw e;
	        }
	        finally {
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
	    _markUpdated() {
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
	    get updateComplete() {
	        return this._getUpdateComplete();
	    }
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
	    _getUpdateComplete() {
	        return this._updatePromise;
	    }
	    /**
	     * Controls whether or not `update` should be called when the element requests
	     * an update. By default, this method always returns `true`, but this can be
	     * customized to control when to update.
	     *
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    shouldUpdate(_changedProperties) {
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
	    update(_changedProperties) {
	        if (this._reflectingProperties !== undefined &&
	            this._reflectingProperties.size > 0) {
	            // Use forEach so this works even if for/of loops are compiled to for
	            // loops expecting arrays
	            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
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
	    updated(_changedProperties) {
	    }
	    /**
	     * Invoked when the element is first updated. Implement to perform one time
	     * work on the element after update.
	     *
	     * Setting properties inside this method will trigger the element to update
	     * again after this update cycle completes.
	     *
	     * * @param _changedProperties Map of changed properties with old values
	     */
	    firstUpdated(_changedProperties) {
	    }
	}
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
	const standardProperty = (options, element) => {
	    // When decorating an accessor, pass it through and add property metadata.
	    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
	    // stomp over the user's accessor.
	    if (element.kind === 'method' && element.descriptor &&
	        !('value' in element.descriptor)) {
	        return Object.assign({}, element, { finisher(clazz) {
	                clazz.createProperty(element.key, options);
	            } });
	    }
	    else {
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
	            initializer() {
	                if (typeof element.initializer === 'function') {
	                    this[element.key] = element.initializer.call(this);
	                }
	            },
	            finisher(clazz) {
	                clazz.createProperty(element.key, options);
	            }
	        };
	    }
	};
	const legacyProperty = (options, proto, name) => {
	    proto.constructor
	        .createProperty(name, options);
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
	    return (protoOrDescriptor, name) => (name !== undefined) ?
	        legacyProperty(options, protoOrDescriptor, name) :
	        standardProperty(options, protoOrDescriptor);
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
	// IMPORTANT: do not change the property name or the assignment expression.
	// This line will be used in regexes to search for LitElement usage.
	// TODO(justinfagnani): inject version number at build time
	(window['litElementVersions'] || (window['litElementVersions'] = []))
	    .push('2.2.1');

	/* @license
	 * Copyright 2019 Google LLC. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the 'License');
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an 'AS IS' BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof undefined === "function") r = undefined(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	const EMPTY_ATTRIBUTE_RE = /([\w-]+)=\"\"/g;
	/**
	 * ExampleSnippet is a custom element that enables documentation authors to
	 * craft a single code snippet that is used for both human-readable
	 * documentation and running a live demo.
	 *
	 * An example usage looks like this:
	 *
	 * <div id="demo-container"></div>
	 * <example-snippet stamp-to="demo-container" highlight-as="html">
	 *   <template>
	 * <script>
	 *   console.log('This is how you log things to the console!');
	 * </script>
	 *   </template>
	 * </example-snippet>
	 *
	 * The above example will create a <pre><code></code></pre> inside of itself
	 * containing syntax-highlightable markup of the code in the template. It will
	 * also create the content of the template as DOM and insert it into the node
	 * indicated by the "stamp-to" attribute. The "stamp-to" attribute references
	 * another node by its ID.
	 *
	 * Add the "lazy" boolean attribute if you want to stamp the example manually
	 * by invoking its "stamp" method. Note that this will prevent the snippet from
	 * stamping itself automatically upon being connected to the DOM.
	 *
	 * ExampleSnippet is a simplified alternative to Polymer Project's DemoSnippet.
	 * The key differences are:
	 *
	 *  - ExampleSnippet does not use ShadowDOM by default
	 *  - ExampleSnippet supports stamping demos to elements other than itself
	 *
	 * @see https://github.com/PolymerElements/iron-demo-helpers/blob/master/demo-snippet.js
	 */
	class ExampleSnippet extends UpdatingElement {
	    constructor() {
	        super(...arguments);
	        this.useShadowRoot = false;
	        this.stampTo = null;
	        this.template = null;
	        this.highlightAs = 'markup';
	        this.lazy = false;
	        this.preserveWhitespace = false;
	        this.inertScript = false;
	        this.stamped = false;
	    }
	    stamp() {
	        if (this.template == null) {
	            return;
	        }
	        const root = this.getRootNode();
	        const stampTarget = this.stampTo == null ?
	            this :
	            root.getElementById(this.stampTo);
	        if (stampTarget != null) {
	            let parentNode;
	            if (this.useShadowRoot) {
	                if (stampTarget.shadowRoot == null) {
	                    stampTarget.attachShadow({ mode: 'open' });
	                }
	                parentNode = stampTarget.shadowRoot;
	            }
	            else {
	                parentNode = stampTarget;
	            }
	            const { template, highlightAs } = this;
	            const content = template.content.cloneNode(true);
	            if (this.inertScript) {
	                const scripts = Array.from(content.querySelectorAll('script'));
	                for (const script of scripts) {
	                    script.parentNode.removeChild(script);
	                }
	            }
	            parentNode.appendChild(content);
	            const pre = document.createElement('pre');
	            const code = document.createElement('code');
	            pre.appendChild(code);
	            let snippet = template.innerHTML;
	            snippet = snippet.replace('type="noexecute" ', '');
	            if (!this.preserveWhitespace) {
	                snippet = snippet.trim();
	            }
	            if (highlightAs === 'html') {
	                snippet = snippet.replace(EMPTY_ATTRIBUTE_RE, '$1');
	            }
	            const highlighted = Prism.highlight(snippet, Prism.languages[highlightAs], highlightAs);
	            code.innerHTML = highlighted;
	            this.appendChild(pre);
	        }
	    }
	    connectedCallback() {
	        super.connectedCallback && super.connectedCallback();
	        this.template = this.querySelector('template');
	    }
	    createRenderRoot() {
	        return this;
	    }
	    updated(changedProperties) {
	        super.updated(changedProperties);
	        if (!this.stamped && !this.lazy &&
	            (changedProperties.has('stamp-to') ||
	                changedProperties.has('template')) &&
	            this.template != null) {
	            this.stamp();
	        }
	    }
	}
	__decorate([
	    property({ type: Boolean, attribute: 'use-shadow-root' })
	], ExampleSnippet.prototype, "useShadowRoot", void 0);
	__decorate([
	    property({ type: String, attribute: 'stamp-to' })
	], ExampleSnippet.prototype, "stampTo", void 0);
	__decorate([
	    property({ type: Object })
	], ExampleSnippet.prototype, "template", void 0);
	__decorate([
	    property({ type: String, attribute: 'highlight-as' })
	], ExampleSnippet.prototype, "highlightAs", void 0);
	__decorate([
	    property({ type: Boolean, attribute: 'lazy' })
	], ExampleSnippet.prototype, "lazy", void 0);
	__decorate([
	    property({ type: Boolean })
	], ExampleSnippet.prototype, "preserveWhitespace", void 0);
	__decorate([
	    property({ type: Boolean, attribute: 'inert-script' })
	], ExampleSnippet.prototype, "inertScript", void 0);
	customElements.define('example-snippet', ExampleSnippet);

	exports.ExampleSnippet = ExampleSnippet;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
