"use strict";
var LoverryPlayer = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // ../../packages/engine/dist/types.js
  var require_types = __commonJS({
    "../../packages/engine/dist/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // ../../packages/expressions/dist/token.js
  var require_token = __commonJS({
    "../../packages/expressions/dist/token.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TokenType = void 0;
      exports.TokenType = {
        Identifier: "Identifier",
        Number: "Number",
        Boolean: "Boolean",
        String: "String",
        Equals: "==",
        NotEquals: "!=",
        MoreThan: ">",
        LessThan: "<",
        MoreOrEquals: ">=",
        LessOrEquals: "<=",
        And: "and",
        Or: "or",
        Not: "not",
        LeftParen: "(",
        RightParen: ")",
        Eof: "EOF"
      };
    }
  });

  // ../../packages/expressions/dist/lexer.js
  var require_lexer = __commonJS({
    "../../packages/expressions/dist/lexer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Lexer = void 0;
      var token_1 = require_token();
      var Lexer = class {
        constructor(input) {
          __publicField(this, "_input");
          __publicField(this, "_current_char", null);
          __publicField(this, "_position", 0);
          this._input = input;
          this._current_char = (input.length > 0 ? input[0] : null) || null;
        }
        execute() {
          const tokens = [];
          let token = this.nextToken();
          while (token.type !== token_1.TokenType.Eof) {
            tokens.push(token);
            token = this.nextToken();
          }
          tokens.push(token);
          return tokens;
        }
        advance() {
          this._position++;
          const char = (() => {
            if (this._position < this._input.length) {
              return this._input[this._position] || null;
            }
            return null;
          })();
          this._current_char = char;
          return char;
        }
        getCurrentChar() {
          const peekPosition = this._position + 1;
          const peek = (() => {
            if (peekPosition < this._input.length) {
              return this._input[peekPosition] || null;
            }
            return null;
          })();
          return peek;
        }
        skipWhitespace() {
          while (this._current_char && /\s/.test(this._current_char)) {
            this.advance();
          }
        }
        readIdentifier() {
          let result = "";
          while (this._current_char && /[a-zA-Z_][a-zA-Z0-9_]*/.test(this._current_char)) {
            result += this._current_char;
            this.advance();
          }
          return result;
        }
        readNumber() {
          let result = "";
          while (this._current_char && /[0-9.]/.test(this._current_char)) {
            result += this._current_char;
            this.advance();
          }
          return result;
        }
        readString() {
          const quote = this._current_char;
          this.advance();
          let result = "";
          while (this._current_char && this._current_char !== quote) {
            if (this._current_char === "\\") {
              const escaped = this.advance();
              if (escaped === quote) {
                result += quote;
              } else if (escaped === "n") {
                result += "\n";
              } else if (escaped === "t") {
                result += "	";
              } else if (escaped) {
                result += escaped;
              }
            } else {
              result += this._current_char;
            }
            this.advance();
          }
          this.advance();
          return result;
        }
        nextToken() {
          this.skipWhitespace();
          if (this._current_char === null) {
            return { type: token_1.TokenType.Eof, value: "", position: this._position };
          }
          const startPos = this._position;
          switch (this._current_char) {
            case "(":
              this.advance();
              return { type: token_1.TokenType.LeftParen, value: "(", position: startPos };
            case ")":
              this.advance();
              return { type: token_1.TokenType.RightParen, value: ")", position: startPos };
            case "=":
              if (this.getCurrentChar() === "=") {
                this.advance();
                this.advance();
                return { type: token_1.TokenType.Equals, value: "==", position: startPos };
              }
              throw new Error(`Unexpected character '=' at position ${startPos}`);
            case "!":
              if (this.getCurrentChar() === "=") {
                this.advance();
                this.advance();
                return { type: token_1.TokenType.NotEquals, value: "!=", position: startPos };
              }
              throw new Error(`Unexpected character '!' at position ${startPos}`);
            case ">":
              if (this.getCurrentChar() === "=") {
                this.advance();
                this.advance();
                return {
                  type: token_1.TokenType.MoreOrEquals,
                  value: ">=",
                  position: startPos
                };
              }
              this.advance();
              return { type: token_1.TokenType.MoreThan, value: ">", position: startPos };
            case "<":
              if (this.getCurrentChar() === "=") {
                this.advance();
                this.advance();
                return {
                  type: token_1.TokenType.LessOrEquals,
                  value: "<=",
                  position: startPos
                };
              }
              this.advance();
              return { type: token_1.TokenType.LessThan, value: "<", position: startPos };
          }
          if (/[0-9]/.test(this._current_char)) {
            const value = this.readNumber();
            return { type: token_1.TokenType.Number, value, position: startPos };
          }
          if (this._current_char === '"' || this._current_char === "'") {
            const value = this.readString();
            return { type: token_1.TokenType.String, value, position: startPos };
          }
          if (/[a-zA-Z_]/.test(this._current_char)) {
            const ident = this.readIdentifier();
            if (ident === "true" || ident === "false") {
              return { type: token_1.TokenType.Boolean, value: ident, position: startPos };
            }
            switch (ident) {
              case "and":
                return { type: token_1.TokenType.And, value: ident, position: startPos };
              case "or":
                return { type: token_1.TokenType.Or, value: ident, position: startPos };
              case "not":
                return { type: token_1.TokenType.Not, value: ident, position: startPos };
              default:
                return {
                  type: token_1.TokenType.Identifier,
                  value: ident,
                  position: startPos
                };
            }
          }
          throw new Error(`Unexpected character '${this._current_char}' at position ${startPos}`);
        }
      };
      exports.Lexer = Lexer;
    }
  });

  // ../../packages/expressions/dist/parser.js
  var require_parser = __commonJS({
    "../../packages/expressions/dist/parser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Parser = void 0;
      var token_1 = require_token();
      var lexer_1 = require_lexer();
      var _Parser = class _Parser {
        constructor(tokens) {
          __publicField(this, "_tokens");
          __publicField(this, "_current", 0);
          this._tokens = tokens;
        }
        static execute(input) {
          const lexer = new lexer_1.Lexer(input);
          const tokens = lexer.execute();
          const parser = new _Parser(tokens);
          return parser.execute();
        }
        execute() {
          const expression = this.parseExpression(0);
          const token = this.getToken();
          if (token.type !== token_1.TokenType.Eof) {
            throw new Error(`Unexpected token after expression: ${token.type}`);
          }
          return expression;
        }
        getToken() {
          const token = this._tokens[this._current];
          if (!token) {
            throw new Error("Token is not defined");
          }
          return token;
        }
        consume(type) {
          const token = this.getToken();
          if (type && token.type !== type) {
            throw new Error(`Expected ${type}, got ${token.type} at position ${token.position}`);
          }
          this._current++;
          return token;
        }
        getPrecedence(type) {
          return _Parser._precedence.get(type) ?? 0;
        }
        parseLiteral() {
          const token = this.consume();
          let value = token.value;
          if (token.type === token_1.TokenType.Number) {
            value = parseFloat(token.value);
          } else if (token.type === token_1.TokenType.Boolean) {
            value = token.value === "true";
          } else if (token.type === token_1.TokenType.String) {
          } else {
            throw new Error(`Unexpected token for literal: ${token.type}`);
          }
          const expression = {
            type: "literal",
            value
          };
          return expression;
        }
        parseVariable() {
          const token = this.consume(token_1.TokenType.Identifier);
          const expression = {
            type: "variable_reference",
            variable: token.value
          };
          return expression;
        }
        parseGrouped() {
          this.consume(token_1.TokenType.LeftParen);
          const expression = this.parseExpression(0);
          this.consume(token_1.TokenType.RightParen);
          return expression;
        }
        parsePrefixNot() {
          const precedence = this.getPrecedence(token_1.TokenType.Not);
          const operand = this.parseExpression(precedence);
          const expression = {
            type: "unary",
            operator: "not",
            operand
          };
          return expression;
        }
        parseBinary(left, precedence, opType) {
          const right = this.parseExpression(precedence);
          let operator;
          switch (opType) {
            case token_1.TokenType.Equals:
              operator = "==";
              break;
            case token_1.TokenType.NotEquals:
              operator = "!=";
              break;
            case token_1.TokenType.MoreThan:
              operator = ">";
              break;
            case token_1.TokenType.LessThan:
              operator = "<";
              break;
            case token_1.TokenType.MoreOrEquals:
              operator = ">=";
              break;
            case token_1.TokenType.LessOrEquals:
              operator = "<=";
              break;
            case token_1.TokenType.And:
              operator = "and";
              break;
            case token_1.TokenType.Or:
              operator = "or";
              break;
            default:
              throw new Error(`Unknown binary operator ${opType}`);
          }
          const expression = {
            type: "binary",
            operator,
            left,
            right
          };
          return expression;
        }
        parseExpression(minPrecedence) {
          let left;
          const token = this.getToken();
          switch (token.type) {
            case token_1.TokenType.Number:
            case token_1.TokenType.Boolean:
            case token_1.TokenType.String:
              left = this.parseLiteral();
              break;
            case token_1.TokenType.Identifier:
              left = this.parseVariable();
              break;
            case token_1.TokenType.LeftParen:
              left = this.parseGrouped();
              break;
            case token_1.TokenType.Not:
              left = this.parsePrefixNot();
              break;
            default:
              throw new Error(`Unexpected token at start of expression: ${token.type}`);
          }
          while (true) {
            const nextToken = this.getToken();
            if (nextToken.type === token_1.TokenType.Eof) {
              break;
            }
            const precedence = this.getPrecedence(nextToken.type);
            if (precedence < minPrecedence) {
              break;
            }
            switch (nextToken.type) {
              case token_1.TokenType.Equals:
              case token_1.TokenType.NotEquals:
              case token_1.TokenType.MoreThan:
              case token_1.TokenType.LessThan:
              case token_1.TokenType.MoreOrEquals:
              case token_1.TokenType.LessOrEquals:
              case token_1.TokenType.And:
              case token_1.TokenType.Or:
                left = this.parseBinary(left, precedence, nextToken.type);
                break;
              default:
                return left;
            }
          }
          return left;
        }
      };
      __publicField(_Parser, "_precedence", /* @__PURE__ */ new Map([
        [token_1.TokenType.Or, 10],
        [token_1.TokenType.And, 20],
        [token_1.TokenType.Equals, 30],
        [token_1.TokenType.NotEquals, 30],
        [token_1.TokenType.MoreThan, 40],
        [token_1.TokenType.LessThan, 40],
        [token_1.TokenType.MoreOrEquals, 40],
        [token_1.TokenType.LessOrEquals, 40],
        [token_1.TokenType.Not, 50]
      ]));
      var Parser = _Parser;
      exports.Parser = Parser;
    }
  });

  // ../../packages/expressions/dist/index.js
  var require_dist = __commonJS({
    "../../packages/expressions/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseExpression = parseExpression;
      var parser_1 = require_parser();
      function parseExpression(input) {
        return parser_1.Parser.execute(input);
      }
      __exportStar(require_lexer(), exports);
      __exportStar(require_parser(), exports);
      __exportStar(require_token(), exports);
    }
  });

  // ../../packages/engine/dist/expression-evaluator.js
  var require_expression_evaluator = __commonJS({
    "../../packages/engine/dist/expression-evaluator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ExpressionEvaluator = void 0;
      var expressions_1 = require_dist();
      var _ExpressionEvaluator = class _ExpressionEvaluator {
        constructor(dependencies) {
          __publicField(this, "dependencies");
          this.dependencies = dependencies;
        }
        execute(expression) {
          return this[expression.type](expression);
        }
        literal(expression) {
          const literalExpression = this.resolveExpression({
            expression,
            type: "literal"
          });
          return literalExpression.value;
        }
        variable_reference(expression) {
          const variableReferenceExpression = this.resolveExpression({
            expression,
            type: "variable_reference"
          });
          const value = this.dependencies.gameStateMap.get(variableReferenceExpression.variable);
          if (!value) {
            return false;
          }
          return value;
        }
        binary(expression) {
          const binaryExpression = this.resolveExpression({
            expression,
            type: "binary"
          });
          const left = this.execute(binaryExpression.left);
          const right = this.execute(binaryExpression.right);
          return _ExpressionEvaluator.BINARY_OPERATORS[binaryExpression.operator](left, right);
        }
        unary(expression) {
          const unaryExpression = this.resolveExpression({
            expression,
            type: "unary"
          });
          return _ExpressionEvaluator.UNARY_OPERATOR[unaryExpression.operator](this, unaryExpression.operand);
        }
        parseCondition(condition) {
          try {
            return expressions_1.Parser.execute(condition);
          } catch {
            return null;
          }
        }
        resolveExpression(options) {
          if (options.expression.type !== options.type) {
            throw new Error(`incompatibility of expressions type, expected ${options.type}, recieved ${options.expression.type}`);
          }
          return options.expression;
        }
      };
      __publicField(_ExpressionEvaluator, "BINARY_OPERATORS", {
        "==": (l, r) => l === r,
        "!=": (l, r) => l !== r,
        ">": (l, r) => l > r,
        "<": (l, r) => l < r,
        ">=": (l, r) => l >= r,
        "<=": (l, r) => l <= r,
        and: (l, r) => !!l && !!r,
        or: (l, r) => !!l || !!r
      });
      __publicField(_ExpressionEvaluator, "UNARY_OPERATOR", {
        not: (thisArgument, operand) => !thisArgument.execute(operand)
      });
      var ExpressionEvaluator = _ExpressionEvaluator;
      exports.ExpressionEvaluator = ExpressionEvaluator;
    }
  });

  // ../../packages/engine/dist/game-state.js
  var require_game_state = __commonJS({
    "../../packages/engine/dist/game-state.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GameState = void 0;
      var expression_evaluator_1 = require_expression_evaluator();
      var GameState2 = class {
        constructor(initialState = /* @__PURE__ */ new Map()) {
          __publicField(this, "_variables", /* @__PURE__ */ new Map());
          __publicField(this, "_listeners", []);
          this._variables = initialState;
        }
        get variables() {
          return this._variables;
        }
        get(key) {
          return this._variables.get(key);
        }
        set(key, value) {
          const oldValue = this._variables.get(key);
          if (oldValue === value) {
            return;
          }
          this._variables.set(key, value);
          this.notifyChanges([{ variable: key, oldValue, newValue: value }]);
        }
        applyEffects(effects) {
          const changes = [];
          for (const effect of effects) {
            const oldValue = this._variables.get(effect.variable);
            let newValue = oldValue ?? 0;
            const rhs = effect.value;
            switch (effect.operator) {
              case "=":
                newValue = rhs;
                break;
              case "+=":
                newValue = (Number(oldValue) || 0) + Number(rhs);
                break;
              case "-=":
                newValue = (Number(oldValue) || 0) - Number(rhs);
                break;
            }
            if (newValue !== oldValue) {
              this._variables.set(effect.variable, newValue);
              changes.push({ variable: effect.variable, oldValue, newValue });
            }
          }
          if (changes.length) {
            this.notifyChanges(changes);
          }
        }
        evaluateCondition(condition) {
          if (!condition) {
            return true;
          }
          const result = new expression_evaluator_1.ExpressionEvaluator({
            gameStateMap: this._variables
          }).execute(condition);
          return !!result;
        }
        onStateChanged(callback) {
          this._listeners.push(callback);
        }
        notifyChanges(changes) {
          for (const listener of this._listeners) {
            listener(changes);
          }
        }
      };
      exports.GameState = GameState2;
    }
  });

  // ../../node_modules/.pnpm/lz-string@1.5.0/node_modules/lz-string/libs/lz-string.js
  var require_lz_string = __commonJS({
    "../../node_modules/.pnpm/lz-string@1.5.0/node_modules/lz-string/libs/lz-string.js"(exports, module) {
      var LZString = function() {
        var f = String.fromCharCode;
        var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
        var baseReverseDic = {};
        function getBaseValue(alphabet, character) {
          if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
              baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
          }
          return baseReverseDic[alphabet][character];
        }
        var LZString2 = {
          compressToBase64: function(input) {
            if (input == null) return "";
            var res = LZString2._compress(input, 6, function(a) {
              return keyStrBase64.charAt(a);
            });
            switch (res.length % 4) {
              default:
              case 0:
                return res;
              case 1:
                return res + "===";
              case 2:
                return res + "==";
              case 3:
                return res + "=";
            }
          },
          decompressFromBase64: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            return LZString2._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrBase64, input.charAt(index));
            });
          },
          compressToUTF16: function(input) {
            if (input == null) return "";
            return LZString2._compress(input, 15, function(a) {
              return f(a + 32);
            }) + " ";
          },
          decompressFromUTF16: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString2._decompress(compressed.length, 16384, function(index) {
              return compressed.charCodeAt(index) - 32;
            });
          },
          //compress into uint8array (UCS-2 big endian format)
          compressToUint8Array: function(uncompressed) {
            var compressed = LZString2.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2);
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
              var current_value = compressed.charCodeAt(i);
              buf[i * 2] = current_value >>> 8;
              buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
          },
          //decompress from uint8array (UCS-2 big endian format)
          decompressFromUint8Array: function(compressed) {
            if (compressed === null || compressed === void 0) {
              return LZString2.decompress(compressed);
            } else {
              var buf = new Array(compressed.length / 2);
              for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
              }
              var result = [];
              buf.forEach(function(c) {
                result.push(f(c));
              });
              return LZString2.decompress(result.join(""));
            }
          },
          //compress into a string that is already URI encoded
          compressToEncodedURIComponent: function(input) {
            if (input == null) return "";
            return LZString2._compress(input, 6, function(a) {
              return keyStrUriSafe.charAt(a);
            });
          },
          //decompress from an output of compressToEncodedURIComponent
          decompressFromEncodedURIComponent: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            input = input.replace(/ /g, "+");
            return LZString2._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrUriSafe, input.charAt(index));
            });
          },
          compress: function(uncompressed) {
            return LZString2._compress(uncompressed, 16, function(a) {
              return f(a);
            });
          },
          _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null) return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
              context_c = uncompressed.charAt(ii);
              if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
              }
              context_wc = context_w + context_c;
              if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
              } else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                  if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = value >> 1;
                    }
                  } else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1 | value;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = value >> 1;
                    }
                  }
                  context_enlargeIn--;
                  if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                  }
                  delete context_dictionaryToCreate[context_w];
                } else {
                  value = context_dictionary[context_w];
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
              }
            }
            if (context_w !== "") {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                } else {
                  value = 1;
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
            }
            value = 2;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
            while (true) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                break;
              } else context_data_position++;
            }
            return context_data.join("");
          },
          decompress: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString2._decompress(compressed.length, 32768, function(index) {
              return compressed.charCodeAt(index);
            });
          },
          _decompress: function(length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
              dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            switch (next = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                c = f(bits);
                break;
              case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                c = f(bits);
                break;
              case 2:
                return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
              if (data.index > length) {
                return "";
              }
              bits = 0;
              maxpower = Math.pow(2, numBits);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              switch (c = bits) {
                case 0:
                  bits = 0;
                  maxpower = Math.pow(2, 8);
                  power = 1;
                  while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                      data.position = resetValue;
                      data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                  }
                  dictionary[dictSize++] = f(bits);
                  c = dictSize - 1;
                  enlargeIn--;
                  break;
                case 1:
                  bits = 0;
                  maxpower = Math.pow(2, 16);
                  power = 1;
                  while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                      data.position = resetValue;
                      data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                  }
                  dictionary[dictSize++] = f(bits);
                  c = dictSize - 1;
                  enlargeIn--;
                  break;
                case 2:
                  return result.join("");
              }
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
              if (dictionary[c]) {
                entry = dictionary[c];
              } else {
                if (c === dictSize) {
                  entry = w + w.charAt(0);
                } else {
                  return null;
                }
              }
              result.push(entry);
              dictionary[dictSize++] = w + entry.charAt(0);
              enlargeIn--;
              w = entry;
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
            }
          }
        };
        return LZString2;
      }();
      if (typeof define === "function" && define.amd) {
        define(function() {
          return LZString;
        });
      } else if (typeof module !== "undefined" && module != null) {
        module.exports = LZString;
      } else if (typeof angular !== "undefined" && angular != null) {
        angular.module("LZString", []).factory("LZString", function() {
          return LZString;
        });
      }
    }
  });

  // ../../packages/engine/dist/scene-loader.js
  var require_scene_loader = __commonJS({
    "../../packages/engine/dist/scene-loader.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SingleJsonSceneLoader = exports.JsonSceneLoader = void 0;
      var lz_string_1 = require_lz_string();
      var JsonSceneLoader = class {
        constructor(baseUrl = "/scenes") {
          __publicField(this, "_cache", /* @__PURE__ */ new Map());
          __publicField(this, "_base_url");
          this._base_url = baseUrl;
        }
        async execute(sceneId) {
          if (this._cache.has(sceneId)) {
            return this._cache.get(sceneId);
          }
          const url = `${this._base_url}/${sceneId}.json`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to load scene ${sceneId}: ${response.status}`);
          }
          const scene = await response.json();
          this._cache.set(sceneId, scene);
          return structuredClone(scene);
        }
      };
      exports.JsonSceneLoader = JsonSceneLoader;
      var SingleJsonSceneLoader2 = class {
        constructor(url = "/loverry-preview/scenes/scenes.json") {
          __publicField(this, "_url");
          __publicField(this, "_scenes_map", null);
          this._url = url;
        }
        async execute(sceneId) {
          await this.ensureLoaded();
          const scene = this._scenes_map[sceneId];
          if (!scene) {
            throw new Error(`Scene ${sceneId} not found`);
          }
          return structuredClone(scene);
        }
        async ensureLoaded() {
          if (this._scenes_map) {
            return this._scenes_map;
          }
          const response = await fetch(this._url);
          if (!response.ok) {
            throw new Error(`Failed to load scenes.json`);
          }
          const text = await response.text();
          const scenes = (() => {
            if (text.startsWith("{")) {
              return JSON.parse(text);
            }
            const json = (0, lz_string_1.decompressFromBase64)(text);
            return JSON.parse(json);
          })();
          this._scenes_map = scenes;
          return structuredClone(scenes);
        }
      };
      exports.SingleJsonSceneLoader = SingleJsonSceneLoader2;
    }
  });

  // ../../packages/engine/dist/story-player.js
  var require_story_player = __commonJS({
    "../../packages/engine/dist/story-player.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StoryPlayer = void 0;
      var StoryPlayer2 = class {
        constructor(dependencies, options) {
          __publicField(this, "dependencies");
          __publicField(this, "options");
          __publicField(this, "_current", {
            scene: null,
            sceneId: null,
            nodeIndex: 0
          });
          __publicField(this, "_player_state", "idle");
          this.dependencies = dependencies;
          this.options = options;
          this.dependencies.gameState.onStateChanged((changes) => {
            this.dependencies.events.onGameStateChanged?.(changes);
          });
        }
        on(event, handler) {
          this.dependencies.events[event] = handler;
        }
        async loadScene(sceneId) {
          if (this._current.sceneId === sceneId && this._current.scene) {
            this._current.nodeIndex = 0;
            this._player_state = "idle";
            this.dependencies.events.onSceneChanged?.(sceneId);
            this.advance();
            return;
          }
          this._current.scene = await this.dependencies.sceneLoader.execute(sceneId);
          this._current.sceneId = sceneId;
          this._current.nodeIndex = 0;
          this._player_state = "idle";
          this.dependencies.events.onSceneChanged?.(sceneId);
          this.advance();
        }
        next() {
          if (this._player_state !== "idle")
            return;
          this.advance();
        }
        selectOption(optionId) {
          if (this._player_state !== "waiting_for_choice") {
            return;
          }
          const node = this._current.scene?.nodes[this._current.nodeIndex];
          if (!node) {
            return;
          }
          const option = node.options.find((option2) => option2.id === optionId);
          if (!option) {
            return;
          }
          if (!this.dependencies.gameState.evaluateCondition(option.condition)) {
            return;
          }
          if (option.effects) {
            this.dependencies.gameState.applyEffects(option.effects);
          }
          if (option.events) {
            for (const event of option.events) {
              this.dependencies.events.onEventTriggered?.(event.id, event.arguments ?? []);
            }
          }
          if (this._current.scene && option.nodes.length) {
            const parentNodes = this._current.scene.nodes;
            const before = parentNodes.slice(0, this._current.nodeIndex);
            const after = parentNodes.slice(this._current.nodeIndex + 1);
            const newNodes = [...before, ...option.nodes, ...after];
            this._current.scene.nodes = newNodes;
            this._current.nodeIndex = this._current.nodeIndex;
          } else {
            this._current.nodeIndex++;
          }
          this._player_state = "idle";
          this.advance();
        }
        getCurrentNode() {
          if (!this._current.scene) {
            return null;
          }
          const index = this._current.nodeIndex - 1;
          if (index < 0 || index >= this._current.scene.nodes.length) {
            return null;
          }
          return this._current.scene.nodes[index];
        }
        getCurrentSceneId() {
          return this._current.sceneId;
        }
        getGameState() {
          return this.dependencies.gameState;
        }
        isWaitingForChoice() {
          return this._player_state === "waiting_for_choice";
        }
        advance() {
          if (this._player_state === "waiting_for_choice") {
            return;
          }
          if (!this._current.scene) {
            return;
          }
          while (this._current.nodeIndex < this._current.scene.nodes.length) {
            const node = this._current.scene.nodes[this._current.nodeIndex];
            const passesCondition = this.dependencies.gameState.evaluateCondition(node.condition);
            if (!passesCondition) {
              this._current.nodeIndex++;
              continue;
            }
            if (node.effects)
              this.dependencies.gameState.applyEffects(node.effects);
            if (node.events) {
              for (const ev of node.events) {
                this.dependencies.events.onEventTriggered?.(ev.id, ev.arguments ?? []);
              }
            }
            switch (node.type) {
              case "choice":
                const options = node.options.filter((option) => this.dependencies.gameState.evaluateCondition(option.condition)).map((option) => ({
                  id: option.id,
                  text: option.text,
                  condition: option.condition
                }));
                if (options.length === 0) {
                  this._current.nodeIndex++;
                  continue;
                }
                this._player_state = "waiting_for_choice";
                this.dependencies.events.onChoice?.(options);
                return;
              case "transition":
                const targetId = node.target;
                if (node.mode === "jump" || !node.mode) {
                  this.loadScene(targetId);
                  return;
                } else if (node.mode === "call") {
                  console.warn("call mode not implemented");
                } else if (node.mode === "return") {
                  console.warn("return mode not implemented");
                }
                this._current.nodeIndex++;
                continue;
              case "background":
              case "character":
              case "effect":
                this.dependencies.events.onNode?.(node);
                this._current.nodeIndex++;
                if (this.options.skipGameCallouts) {
                  continue;
                } else {
                  return;
                }
              default:
                this.dependencies.events.onNode?.(node);
                this._current.nodeIndex++;
                return;
            }
          }
          this._player_state = "finished";
          this.dependencies.events.onNode?.(null);
        }
      };
      exports.StoryPlayer = StoryPlayer2;
    }
  });

  // ../../packages/engine/dist/index.js
  var require_dist2 = __commonJS({
    "../../packages/engine/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_types(), exports);
      __exportStar(require_expression_evaluator(), exports);
      __exportStar(require_game_state(), exports);
      __exportStar(require_scene_loader(), exports);
      __exportStar(require_story_player(), exports);
    }
  });

  // src/main.ts
  var import_engine = __toESM(require_dist2());
  var bgLayer = document.getElementById("bg-layer");
  var charactersLayer = document.getElementById("characters-layer");
  var effectOverlay = document.getElementById("effect-overlay");
  var contentDiv = document.getElementById("content");
  var sceneSelect = document.getElementById("sceneSelect");
  var prevBtn = document.getElementById("prevSceneBtn");
  var nextBtn = document.getElementById("nextSceneBtn");
  var sceneCounterSpan = document.getElementById("sceneCounter");
  var currentSceneIds = [];
  var currentSceneIndex = 0;
  var characterElements = /* @__PURE__ */ new Map();
  var escapeHtml = (str) => {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function(m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      if (m === '"') return "&quot;";
      if (m === "'") return "&#039;";
      return m;
    });
  };
  var setBackground = (file) => {
    if (!file) {
      return;
    }
    const img = new Image();
    img.onload = () => {
      bgLayer.style.backgroundImage = `url('/loverry-preview/assets/background/${file}')`;
    };
    img.src = `/loverry-preview/assets/background/${file}`;
  };
  var setCharacter = (characterId, sprite, position, hidden) => {
    let img = characterElements.get(characterId);
    if (!img) {
      img = document.createElement("img");
      img.className = "character-sprite";
      characterElements.set(characterId, img);
      charactersLayer.appendChild(img);
    }
    if (hidden) {
      img.style.display = "none";
      return;
    }
    img.style.display = "block";
    const spriteFile = sprite || "default.png";
    img.src = `/loverry-preview/assets/characters/${characterId}/${spriteFile}`;
    (() => {
      if (!position) {
        return;
      }
      if (typeof position === "number") {
        return;
      }
      img.setAttribute("data-position", position);
      if (position === "left") img.style.marginRight = "auto";
      else if (position === "right") img.style.marginLeft = "auto";
      else if (position === "center") {
        img.style.marginLeft = "auto";
        img.style.marginRight = "auto";
      }
    })();
  };
  var applyEffect = (effectId, intensity, durationMs) => {
    effectOverlay.className = "effect-overlay";
    let effectClass = "";
    switch (effectId) {
      case "flash":
        effectClass = "effect-flash";
        break;
      case "shake":
        effectClass = "effect-shake";
        break;
      case "pulse":
        effectClass = "effect-pulse";
        break;
      default:
        effectClass = "effect-flash";
    }
    effectOverlay.classList.add(effectClass);
    setTimeout(
      () => effectOverlay.classList.remove(effectClass),
      durationMs || 300
    );
  };
  var renderNode = (node) => {
    const div = document.createElement("div");
    div.className = node.type;
    if (player.options.clearPreviousNodes) {
      clearTextArea();
    }
    switch (node.type) {
      case "dialogue":
        div.innerHTML = `<strong>${escapeHtml(node.character)}</strong>${node.emotion ? ` <span class="emotion">(${escapeHtml(node.emotion)})</span>` : ""}: ${escapeHtml(node.text)}`;
        break;
      case "thought":
        div.innerHTML = `<em>(${escapeHtml(node.character)} \u043C\u044B\u0441\u043B\u0435\u043D\u043D\u043E): ${escapeHtml(node.text)}</em>`;
        break;
      case "action":
        div.innerHTML = `<em>${escapeHtml(node.text)}</em>`;
        break;
      case "background":
        setBackground(node.file);
        return;
      case "character":
        setCharacter(node.character, node.sprite, node.position, node.hidden);
        return;
      case "effect":
        if (node.effect) applyEffect(node.effect, node.intensity, node.duration);
        return;
      default:
        div.textContent = JSON.stringify(node);
    }
    contentDiv.appendChild(div);
    div.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  var renderChoices = (options) => {
    const div = document.createElement("div");
    div.className = "choice";
    div.innerHTML = `<strong>\u0412\u044B\u0431\u043E\u0440:</strong><ul>${options.map((opt) => `<li data-choice-id="${escapeHtml(opt.id)}">${escapeHtml(opt.text)}</li>`).join("")}</ul>`;
    contentDiv.appendChild(div);
    div.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const id = li.getAttribute("data-choice-id");
        player.selectOption(id);
      });
    });
  };
  var clearTextArea = () => {
    for (const child of contentDiv.children) {
      child.remove();
    }
  };
  var updateMetaAndNav = (sceneId, index, total) => {
    sceneCounterSpan.textContent = `\u0421\u0446\u0435\u043D\u0430 ${index + 1} \u0438\u0437 ${total}`;
    sceneSelect.value = sceneId;
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= total - 1;
  };
  var loader = new import_engine.SingleJsonSceneLoader("/loverry-preview/scenes/scenes.json");
  var gameState = new import_engine.GameState(/* @__PURE__ */ new Map());
  var player = new import_engine.StoryPlayer(
    {
      sceneLoader: loader,
      gameState,
      events: {
        onSceneChanged: (sceneId) => {
          currentSceneIndex = currentSceneIds.indexOf(sceneId);
          updateMetaAndNav(sceneId, currentSceneIndex, currentSceneIds.length);
          clearTextArea();
          bgLayer.style.backgroundImage = "";
          charactersLayer.innerHTML = "";
          characterElements.clear();
        },
        onNode: (node) => {
          if (node) renderNode(node);
          else {
            const endMsg = document.createElement("div");
            endMsg.className = "placeholder";
            endMsg.textContent = "\u041A\u043E\u043D\u0435\u0446 \u0441\u0446\u0435\u043D\u044B. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u0443\u044E \u0441\u0446\u0435\u043D\u0443.";
            contentDiv.appendChild(endMsg);
          }
        },
        onChoice: (options) => renderChoices(options),
        onGameStateChanged: (changes) => {
          console.log("State changed:", changes);
        },
        onTransition: (targetId) => {
          console.log("Transition:", targetId);
        },
        onEventTriggered: (eventId, args) => {
          console.log("Event:", eventId, args);
        }
      }
    },
    {
      skipGameCallouts: true,
      clearPreviousNodes: true
    }
  );
  var loadSceneList = async () => {
    const scenesMap = await loader.ensureLoaded();
    currentSceneIds = Object.keys(scenesMap).sort(
      (a, b) => a.localeCompare(b, void 0, { numeric: true })
    );
    sceneSelect.innerHTML = "";
    for (const id of currentSceneIds) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      sceneSelect.appendChild(option);
    }
    const scene = currentSceneIds[0];
    await player.loadScene(scene);
    sceneSelect.value = scene;
  };
  sceneSelect.addEventListener("change", (event) => {
    if (!event.target) {
      return;
    }
    if ("value" in event.target && typeof event.target.value === "string") {
      player.loadScene(event.target.value);
    }
  });
  prevBtn.addEventListener("click", () => {
    if (currentSceneIndex > 0) {
      player.loadScene(currentSceneIds[currentSceneIndex - 1]);
    }
  });
  nextBtn.addEventListener("click", () => {
    if (currentSceneIndex < currentSceneIds.length - 1) {
      player.loadScene(currentSceneIds[currentSceneIndex + 1]);
    }
  });
  var nextStepBtn = document.createElement("button");
  nextStepBtn.textContent = "\u25B6 \u0414\u0430\u043B\u0435\u0435";
  nextStepBtn.id = "nextStepBtn";
  nextStepBtn.addEventListener("click", () => player.next());
  document.querySelector(".panel-footer")?.insertBefore(nextStepBtn, document.querySelector("#nextSceneBtn"));
  loadSceneList().catch(console.error);
})();
