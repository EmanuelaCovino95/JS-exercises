(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Mustache = factory());
}(this, (function () { 'use strict';

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.templateCache = {
      _cache: {},
      set: function set (key, value) {
        this._cache[key] = value;
      },
      get: function get (key) {
        return this._cache[key];
      },
      clear: function clear () {
        this._cache = {};
      }
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    if (typeof this.templateCache !== 'undefined') {
      this.templateCache.clear();
    }
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var isCacheEnabled = typeof cache !== 'undefined';
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `config` argument is given here, then it should be an
   * object with a `tags` attribute or an `escape` attribute or both.
   * If an array is passed, then it will be interpreted the same way as
   * a `tags` attribute on a `config` object.
   *
   * The `tags` attribute of a `config` object must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   *
   * The `escape` attribute of a `config` object must be a function which
   * accepts a string as input and outputs a safely escaped string.
   * If an `escape` function is not provided, then an HTML-safe string
   * escaping function is used as the default.
   */
  Writer.prototype.render = function render (template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, config);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context, config);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials, config);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate, config);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) {
    if (!partials) return;
    var tags = this.getConfigTags(config);

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context, config) {
    var escape = this.getConfigEscape(config) || mustache.escape;
    var value = context.lookup(token[1]);
    if (value != null)
      return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  Writer.prototype.getConfigTags = function getConfigTags (config) {
    if (isArray(config)) {
      return config;
    }
    else if (config && typeof config === 'object') {
      return config.tags;
    }
    else {
      return undefined;
    }
  };

  Writer.prototype.getConfigEscape = function getConfigEscape (config) {
    if (config && typeof config === 'object' && !isArray(config)) {
      return config.escape;
    }
    else {
      return undefined;
    }
  };

  var mustache = {
    name: 'mustache.js',
    version: '4.2.0',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache (cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache () {
      return defaultWriter.templateCache;
    }
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view`, `partials`, and `config`
   * using the default writer.
   */
  mustache.render = function render (template, view, partials, config) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, config);
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

})));

},{}],2:[function(require,module,exports){
const  Mustache  =  require ( 'mustache' );

function renderizzazione(richiesta) {
    //mustache renderizza blocchetto 1
    var template = document.getElementById("templateUtenti").innerHTML;
    var rendered = Mustache.render(template, richiesta);
    document.querySelector('div.utenteMemorizzato').innerHTML = rendered;
    bindEvents();
}

function settingIniziale () {
    document.querySelector('.prezzoArticoli').innerHTML = '&euro; 399,00';
    document.querySelector('.prezzoConsegna').innerHTML = '&euro; 0,00';
    document.querySelector('.prezzoTotale').innerHTML = '&euro; 399,00';
    document.querySelector('.stepDue .radioButton input').checked = true;
    document.querySelector('.stepDue .radioButton label span').classList.add('scelto');
    document.querySelector('.stepDue .inserireDatiPersonali').classList.add('segnaposto');
}

function bindEvents () {

    settingIniziale();

    document.querySelector('.colonnaDeiProdotti > span').addEventListener("click", () =>{
        document.querySelector('.divProdotto').style.display = 'block';
    })
    document.querySelector('.divProdotto span.logo').addEventListener("click", () =>{
        document.querySelector('.divProdotto').style.display = 'none';
    })
    
    for (let i=0; i < document.querySelectorAll('.stepUno .radioButton input').length; i++) {
        document.querySelectorAll('.stepUno .radioButton input')[i].addEventListener("click", ()=> {
            if (document.querySelectorAll('.stepUno .radioButton input')[i].checked) {
                document.querySelectorAll('.radioButton label span:first-child')[i].classList.add('scelto');
                for (let j=0; j<document.querySelectorAll('.stepUno .radioButton input').length; j++) {
                    if (j!==i) {
                        document.querySelectorAll('.radioButton label span:first-child')[j].classList.remove('scelto');
                    }
                }
            } 
        })
    }
    document.querySelector('.stepUno .continua').addEventListener("click", () => {
        document.querySelector('div.stepUno').classList.add('completato');
        document.querySelector('div.stepUno').style.display='none';

        if (document.querySelectorAll('.stepUno .radioButton input')[0].checked === true) {
            if(!(document.querySelector('div.stepDue').classList.contains('completato'))) {
                document.querySelector('div.stepDue').style.display='block';
                document.querySelector('div.stepN.due').classList.add('indicatore');
                document.querySelectorAll('.matitaModificaMobile')[2].classList.add('ricomparsa');
            } else if (!document.querySelector('div.stepTre').classList.contains('completato')) {
                document.querySelector('div.stepTre').style.display='block';
                document.querySelector('div.stepN.tre').classList.add('indicatore');
                document.querySelectorAll('.matitaModificaMobile')[3].classList.add('ricomparsa');
            }else if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
                document.querySelector('div.stepQuattro').style.display='block';
                document.querySelector('div.stepN.quattro').classList.add('indicatore');
                document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
            }else {
                document.querySelector('div.stepCinque').style.display='block';
                document.querySelector('div.stepN.cinque').classList.add('indicatore');
                document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
            }
            document.querySelector('.stepColumn:first-child').classList.remove('deselezionato');
            document.querySelector('.stepColumn:first-child').classList.add('selezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.remove('selezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.add('deselezionato');
            document.querySelector('div.stepN.uno').classList.remove('indicatore');
            document.querySelector('div.stepN.uno .modifica').style.display = 'block';
            document.querySelectorAll('.matitaModificaMobile')[0].classList.add('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[1].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[6].classList.remove('ricomparsa');
            document.querySelector('div.stepN.uno').style.opacity = '1';
        } else {
            document.querySelector('.stepColumn:first-child').classList.remove('selezionato');
            document.querySelector('.stepColumn:first-child').classList.add('deselezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.remove('deselezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.add('selezionato');
            document.querySelectorAll('div.stepN.uno')[1].style.opacity = '1';
            document.querySelectorAll('div.stepN.uno')[1].classList.remove('indicatore');
            document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'block';
            if(!(document.querySelectorAll('div.stepDue')[1].classList.contains('completato'))) {
                document.querySelectorAll('.stepDue')[1].classList.remove('deselezionato');
                document.querySelectorAll('.stepDue')[1].classList.add('selezionato'); 
                document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
            } else {
                document.querySelectorAll('div.stepTre')[1].classList.remove('deselezionato');
                document.querySelectorAll('div.stepTre')[1].classList.add('selezionato');
                document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
                document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'none';
            }
            document.querySelectorAll('.matitaModificaMobile')[0].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[1].classList.add('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[2].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[3].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[4].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[5].classList.remove('ricomparsa');
        }
    })

    document.querySelector('div.stepN.uno .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.uno').classList.add('indicatore');
        document.querySelector('div.stepUno').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'none';
        if(document.querySelector('div.stepDue').classList.contains('completato')) {
            document.querySelector('div.stepN.due .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepTre').classList.contains('completato')) {
            document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })

    document.querySelectorAll('div.stepN.uno .modifica')[1].addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.classList.contains('selezionato')) {
                item.classList.remove('selezionato');
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelectorAll('div.stepN.uno')[1].classList.add('indicatore');
        document.querySelector('div.stepUno').style.display='block';
        document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'none';
        if(document.querySelectorAll('div.stepDue')[1].classList.contains('completato')) {
            document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'block';
        }
        if(document.querySelectorAll('div.stepTre')[1].classList.contains('completato')) {
            document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'block';
        }
    })

    document.querySelectorAll('.matitaModificaMobile').forEach((step)=> {
        step.addEventListener("click", () => {
            document.querySelectorAll('div.step').forEach((item) => {
                if ((item.style.display === 'block')||(item.classList.contains('selezionato'))) {
                    item.style.display = 'none';
                    item.classList.remove('selezionato');
                }
            })
            document.querySelectorAll('div.stepN').forEach((item) => {
                if (item.classList.contains('indicatore')) {
                    item.classList.remove('indicatore');
                }
            })
            if ((step == document.querySelectorAll('.matitaModificaMobile')[0])||(step == document.querySelectorAll('.matitaModificaMobile')[1])) {
                document.querySelector('div.stepN.uno').classList.add('indicatore');
                document.querySelector('div.stepUno').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[2]) {
                document.querySelector('div.stepN.due').classList.add('indicatore');
                document.querySelector('div.stepDue').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[3]) {
                document.querySelector('div.stepN.tre').classList.add('indicatore');
                document.querySelector('div.stepTre').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[4]) {
                document.querySelector('div.stepN.quattro').classList.add('indicatore');
                document.querySelector('div.stepQuattro').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[5]) {
                document.querySelector('div.stepN.cinque').classList.add('indicatore');
                document.querySelector('div.stepCinque').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[6]) {
                document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
                document.querySelectorAll('div.stepDue')[1].style.display='block';
            }
        })
    })
    
    let nome;
    let cognome;
    let telefono;
    let citta;
    let indirizzo;
    let nCivico;
    let provincia;
    let cap;

    for (let i= 0; i < document.querySelectorAll('.stepDue:nth-child(9) .radioButton input').length; i++) {
        document.querySelectorAll('.stepDue:nth-child(9) .radioButton input')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepDue .inserireDatiPersonali')[i].classList.add('segnaposto');
            for (let j= 0; j < document.querySelectorAll('.stepDue:nth-child(9) .radioButton input').length; j++) {
                if (document.querySelectorAll('.stepDue:nth-child(9) .radioButton input')[j].checked === false) {
                    document.querySelectorAll('.stepDue .inserireDatiPersonali')[j].classList.remove('segnaposto');
                    document.querySelectorAll('.stepDue:nth-child(9) .radioButton label > span')[j].classList.remove('scelto');
                    document.querySelectorAll('.stepDue .inserireDatiPersonali')[j].style.display = 'none';
                }
            }
            if (document.querySelectorAll('.stepDue .radioButton input')[i].checked === true) {
                document.querySelectorAll('.stepDue .radioButton  label > span')[i].classList.add('scelto');
            }
            if (document.querySelector('.stepDue input#nuovoIndirizzo').checked === true) {
                document.querySelector('.stepDue .radioButton + form').style.display = 'block';
                document.querySelectorAll('.stepDue .datiUtente + form').forEach(item => item.style.display = 'none');
                document.querySelector('label[for="nuovoIndirizzo"] span').style.color = '#3c4043';
                document.querySelector('#nuovoIndirizzo + span').style.border = 'none';
            }
            nome = document.querySelector('.segnaposto input[name="nome"]').value;
            cognome = document.querySelector('.segnaposto input[name="cognome"]').value;
            telefono = document.querySelector('.segnaposto input[name="telefono"]').value;
            citta = document.querySelector('.segnaposto input[name="citta"]').value;
            indirizzo = document.querySelector('.segnaposto input[name="indirizzo"]').value;
            nCivico = document.querySelector('.segnaposto input[name="nCivico"]').value;
            provincia = document.querySelector('.segnaposto select[name="provincia"]').value;
            cap = document.querySelector('.segnaposto input[name="cap"]').value;
        })
    }

    for (let i=0; i < document.querySelectorAll('.bi-pencil').length; i++) {
        document.querySelectorAll('.bi-pencil')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepDue .inserireDatiPersonali')[i].style.display = 'block';
        })
    }
    for (let i=0; i < document.querySelectorAll('.bi-trash').length; i++) {
        document.querySelectorAll('.bi-trash')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepDue .datiUtente')[i].style.display = 'none';
            document.querySelectorAll('.stepDue .datiUtente + form')[i].style.display = 'none';
            document.querySelectorAll('.stepDue .inserireDatiPersonali')[i].classList.remove('segnaposto');
            document.querySelectorAll('.stepDue .radioButton label > span')[i].classList.remove('scelto');
        })
    }

    document.querySelector('.stepDue .continua').addEventListener("click", () => {
        for (j=0; j < document.querySelectorAll('.stepDue .inserireDatiPersonali').length; j++) {
            if (document.querySelectorAll('.stepDue .inserireDatiPersonali')[j].classList.contains('segnaposto')) {
                for (i = 0; i < document.querySelectorAll('.segnaposto *[required]').length; i++) {
                    if (!document.querySelectorAll('.segnaposto *[required]')[i].value) {
                        document.querySelectorAll('.segnaposto .errore')[i].style.display = 'block';
                        document.querySelectorAll('.segnaposto *[required]')[i].style.border = '1px solid #DD2727';
                    }
                }
                if (document.querySelector('.segnaposto input[name="nome"]').value !== '') {
                    if (document.querySelector('.segnaposto input[name="cognome"]').value !== '') {
                        if (document.querySelector('.segnaposto input[name="telefono"]').value !== '') {
                            if (document.querySelector('.segnaposto input[name="citta"]').value !== '') {
                                if (document.querySelector('.segnaposto input[name="indirizzo"]').value !== '') {
                                    if (document.querySelector('.segnaposto input[name="nCivico"]').value !== '') {
                                        if (document.querySelector('.segnaposto select[name="provincia"]').value !== '') {
                                            if (document.querySelector('.segnaposto input[name="cap"]').value !== '') {
                                                nome = document.querySelector('.segnaposto input[name="nome"]').value;
                                                cognome = document.querySelector('.segnaposto input[name="cognome"]').value;
                                                telefono = document.querySelector('.segnaposto input[name="telefono"]').value;
                                                citta = document.querySelector('.segnaposto input[name="citta"]').value;
                                                indirizzo = document.querySelector('.segnaposto input[name="indirizzo"]').value;
                                                nCivico = document.querySelector('.segnaposto input[name="nCivico"]').value;
                                                provincia = document.querySelector('.segnaposto select[name="provincia"]').value;
                                                cap = document.querySelector('.segnaposto input[name="cap"]').value;
                                                /* document.querySelector('.segnaposto').submit(); */
                                                /* document.querySelector('.segnaposto input[type="submit"]').dispatchEvent(new Event("click")); */
                                                document.querySelector('div.stepDue').classList.add('completato');
                                                document.querySelector('div.stepDue').style.display = 'none';
                                                if (!document.querySelector('div.stepTre').classList.contains('completato')) {
                                                    document.querySelector('div.stepTre').style.display = 'block';
                                                    document.querySelector('div.stepN.tre').classList.add('indicatore');
                                                } else if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
                                                    document.querySelector('div.stepQuattro').style.display = 'block';
                                                    document.querySelector('div.stepN.quattro').classList.add('indicatore');
                                                } else {
                                                    document.querySelector('div.stepCinque').style.display = 'block';
                                                    document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                                    document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
                                                }
                                                document.querySelector('div.stepN.due').classList.remove('indicatore');
                                                document.querySelector('div.stepN.due .modifica').style.display = 'block';
                                                document.querySelectorAll('.matitaModificaMobile')[2].classList.add('ricomparsa');
                                                document.querySelector('div.stepN.due').style.opacity = '1';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        document.querySelector('.nomeEcognome').innerHTML = nome + ' ' + cognome;
        document.querySelector('.indirizzo').innerHTML = indirizzo + ', ' + nCivico;
        document.querySelector('.citta').innerHTML = cap + ' ' + citta + ' (' + provincia + ')';
        document.querySelector('#nomeEcognome-0').value = nome + ' ' + cognome;
        document.querySelector('#ragioneSociale-0').value = nome + ' ' + cognome;
        document.querySelector('#cittadina-0').value = citta;
        document.querySelector('#via-0').value = indirizzo;
        document.querySelector('#civico-0').value = nCivico;
        document.querySelector('#prov-0').value = provincia;
        document.querySelector('#CAP-0').value = cap;
    })

    for (let i=0; i < document.querySelectorAll('.stepDue .inserireDatiPersonali *[required]').length; i++) {
        document.querySelectorAll('.stepDue .inserireDatiPersonali *[required]')[i].addEventListener("change", () => {
            document.querySelectorAll('.stepDue .inserireDatiPersonali .errore')[i].style.display = 'none';
            document.querySelectorAll('.stepDue .inserireDatiPersonali *[required]')[i].style.border = '1px solid #e0e1e5';
        })
    }

    document.querySelector('div.stepN.due .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.due').classList.add('indicatore');
        document.querySelector('div.stepDue').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'none';
        if(document.querySelector('div.stepTre').classList.contains('completato')) {
            document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })
    
    document.querySelector('#selezionareUnaProvincia').addEventListener("change", () => {
        for(i=0; i<document.querySelectorAll('#selezionareUnaProvincia option').length-1; i++) {
            if (document.querySelectorAll('#selezionareUnaProvincia option')[i+1].selected) {
                document.querySelectorAll('.itemContainer')[i].classList.remove('deselezionato');
                document.querySelectorAll('.itemContainer')[i].classList.add('selezionato');
            } else {
                document.querySelectorAll('.itemContainer')[i].classList.remove('selezionato');
                document.querySelectorAll('.itemContainer')[i].classList.add('deselezionato');
            }
        }
        document.querySelectorAll('.itemContainer input').forEach(input => input.checked = false);
    })
    
    document.querySelectorAll('.stepDue .continua')[1].addEventListener("click", () => {
        if (document.querySelector('#selezionareUnaProvincia').value !== '') {
            document.querySelectorAll('.itemContainer.selezionato input').forEach(input => {
                if (input.checked) {
                    document.querySelectorAll('div.stepDue')[1].classList.add('completato');
                    document.querySelectorAll('div.stepDue')[1].classList.remove('selezionato');
                    document.querySelectorAll('div.stepDue')[1].classList.add('deselezionato')
                    document.querySelectorAll('div.stepTre')[1].classList.remove('deselezionato');
                    document.querySelectorAll('div.stepTre')[1].classList.add('selezionato');
                    document.querySelectorAll('div.stepN.due')[1].classList.remove('indicatore');
                    document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
                    document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'block';
                    document.querySelectorAll('.matitaModificaMobile')[6].classList.add('ricomparsa');
                    document.querySelectorAll('div.stepN.due')[1].style.opacity = '1';
                    document.querySelector('.riepilogoInfo').innerHTML = document.querySelector('.segnaposto input[name="nome"]').value + ' ' + document.querySelector('.segnaposto input[name="cognome"]').value + ' - ' + document.querySelector('.segnaposto input[name="email"]').value;
                    document.querySelector('#recapito').placeholder = document.querySelector('.segnaposto input[name="telefono"]').value;
                }
            }) 
            
        }
    })

    document.querySelectorAll('div.stepN.due .modifica')[1].addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
            if (item.classList.contains('selezionato')) {
                item.classList.remove('selezionato');
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
        document.querySelectorAll('div.stepDue')[1].classList.remove('deselezionato');
        document.querySelectorAll('div.stepDue')[1].classList.add('selezionato');
        document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'none';
        if(document.querySelectorAll('div.stepTre')[1].classList.contains('completato')) {
            document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'block';
        }
    })

    for (let i=0; i<document.querySelectorAll('.stepTre .radioButton').length; i++) { 
        document.querySelectorAll('.stepTre .radioButton')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepTre .flexBox p')[i].classList.add('scelto');
            document.querySelectorAll('.stepTre .flexBox span')[i].classList.add('scelto');
            for (let j=0; j<document.querySelectorAll('.stepTre .radioButton').length; j++) { 
                if(document.querySelectorAll('.stepTre .radioButton input')[j].checked === false) {
                    document.querySelectorAll('.stepTre .flexBox p')[j].classList.remove('scelto');
                    document.querySelectorAll('.stepTre .flexBox span')[j].classList.remove('scelto');
                }
            }
            if (document.querySelectorAll('.stepTre .radioButton input')[1].checked === true) {
                document.querySelector('.prezzoConsegna').innerHTML = '&euro; 19,99';
                document.querySelector('.prezzoTotale').innerHTML = '&euro; 418,99';
            }
            if (document.querySelectorAll('.stepTre .radioButton input')[0].checked === true) {
                document.querySelector('.prezzoConsegna').innerHTML = '&euro; 0,00';
                document.querySelector('.prezzoTotale').innerHTML = '&euro; 399,00';
            }
        })
    }

    document.querySelector('.stepTre .continua').addEventListener("click", () => {
        document.querySelector('div.stepTre').classList.add('completato');
        document.querySelector('div.stepTre').style.display='none';
        if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepQuattro').style.display='block';
            document.querySelector('div.stepN.quattro').classList.add('indicatore');
        }else {
            document.querySelector('div.stepCinque').style.display='block';
            document.querySelector('div.stepN.cinque').classList.add('indicatore');
            document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
        }
        document.querySelector('div.stepN.tre').classList.remove('indicatore');
        document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        document.querySelectorAll('.matitaModificaMobile')[3].classList.add('ricomparsa');
        document.querySelector('div.stepN.tre').style.opacity = '1';
    })

    document.querySelectorAll('.stepTre .continua')[1].addEventListener("click", () => {
        document.querySelectorAll('div.stepN.tre')[1].classList.remove('indicatore');
        document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepTre')[1].classList.add('completato');
        document.querySelectorAll('.matitaModificaMobile')[6].classList.add('ricomparsa');
        document.querySelectorAll('div.stepN.tre')[1].style.opacity = '1';
    })
    
    document.querySelector('div.stepN.tre .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.tre').classList.add('indicatore');
        document.querySelector('div.stepTre').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'block';
        document.querySelector('div.stepN.tre .modifica').style.display = 'none';
        if(document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })
    
    document.querySelectorAll('div.stepN.tre .modifica')[1].addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
            if (item.classList.contains('selezionato')) {
                item.classList.remove('selezionato');
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
        document.querySelectorAll('div.stepTre')[1].classList.remove('deselezionato');
        document.querySelectorAll('div.stepTre')[1].classList.add('selezionato');
        document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'none';
    })

    document.querySelector('.alert span').addEventListener("click", ()=> {
        document.querySelector('.opzioneDefault').style.display = 'none';
        document.querySelector('.selezionaOpzioniParticolari').style.display = 'block';
    })

    for (let i=0; i<document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input').length; i++) {
        document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[i].addEventListener("click", ()=>{
            document.querySelector('.selezionaOpzioniParticolari > .radioButton  .checkmark').style.border = "none";
            document.querySelector('.selezionaOpzioniParticolari > .radioButton  label span').classList.remove('segnalazione');
            document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  label span')[i].classList.add('scelto');
            for (let j=0; j<document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input').length; j++) {
                if(document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[j].checked === false) {
                    document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  label span')[j].classList.remove('scelto');
                }
            }
            if (document.querySelector('.selezionaOpzioniParticolari > .radioButton  input').checked === true) {
                document.querySelectorAll('.datiFatturazione')[1].style.display='none';
                document.querySelector('.datiFatturazione').style.display='block';
            }
            if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[1].checked === true) {
                document.querySelector('.datiFatturazione').style.display='none';
                document.querySelectorAll('.datiFatturazione')[1].style.display='block';
            }
        })
    }

    for (let i=0; i<document.querySelectorAll('.tipoDiCliente input').length;i++) {
        document.querySelectorAll('.tipoDiCliente input')[i].addEventListener('click', ()=>{
            if (document.querySelector('.tipoDiCliente input').checked===true) {
                document.querySelector('.pIva').style.display='none';
                document.querySelector('.ragioneSociale').style.display='none';
                document.querySelector('.codiceFiscale').style.display='block';
                document.querySelector('.nomeCognome').style.display='block';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            } else  {
                document.querySelector('.pIva').style.display='block';
                document.querySelector('.ragioneSociale').style.display='block';
                document.querySelector('.codiceFiscale').style.display='none';
                document.querySelector('.nomeCognome').style.display='none';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            }
            if (document.querySelectorAll('.tipoDiCliente input')[2].checked===true) {
                document.querySelectorAll('.pIva')[1].style.display='none';
                document.querySelectorAll('.ragioneSociale')[1].style.display='none';
                document.querySelectorAll('.codiceFiscale')[1].style.display='block';
                document.querySelectorAll('.nomeCognome')[1].style.display='block';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            } else {
                document.querySelectorAll('.pIva')[1].style.display='block';
                document.querySelectorAll('.ragioneSociale')[1].style.display='block';
                document.querySelectorAll('.codiceFiscale')[1].style.display='none';
                document.querySelectorAll('.nomeCognome')[1].style.display='none';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            }
            document.querySelectorAll('.tipoDiCliente label span')[i].classList.add('scelto');
            for (j=0; j < 2 ; j++) {
                if (document.querySelectorAll('.tipoDiCliente input')[j].checked === false) {
                    document.querySelectorAll('.tipoDiCliente label span')[j].classList.remove('scelto');
                }
            }
            for (j=2; j < 4 ; j++) {
                if (document.querySelectorAll('.tipoDiCliente input')[j].checked === false) {
                    document.querySelectorAll('.tipoDiCliente label span')[j].classList.remove('scelto');
                }
            }
        })
    }

    for (let i=0; i<document.querySelectorAll('.doveInviareLaFattura input[type="radio"]').length; i++) { 
        document.querySelectorAll('.doveInviareLaFattura input[type="radio"]')[i].addEventListener("click", () => {
            document.querySelectorAll('.doveInviareLaFattura label span')[i].classList.add('scelto');
            for (let j=0; j<document.querySelectorAll('.doveInviareLaFattura input[type="radio"]').length; j++) { 
                if(document.querySelectorAll('.doveInviareLaFattura input[type="radio"]')[j].checked === false) {
                    document.querySelectorAll('.doveInviareLaFattura label span')[j].classList.remove('scelto');
                }
            }
        })
    }

    document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[2].addEventListener("click", ()=> {
        document.querySelector('.datiFatturazione').style.display='none';
        document.querySelectorAll('.datiFatturazione')[1].style.display='none';
    })

    document.querySelector('.stepQuattro .continua').addEventListener("click", () => {
        if (document.querySelector('.selezionaOpzioniParticolari').style.display === 'block') {
            if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[0].checked === false) {
                if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[1].checked === false) {
                    if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[2].checked === false) {
                        document.querySelector('.selezionaOpzioniParticolari > .radioButton  label span').classList.add('segnalazione');
                        document.querySelector('.selezionaOpzioniParticolari > .radioButton  .checkmark').style.border = "1px solid #DD2727";
                    }
                }
            }
            
        }
        if ((document.querySelector('.selezionaOpzioniParticolari').style.display !== 'block')||(document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[2].checked === true)) {
            document.querySelector('div.stepQuattro').classList.add('completato');
            document.querySelector('div.stepQuattro').style.display='none';
            document.querySelector('div.stepCinque').style.display='block';
            document.querySelector('div.stepN.quattro').classList.remove('indicatore');
            document.querySelector('div.stepN.cinque').classList.add('indicatore');
            document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
            document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
            document.querySelector('div.stepN.quattro').style.opacity = '1';
        }
        if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[0].checked === true) {
            for (i = 0; i < (document.querySelectorAll('.datiFatturazione form input[required]').length /2); i++) {
                if (!document.querySelectorAll('.datiFatturazione form input[required]')[i].value) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'block';
                    document.querySelectorAll('.datiFatturazione form input')[i].style.border = '1px solid #DD2727';
                }
            }
            if (((document.querySelector('#codiceFiscale-0').value !== '')&&(document.querySelectorAll('.pIva')[0].style.display !== 'block'))||((document.querySelector('#pIva-0').value !== '')&&(document.querySelectorAll('.codiceFiscale')[0].style.display !== 'block'))) {
                if (((document.querySelector('#nomeEcognome-0').value !== '')&&(document.querySelectorAll('.ragioneSociale')[0].style.display !== 'block'))||((document.querySelector('#ragioneSociale-0').value !== '')&&(document.querySelectorAll('.nomeCognome')[0].style.display !== 'block'))) {
                    if (document.querySelector('#cittadina-0').value !== '') {
                        if (document.querySelector('#via-0').value !== '') {
                            if (document.querySelector('#civico-0').value !== '') {
                                if (document.querySelector('#prov-0').value !== '') {
                                    if (document.querySelector('#CAP-0').value !== '') {
                                        document.querySelector('div.stepQuattro').classList.add('completato');
                                        document.querySelector('div.stepQuattro').style.display = 'none';
                                        document.querySelector('div.stepCinque').style.display = 'block';
                                        document.querySelector('div.stepN.quattro').classList.remove('indicatore');
                                        document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
                                        document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
                                        document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
                                        document.querySelector('div.stepN.quattro').style.opacity = '1';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[1].checked === true) {
            for (i = document.querySelectorAll('.datiFatturazione form input[required]').length /2; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                if (!document.querySelectorAll('.datiFatturazione form input[required]')[i].value) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'block';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #DD2727';
                }
            }
            
            if (((document.querySelector('#codiceFiscale-1').value !== '')&&(document.querySelectorAll('.pIva')[1].style.display !== 'block'))||((document.querySelector('#pIva-1').value !== '')&&(document.querySelectorAll('.codiceFiscale')[1].style.display !== 'block'))) {
                if (((document.querySelector('#nomeEcognome-1').value !== '')&&(document.querySelectorAll('.ragioneSociale')[1].style.display !== 'block'))||((document.querySelector('#ragioneSociale-1').value !== '')&&(document.querySelectorAll('.nomeCognome')[1].style.display !== 'block'))) {
                    if (document.querySelector('#cittadina-1').value !== '') {
                        if (document.querySelector('#via-1').value !== '') {
                            if (document.querySelector('#civico-1').value !== '') {
                                if (document.querySelector('#prov-1').value !== '') {
                                    if (document.querySelector('#CAP-1').value !== '') {
                                        document.querySelector('div.stepQuattro').classList.add('completato');
                                        document.querySelector('div.stepQuattro').style.display='none';
                                        document.querySelector('div.stepCinque').style.display='block';
                                        document.querySelector('div.stepN.quattro').classList.remove('indicatore');
                                        document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
                                        document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
                                        document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
                                        document.querySelector('div.stepN.quattro').style.opacity = '1';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
        document.querySelectorAll('.datiFatturazione form input[required]')[i].addEventListener("change", () => {
            document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
            document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
        })
    }
    
    document.querySelector('div.stepN.quattro .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.quattro').classList.add('indicatore');
        document.querySelector('div.stepQuattro').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'block';
        document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        document.querySelector('div.stepN.quattro .modifica').style.display = 'none';
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })

    for (let i=0; i<document.querySelectorAll('.pagamento > div').length; i++) { 
        document.querySelectorAll('.pagamento > div')[i].addEventListener("click", () => {
            document.querySelectorAll('.pagamento input')[i].checked = true;
            document.querySelectorAll('.pagamento span')[i].classList.add('scelto');
            document.querySelectorAll('.pagamento > div')[i].classList.add('bordoBlu');
            document.querySelector('.pagamento + p').style.visibility='hidden';
            for (let j=0; j<document.querySelectorAll('.pagamento > div').length; j++) { 
                if(document.querySelectorAll('.pagamento input')[j].checked === false) {
                    document.querySelectorAll('.pagamento span')[j].classList.remove('scelto');
                    document.querySelectorAll('.pagamento > div')[j].classList.remove('bordoBlu');
                }
            }
        })
    }
    document.querySelector('.accettaCondizioni input').addEventListener("click", () => {
        if (document.querySelector('.accettaCondizioni input').checked === true) {
            document.querySelector('.accettaCondizioni label span:first-child').classList.add('scelto');
            document.querySelector('.accettaCondizioni label span:last-child').classList.add('grassetto');
            document.querySelector('.accettaCondizioni + p').style.visibility='hidden';
        } else {
            document.querySelector('div.stepCinque label span:first-child').classList.remove('scelto');
            document.querySelector('div.stepCinque label span:last-child').classList.remove('grassetto');
            document.querySelector('.stepCinque .radioButton + p').style.visibility='visible';
        }
    })
    
    document.querySelector('.accettaCondizioni label span:last-child').addEventListener("click", () => {
        document.querySelector('.condizioniGeneraliDiVendita').style.display = 'flex';
    })
    document.querySelector('.close').addEventListener("click", () => {
        document.querySelector('.condizioniGeneraliDiVendita').style.display = 'none';
    })

    document.querySelector('.stepCinque .continua').addEventListener("click", () => {
        if (((document.querySelectorAll('.pagamento input')[0].checked === true)||(document.querySelectorAll('.pagamento input')[1].checked === true))&&(document.querySelector('.stepCinque input[type="checkbox"]').checked)) {
            document.querySelector('div.stepN.cinque').classList.remove('indicatore');
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
            document.querySelectorAll('.matitaModificaMobile')[5].classList.add('ricomparsa');
            document.querySelector('div.stepN.cinque').style.opacity = '1';
        }
        if ((document.querySelectorAll('.pagamento input')[0].checked === false)&&(document.querySelectorAll('.pagamento input')[1].checked === false)) {
            document.querySelector('.pagamento + p').style.visibility='visible';
        }
        if (document.querySelector('.accettaCondizioni input').checked === false) {
            document.querySelector('.accettaCondizioni + p').style.visibility='visible';
        }
    })
    
    document.querySelector('div.stepN.cinque .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepCinque').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'block';
        document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
        document.querySelector('div.stepN.cinque').classList.add('indicatore');
    })
}


function chiamataAjax() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "src/json/utenti.json", true);
    xhttp.onload = function() {
        var lista = JSON.parse(xhttp.responseText);
        renderizzazione(lista);
    }
    xhttp.send();
}

function inizializzazione() {
    chiamataAjax();
}

inizializzazione();
},{"mustache":1}]},{},[2]);
