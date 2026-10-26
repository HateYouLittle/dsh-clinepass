import { createRequire as __createRequire } from 'node:module'; var require = __createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
var __using = (stack, value, async) => {
  if (value != null) {
    if (typeof value !== "object" && typeof value !== "function") __typeError("Object expected");
    var dispose, inner;
    if (async) dispose = value[__knownSymbol("asyncDispose")];
    if (dispose === void 0) {
      dispose = value[__knownSymbol("dispose")];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") __typeError("Object not disposable");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    stack.push([async, dispose, value]);
  } else if (async) {
    stack.push([async]);
  }
  return value;
};
var __callDispose = (stack, error, hasError) => {
  var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
    return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
  };
  var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
  var next = (it) => {
    while (it = stack.pop()) {
      try {
        var result = it[1] && it[1].call(it[2]);
        if (it[0]) return Promise.resolve(result).then(next, (e) => (fail(e), next()));
      } catch (e) {
        fail(e);
      }
    }
    if (hasError) throw error;
  };
  return next();
};

// node_modules/partial-json/dist/options.js
var require_options = __commonJS({
  "node_modules/partial-json/dist/options.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Allow = exports.ALL = exports.COLLECTION = exports.ATOM = exports.SPECIAL = exports.INF = exports._INFINITY = exports.INFINITY = exports.NAN = exports.BOOL = exports.NULL = exports.OBJ = exports.ARR = exports.NUM = exports.STR = void 0;
    exports.STR = 1;
    exports.NUM = 2;
    exports.ARR = 4;
    exports.OBJ = 8;
    exports.NULL = 16;
    exports.BOOL = 32;
    exports.NAN = 64;
    exports.INFINITY = 128;
    exports._INFINITY = 256;
    exports.INF = exports.INFINITY | exports._INFINITY;
    exports.SPECIAL = exports.NULL | exports.BOOL | exports.INF | exports.NAN;
    exports.ATOM = exports.STR | exports.NUM | exports.SPECIAL;
    exports.COLLECTION = exports.ARR | exports.OBJ;
    exports.ALL = exports.ATOM | exports.COLLECTION;
    exports.Allow = { STR: exports.STR, NUM: exports.NUM, ARR: exports.ARR, OBJ: exports.OBJ, NULL: exports.NULL, BOOL: exports.BOOL, NAN: exports.NAN, INFINITY: exports.INFINITY, _INFINITY: exports._INFINITY, INF: exports.INF, SPECIAL: exports.SPECIAL, ATOM: exports.ATOM, COLLECTION: exports.COLLECTION, ALL: exports.ALL };
    exports.default = exports.Allow;
  }
});

// node_modules/partial-json/dist/index.js
var require_dist = __commonJS({
  "node_modules/partial-json/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Allow = exports.MalformedJSON = exports.PartialJSON = exports.parseJSON = exports.parse = void 0;
    var options_1 = require_options();
    Object.defineProperty(exports, "Allow", { enumerable: true, get: function() {
      return options_1.Allow;
    } });
    __exportStar(require_options(), exports);
    var PartialJSON = class extends Error {
    };
    exports.PartialJSON = PartialJSON;
    var MalformedJSON = class extends Error {
    };
    exports.MalformedJSON = MalformedJSON;
    function parseJSON(jsonString, allowPartial = options_1.Allow.ALL) {
      if (typeof jsonString !== "string") {
        throw new TypeError(`expecting str, got ${typeof jsonString}`);
      }
      if (!jsonString.trim()) {
        throw new Error(`${jsonString} is empty`);
      }
      return _parseJSON(jsonString.trim(), allowPartial);
    }
    exports.parseJSON = parseJSON;
    var _parseJSON = (jsonString, allow) => {
      const length = jsonString.length;
      let index = 0;
      const markPartialJSON = (msg) => {
        throw new PartialJSON(`${msg} at position ${index}`);
      };
      const throwMalformedError = (msg) => {
        throw new MalformedJSON(`${msg} at position ${index}`);
      };
      const parseAny = () => {
        skipBlank();
        if (index >= length)
          markPartialJSON("Unexpected end of input");
        if (jsonString[index] === '"')
          return parseStr();
        if (jsonString[index] === "{")
          return parseObj();
        if (jsonString[index] === "[")
          return parseArr();
        if (jsonString.substring(index, index + 4) === "null" || options_1.Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
          index += 4;
          return null;
        }
        if (jsonString.substring(index, index + 4) === "true" || options_1.Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
          index += 4;
          return true;
        }
        if (jsonString.substring(index, index + 5) === "false" || options_1.Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
          index += 5;
          return false;
        }
        if (jsonString.substring(index, index + 8) === "Infinity" || options_1.Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
          index += 8;
          return Infinity;
        }
        if (jsonString.substring(index, index + 9) === "-Infinity" || options_1.Allow._INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
          index += 9;
          return -Infinity;
        }
        if (jsonString.substring(index, index + 3) === "NaN" || options_1.Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
          index += 3;
          return NaN;
        }
        return parseNum();
      };
      const parseStr = () => {
        const start = index;
        let escape = false;
        index++;
        while (index < length && (jsonString[index] !== '"' || escape && jsonString[index - 1] === "\\")) {
          escape = jsonString[index] === "\\" ? !escape : false;
          index++;
        }
        if (jsonString.charAt(index) == '"') {
          try {
            return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
          } catch (e) {
            throwMalformedError(String(e));
          }
        } else if (options_1.Allow.STR & allow) {
          try {
            return JSON.parse(jsonString.substring(start, index - Number(escape)) + '"');
          } catch (e) {
            return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"');
          }
        }
        markPartialJSON("Unterminated string literal");
      };
      const parseObj = () => {
        index++;
        skipBlank();
        const obj = {};
        try {
          while (jsonString[index] !== "}") {
            skipBlank();
            if (index >= length && options_1.Allow.OBJ & allow)
              return obj;
            const key = parseStr();
            skipBlank();
            index++;
            try {
              const value = parseAny();
              obj[key] = value;
            } catch (e) {
              if (options_1.Allow.OBJ & allow)
                return obj;
              else
                throw e;
            }
            skipBlank();
            if (jsonString[index] === ",")
              index++;
          }
        } catch (e) {
          if (options_1.Allow.OBJ & allow)
            return obj;
          else
            markPartialJSON("Expected '}' at end of object");
        }
        index++;
        return obj;
      };
      const parseArr = () => {
        index++;
        const arr = [];
        try {
          while (jsonString[index] !== "]") {
            arr.push(parseAny());
            skipBlank();
            if (jsonString[index] === ",") {
              index++;
            }
          }
        } catch (e) {
          if (options_1.Allow.ARR & allow) {
            return arr;
          }
          markPartialJSON("Expected ']' at end of array");
        }
        index++;
        return arr;
      };
      const parseNum = () => {
        if (index === 0) {
          if (jsonString === "-")
            throwMalformedError("Not sure what '-' is");
          try {
            return JSON.parse(jsonString);
          } catch (e) {
            if (options_1.Allow.NUM & allow)
              try {
                return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
              } catch (e2) {
              }
            throwMalformedError(String(e));
          }
        }
        const start = index;
        if (jsonString[index] === "-")
          index++;
        while (jsonString[index] && ",]}".indexOf(jsonString[index]) === -1)
          index++;
        if (index == length && !(options_1.Allow.NUM & allow))
          markPartialJSON("Unterminated number literal");
        try {
          return JSON.parse(jsonString.substring(start, index));
        } catch (e) {
          if (jsonString.substring(start, index) === "-")
            markPartialJSON("Not sure what '-' is");
          try {
            return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
          } catch (e2) {
            throwMalformedError(String(e2));
          }
        }
      };
      const skipBlank = () => {
        while (index < length && " \n\r	".includes(jsonString[index])) {
          index++;
        }
      };
      return parseAny();
    };
    var parse = parseJSON;
    exports.parse = parse;
  }
});

// src/index.ts
import { launchEnvironmentOf } from "@deepseek-ai/dsh-launch-environment";
import { credentialRef as credentialRef2 } from "@deepseek-ai/dsh-credentials";
import { LlmError as LlmError10, assertUsableApiKey, resolveImageAttachmentAccess } from "@deepseek-ai/dsh-llm";

// src/adapter.ts
import { createHash as createHash2, randomUUID as randomUUID4 } from "node:crypto";

// node_modules/clinepass-pi-ai/dist/utils/event-stream.js
var FifoQueue = class {
  incoming = [];
  outgoing = [];
  get length() {
    return this.incoming.length + this.outgoing.length;
  }
  enqueue(value) {
    this.incoming.push(value);
  }
  dequeue() {
    if (this.outgoing.length === 0) {
      while (this.incoming.length > 0) {
        this.outgoing.push(this.incoming.pop());
      }
    }
    return this.outgoing.pop();
  }
};
var EventStream = class {
  queue = new FifoQueue();
  waiting = new FifoQueue();
  done = false;
  finalResultPromise;
  resolveFinalResult;
  isComplete;
  extractResult;
  constructor(isComplete, extractResult) {
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    this.finalResultPromise = new Promise((resolve3) => {
      this.resolveFinalResult = resolve3;
    });
  }
  push(event) {
    if (this.done)
      return;
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.dequeue();
    if (waiter) {
      waiter({ value: event, done: false });
    } else {
      this.queue.enqueue(event);
    }
  }
  end(result) {
    this.done = true;
    if (result !== void 0) {
      this.resolveFinalResult(result);
    }
    while (this.waiting.length > 0) {
      const waiter = this.waiting.dequeue();
      waiter({ value: void 0, done: true });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      if (this.queue.length > 0) {
        yield this.queue.dequeue();
      } else if (this.done) {
        return;
      } else {
        const result = await new Promise((resolve3) => this.waiting.enqueue(resolve3));
        if (result.done)
          return;
        yield result.value;
      }
    }
  }
  result() {
    return this.finalResultPromise;
  }
};
var AssistantMessageEventStream = class extends EventStream {
  #startedAt = Date.now();
  #startedAtMonotonic = performance.now();
  constructor() {
    super((event) => event.type === "done" || event.type === "error", (event) => {
      if (event.type === "done") {
        return event.message;
      } else if (event.type === "error") {
        return event.error;
      }
      throw new Error("Unexpected event type for final result");
    });
  }
  push(event) {
    if (event.type === "done")
      this.#time(event.message);
    else if (event.type === "error")
      this.#time(event.error);
    super.push(event);
  }
  end(result) {
    if (result !== void 0)
      this.#time(result);
    super.end(result);
  }
  #time(message) {
    if (this.done || message.durationMs !== void 0 || message.timestamp < this.#startedAt)
      return;
    message.durationMs = Math.max(0, Math.round(performance.now() - this.#startedAtMonotonic));
  }
};

// node_modules/clinepass-pi-ai/dist/api/lazy.js
function createSetupErrorMessage(model, error, timestamp) {
  return {
    role: "assistant",
    content: [],
    api: model.api,
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
    },
    stopReason: "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp
  };
}
function hasResult(source) {
  return typeof source.result === "function";
}
async function forwardStream(target, source) {
  for await (const event of source) {
    target.push(event);
  }
  target.end(hasResult(source) ? await source.result() : void 0);
}
function lazyStream(model, setup) {
  const startedAt = Date.now();
  const outer = new AssistantMessageEventStream();
  setup().then((inner) => forwardStream(outer, inner)).catch((error) => {
    const message = createSetupErrorMessage(model, error, startedAt);
    outer.push({ type: "error", reason: "error", error: message });
    outer.end(message);
  });
  return outer;
}

// node_modules/clinepass-pi-ai/dist/utils/diagnostics.js
function formatThrownValue(value) {
  if (value instanceof Error)
    return value.message || value.name;
  if (typeof value === "string")
    return value;
  return String(value);
}

// node_modules/clinepass-pi-ai/dist/utils/models-error.js
var ModelsError = class extends Error {
  code;
  constructor(code, message, options) {
    super(withCauseDetail(message, options?.cause), options);
    this.name = "ModelsError";
    this.code = code;
  }
};
function withCauseDetail(message, cause) {
  if (cause === void 0 || cause === null)
    return message;
  const detail = formatThrownValue(cause).trim();
  if (!detail || message.includes(detail))
    return message;
  return `${message}: ${detail}`;
}

// node_modules/clinepass-pi-ai/dist/auth/resolve.js
var DEFAULT_OAUTH_MINIMUM_VALIDITY_MS = 5 * 60 * 1e3;

// node_modules/clinepass-pi-ai/dist/utils/model-operations.js
function getModelType(model) {
  return model.type ?? "chat";
}
function isModelType(model, type) {
  return getModelType(model) === type;
}
function imageErrorResult(model, error, aborted = false) {
  return {
    api: model.api,
    provider: model.provider,
    model: model.id,
    output: [],
    stopReason: aborted ? "aborted" : "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now()
  };
}
function classifierErrorResult(model, error, aborted = false) {
  return {
    api: model.api,
    provider: model.provider,
    model: model.id,
    answers: {},
    stopReason: aborted ? "aborted" : "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now()
  };
}

// node_modules/clinepass-pi-ai/dist/utils/text.js
function contentText(content, separator = "\n") {
  if (typeof content === "string")
    return content;
  return content.filter((block) => block.type === "text").map((block) => block.text).join(separator);
}
function getSystemMessageText(message) {
  const parts = [contentText(message.content)];
  for (const text2 of Object.values(message.sections ?? {})) {
    if (text2 !== null)
      parts.push(text2);
  }
  return parts.filter((part) => part.length > 0).join("\n\n");
}
function renderSystemMessageUpdate(message) {
  const parts = [];
  const text2 = contentText(message.content);
  if (text2.length > 0)
    parts.push(text2);
  for (const [name2, value] of Object.entries(message.sections ?? {})) {
    parts.push(value === null ? `Removed system prompt section "${name2}".` : `Updated system prompt section "${name2}":

${value}`);
  }
  return parts.join("\n\n");
}

// node_modules/clinepass-pi-ai/dist/utils/transcript.js
function createInitialSystemMessage(systemPrompt, tools) {
  const hasSystemPrompt = systemPrompt !== void 0 && systemPrompt.length > 0;
  const hasTools = tools !== void 0 && tools.length > 0;
  if (!hasSystemPrompt && !hasTools)
    return void 0;
  return {
    role: "system",
    content: systemPrompt ?? "",
    ...hasTools ? { toolsAdded: tools } : {},
    timestamp: 0
  };
}
function normalizeContext(context) {
  const initialMessage = createInitialSystemMessage(context.systemPrompt, context.tools);
  const messages = initialMessage ? [initialMessage, ...context.messages] : context.messages;
  return { messages };
}
function isSystemMessage(message) {
  return message.role === "system";
}
function getInitialSystemMessage(messages) {
  const first = messages[0];
  return first && isSystemMessage(first) ? first : void 0;
}
function getCurrentTools(messages) {
  const tools = /* @__PURE__ */ new Map();
  for (const message of messages) {
    if (!isSystemMessage(message))
      continue;
    for (const tool of message.toolsRemoved ?? [])
      tools.delete(tool.name);
    for (const tool of message.toolsAdded ?? [])
      tools.set(tool.name, tool);
  }
  return [...tools.values()];
}
function getCurrentSystemMessage(messages) {
  const content = [];
  const sections = /* @__PURE__ */ new Map();
  let timestamp;
  for (const message of messages) {
    if (!isSystemMessage(message))
      continue;
    timestamp ??= message.timestamp;
    const text2 = contentText(message.content);
    if (text2.length > 0)
      content.push(text2);
    for (const [name2, value] of Object.entries(message.sections ?? {})) {
      if (value === null)
        sections.delete(name2);
      else
        sections.set(name2, value);
    }
  }
  const tools = getCurrentTools(messages);
  if (timestamp === void 0 && tools.length === 0)
    return void 0;
  return {
    role: "system",
    content: content.join("\n\n"),
    ...sections.size > 0 ? { sections: Object.fromEntries(sections) } : {},
    ...tools.length > 0 ? { toolsAdded: tools } : {},
    timestamp: timestamp ?? 0
  };
}
function collapseSystemMessages(context) {
  const head = getCurrentSystemMessage(context.messages);
  const messages = context.messages.filter((message) => message.role !== "system");
  return { messages: head ? [head, ...messages] : messages };
}
function resolveTranscript(context, supportsMidConvoSystemMessages) {
  return supportsMidConvoSystemMessages ? context : collapseSystemMessages(context);
}
function getDeclaredTools(messages) {
  const definitions = /* @__PURE__ */ new Map();
  for (const message of messages) {
    if (!isSystemMessage(message))
      continue;
    for (const tool of message.toolsAdded ?? [])
      definitions.set(tool.name, tool);
  }
  return [...definitions.values()];
}
function hasNonAdditiveToolChanges(messages) {
  const declared = /* @__PURE__ */ new Set();
  for (const message of messages) {
    if (!isSystemMessage(message))
      continue;
    if ((message.toolsRemoved?.length ?? 0) > 0)
      return true;
    for (const tool of message.toolsAdded ?? []) {
      if (declared.has(tool.name))
        return true;
      declared.add(tool.name);
    }
  }
  return false;
}
function resolveTranscriptTools(messages, supportsToolAdditions) {
  const anchorsAdditions = supportsToolAdditions && !hasNonAdditiveToolChanges(messages);
  return {
    requestTools: anchorsAdditions ? getInitialSystemMessage(messages)?.toolsAdded ?? [] : getCurrentTools(messages),
    anchorsAdditions
  };
}

// node_modules/clinepass-pi-ai/dist/models.js
var KNOWN_MODEL_TYPES = { chat: true, image: true, classifier: true };
function hasKnownModelType(model) {
  return Object.hasOwn(KNOWN_MODEL_TYPES, getModelType(model));
}
function createProvider(input) {
  const single = input.api && typeof input.api.stream === "function" ? input.api : void 0;
  const byApi = single || !input.api ? void 0 : input.api;
  const images = input.images;
  const classifiers = input.classifiers;
  const streams = single ? [single] : Object.values(byApi ?? {}).filter((entry) => entry !== void 0);
  const imageImplementations = Object.values(images ?? {}).filter((entry) => entry !== void 0);
  const classifierImplementations = Object.values(classifiers ?? {}).filter((entry) => entry !== void 0);
  if (streams.length === 0 && imageImplementations.length === 0 && classifierImplementations.length === 0) {
    throw new Error(`Provider ${input.id}: at least one of "api", "images", or "classifiers" is required.`);
  }
  const baselineModels = input.models;
  let dynamicModels = [];
  const fetchModels = input.fetchModels;
  const currentModels = () => {
    const merged = [...baselineModels];
    for (const model of dynamicModels) {
      const index = merged.findIndex((entry) => getModelType(entry) === getModelType(model) && entry.id === model.id);
      if (index >= 0)
        merged[index] = model;
      else
        merged.push(model);
    }
    return merged;
  };
  const apiFor = (model) => single ?? byApi?.[model.api];
  const dispatch = (model, run) => {
    const streams2 = apiFor(model);
    if (!streams2) {
      return lazyStream(model, async () => {
        throw new ModelsError("stream", `Provider ${input.id} has no API implementation for "${model.api}"`);
      });
    }
    return run(streams2);
  };
  const provider = {
    id: input.id,
    name: input.name ?? input.id,
    baseUrl: input.baseUrl,
    headers: input.headers,
    auth: input.auth,
    getModels: () => currentModels().filter((model) => isModelType(model, "chat")),
    getAllModels: currentModels,
    refreshModels: fetchModels ? async (context) => {
      if (context.stored) {
        const restored = context.stored.models.filter((model) => model.provider === input.id).map((model) => model);
        if (!await context.publish({
          update: () => {
            dynamicModels = restored;
          }
        })) {
          return;
        }
      }
      if (!context.allowNetwork || context.signal.aborted)
        return;
      const fetched = await fetchModels(context);
      if (context.signal.aborted)
        return;
      const refreshed = fetched.filter(hasKnownModelType);
      await context.publish({
        persist: { models: refreshed, checkedAt: Date.now() },
        update: () => {
          dynamicModels = refreshed;
        }
      });
    } : void 0,
    filterModels: input.filterModels,
    filterAllModels: input.filterAllModels,
    stream: (model, context, options) => dispatch(model, (streams2) => streams2.stream(model, context, options)),
    streamSimple: (model, context, options) => dispatch(model, (streams2) => streams2.streamSimple(model, context, options))
  };
  if (streams.some((entry) => entry.fetchDeferred !== void 0)) {
    provider.fetchDeferred = (model, handle, options) => lazyStream(model, async () => {
      const implementation = apiFor(model);
      if (!implementation?.fetchDeferred) {
        throw new ModelsError("provider", `Provider ${input.id} does not support deferred responses for "${model.api}"`);
      }
      return implementation.fetchDeferred(model, handle, options);
    });
  }
  if (streams.some((entry) => entry.cancelDeferred !== void 0)) {
    provider.cancelDeferred = async (model, handle, options) => {
      const implementation = apiFor(model);
      if (!implementation?.cancelDeferred) {
        throw new ModelsError("provider", `Provider ${input.id} cannot cancel deferred responses for "${model.api}"`);
      }
      await implementation.cancelDeferred(model, handle, options);
    };
  }
  if (images && imageImplementations.length > 0) {
    provider.generateImages = async (model, context, options) => {
      const implementation = images[model.api];
      if (!implementation) {
        return imageErrorResult(model, new ModelsError("provider", `Provider ${input.id} has no image generation implementation for "${model.api}"`));
      }
      return implementation.generateImages(model, context, options);
    };
  }
  if (classifiers && classifierImplementations.length > 0) {
    provider.classify = async (model, context, options) => {
      const implementation = classifiers[model.api];
      if (!implementation) {
        return classifierErrorResult(model, new ModelsError("provider", `Provider ${input.id} has no classifier implementation for "${model.api}"`));
      }
      return implementation.classify(model, context, options);
    };
  }
  return provider;
}
function calculateCost(model, usage) {
  const inputTokens = usage.input + usage.cacheRead + usage.cacheWrite;
  let rates = model.cost;
  let matchedThreshold = -1;
  for (const tier of model.cost.tiers ?? []) {
    if (inputTokens > tier.inputTokensAbove && tier.inputTokensAbove > matchedThreshold) {
      rates = tier;
      matchedThreshold = tier.inputTokensAbove;
    }
  }
  const longWrite = usage.cacheWrite1h ?? 0;
  const shortWrite = usage.cacheWrite - longWrite;
  usage.cost.input = rates.input / 1e6 * usage.input;
  usage.cost.output = rates.output / 1e6 * usage.output;
  usage.cost.cacheRead = rates.cacheRead / 1e6 * usage.cacheRead;
  usage.cost.cacheWrite = (rates.cacheWrite * shortWrite + rates.input * 2 * longWrite) / 1e6;
  usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
  return usage.cost;
}
var EXTENDED_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
function getSupportedThinkingLevels(model) {
  if (!model.reasoning)
    return ["off"];
  return EXTENDED_THINKING_LEVELS.filter((level) => {
    const mapped = model.thinkingLevelMap?.[level];
    if (mapped === null)
      return false;
    if (level === "xhigh" || level === "max")
      return mapped !== void 0;
    return true;
  });
}
function clampThinkingLevel(model, level) {
  const availableLevels = getSupportedThinkingLevels(model);
  if (availableLevels.includes(level))
    return level;
  const requestedIndex = EXTENDED_THINKING_LEVELS.indexOf(level);
  if (requestedIndex === -1)
    return availableLevels[0] ?? "off";
  for (let i = requestedIndex; i < EXTENDED_THINKING_LEVELS.length; i++) {
    const candidate = EXTENDED_THINKING_LEVELS[i];
    if (availableLevels.includes(candidate))
      return candidate;
  }
  for (let i = requestedIndex - 1; i >= 0; i--) {
    const candidate = EXTENDED_THINKING_LEVELS[i];
    if (availableLevels.includes(candidate))
      return candidate;
  }
  return availableLevels[0] ?? "off";
}

// node_modules/clinepass-pi-ai/dist/utils/json-parse.js
var import_partial_json = __toESM(require_dist(), 1);
var VALID_JSON_ESCAPES = /* @__PURE__ */ new Set(['"', "\\", "/", "b", "f", "n", "r", "t", "u"]);
function isControlCharacter(char) {
  const codePoint = char.codePointAt(0);
  return codePoint !== void 0 && codePoint >= 0 && codePoint <= 31;
}
function escapeControlCharacter(char) {
  switch (char) {
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`;
  }
}
function repairJson(json) {
  let repaired = "";
  let inString = false;
  for (let index = 0; index < json.length; index++) {
    const char = json[index];
    if (!inString) {
      repaired += char;
      if (char === '"') {
        inString = true;
      }
      continue;
    }
    if (char === '"') {
      repaired += char;
      inString = false;
      continue;
    }
    if (char === "\\") {
      const nextChar = json[index + 1];
      if (nextChar === void 0) {
        repaired += "\\\\";
        continue;
      }
      if (nextChar === "u") {
        const unicodeDigits = json.slice(index + 2, index + 6);
        if (/^[0-9a-fA-F]{4}$/.test(unicodeDigits)) {
          repaired += `\\u${unicodeDigits}`;
          index += 5;
          continue;
        }
      }
      if (VALID_JSON_ESCAPES.has(nextChar)) {
        repaired += `\\${nextChar}`;
        index += 1;
        continue;
      }
      repaired += "\\\\";
      continue;
    }
    repaired += isControlCharacter(char) ? escapeControlCharacter(char) : char;
  }
  return repaired;
}
function parseJsonWithRepair(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    const repairedJson = repairJson(json);
    if (repairedJson !== json) {
      return JSON.parse(repairedJson);
    }
    throw error;
  }
}
function parseStreamingJson(partialJson) {
  if (!partialJson || partialJson.trim() === "") {
    return {};
  }
  try {
    return parseJsonWithRepair(partialJson);
  } catch {
    try {
      const result = (0, import_partial_json.parse)(partialJson);
      return result ?? {};
    } catch {
      try {
        const result = (0, import_partial_json.parse)(repairJson(partialJson));
        return result ?? {};
      } catch {
        return {};
      }
    }
  }
}

// node_modules/clinepass-pi-ai/dist/utils/overflow.js
var OVERFLOW_PATTERNS = [
  /prompt (?:is )?too long/i,
  // Anthropic and z.ai token overflow
  /prompt exceeds max length/i,
  // z.ai CN endpoint token overflow
  /request_too_large/i,
  // Anthropic request byte-size overflow (HTTP 413)
  /input is too long for requested model/i,
  // Amazon Bedrock
  /exceeds the context window/i,
  // OpenAI (Completions & Responses API)
  /exceeds (?:the )?(?:model'?s )?maximum context length(?: of [\d,]+ tokens?|\s*\([\d,]+\))/i,
  // OpenAI-compatible proxies (LiteLLM)
  /input token count.*exceeds the maximum/i,
  // Google (Gemini)
  /maximum prompt length is \d+/i,
  // xAI (Grok)
  /reduce the length of the messages/i,
  // Groq
  /maximum context length is \d+ tokens/i,
  // OpenRouter (most backends)
  /exceeds (?:the )?maximum allowed input length of [\d,]+ tokens?/i,
  // OpenRouter/Poolside
  /input \(\d+ tokens\) is longer than the model'?s context length \(\d+ tokens\)/i,
  // Together AI
  /exceeds the limit of \d+/i,
  // GitHub Copilot
  /exceeds the available context size/i,
  // llama.cpp server
  /greater than the context length/i,
  // LM Studio
  /context window exceeds limit/i,
  // MiniMax
  /exceeded model token limit/i,
  // Kimi For Coding
  /too large for model with \d+ maximum context length/i,
  // Mistral
  /prompt has [\d,]+ tokens?, but the configured context size is [\d,]+ tokens?/i,
  // DS4 server
  /model_context_window_exceeded/i,
  // z.ai non-standard finish_reason surfaced as error text
  /prompt too long; exceeded (?:max )?context length/i,
  // Ollama explicit overflow error
  /range of input length should be/i,
  // DashScope / Qwen Token Plan
  /context[_ ]length[_ ]exceeded/i,
  // Generic fallback
  /too many tokens/i,
  // Generic fallback
  /token limit exceeded/i
  // Generic fallback
];
var CEREBRAS_BODYLESS_OVERFLOW_PATTERN = /^4(?:00|13)\s*(?:status code)?\s*\(no body\)/i;
var NON_OVERFLOW_PATTERNS = [
  /^(Throttling error|Service unavailable):/i,
  // AWS Bedrock non-overflow errors (human-readable prefixes from formatBedrockError)
  /rate limit/i,
  // Generic rate limiting
  /too many requests/i
  // Generic HTTP 429 style
];
function isContextOverflow(message, contextWindow) {
  if (message.stopReason === "error" && message.errorMessage) {
    const isNonOverflow = NON_OVERFLOW_PATTERNS.some((p) => p.test(message.errorMessage));
    if (!isNonOverflow) {
      if (OVERFLOW_PATTERNS.some((p) => p.test(message.errorMessage))) {
        return true;
      }
      if (message.provider === "cerebras" && CEREBRAS_BODYLESS_OVERFLOW_PATTERN.test(message.errorMessage)) {
        return true;
      }
    }
  }
  if (contextWindow && message.stopReason === "stop") {
    const inputTokens = message.usage.input + message.usage.cacheRead;
    if (inputTokens > contextWindow) {
      return true;
    }
  }
  if (contextWindow && message.stopReason === "length" && message.usage.output === 0) {
    const inputTokens = message.usage.input + message.usage.cacheRead;
    if (inputTokens >= contextWindow * 0.99) {
      return true;
    }
  }
  return false;
}

// src/request-executor.ts
import { LlmError as LlmError7, attributionHeaders, contentHasImage as contentHasImage2 } from "@deepseek-ai/dsh-llm";
import { deadline, idleWatchdog, timeoutOf } from "@deepseek-ai/dsh-timeout";

// src/config.ts
import { MAX_TIMER_DELAY_MS } from "@deepseek-ai/dsh-timeout";

// src/conversion/context.ts
import { brandString } from "@deepseek-ai/dsh-brand";
import { contentHasImage, LlmError as LlmError4, offloadedImageText, requestImageHandleText } from "@deepseek-ai/dsh-llm";

// src/conversion/replay.ts
import { LlmError } from "@deepseek-ai/dsh-llm";
function parseArguments(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
  }
  return {};
}
function emptyPiUsage() {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
  };
}
function toPiReplayState(message, requestedModel = message.model, requestedProvider = message.provider) {
  const responseModel = message.api === "anthropic-messages" && message.model !== requestedModel ? message.model : message.responseModel;
  const response = {
    kind: "pi-ai",
    version: 2,
    api: message.api,
    provider: requestedProvider,
    ...requestedProvider === message.provider ? {} : { sdkProvider: message.provider },
    model: requestedModel,
    ...responseModel === void 0 ? {} : { responseModel },
    ...message.responseId === void 0 ? {} : { responseId: message.responseId },
    ...message.providerThinkingLevel === void 0 ? {} : { providerThinkingLevel: message.providerThinkingLevel },
    stopReason: message.stopReason
  };
  return {
    response,
    blocks: message.content.map((block) => {
      switch (block.type) {
        case "text":
          return {
            type: "text",
            ...block.textSignature === void 0 ? {} : { textSignature: block.textSignature }
          };
        case "thinking":
          return {
            type: "reasoning",
            ...block.thinkingSignature === void 0 ? {} : { thinkingSignature: block.thinkingSignature },
            ...block.redacted === void 0 ? {} : { redacted: block.redacted }
          };
        case "toolCall":
          return {
            type: "tool-call",
            ...block.thoughtSignature === void 0 ? {} : { thoughtSignature: block.thoughtSignature }
          };
      }
    })
  };
}
function invalidReplay(message) {
  throw new LlmError(`invalid pi-ai replay state: ${message}`, "INVALID_REPLAY_STATE");
}
function readReplayState(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return invalidReplay("expected a replay envelope");
  const envelope = value;
  const rawResponse = envelope["response"];
  if (typeof rawResponse !== "object" || rawResponse === null || Array.isArray(rawResponse)) return invalidReplay("expected a response object");
  const response = rawResponse;
  if (response["kind"] !== "pi-ai") return invalidReplay("unknown state kind");
  if (response["version"] !== 2) return invalidReplay(`unsupported version ${String(response["version"])}`);
  for (const key of ["api", "provider", "model"]) {
    if (typeof response[key] !== "string" || response[key].length === 0) return invalidReplay(`${key} must be a non-empty string`);
  }
  if (response["sdkProvider"] !== void 0 && (typeof response["sdkProvider"] !== "string" || response["sdkProvider"].length === 0)) {
    return invalidReplay("sdkProvider must be a non-empty string");
  }
  if (!["stop", "length", "toolUse", "error", "aborted"].includes(String(response["stopReason"]))) {
    return invalidReplay("unknown stopReason");
  }
  if (response["responseModel"] !== void 0 && typeof response["responseModel"] !== "string") return invalidReplay("responseModel must be a string");
  if (response["responseId"] !== void 0 && typeof response["responseId"] !== "string") return invalidReplay("responseId must be a string");
  if (response["providerThinkingLevel"] !== void 0 && typeof response["providerThinkingLevel"] !== "string") return invalidReplay("providerThinkingLevel must be a string");
  const blocks = envelope["blocks"];
  if (!Array.isArray(blocks)) return invalidReplay("blocks must be an array");
  for (const [index, value2] of blocks.entries()) {
    if (typeof value2 !== "object" || value2 === null || Array.isArray(value2)) return invalidReplay(`block ${index} must be an object`);
    const block = value2;
    if (!["text", "reasoning", "tool-call"].includes(String(block["type"]))) return invalidReplay(`block ${index} has an unknown type`);
    for (const signature of ["textSignature", "thinkingSignature", "thoughtSignature"]) {
      if (block[signature] !== void 0 && typeof block[signature] !== "string") return invalidReplay(`block ${index} ${signature} must be a string`);
    }
    if (block["redacted"] !== void 0 && typeof block["redacted"] !== "boolean") return invalidReplay(`block ${index} redacted must be boolean`);
  }
  return {
    response,
    blocks
  };
}
function foreignAssistant(message) {
  const source = message.source.kind === "model" ? message.source : void 0;
  const content = [];
  for (const block of message.content) {
    switch (block.type) {
      case "text":
        content.push({ type: "text", text: block.text });
        break;
      case "reasoning":
        content.push({ type: "thinking", thinking: block.text });
        break;
      case "tool-call":
        content.push({
          type: "toolCall",
          id: block.id,
          name: block.name,
          arguments: parseArguments(block.arguments)
        });
        break;
      case "image":
        throw new LlmError("pi-ai chat history cannot represent structured assistant image output", "UNSUPPORTED_CONTENT");
      default:
        break;
    }
  }
  return {
    role: "assistant",
    content,
    // Deliberately never equals a catalog API: absent replay state is foreign
    // even if source names the same provider/model as this request.
    api: "dsh-foreign",
    provider: source?.provider ?? "dsh-foreign",
    model: source?.model ?? "dsh-foreign",
    usage: emptyPiUsage(),
    stopReason: content.some((piece) => piece.type === "toolCall") ? "toolUse" : "stop",
    timestamp: 0
  };
}
function replayedAssistant(message, source, rawState) {
  const state = readReplayState(rawState);
  if (state.response.provider !== source.provider) return invalidReplay("provider does not match assistant source");
  if (state.response.model !== source.model) return invalidReplay("model does not match assistant source");
  if (state.blocks.length !== message.content.length) return invalidReplay("block count does not match assistant content");
  const content = message.content.map((block, index) => {
    const replay = state.blocks[index];
    if (replay === void 0 || replay.type !== block.type) return invalidReplay(`block ${index} does not match assistant content`);
    switch (block.type) {
      case "text":
        return {
          type: "text",
          text: block.text,
          ...replay.type === "text" && replay.textSignature !== void 0 ? { textSignature: replay.textSignature } : {}
        };
      case "reasoning":
        return {
          type: "thinking",
          thinking: block.text,
          ...replay.type === "reasoning" && replay.thinkingSignature !== void 0 ? { thinkingSignature: replay.thinkingSignature } : {},
          ...replay.type === "reasoning" && replay.redacted !== void 0 ? { redacted: replay.redacted } : {}
        };
      case "tool-call":
        return {
          type: "toolCall",
          id: block.id,
          name: block.name,
          arguments: parseArguments(block.arguments),
          ...replay.type === "tool-call" && replay.thoughtSignature !== void 0 ? { thoughtSignature: replay.thoughtSignature } : {}
        };
      /* v8 ignore next -- readReplayState rejects unknown replay tags, so an equal plugin-added Harness tag cannot reach this switch */
      default:
        return invalidReplay(`block ${index} has an unsupported Harness type`);
    }
  });
  return {
    role: "assistant",
    content,
    api: state.response.api,
    provider: state.response.sdkProvider ?? state.response.provider,
    // SDK signature matching uses the requested identity even when Anthropic reports an alias.
    model: state.response.model,
    ...state.response.responseModel === void 0 ? {} : { responseModel: state.response.responseModel },
    ...state.response.responseId === void 0 ? {} : { responseId: state.response.responseId },
    ...state.response.providerThinkingLevel === void 0 ? {} : { providerThinkingLevel: state.response.providerThinkingLevel },
    usage: emptyPiUsage(),
    stopReason: state.response.stopReason,
    timestamp: 0
  };
}
function toPiAssistant(message, onDegrade) {
  const source = message.source;
  if (source.kind !== "model" || source.replayState === void 0) return foreignAssistant(message);
  try {
    return replayedAssistant(message, source, source.replayState);
  } catch (error) {
    if (!(error instanceof LlmError) || error.code !== "INVALID_REPLAY_STATE") throw error;
    onDegrade?.(error.message);
    return foreignAssistant(message);
  }
}

// src/conversion/context.ts
import { requestImageDimensions } from "@deepseek-ai/dsh-attachment";

// src/conversion/config.ts
var DEFAULT_MAX_REQUEST_IMAGE_BYTES = 20 * 1024 * 1024;
var DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET = 2048 * 2048;
var DEFAULT_REQUEST_IMAGE_MAX_BYTES = 1024 * 1024;

// src/conversion/image-offload.ts
import * as llm from "@deepseek-ai/dsh-llm";
var api = llm;
function projectRequestImages(messages, policy) {
  if (api.requiredImageOffload !== void 0 && api.projectOffloadedImages !== void 0) {
    if (policy.exact && policy.maxBytes !== void 0 || policy.maxImages !== void 0) {
      const offloadImages = api.requiredImageOffload(
        messages,
        { representation: "base64", maxBytes: policy.exact ? policy.maxBytes : void 0, maxImages: policy.maxImages, countQuantum: 1 },
        (block) => policy.exact ? policy.byteLength(block.attachment) : 0
      );
      if (offloadImages > 0) {
        throw new llm.LlmError(
          `pi-ai request images exceed the configured image count or base64 payload bound; ${offloadImages} more oldest occurrence(s) must be offloaded.`,
          api.IMAGE_OFFLOAD_REQUIRED_CODE ?? "IMAGE_OFFLOAD_REQUIRED",
          { offloadImages }
        );
      }
    }
    if (!policy.exact) return messages;
    return api.projectOffloadedImages(messages, policy.placeholder);
  }
  if (api.offloadRequestImagesWithPolicy === void 0) {
    throw new llm.LlmError("The DSH host has no supported image offload API", "UNSUPPORTED_CONTENT");
  }
  return api.offloadRequestImagesWithPolicy(messages, {
    representation: "base64",
    byteQuantum: 1,
    countQuantum: 1,
    maxImages: policy.maxImages,
    maxBytes: policy.maxBytes,
    byteLength: policy.byteLength,
    placeholder: policy.placeholder
  });
}

// src/conversion/image-pool.ts
import { LlmError as LlmError3 } from "@deepseek-ai/dsh-llm";
var IMAGE_PREPARATION_CONCURRENCY = 4;
var IMAGE_PREPARATION_QUEUE_LIMIT = 32;
var IMAGE_PAYLOAD_BUDGET_BYTES = 128 * 1024 * 1024;
var active = 0;
var retainedBytes = 0;
var queued = [];
function observe(observer, started, rejected = false) {
  try {
    observer?.({
      queueWaitMs: performance.now() - started,
      active,
      queued: queued.length,
      retainedBytes,
      ...rejected ? { rejected: true } : {}
    });
  } catch {
  }
}
var ImagePayloadLease = class {
  constructor(observer) {
    this.observer = observer;
  }
  bytes = 0;
  closed = false;
  reserve(bytes) {
    if (this.closed) throw new LlmError3("Image preparation was cancelled", "ABORTED");
    if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > IMAGE_PAYLOAD_BUDGET_BYTES - retainedBytes) {
      observe(this.observer, performance.now(), true);
      throw new LlmError3("ClinePass image payload capacity is busy; retry after another image request completes", "IMAGE_RESOURCE_BUSY");
    }
    this.bytes += bytes;
    retainedBytes += bytes;
    observe(this.observer, performance.now());
  }
  [Symbol.dispose]() {
    if (this.closed) return;
    this.closed = true;
    retainedBytes -= this.bytes;
  }
};
function acquire(signal, observer) {
  return new Promise((resolve3, reject) => {
    const started = performance.now();
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const abort = () => {
      const index = queued.indexOf(start);
      if (index >= 0) queued.splice(index, 1);
      signal?.removeEventListener("abort", abort);
      observe(observer, started);
      reject(signal.reason);
    };
    const start = () => {
      signal?.removeEventListener("abort", abort);
      active++;
      observe(observer, started);
      resolve3(() => {
        active--;
        queued.shift()?.();
      });
    };
    if (active < IMAGE_PREPARATION_CONCURRENCY) start();
    else if (queued.length >= IMAGE_PREPARATION_QUEUE_LIMIT) {
      observe(observer, started, true);
      reject(new LlmError3("ClinePass image preparation queue is full; retry after another image request completes", "IMAGE_RESOURCE_BUSY"));
    } else {
      queued.push(start);
      signal?.addEventListener("abort", abort, { once: true });
      observe(observer, performance.now());
    }
  });
}
async function withImagePermit(work, signal, observer) {
  const release = await acquire(signal, observer);
  try {
    signal?.throwIfAborted();
    return await work();
  } finally {
    release();
  }
}

// src/request-control.ts
function waitWithSignal(work, signal) {
  if (signal?.aborted) return Promise.reject(signal.reason);
  return new Promise((resolve3, reject) => {
    const cleanup = () => {
      signal?.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      reject(signal.reason);
    };
    signal?.addEventListener("abort", abort, { once: true });
    Promise.resolve().then(() => {
      signal?.throwIfAborted();
      return work();
    }).then((value) => {
      cleanup();
      resolve3(value);
    }, (error) => {
      cleanup();
      reject(error);
    });
  });
}

// src/conversion/context.ts
function flattenText(message) {
  return message.content.filter((block) => block.type === "text").map((block) => block.text).join("");
}
function toolResultText(blocks) {
  return blocks.map((block) => block.type === "text" ? block.text : block.type === "tool-result" ? toolResultText(block.content) : "").join("");
}
function toolMessage(message) {
  if (message.role !== "tool") return void 0;
  return message;
}
function assertSupportedHistory(messages) {
  for (const message of messages) {
    if (message.role === "developer") throw new LlmError4("Developer messages are not supported yet", "UNSUPPORTED_CONTENT");
    if (!["system", "user", "assistant", "tool"].includes(message.role)) {
      throw new LlmError4(`Unsupported message role: ${message.role}`, "UNSUPPORTED_CONTENT");
    }
    if (message.content.some((block) => block.type === "tool-addition" || block.type === "tool-removal")) {
      throw new LlmError4("Tool-change blocks require developer role", "UNSUPPORTED_CONTENT");
    }
    if (message.role !== "user" && !toolMessage(message) && contentHasImage(message.content)) {
      throw new LlmError4(
        `pi-ai cannot represent an image in an in-history ${message.role} message`,
        "UNSUPPORTED_CONTENT"
      );
    }
  }
}
async function userContent(blocks, requestImages, resolveImageAccess) {
  const content = [];
  for (const block of blocks) {
    switch (block.type) {
      case "text":
        if (block.text.length > 0) content.push({ type: "text", text: block.text });
        break;
      case "image": {
        const version = requestImages.get(block.attachment.attachmentId);
        content.push({
          type: "text",
          text: requestImageHandleText(block.attachment, version, resolveImageAccess(block.attachment))
        });
        content.push({
          type: "image",
          data: Buffer.from(version.data).toString("base64"),
          mimeType: version.mediaType
        });
        break;
      }
      case "tool-result":
        {
          const nested = await userContent(block.content, requestImages, resolveImageAccess);
          if (typeof nested === "string") {
            if (nested.length > 0) content.push({ type: "text", text: nested });
          } else {
            content.push(...nested);
          }
        }
        break;
      default:
        break;
    }
  }
  if (content.every((block) => block.type === "text")) return content.map((block) => block.text).join("");
  return content;
}
function collectImageRefs(blocks, refs, occurrences) {
  for (const block of blocks) {
    if (block.type === "image") {
      if (block.offloaded !== true) {
        refs.set(block.attachment.attachmentId, block.attachment);
        occurrences.set(block.attachment.attachmentId, (occurrences.get(block.attachment.attachmentId) ?? 0) + 1);
      }
    } else if (block.type === "tool-result") {
      collectImageRefs(block.content, refs, occurrences);
    }
  }
}
async function prepareRequestImages(messages, attachments, budget, signal, maxEncodedBytes, checkBudget, lease, observer) {
  const refs = /* @__PURE__ */ new Map();
  const occurrences = /* @__PURE__ */ new Map();
  for (const message of messages) collectImageRefs(message.content, refs, occurrences);
  const orderedRefs = [...refs.values()];
  const versions = /* @__PURE__ */ new Map();
  const cancelled = new AbortController();
  const preparationSignal = signal ? AbortSignal.any([signal, cancelled.signal]) : cancelled.signal;
  let next = 0;
  let failed = false;
  let failure;
  let encodedBytes = 0;
  const worker = async () => {
    try {
      while (next < orderedRefs.length) {
        preparationSignal.throwIfAborted();
        const ref = orderedRefs[next++];
        const image = await waitWithSignal(() => withImagePermit(
          () => attachments.readImageRequest(ref, requestImageTarget(ref, budget), preparationSignal),
          preparationSignal,
          observer
        ), preparationSignal);
        preparationSignal.throwIfAborted();
        lease?.reserve(image.data.byteLength + Math.ceil(image.data.byteLength / 3) * 4 * occurrences.get(ref.attachmentId));
        versions.set(ref.attachmentId, image);
        encodedBytes += Math.ceil(image.bytes / 3) * 4 * occurrences.get(ref.attachmentId);
        if (maxEncodedBytes !== void 0 && encodedBytes > maxEncodedBytes) checkBudget?.(versions);
      }
    } catch (error) {
      if (!failed) {
        failed = true;
        failure = error;
        cancelled.abort(error);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(IMAGE_PREPARATION_CONCURRENCY, orderedRefs.length) }, worker));
  if (failed) throw failure;
  return versions;
}
function toolsOf(options) {
  if (options.tools?.some((tool) => tool.deferLoading === true)) {
    throw new LlmError4("Deferred tool loading is not supported yet", "UNSUPPORTED_CONTENT");
  }
  return options.tools?.map((tool) => ({
    name: tool.name,
    description: tool.description,
    // ToolSchema.parameters is a JSON Schema object; pi-ai's TSchema
    // (TypeBox) is structurally JSON Schema, so it assigns directly.
    parameters: tool.parameters
  }));
}
function splitSystemPrompt(options) {
  if (options.system !== void 0) return { systemPrompt: options.system, messages: options.messages };
  const [first, ...rest] = options.messages;
  if (first?.role !== "system") return { systemPrompt: void 0, messages: options.messages };
  const text2 = flattenText(first);
  return { systemPrompt: text2.length > 0 ? text2 : void 0, messages: rest };
}
function piContext(systemPrompt, options, messages) {
  const tools = toolsOf(options);
  return {
    ...systemPrompt !== void 0 ? { systemPrompt } : {},
    messages,
    ...tools !== void 0 && tools.length > 0 ? { tools } : {}
  };
}
function appendAssistant(message, messages, toolNames, onReplayDegrade) {
  const assistant = toPiAssistant(message, onReplayDegrade);
  for (const block of assistant.content) {
    if (block.type === "toolCall") toolNames.set(brandString(block.id), block.name);
  }
  messages.push(assistant);
}
function textOnlyContext(options, onReplayDegrade) {
  assertSupportedHistory(options.messages);
  const split = splitSystemPrompt(options);
  const toolNames = /* @__PURE__ */ new Map();
  const messages = [];
  for (const message of split.messages) {
    if (contentHasImage(message.content)) {
      throw new LlmError4("pi-ai image conversion requires the durable attachment service", "UNSUPPORTED_CONTENT");
    }
    const tool = toolMessage(message);
    if (tool) {
      messages.push({
        role: "toolResult",
        toolCallId: tool.toolCallId,
        toolName: toolNames.get(tool.toolCallId) ?? "unknown",
        content: [{ type: "text", text: toolResultText(tool.content) || "(no output)" }],
        isError: tool.isError ?? false,
        timestamp: 0
      });
      continue;
    }
    if (message.role === "system") {
      messages.push({ role: "user", content: flattenText(message), timestamp: 0 });
      continue;
    }
    if (message.role === "assistant") {
      appendAssistant(message, messages, toolNames, onReplayDegrade);
      continue;
    }
    const text2 = flattenText(message);
    const results = message.content.filter((block) => block.type === "tool-result");
    if (text2.length > 0 || results.length === 0) messages.push({ role: "user", content: text2, timestamp: 0 });
    for (const result of results) {
      messages.push({
        role: "toolResult",
        toolCallId: result.toolCallId,
        toolName: toolNames.get(result.toolCallId) ?? "unknown",
        content: [{
          type: "text",
          text: toolResultText(result.content) || "(no output)"
        }],
        isError: result.isError ?? false,
        timestamp: 0
      });
    }
  }
  return piContext(split.systemPrompt, options, messages);
}
function requestImageTarget(ref, budget) {
  return {
    ...requestImageDimensions(ref.width, ref.height, budget.maxPixels),
    maxPixels: budget.maxPixels,
    maxBytes: budget.maxBytes
  };
}
function toPiContext(options, images, onReplayDegrade) {
  return images === void 0 ? textOnlyContext(options, onReplayDegrade) : toPiContextWithImages(options, images, onReplayDegrade);
}
async function toPiContextWithImages(options, images, onReplayDegrade) {
  var _stack = [];
  try {
    const { attachments, resolveImageAccess, maxImages, maxRequestImageBytes } = images;
    const requestImagePolicy = images.requestImagePolicy ?? {
      maxPixels: DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET,
      maxBytes: DEFAULT_REQUEST_IMAGE_MAX_BYTES
    };
    assertSupportedHistory(options.messages);
    const split = splitSystemPrompt(options);
    const projection = {
      maxImages,
      maxBytes: maxRequestImageBytes,
      placeholder: (ref) => offloadedImageText(ref, resolveImageAccess(ref))
    };
    const requestMessages = projectRequestImages(split.messages, {
      ...projection,
      exact: false,
      byteLength: (ref) => Math.min(ref.bytes, requestImagePolicy.maxBytes)
    });
    const localLease = __using(_stack, images.payloadLease === void 0 ? new ImagePayloadLease() : void 0);
    const requestImages = await prepareRequestImages(requestMessages, attachments, requestImagePolicy, options.signal, maxRequestImageBytes, (versions) => {
      projectRequestImages(requestMessages, {
        ...projection,
        exact: true,
        byteLength: (ref) => versions.get(ref.attachmentId)?.bytes ?? 0
      });
    }, images.payloadLease ?? localLease, images.onImagePool);
    const exactMessages = projectRequestImages(requestMessages, {
      ...projection,
      exact: true,
      byteLength: (ref) => requestImages.get(ref.attachmentId).bytes
    });
    const toolNames = /* @__PURE__ */ new Map();
    const messages = [];
    for (const message of exactMessages) {
      const tool = toolMessage(message);
      if (tool) {
        const content2 = await userContent(tool.content, requestImages, resolveImageAccess);
        messages.push({
          role: "toolResult",
          toolCallId: tool.toolCallId,
          toolName: toolNames.get(tool.toolCallId) ?? "unknown",
          content: typeof content2 === "string" ? [{ type: "text", text: content2 || "(no output)" }] : content2,
          isError: tool.isError ?? false,
          timestamp: 0
        });
        continue;
      }
      if (message.role === "system") {
        messages.push({ role: "user", content: flattenText(message), timestamp: 0 });
        continue;
      }
      if (message.role === "assistant") {
        appendAssistant(message, messages, toolNames, onReplayDegrade);
        continue;
      }
      const regular = message.content.filter((block) => block.type !== "tool-result");
      const content = await userContent(regular, requestImages, resolveImageAccess);
      const results = message.content.filter((block) => block.type === "tool-result");
      if (content.length > 0 || results.length === 0) {
        messages.push({ role: "user", content, timestamp: 0 });
      }
      for (const result of results) {
        const resultContent = await userContent(result.content, requestImages, resolveImageAccess);
        messages.push({
          role: "toolResult",
          toolCallId: result.toolCallId,
          toolName: toolNames.get(result.toolCallId) ?? "unknown",
          content: typeof resultContent === "string" ? [{ type: "text", text: resultContent || "(no output)" }] : resultContent,
          isError: result.isError ?? false,
          timestamp: 0
        });
      }
    }
    return piContext(split.systemPrompt, options, messages);
  } catch (_) {
    var _error = _, _hasError = true;
  } finally {
    __callDispose(_stack, _error, _hasError);
  }
}

// src/conversion/stream.ts
import { brandString as brandString2 } from "@deepseek-ai/dsh-brand";
import { CONTEXT_WINDOW_EXCEEDED_CODE, EMPTY_RESPONSE_CODE, isContextWindowExceededError, isQuotaExceededError, LlmError as LlmError5, QUOTA_EXCEEDED_CODE } from "@deepseek-ai/dsh-llm";
function mapUsage(usage) {
  return {
    inputTokens: usage.input,
    outputTokens: usage.output,
    totalTokens: usage.totalTokens,
    ...usage.cacheRead > 0 ? { cacheReadTokens: usage.cacheRead } : {},
    ...usage.cacheWrite > 0 ? { cacheWriteTokens: usage.cacheWrite } : {}
  };
}
function hasUsage(usage) {
  return usage.input > 0 || usage.output > 0 || usage.cacheRead > 0 || usage.cacheWrite > 0 || usage.totalTokens > 0;
}
function classifyPiAiError(message) {
  if (isQuotaExceededError(message)) return QUOTA_EXCEEDED_CODE;
  if (/\b(?:401|403)\b/.test(message)) return "AUTH";
  if (/\b429\b|rate.?limit/i.test(message)) return "RATE_LIMIT";
  if (/\b413\b|failed to buffer the request body:\s*length limit exceeded|payload too large|request body too large/i.test(message)) return "INVALID_REQUEST";
  if (/\b400\b|invalid.?request/i.test(message)) return "INVALID_REQUEST";
  if (/\b5\d\d\b/.test(message)) return "SERVER";
  if (/\btime(?:d)?\s*out\b|timeout/i.test(message)) return "TIMEOUT";
  if (/stream ended (?:before|without)\b/i.test(message)) return "TRANSPORT";
  if (/\b(?:network|connection|socket|fetch)\b|\bECONN[A-Z]+\b/i.test(message) || /\b(?:other side closed|HTTP2 request did not get a response|WebSocket closed unexpectedly)\b/i.test(message) || /\bterminated\b|premature close/i.test(message)) {
    return "TRANSPORT";
  }
  return "PI_AI_ERROR";
}
var MIN_ANSWER_ALLOWANCE = 1024;
function mapStopReason(message, contextWindow, reservedMaxTokens) {
  const piAiOverflow = isContextOverflow(message, contextWindow);
  const harnessOverflow = message.stopReason === "error" && message.errorMessage !== void 0 && isContextWindowExceededError(message.errorMessage);
  if (piAiOverflow || harnessOverflow) {
    return {
      kind: "error",
      failure: {
        message: message.errorMessage ?? `pi-ai detected context overflow for model "${message.model}"`,
        code: CONTEXT_WINDOW_EXCEEDED_CODE
      }
    };
  }
  switch (message.stopReason) {
    case "stop":
      if (message.content.length === 0) {
        return {
          kind: "error",
          failure: {
            message: `model "${message.model}" returned a completed response with no content`,
            code: EMPTY_RESPONSE_CODE
          }
        };
      }
      return { kind: "stop" };
    case "length":
      if (message.content.length === 0) {
        const raiseOutputLimit = reservedMaxTokens !== void 0 && (reservedMaxTokens <= MIN_ANSWER_ALLOWANCE || message.usage.output >= reservedMaxTokens);
        return {
          kind: "error",
          failure: {
            message: raiseOutputLimit ? `model "${message.model}" produced no content at its ${reservedMaxTokens}-token output allowance. Increase this model's "max output" in the plugin settings, then retry` : `model "${message.model}" produced no content at the output cap${contextWindow === void 0 ? "" : ` in a ${contextWindow}-token window`}. The prompt may leave too little room for an answer. Compact the context (/compact) or lower this model's "max output" in the plugin settings, then retry`,
            code: "INVALID_REQUEST"
          }
        };
      }
      return { kind: "max-tokens" };
    case "toolUse":
      return { kind: "tool-calls" };
    case "pending":
      return {
        kind: "error",
        failure: { message: `pi-ai stream for model "${message.model}" ended pending`, code: "PI_AI_ERROR" }
      };
    case "deferred":
      return {
        kind: "error",
        failure: { message: `pi-ai deferred response for model "${message.model}" is not supported`, code: "PI_AI_ERROR" }
      };
    case "aborted":
      return {
        kind: "aborted",
        failure: { message: message.errorMessage ?? "pi-ai stream aborted", code: "ABORTED" }
      };
    case "error": {
      const text2 = message.errorMessage ?? "pi-ai stream error";
      return { kind: "error", failure: { message: text2, code: classifyPiAiError(text2) } };
    }
  }
}
async function* toStreamChunks(events, contextWindow, callerSignal, requestedModel, requestedProvider, reservedMaxTokens) {
  const toolIds = /* @__PURE__ */ new Map();
  for await (const event of events) {
    switch (event.type) {
      case "start":
        break;
      case "text_start":
        yield { type: "block-start", index: event.contentIndex, blockType: "text" };
        break;
      case "text_delta":
        yield { type: "text-delta", index: event.contentIndex, text: event.delta };
        break;
      case "text_end":
        yield { type: "block-end", index: event.contentIndex, block: { type: "text", text: event.content } };
        break;
      case "thinking_start":
        yield { type: "block-start", index: event.contentIndex, blockType: "reasoning" };
        break;
      case "thinking_delta":
        yield { type: "reasoning-delta", index: event.contentIndex, text: event.delta };
        break;
      case "thinking_end":
        yield { type: "block-end", index: event.contentIndex, block: { type: "reasoning", text: event.content } };
        break;
      case "toolcall_start": {
        const partial = event.partial.content[event.contentIndex];
        const id = partial?.type === "toolCall" ? partial.id : "";
        const name2 = partial?.type === "toolCall" ? partial.name : "";
        toolIds.set(event.contentIndex, { id, name: name2 });
        yield { type: "block-start", index: event.contentIndex, blockType: "tool-call" };
        break;
      }
      case "toolcall_delta": {
        const known = toolIds.get(event.contentIndex);
        yield {
          type: "tool-call-delta",
          index: event.contentIndex,
          id: brandString2(known?.id ?? ""),
          ...known?.name !== void 0 && known.name.length > 0 ? { name: known.name } : {},
          argumentsDelta: event.delta
        };
        break;
      }
      case "toolcall_end":
        yield {
          type: "block-end",
          index: event.contentIndex,
          block: {
            type: "tool-call",
            id: brandString2(event.toolCall.id),
            name: event.toolCall.name,
            // pi-ai hands back the PARSED arguments; the harness vocabulary
            // keeps the raw string.
            arguments: JSON.stringify(event.toolCall.arguments)
          }
        };
        break;
      case "done": {
        const reason = mapStopReason(event.message, contextWindow, reservedMaxTokens);
        if (reason.kind !== "error" || hasUsage(event.message.usage)) {
          yield { type: "usage", usage: mapUsage(event.message.usage) };
        }
        yield {
          type: "finish",
          reason,
          replayState: toPiReplayState(event.message, requestedModel, requestedProvider)
        };
        return;
      }
      case "error":
        if (hasUsage(event.error.usage)) yield { type: "usage", usage: mapUsage(event.error.usage) };
        yield {
          type: "finish",
          reason: mapStopReason(
            callerSignal?.aborted ? { ...event.error, stopReason: "aborted" } : event.error,
            contextWindow,
            reservedMaxTokens
          )
        };
        return;
      default: {
        const unsupported = event;
        throw new LlmError5(`Unsupported pi-ai stream event: ${unsupported.type}`, "UNSUPPORTED_CONTENT");
      }
    }
  }
  throw new LlmError5("pi-ai event stream ended without done/error", "STREAM_CLOSED");
}

// src/config.ts
import z from "@deepseek-ai/schemastery";

// src/gateway-url.ts
var DEFAULT_BASE_URL = "https://api.cline.bot/api/v1";
function migrateGatewayBaseURL(baseURL) {
  const trimmed = baseURL.replace(/\/+$/, "");
  return trimmed === "https://api.cline.bot" ? DEFAULT_BASE_URL : trimmed;
}

// src/usage-display.ts
var USAGE_DISPLAY_MODES = ["auto", "always", "off"];
var DEFAULT_USAGE_DISPLAY = "auto";

// src/accounts.ts
var MAX_ACCOUNTS = 20;
var ACCOUNT_REF_PREFIX = "DSH_CLINEPASS_ACCOUNT_";
var DEFAULT_ACCOUNT_REF = "CLINE_API_KEY";
var ACCOUNT_REF_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
function accountRefOf(settings) {
  return settings.apiKeyEnv || DEFAULT_ACCOUNT_REF;
}
function moveAccountFirst(accounts, ref) {
  const index = accounts.findIndex((account) => account.apiKeyEnv === ref);
  return index <= 0 ? accounts : [accounts[index], ...accounts.slice(0, index), ...accounts.slice(index + 1)];
}
function accountsOf(settings) {
  const ref = accountRefOf(settings);
  if (settings.accounts?.length === 0) return [];
  const accounts = settings.accounts ?? [];
  return accounts.some((account) => account.apiKeyEnv === ref) ? moveAccountFirst(accounts, ref) : [
    { id: `legacy:${ref}`, name: "", apiKeyEnv: ref },
    ...accounts
  ];
}
function assertAccounts(accounts, selectedRef) {
  if (accounts == null) return;
  if (!Array.isArray(accounts) || accounts.length > MAX_ACCOUNTS || accounts.length === MAX_ACCOUNTS && selectedRef && !accounts.some((account) => account.apiKeyEnv === selectedRef)) {
    throw new Error(`ClinePass supports at most ${MAX_ACCOUNTS} accounts, including the selected reference`);
  }
  const ids = /* @__PURE__ */ new Set();
  const refs = /* @__PURE__ */ new Set();
  for (const account of accounts) {
    if (!account || typeof account.id !== "string" || !account.id || account.id.length > 128 || account.id.startsWith("legacy:") && account.id !== `legacy:${account.apiKeyEnv}` || typeof account.name !== "string" || !account.name.trim() && account.id !== `legacy:${account.apiKeyEnv}` || account.name.length > 80 || typeof account.apiKeyEnv !== "string" || !ACCOUNT_REF_PATTERN.test(account.apiKeyEnv) || ids.has(account.id) || refs.has(account.apiKeyEnv)) throw new Error("Invalid or duplicate ClinePass account");
    ids.add(account.id);
    refs.add(account.apiKeyEnv);
  }
}

// src/config.ts
var DEFAULT_API_KEY_ENV = DEFAULT_ACCOUNT_REF;
var DEFAULT_REFRESH_MINUTES = 60;
var DEFAULT_STREAM_IDLE_TIMEOUT_MS = 3e5;
var DEFAULT_REQUEST_PREPARATION_TIMEOUT_MS = 6e4;
var DEFAULT_REQUEST_TIMEOUT_MS = 30 * 6e4;
var fields = {
  enabled: z.boolean().default(true),
  usageDisplay: z.union(USAGE_DISPLAY_MODES.map((mode) => z.const(mode))).default(DEFAULT_USAGE_DISPLAY),
  modelVisibility: z.dict(z.boolean().required()).default({}),
  // A bare environment variable name: an empty string would otherwise pass the
  // schema, then never match any account (accountRefOf normalizes it away) and
  // silently deregister the route while the default credential still resolves.
  apiKeyEnv: z.string().role("credential-ref").pattern(ACCOUNT_REF_PATTERN).default(DEFAULT_API_KEY_ENV),
  accounts: z.union([z.const(null), z.array(z.object({
    id: z.string().required(),
    name: z.string().required(),
    apiKeyEnv: z.string().role("credential-ref").pattern(ACCOUNT_REF_PATTERN).required()
  })).max(MAX_ACCOUNTS)]).default(null),
  autoSwitch: z.boolean().default(false),
  // Internal recovery state uses the same durable profile/section as its accounts.
  // Cross-field ownership and discriminants are checked before any side effect.
  accountOperations: z.array(z.any()).max(MAX_ACCOUNTS).default([]).hidden(),
  // Settings rebuild and serialize this schema before sending it to clients.
  // Keep it data-only: a rehydrated transform loses its callback on forwarding.
  baseURL: z.string().default(DEFAULT_BASE_URL),
  proxyURL: z.string().default(""),
  refreshMinutes: z.number().step(1).min(1).max(7 * 24 * 60).default(DEFAULT_REFRESH_MINUTES),
  streamIdleTimeoutMs: z.number().min(Number.MIN_VALUE).max(MAX_TIMER_DELAY_MS).default(DEFAULT_STREAM_IDLE_TIMEOUT_MS),
  requestPreparationTimeoutMs: z.number().step(1).min(1).max(MAX_TIMER_DELAY_MS).default(DEFAULT_REQUEST_PREPARATION_TIMEOUT_MS),
  requestTimeoutMs: z.number().step(1).min(1).max(MAX_TIMER_DELAY_MS).default(DEFAULT_REQUEST_TIMEOUT_MS),
  maxImages: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER),
  // The image defaults are the generic pi-ai adapter's: one normalized
  // request image fits the budget, and fifteen of them fit the payload cap.
  maxRequestImageBytes: z.number().step(1).min(1).default(DEFAULT_MAX_REQUEST_IMAGE_BYTES),
  requestImagePixelBudget: z.number().step(1).min(1).default(DEFAULT_REQUEST_IMAGE_PIXEL_BUDGET),
  requestImageMaxBytes: z.number().step(1).min(1).default(DEFAULT_REQUEST_IMAGE_MAX_BYTES),
  // null explicitly selects catalog values, overriding even inherited profile limits.
  modelLimits: z.dict(z.union([z.const(null), z.object({
    contextWindow: z.union([z.const(null), z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER)]),
    maxTokens: z.union([z.const(null), z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER)]),
    thinkingBudgets: z.union([z.const(null), z.array(z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).required()).max(16)])
  })])).default({})
};
var PlainConfig = z.object(fields);
var Config = z.object(Object.fromEntries(
  Object.entries(fields).map(([key, schema]) => [key, schema.volatile()])
));
function readConfig(config) {
  const value = Object.fromEntries(Object.keys(fields).map((key) => [key, config[key].get()]));
  return { ...value, baseURL: migrateGatewayBaseURL(value.baseURL) };
}
function assertBaseURL(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`llm-clinepass: baseURL "${raw}" is not a valid URL`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`llm-clinepass: baseURL "${raw}" must be http or https`);
  }
  if (url.search.length > 0 || url.hash.length > 0) {
    throw new Error(`llm-clinepass: baseURL "${raw}" must not carry a query or fragment`);
  }
  return migrateGatewayBaseURL(url.toString().replace(/\/+$/, ""));
}
function assertApiKeyEnv(raw) {
  if (!ACCOUNT_REF_PATTERN.test(raw)) {
    throw new Error(`llm-clinepass: apiKeyEnv "${raw}" must be an environment variable name ([A-Za-z_][A-Za-z0-9_]*)`);
  }
}

// src/gateway-diagnostics.ts
import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// src/gateway-error.ts
import { isContextWindowExceededError as isContextWindowExceededError2, isQuotaExceededError as isQuotaExceededError2 } from "@deepseek-ai/dsh-llm";
function classifyGatewayError(status, body, fallback) {
  let error;
  try {
    const parsed = JSON.parse(body);
    error = parsed?.error && typeof parsed.error === "object" ? parsed.error : parsed;
  } catch {
  }
  const types = [error?.type, error?.code].filter((value) => typeof value === "string").map((value) => value.replace(/[^a-z0-9]/gi, "").toLowerCase());
  if (types.some((type) => ["modelerror", "modelnotfound", "unknownmodel"].includes(type))) return "UNKNOWN_MODEL";
  if (types.some((type) => [
    "creditserror",
    "monthlylimiterror",
    "userlimiterror",
    "gousagelimiterror",
    "insufficientquota",
    "quotaexceeded"
  ].includes(type))) return "QUOTA";
  if (types.some((type) => ["autherror", "authenticationerror", "invalidapikey", "invalidkey"].includes(type))) return "INVALID_CREDENTIAL";
  if (types.some((type) => ["regionerror", "datapolicyerror", "permissionerror", "permissiondenied"].includes(type))) return "AUTH";
  if (types.some((type) => ["ratelimiterror", "ratelimitexceeded"].includes(type))) return "RATE_LIMIT";
  const message = typeof error?.message === "string" ? error.message : body;
  if ([401, 402, 403, 429].includes(status) && isQuotaExceededError2(message)) return "QUOTA";
  if ((status === 401 || status === 403) && /(?:invalid|incorrect|expired)[ _-]?(?:api[ _-]?)?key|invalid credential/i.test(message)) return "INVALID_CREDENTIAL";
  if (status === 401 || status === 402 || status === 403) return "AUTH";
  if (status === 404) return "UNKNOWN_MODEL";
  if (status === 429) return "RATE_LIMIT";
  if (status === 408 || status === 504) return "TIMEOUT";
  if (status >= 500) return "SERVER";
  if (status === 400 || status === 413 || status === 422) {
    if (isContextWindowExceededError2([error?.type, error?.code, message].join(" "))) return "CONTEXT_WINDOW_EXCEEDED";
    return fallback === "CONTEXT_WINDOW_EXCEEDED" ? fallback : "INVALID_REQUEST";
  }
  return fallback;
}

// src/gateway-diagnostics.ts
var MAX_BODY_BYTES = 16 * 1024;
var BODY_READ_TIMEOUT_MS = 1e3;
var RESPONSE_HEADERS = [
  "content-type",
  "content-length",
  "server",
  "via",
  "x-request-id",
  "request-id",
  "cf-ray",
  "x-amzn-requestid",
  "x-vercel-id",
  "traceparent",
  "retry-after",
  // Cline is fronted by Cloudflare and exposes its edge placement on some paths.
  "cf-placement"
];
async function previewBody(response, callerSignal) {
  const chunks = [];
  let bytes = 0;
  let truncated = false;
  let readFailed = false;
  let reader;
  const signal = callerSignal ? AbortSignal.any([callerSignal, AbortSignal.timeout(BODY_READ_TIMEOUT_MS)]) : AbortSignal.timeout(BODY_READ_TIMEOUT_MS);
  const abort = Promise.withResolvers();
  const onAbort = () => {
    abort.reject(signal.reason);
  };
  try {
    signal.throwIfAborted();
    reader = response.clone().body?.getReader();
    if (reader) {
      signal.addEventListener("abort", onAbort, { once: true });
      while (true) {
        const part = await Promise.race([reader.read(), abort.promise]);
        if (part.done) break;
        const remaining = MAX_BODY_BYTES - bytes;
        chunks.push(part.value.slice(0, remaining));
        bytes += Math.min(part.value.byteLength, remaining);
        if (part.value.byteLength > remaining) {
          truncated = true;
          break;
        }
      }
    }
  } catch {
    readFailed = true;
  } finally {
    signal.removeEventListener("abort", onAbort);
    if (reader) void reader.cancel().catch(() => {
    });
  }
  return {
    text: Buffer.concat(chunks, bytes).toString("utf8"),
    bytes,
    truncated,
    ...readFailed ? { readFailed: true } : {}
  };
}
function requestSummary(input, init) {
  const url = new URL(input instanceof Request ? input.url : String(input));
  const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : void 0));
  const session = headers.get("x-task-id");
  const result = {
    url: `${url.origin}${url.pathname}`,
    method: init?.method ?? (input instanceof Request ? input.method : "GET"),
    sessionHash: session ? createHash("sha256").update(session).digest("hex").slice(0, 16) : void 0,
    userAgent: headers.get("user-agent")?.slice(0, 512)
  };
  if (typeof init?.body === "string") {
    result.bodyBytes = Buffer.byteLength(init.body);
    try {
      const body = JSON.parse(init.body);
      result.messageCount = Array.isArray(body?.messages) ? body.messages.length : void 0;
      result.toolCount = Array.isArray(body?.tools) ? body.tools.length : void 0;
      const maxTokens = body?.max_tokens ?? body?.max_completion_tokens ?? body?.max_output_tokens;
      if (typeof maxTokens === "number") result.maxTokens = maxTokens;
      const effort = body?.reasoning_effort ?? body?.reasoning?.effort;
      if (typeof effort === "string") result.reasoningEffort = effort.slice(0, 128);
      if (typeof body?.thinking?.type === "string") result.thinking = body.thinking.type.slice(0, 128);
    } catch {
    }
  }
  return result;
}
var GatewayDiagnostics = class {
  constructor(options) {
    this.options = options;
    this.secrets = [options.apiKey];
    if (options.proxyURL) {
      const url = new URL(options.proxyURL);
      for (const value of [url.username, url.password]) {
        if (value) this.secrets.push(value, decodeURIComponent(value));
      }
      if (url.username || url.password) {
        this.secrets.push(Buffer.from(`${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`).toString("base64"));
      }
    }
    this.secrets = [...new Set(this.secrets.flatMap((secret) => [secret, JSON.stringify(secret).slice(1, -1)]))].sort((a, b) => b.length - a.length);
  }
  evidence;
  code;
  secrets;
  redact(text2, truncated = false) {
    for (const secret of this.secrets) {
      if (!secret) continue;
      text2 = text2.replaceAll(secret, "[REDACTED]");
      if (truncated) for (let length = Math.min(secret.length - 1, text2.length); length > 0; length--) {
        if (text2.endsWith(secret.slice(0, length))) {
          text2 = text2.slice(0, -length) + "[REDACTED]";
          break;
        }
      }
    }
    return text2;
  }
  fetch = async (input, init) => {
    const response = await (this.options.fetch ?? globalThis.fetch)(input, init);
    const rawRequestId = response.headers.get("x-request-id") ?? response.headers.get("request-id") ?? response.headers.get("cf-ray");
    const requestId = rawRequestId === null ? void 0 : this.redact(rawRequestId, true).slice(0, 128);
    try {
      this.options.onResponse?.(response.status, requestId);
    } catch {
    }
    if (!response.ok) {
      const headers = {};
      for (const name2 of RESPONSE_HEADERS) {
        const value = response.headers.get(name2);
        if (value !== null) headers[name2] = this.redact(value).slice(0, 512);
      }
      const request = requestSummary(input, init);
      if (this.options.contextWindow !== void 0) request.contextWindow = this.options.contextWindow;
      const signal = init?.signal ?? (input instanceof Request ? input.signal : void 0);
      const time = (/* @__PURE__ */ new Date()).toISOString();
      const preview = previewBody(response, signal);
      this.code = preview.then((body) => classifyGatewayError(response.status, body.text, "PI_AI_ERROR"));
      this.evidence = preview.then((body) => ({
        time,
        provider: this.options.provider,
        model: this.options.model,
        ...this.options.callId === void 0 ? {} : { callId: this.options.callId, attempt: this.options.attempt },
        request,
        response: { status: response.status, headers, body: {
          ...body,
          text: this.redact(body.text, body.truncated || body.readFailed)
        } }
      }));
    }
    return response;
  };
  async failureCode(fallback) {
    const code = await this.code;
    return code === void 0 || code === "PI_AI_ERROR" || code === "INVALID_REQUEST" && fallback === "CONTEXT_WINDOW_EXCEEDED" ? fallback : code;
  }
  async failureMessage(original) {
    let message = this.redact(original);
    const evidence = await this.evidence;
    if (!evidence) return `${this.options.provider}/${this.options.model}: ${message}`;
    const { status, body } = evidence.response;
    if (body.bytes > 0 && message.includes("status code (no body)")) {
      message = `${status} ${body.text.slice(0, 1024)}`;
    }
    const presence = body.bytes > 0 ? "nonempty" : body.readFailed ? "unavailable" : "empty";
    message += ` [HTTP ${status}; response body: ${presence}${body.truncated ? ", truncated" : ""}${body.readFailed ? ", incomplete read" : ""}]`;
    if ([400, 413, 422].includes(status)) {
      const { maxTokens, contextWindow } = evidence.request;
      const allowance = typeof maxTokens === "number" ? `max_tokens=${maxTokens}` : "output allowance unavailable";
      const window = typeof contextWindow === "number" ? `; context window=${contextWindow}` : "";
      message += ` [${allowance}${window}. For context capacity failures, compact the conversation (/compact) or lower this model's Max output in ClinePass settings, then retry.]`;
    }
    if (this.options.directory?.trim()) {
      try {
        const directory = resolve(this.options.directory);
        await mkdir(directory, { recursive: true, mode: 448 });
        const file = join(directory, `http-error-${randomUUID()}.json`);
        await writeFile(file, JSON.stringify(evidence, (_key, value) => typeof value === "string" ? this.redact(value) : value, 2) + "\n", { flag: "wx", mode: 384 });
        message += ` [diagnostic file: ${this.redact(file)}]`;
      } catch {
        message += " [diagnostic file could not be written]";
      }
    }
    return `${this.options.provider}/${this.options.model}: ${message}`;
  }
};

// src/reasoning.ts
import { LlmError as LlmError6 } from "@deepseek-ai/dsh-llm";
var BUDGET_PRESETS = { minimal: 1024, low: 2048, medium: 8192, high: 16384 };
function supportsThinkingBudget(api2, compat) {
  const options = compat;
  return api2 === "anthropic-messages" ? options?.forceAdaptiveThinking !== true : api2 === "openai-completions" && Boolean(options?.thinkingTokenBudgetField || options?.supportsThinkingTokenBudget);
}
function reasoningBudgetRange(model) {
  if (!model.reasoning || !model.reasoningBudget) return void 0;
  return { min: model.reasoningBudget.min, max: Math.min(model.reasoningBudget.max, model.maxTokens - 1024) };
}
function withGatewayReasoning(model) {
  if (model.reasoning && model.reasoningControl === void 0 && model.api === "anthropic-messages" && supportsThinkingBudget(model.api, model.compat)) {
    return { ...model, reasoningControl: "budget", reasoningBudget: { min: 1024, max: Number.MAX_SAFE_INTEGER } };
  }
  return model;
}
function reasoningChoices(model) {
  if (!model.reasoning) return [];
  const range = reasoningBudgetRange(model);
  const presets = model.reasoningBudgetPresets ?? [];
  const valid = (tokens) => range !== void 0 && Number.isSafeInteger(tokens) && tokens >= range.min && tokens <= range.max;
  if (range && presets.some((tokens) => !valid(tokens))) {
    throw new LlmError6(`clinepass model "${model.id}" thinking budgets must be integers between ${range.min} and ${range.max} tokens`, "INVALID_REQUEST");
  }
  if (range && model.reasoningControl === "budget") {
    const choices = Object.entries(BUDGET_PRESETS).filter(([, tokens]) => valid(tokens)).map(([id, tokens]) => ({ id, tokens }));
    const existing = new Set(choices.map((choice) => choice.tokens));
    for (const tokens of new Set(presets.length > 0 || choices.length > 0 ? presets : [range.min])) {
      if (valid(tokens) && !existing.has(tokens)) {
        choices.push({ id: `budget:${tokens}`, tokens });
        existing.add(tokens);
      }
    }
    const enabled = choices.sort((a, b) => a.tokens - b.tokens).map(({ id, tokens }) => ({ id, name: `${tokens.toLocaleString("en-US")} tokens` }));
    return model.thinkingLevelMap?.off === null ? enabled : [{ id: "off", name: "Off" }, ...enabled];
  }
  return [...getSupportedThinkingLevels(model).map((id) => ({
    id,
    // Keep the durable high ID of the old switch, but describe its actual meaning.
    name: model.reasoningControl === "toggle" && id === "high" ? "On" : `${id.charAt(0).toUpperCase()}${id.slice(1)}`
  })), ...range === void 0 ? [] : [...new Set(presets)].sort((a, b) => a - b).map((tokens) => ({ id: `budget:${tokens}`, name: `${tokens.toLocaleString("en-US")} tokens` }))];
}
function reasoningIntent(model, level) {
  if (level === void 0) return { kind: "default" };
  if (level === "off") return { kind: "off" };
  const range = reasoningBudgetRange(model);
  if (range && (model.reasoningControl === "budget" || level.startsWith("budget:"))) return {
    kind: "budget",
    min: range.min,
    tokens: level.startsWith("budget:") ? Number(level.slice(7)) : BUDGET_PRESETS[level]
  };
  return model.reasoningControl === "toggle" ? { kind: "on" } : { kind: "effort", level };
}
function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function withoutKeys(value, keys) {
  const source = object(value);
  if (!source) return value;
  const result = { ...source };
  for (const key of keys) delete result[key];
  return Object.keys(result).length > 0 ? result : void 0;
}
function reasoningRequest(intent) {
  return {
    ...intent.kind === "effort" ? { reasoning: intent.level } : intent.kind === "budget" ? { reasoning: "high", thinkingBudgets: { high: intent.tokens } } : intent.kind === "on" ? { reasoning: "high" } : {},
    onPayload(payload) {
      if (intent.kind === "off" || intent.kind === "effort") return payload;
      const source = object(payload);
      if (!source) return payload;
      const body = { ...source };
      if (intent.kind === "budget") {
        const thinking = object(body.thinking);
        const actual = thinking?.budget_tokens ?? body.thinking_token_budget ?? body.thinking_budget ?? body.thinking_budget_tokens;
        const ceiling = body.max_tokens ?? body.max_completion_tokens;
        if (typeof actual !== "number" || actual < intent.min || typeof ceiling === "number" && actual > ceiling - 1024) {
          throw new LlmError6(`clinepass thinking budget requires at least ${intent.min} tokens of available thinking space`, "INVALID_REQUEST");
        }
      }
      delete body.reasoning_effort;
      body.reasoning = withoutKeys(body.reasoning, ["effort"]);
      body.output_config = withoutKeys(body.output_config, ["effort"]);
      if (intent.kind === "default") {
        delete body.thinking;
        delete body.enable_thinking;
        body.chat_template_kwargs = withoutKeys(body.chat_template_kwargs, ["enable_thinking"]);
        body.config = withoutKeys(body.config, ["thinkingConfig"]);
      }
      for (const key of ["reasoning", "output_config", "chat_template_kwargs", "config"]) {
        if (body[key] === void 0) delete body[key];
      }
      return body;
    }
  };
}

// src/request-budget.ts
var DEEPSEEK_V41_FLASH_DEFAULT_MAX_TOKENS = 65536;
var DEEPSEEK_V41_FLASH_MODEL = "cline-pass/deepseek-v4.1-flash";
function requestMaxTokens(model, limits, requested) {
  const configured = limits[model.id]?.maxTokens ?? void 0;
  const allowance = configured === void 0 ? requested : Math.min(requested ?? configured, configured);
  if (model.id !== DEEPSEEK_V41_FLASH_MODEL) return allowance;
  return Math.min(allowance ?? DEEPSEEK_V41_FLASH_DEFAULT_MAX_TOKENS, model.maxTokens);
}

// src/request-executor.ts
function resolveReasoningLevel(model, effort) {
  if (effort === void 0) return void 0;
  const supported = reasoningChoices(model).map((choice) => choice.id);
  if (supported.some((level) => level === effort)) return effort;
  throw new LlmError7(
    `clinepass model "${model.id}" does not support reasoning effort "${effort}"`,
    "UNSUPPORTED_REASONING_EFFORT"
  );
}
var ClinePassRequestExecutor = class {
  constructor(options, transport) {
    this.options = options;
    this.transport = transport;
  }
  /** One account, one SDK attempt; host recovery still owns failures after output. */
  async *stream(options, snapshot, trace) {
    var _stack = [];
    try {
      if (options.stop !== void 0) {
        throw new LlmError7("llm-clinepass does not support GenerateOptions.stop", "UNSUPPORTED_OPTION");
      }
      const { config, provider, model, sessionId } = snapshot;
      const maxTokens = requestMaxTokens(model, config.modelLimits, options.maxTokens);
      const reasoning = resolveReasoningLevel(model, options.reasoningEffort);
      const consumer = new AbortController();
      const upstream = options.signal === void 0 ? consumer.signal : AbortSignal.any([options.signal, consumer.signal]);
      const watchdog = __using(_stack, idleWatchdog(upstream, config.streamIdleTimeoutMs, "LLM_STREAM_IDLE_TIMEOUT"));
      const preparation = __using(_stack, deadline(watchdog.signal, config.requestPreparationTimeoutMs ?? DEFAULT_REQUEST_PREPARATION_TIMEOUT_MS, "LLM_PREPARATION_TIMEOUT"));
      const payloadLease = __using(_stack, new ImagePayloadLease(trace.imagePool));
      try {
        const apiKey = await trace.measure("credential", () => waitWithSignal(
          () => this.options.resolveApiKey(config, preparation.signal),
          preparation.signal
        ));
        if (!apiKey) throw new LlmError7("llm-clinepass: no credential resolved for the route", "MISSING_CREDENTIAL");
        const containsImage = options.messages.some((message) => contentHasImage2(message.content));
        if (containsImage && !model.input.includes("image")) {
          throw new LlmError7(`clinepass model "${model.id}" does not support image input`, "UNSUPPORTED_CONTENT");
        }
        let imageRequest;
        if (containsImage) {
          const access = this.options.imageAccess;
          const store = access?.resolveAttachments();
          if (access === void 0 || store === void 0) {
            throw new LlmError7("llm-clinepass image input requires the durable attachment service", "UNSUPPORTED_CONTENT");
          }
          imageRequest = {
            attachments: store,
            resolveImageAccess: (ref) => access.resolveImageAccess(store, ref),
            maxImages: config.maxImages ?? void 0,
            maxRequestImageBytes: config.maxRequestImageBytes,
            requestImagePolicy: {
              maxPixels: config.requestImagePixelBudget,
              maxBytes: config.requestImageMaxBytes
            },
            payloadLease,
            onImagePool: trace.imagePool
          };
        }
        const context = await trace.measure("images", () => waitWithSignal(() => imageRequest === void 0 ? Promise.resolve(toPiContext(options, void 0, this.options.onReplayDegrade)) : toPiContext({ ...options, signal: preparation.signal }, imageRequest, this.options.onReplayDegrade), preparation.signal));
        preparation[Symbol.dispose]();
        watchdog.signal.throwIfAborted();
        const diagnostics = new GatewayDiagnostics({
          provider: String(options.provider),
          model: model.id,
          apiKey,
          proxyURL: config.proxyURL,
          fetch: this.transport.forProxy(config.proxyURL),
          directory: this.options.debugDirectory ? this.options.debugDirectory() : process.env.DSH_CLINEPASS_DEBUG_DIR,
          callId: trace.callId,
          attempt: trace.attempts,
          contextWindow: model.contextWindow,
          onResponse: (status, requestId) => trace.response(status, requestId)
        });
        const events = provider.streamSimple(model, normalizeContext(context), {
          apiKey,
          fetch: diagnostics.fetch,
          ...reasoningRequest(reasoningIntent(model, reasoning)),
          ...options.temperature === void 0 ? {} : { temperature: options.temperature },
          ...maxTokens === void 0 ? {} : { maxTokens },
          sessionId,
          signal: watchdog.signal,
          // Harness-owned request identity: `X-Task-ID` is Cline's documented
          // per-task request header (the extension sets it on every call), and
          // attribution merges last in pi-ai's client.
          headers: {
            "X-Task-ID": sessionId,
            ...attributionHeaders()
          },
          // The agent recovery layer owns visible attempts; one adapter call is
          // one SDK attempt.
          maxRetries: 0
        });
        const iterator = toStreamChunks(events, model.contextWindow, options.signal, model.id, options.provider, maxTokens)[Symbol.asyncIterator]();
        let exhausted = false;
        try {
          while (true) {
            const result = await trace.measure("stream", () => waitWithSignal(() => watchdog.next(iterator), watchdog.signal));
            if (timeoutOf(watchdog.signal, "LLM_REQUEST_TIMEOUT")) throw new LlmError7("clinepass whole request timeout", "TIMEOUT");
            if (timeoutOf(watchdog.signal, "LLM_STREAM_IDLE_TIMEOUT") !== void 0) {
              throw new LlmError7("clinepass stream idle timeout", "TIMEOUT");
            }
            if (result.done) {
              exhausted = true;
              return;
            }
            const chunk = result.value;
            if ((chunk.type === "text-delta" || chunk.type === "reasoning-delta") && chunk.text.length > 0 || chunk.type === "tool-call-delta" && chunk.argumentsDelta.length > 0) trace.firstOutput();
            if (chunk.type === "finish" && chunk.reason.kind === "error") {
              const failure = chunk.reason.failure;
              const message = await waitWithSignal(() => diagnostics.failureMessage(failure.message), watchdog.signal);
              const code = await waitWithSignal(() => diagnostics.failureCode(failure.code), watchdog.signal);
              yield { ...chunk, reason: options.signal?.aborted ? { kind: "aborted", failure: { code: "ABORTED", message: "clinepass request aborted by caller" } } : { ...chunk.reason, failure: { ...chunk.reason.failure, message, code } } };
            } else yield chunk;
          }
        } finally {
          if (!exhausted) {
            consumer.abort("clinepass stream consumer stopped");
            try {
              void iterator.return(void 0).catch(() => {
              });
            } catch (_abortedSdkTeardown) {
            }
          }
        }
      } catch (error) {
        if (timeoutOf(preparation.signal, "LLM_PREPARATION_TIMEOUT")) {
          throw new LlmError7("clinepass credential/image preparation timeout", "TIMEOUT", { cause: error });
        }
        if (timeoutOf(watchdog.signal, "LLM_REQUEST_TIMEOUT")) {
          throw new LlmError7("clinepass whole request timeout", "TIMEOUT", { cause: error });
        }
        if (timeoutOf(watchdog.signal, "LLM_STREAM_IDLE_TIMEOUT") !== void 0) {
          throw new LlmError7("clinepass stream idle timeout", "TIMEOUT", { cause: error });
        }
        if (options.signal?.aborted) {
          throw new LlmError7("clinepass request aborted by caller", "ABORTED", { cause: error });
        }
        throw error;
      }
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
};

// src/adapter.ts
import {
  LlmAdapter,
  LlmError as LlmError9,
  ReasoningEffortId
} from "@deepseek-ai/dsh-llm";
import { deadline as deadline2, timeoutOf as timeoutOf2 } from "@deepseek-ai/dsh-timeout";

// src/catalog.ts
import { randomUUID as randomUUID2 } from "node:crypto";

// node_modules/clinepass-pi-ai/dist/api/openai-completions.js
var openai_completions_exports = {};
__export(openai_completions_exports, {
  convertMessages: () => convertMessages,
  stream: () => stream,
  streamSimple: () => streamSimple
});
import OpenAI from "openai";

// node_modules/clinepass-pi-ai/dist/utils/error-body.js
var MAX_PROVIDER_ERROR_BODY_CHARS = 4e3;
function normalizeProviderError(error) {
  if (!(error instanceof Error)) {
    return { message: safeJsonStringify(error), messageCarriesBody: false };
  }
  const sdkError = error;
  const status = extractStatus(sdkError);
  const body = extractBody(sdkError);
  const messageCarriesBody = body === void 0 || error.message.includes(body);
  return {
    status,
    body,
    message: error.message,
    messageCarriesBody
  };
}
function extractStatus(error) {
  if (typeof error.statusCode === "number")
    return error.statusCode;
  if (typeof error.status === "number")
    return error.status;
  if (typeof error.$metadata?.httpStatusCode === "number")
    return error.$metadata.httpStatusCode;
  if (typeof error.$response?.statusCode === "number")
    return error.$response.statusCode;
  return void 0;
}
function extractBody(error) {
  const bodyText = pickBodyText(error);
  if (bodyText === void 0)
    return void 0;
  const trimmed = bodyText.trim();
  if (trimmed.length === 0)
    return void 0;
  return truncateErrorText(trimmed, MAX_PROVIDER_ERROR_BODY_CHARS);
}
function pickBodyText(error) {
  if (typeof error.body === "string")
    return error.body;
  if (isPlainNonEmptyObject(error.error))
    return safeJsonStringify(error.error);
  const responseBody = error.$response?.body;
  if (typeof responseBody === "string")
    return responseBody;
  if (isReadableStreamLike(responseBody))
    return void 0;
  if (isPlainNonEmptyObject(responseBody))
    return safeJsonStringify(responseBody);
  return void 0;
}
function isReadableStreamLike(value) {
  return typeof value === "object" && value !== null && "pipe" in value && typeof value.pipe === "function";
}
function isPlainNonEmptyObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null)
    return false;
  return Object.keys(value).length > 0;
}
function formatProviderError(norm, prefix) {
  if (norm.messageCarriesBody || norm.status === void 0 || norm.body === void 0) {
    return prefix !== void 0 && norm.status !== void 0 ? `${prefix} (${norm.status}): ${norm.message}` : norm.message;
  }
  return prefix !== void 0 ? `${prefix} (${norm.status}): ${norm.body}` : `${norm.status}: ${norm.body}`;
}
function truncateErrorText(text2, maxChars) {
  if (text2.length <= maxChars)
    return text2;
  return `${text2.slice(0, maxChars)}... [truncated ${text2.length - maxChars} chars]`;
}
function safeJsonStringify(value) {
  try {
    const serialized = JSON.stringify(value);
    return serialized === void 0 ? String(value) : serialized;
  } catch {
    return String(value);
  }
}

// node_modules/clinepass-pi-ai/dist/utils/hash.js
function shortHash(str) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}

// node_modules/clinepass-pi-ai/dist/utils/headers.js
function headersToRecord(headers) {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
}

// node_modules/clinepass-pi-ai/dist/utils/pi-user-agent.js
function loadNodeOs() {
  if (typeof process === "undefined" || !(process.versions?.node || process.versions?.bun)) {
    return null;
  }
  return process.getBuiltinModule?.("node:os") ?? null;
}
var nodeOs = loadNodeOs();
function getPiUserAgent() {
  return nodeOs ? `pi (${nodeOs.platform()} ${nodeOs.release()}; ${nodeOs.arch()})` : "pi (browser)";
}

// node_modules/clinepass-pi-ai/dist/utils/provider-env.js
var procEnvCache = null;
function getBunSandboxEnvValue(name2) {
  if (typeof process === "undefined" || !process.versions?.bun || Object.keys(process.env).length > 0) {
    return void 0;
  }
  if (procEnvCache === null) {
    procEnvCache = /* @__PURE__ */ new Map();
    try {
      const { readFileSync } = __require("node:fs");
      const data = readFileSync("/proc/self/environ", "utf-8");
      for (const entry of data.split("\0")) {
        const idx = entry.indexOf("=");
        if (idx > 0) {
          procEnvCache.set(entry.slice(0, idx), entry.slice(idx + 1));
        }
      }
    } catch {
    }
  }
  return procEnvCache.get(name2);
}
function getProviderEnvValue(name2, env) {
  return env?.[name2] || (typeof process !== "undefined" ? process.env[name2] : void 0) || getBunSandboxEnvValue(name2) || void 0;
}

// node_modules/clinepass-pi-ai/dist/utils/provider-retry.js
var DEFAULT_MAX_RETRY_DELAY_MS = 6e4;
function isProviderError(error) {
  if (!(error instanceof Error) || !("status" in error) || !("headers" in error))
    return false;
  return (error.status === void 0 || typeof error.status === "number") && (error.headers === void 0 || error.headers instanceof Headers);
}
function isRetryableProviderError(error) {
  const shouldRetry = error.headers?.get("x-should-retry");
  if (shouldRetry === "true")
    return true;
  if (shouldRetry === "false")
    return false;
  if (error.status === void 0)
    return true;
  return error.status === 408 || error.status === 409 || error.status === 429 || typeof error.status === "number" && error.status >= 500;
}
function validateServerRetryDelayMs(delayMs, maxRetryDelayMs, providerErrorMessage) {
  const maxDelayMs = maxRetryDelayMs ?? DEFAULT_MAX_RETRY_DELAY_MS;
  if (maxDelayMs > 0 && delayMs > maxDelayMs) {
    throw new Error(`Server requested ${Math.ceil(delayMs / 1e3)}s retry delay (max: ${Math.ceil(maxDelayMs / 1e3)}s). ${providerErrorMessage}`);
  }
  return delayMs;
}
function getRetryDelayMs(error, retryIndex, maxRetryDelayMs) {
  const retryAfterMs = error.headers?.get("retry-after-ms");
  if (retryAfterMs) {
    const value = Number.parseFloat(retryAfterMs);
    if (Number.isFinite(value))
      return validateServerRetryDelayMs(value, maxRetryDelayMs, error.message);
  }
  const retryAfter = error.headers?.get("retry-after");
  if (retryAfter) {
    const seconds = Number.parseFloat(retryAfter);
    const delayMs = Number.isNaN(seconds) ? Date.parse(retryAfter) - Date.now() : seconds * 1e3;
    if (Number.isFinite(delayMs))
      return validateServerRetryDelayMs(delayMs, maxRetryDelayMs, error.message);
  }
  const exponentialDelay = Math.min(0.5 * 2 ** retryIndex, 8) * 1e3;
  return exponentialDelay * (1 - Math.random() * 0.25);
}
function createAbortError() {
  const error = new Error("Request aborted");
  error.name = "AbortError";
  return error;
}
function abortableSleep(ms, signal) {
  return new Promise((resolve3, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      reject(createAbortError());
    };
    const timeout = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve3();
    }, Math.max(0, ms));
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
async function retryProviderRequest(request, options = {}) {
  const maxRetries = options.maxRetries ?? 0;
  let retriesRemaining = maxRetries;
  for (; ; ) {
    try {
      return await request();
    } catch (error) {
      if (options.signal?.aborted)
        throw createAbortError();
      if (retriesRemaining <= 0 || !isProviderError(error) || !isRetryableProviderError(error))
        throw error;
      if (error.status !== void 0 && options.noRetryStatuses?.includes(error.status))
        throw error;
      const retryIndex = maxRetries - retriesRemaining;
      retriesRemaining--;
      await abortableSleep(getRetryDelayMs(error, retryIndex, options.maxRetryDelayMs), options.signal);
    }
  }
}

// node_modules/clinepass-pi-ai/dist/utils/sanitize-unicode.js
function sanitizeSurrogates(text2) {
  return text2.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}

// node_modules/clinepass-pi-ai/dist/api/constrained-sampling.js
var UnsupportedStrictJsonSchemaError = class extends Error {
};
var UNSUPPORTED_STRICT_SCHEMA_KEYS = [
  "$ref",
  "$defs",
  "definitions",
  "allOf",
  "oneOf",
  "patternProperties",
  "dependentSchemas",
  "dependencies",
  "unevaluatedProperties",
  "propertyNames",
  "contains",
  "prefixItems",
  "not",
  "if",
  "then",
  "else"
];
function isJsonSchemaObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStructuredSchema(schema) {
  if (!isJsonSchemaObject(schema))
    return false;
  const types = typeof schema.type === "string" ? [schema.type] : Array.isArray(schema.type) ? schema.type : [];
  return types.includes("object") || types.includes("array") || schema.properties !== void 0 || schema.items !== void 0;
}
function schemaAllowsNull(schema) {
  if (!isJsonSchemaObject(schema))
    return false;
  if (schema.type === "null" || Array.isArray(schema.type) && schema.type.includes("null"))
    return true;
  if (schema.const === null || Array.isArray(schema.enum) && schema.enum.includes(null))
    return true;
  return Array.isArray(schema.anyOf) && schema.anyOf.some((variant) => schemaAllowsNull(variant));
}
function makeJsonSchemaNodeStrict(schema, isUnsupportedKeyword) {
  if (!isJsonSchemaObject(schema)) {
    throw new UnsupportedStrictJsonSchemaError("boolean schemas are unsupported");
  }
  for (const key of UNSUPPORTED_STRICT_SCHEMA_KEYS) {
    if (schema[key] !== void 0) {
      throw new UnsupportedStrictJsonSchemaError(`${key} schemas are unsupported`);
    }
  }
  if (isUnsupportedKeyword) {
    for (const [key, value] of Object.entries(schema)) {
      if (isUnsupportedKeyword(key, value)) {
        throw new UnsupportedStrictJsonSchemaError(`${key}: ${JSON.stringify(value)} is unsupported`);
      }
    }
  }
  if (schema.anyOf !== void 0) {
    if (!Array.isArray(schema.anyOf) || schema.anyOf.length === 0) {
      throw new UnsupportedStrictJsonSchemaError("anyOf must contain at least one schema");
    }
    for (const variant of schema.anyOf) {
      if (isStructuredSchema(variant)) {
        throw new UnsupportedStrictJsonSchemaError("object and array unions are unsupported");
      }
      makeJsonSchemaNodeStrict(variant, isUnsupportedKeyword);
    }
  }
  if (schema.items !== void 0) {
    if (Array.isArray(schema.items)) {
      throw new UnsupportedStrictJsonSchemaError("tuple schemas are unsupported");
    }
    makeJsonSchemaNodeStrict(schema.items, isUnsupportedKeyword);
  }
  const isObjectSchema = schema.type === "object";
  if (schema.properties !== void 0 && !isObjectSchema) {
    throw new UnsupportedStrictJsonSchemaError("properties require type object");
  }
  if (!isObjectSchema)
    return;
  if (schema.additionalProperties !== void 0 && schema.additionalProperties !== false) {
    throw new UnsupportedStrictJsonSchemaError("schema-valued or true additionalProperties is unsupported");
  }
  if (schema.properties !== void 0 && !isJsonSchemaObject(schema.properties)) {
    throw new UnsupportedStrictJsonSchemaError("object properties must be a schema map");
  }
  if (schema.required !== void 0 && (!Array.isArray(schema.required) || schema.required.some((key) => typeof key !== "string"))) {
    throw new UnsupportedStrictJsonSchemaError("object required must be a string array");
  }
  const properties = schema.properties ?? {};
  const propertyNames = Object.keys(properties);
  const required = new Set(Array.isArray(schema.required) ? schema.required : []);
  if ([...required].some((key) => !propertyNames.includes(key))) {
    throw new UnsupportedStrictJsonSchemaError("required contains an unknown property");
  }
  for (const [key, property] of Object.entries(properties)) {
    makeJsonSchemaNodeStrict(property, isUnsupportedKeyword);
    if (!required.has(key) && !schemaAllowsNull(property)) {
      properties[key] = { anyOf: [property, { type: "null" }] };
    }
  }
  schema.required = propertyNames;
  schema.additionalProperties = false;
}
function makeStrictJsonSchema(schema, isUnsupportedKeyword) {
  const cloned = structuredClone(schema);
  if (!isJsonSchemaObject(cloned)) {
    throw new UnsupportedStrictJsonSchemaError("root schema must have type object");
  }
  makeJsonSchemaNodeStrict(cloned, isUnsupportedKeyword);
  if (cloned.type !== "object") {
    throw new UnsupportedStrictJsonSchemaError("root schema must have type object");
  }
  return cloned;
}
function getJsonSchemaToolParameters(tool, strict) {
  return strict === true ? makeStrictJsonSchema(tool.parameters) : tool.parameters;
}
function getGrammarToolInput(toolName, arguments_, inputProperty) {
  const input = arguments_[inputProperty];
  if (typeof input !== "string") {
    throw new Error(`Grammar tool call "${toolName}" requires argument "${inputProperty}" to be a string.`);
  }
  return input;
}
function appendGrammarToolInputJsonDelta(buffer, inputProperty, nextInput, close) {
  if (buffer.closed) {
    if (close && nextInput === buffer.input)
      return void 0;
    throw new Error(`grammar tool input for property "${inputProperty}" changed after it was closed`);
  }
  if (!nextInput.startsWith(buffer.input)) {
    throw new Error(`grammar tool input for property "${inputProperty}" changed non-monotonically`);
  }
  const inputDelta = nextInput.slice(buffer.input.length);
  if (!close && inputDelta.length === 0)
    return void 0;
  let delta = "";
  if (!buffer.started) {
    delta += `{${JSON.stringify(inputProperty)}:"`;
    buffer.started = true;
  }
  delta += JSON.stringify(inputDelta).slice(1, -1);
  buffer.input = nextInput;
  if (close) {
    delta += '"}';
    buffer.closed = true;
  }
  return delta;
}
function inferGrammarInputProperty(tool) {
  const schema = tool.parameters;
  if (schema.type !== "object") {
    throw new Error("grammar constrained sampling requires an object parameter schema");
  }
  if (!Array.isArray(schema.required) || schema.required.length !== 1 || typeof schema.required[0] !== "string") {
    throw new Error("grammar constrained sampling requires exactly one required string property");
  }
  const inputProperty = schema.required[0];
  if (!schema.properties?.[inputProperty]) {
    throw new Error(`grammar constrained sampling requires a properties entry for ${inputProperty}`);
  }
  if (schema.properties[inputProperty]?.type !== "string") {
    throw new Error(`grammar constrained sampling property ${inputProperty} must have type string`);
  }
  return inputProperty;
}
function resolveJsonSchemaStrictSampling(tool, supportsStrictMode, isUnsupportedKeyword) {
  const config = tool.constrainedSampling;
  if (!config || config.type !== "json_schema")
    return void 0;
  if (supportsStrictMode) {
    try {
      makeStrictJsonSchema(tool.parameters, isUnsupportedKeyword);
      return true;
    } catch (error) {
      if (!(error instanceof UnsupportedStrictJsonSchemaError))
        throw error;
      if (config.strict !== "require")
        return void 0;
      throw new Error(`Tool "${tool.name}" requires JSON-schema constrained sampling, but ${error.message}.`);
    }
  }
  if (config.strict === "require") {
    throw new Error(`Tool "${tool.name}" requires JSON-schema constrained sampling, but strict tools are unsupported.`);
  }
  return void 0;
}
function resolveGrammarConstrainedSampling(tool, supportsOpenAIGrammarTools) {
  const config = tool.constrainedSampling;
  if (!config || config.type !== "grammar") {
    return void 0;
  }
  if (!supportsOpenAIGrammarTools) {
    return void 0;
  }
  const larkDefinition = config.variants.openai_lark;
  const regexDefinition = config.variants.openai_regex;
  const hasLarkDefinition = typeof larkDefinition === "string" && larkDefinition.trim().length > 0;
  const hasRegexDefinition = typeof regexDefinition === "string" && regexDefinition.trim().length > 0;
  if (!hasLarkDefinition && !hasRegexDefinition) {
    throw new Error(`Tool "${tool.name}" cannot use grammar constrained sampling: no supported grammar variant was provided.`);
  }
  try {
    return {
      format: hasLarkDefinition ? "lark" : "regex",
      definition: hasLarkDefinition ? larkDefinition : regexDefinition,
      inputProperty: inferGrammarInputProperty(tool)
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Tool "${tool.name}" cannot use grammar constrained sampling: ${message}.`);
  }
}
function createGrammarToolInputProperties(tools, supportsOpenAIGrammarTools) {
  const properties = /* @__PURE__ */ new Map();
  for (const tool of tools ?? []) {
    const grammar = resolveGrammarConstrainedSampling(tool, supportsOpenAIGrammarTools);
    if (grammar) {
      properties.set(tool.name, grammar.inputProperty);
    }
  }
  return properties;
}

// node_modules/clinepass-pi-ai/dist/api/github-copilot-headers.js
function inferCopilotInitiator(messages) {
  const last = messages[messages.length - 1];
  return last && last.role !== "user" ? "agent" : "user";
}
function hasCopilotVisionInput(messages) {
  return messages.some((msg) => {
    if (msg.role === "user" && Array.isArray(msg.content)) {
      return msg.content.some((c) => c.type === "image");
    }
    if (msg.role === "toolResult" && Array.isArray(msg.content)) {
      return msg.content.some((c) => c.type === "image");
    }
    return false;
  });
}
function buildCopilotDynamicHeaders(params) {
  const headers = {
    "X-Initiator": inferCopilotInitiator(params.messages),
    "Openai-Intent": "conversation-edits"
  };
  if (params.hasImages) {
    headers["Copilot-Vision-Request"] = "true";
  }
  return headers;
}

// node_modules/clinepass-pi-ai/dist/api/openai-prompt-cache.js
var OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;
function clampOpenAIPromptCacheKey(key) {
  if (key === void 0)
    return void 0;
  const chars = Array.from(key);
  if (chars.length <= OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH)
    return key;
  return chars.slice(0, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH).join("");
}

// node_modules/clinepass-pi-ai/dist/utils/estimate.js
var CHARS_PER_TOKEN = 3.5;
var ESTIMATED_IMAGE_CHARS = 4800;
function calculateContextTokens(usage) {
  return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function safeJsonStringify2(value) {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return "[unserializable]";
  }
}
function estimateTextAndImageContentChars(content) {
  if (typeof content === "string")
    return content.length;
  let chars = 0;
  for (const block of content)
    chars += block.type === "text" ? block.text.length : ESTIMATED_IMAGE_CHARS;
  return chars;
}
function estimateTextTokens(text2) {
  return Math.ceil(text2.length / CHARS_PER_TOKEN);
}
function estimateTextAndImageContentTokens(content) {
  return Math.ceil(estimateTextAndImageContentChars(content) / CHARS_PER_TOKEN);
}
function estimateMessageTokens(message) {
  let chars = 0;
  if (message.role === "system") {
    return estimateTextTokens(getSystemMessageText(message)) + estimateToolsTokens(message.toolsAdded) + estimateToolsTokens(message.toolsRemoved);
  }
  if (message.role === "user")
    return estimateTextAndImageContentTokens(message.content);
  if (message.role === "toolResult")
    return estimateTextAndImageContentTokens(message.content);
  for (const block of message.content) {
    if (block.type === "text") {
      chars += block.text.length;
    } else if (block.type === "thinking") {
      chars += block.thinking.length;
    } else {
      chars += block.name.length + safeJsonStringify2(block.arguments).length;
    }
  }
  return Math.ceil(chars / CHARS_PER_TOKEN);
}
function getLastAssistantUsageInfo(messages) {
  let latestPrefixTimestamp = Number.NEGATIVE_INFINITY;
  let usageInfo;
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.role === "assistant") {
      const assistant = message;
      const usageAppliesToPrefix = assistant.timestamp >= latestPrefixTimestamp;
      if (usageAppliesToPrefix && assistant.stopReason !== "aborted" && assistant.stopReason !== "error" && calculateContextTokens(assistant.usage) > 0) {
        usageInfo = { usage: assistant.usage, index: i };
      }
    }
    latestPrefixTimestamp = Math.max(latestPrefixTimestamp, message.timestamp);
  }
  return usageInfo;
}
function estimateContextTokens(context) {
  const messages = "messages" in context ? context.messages : context;
  const usageInfo = getLastAssistantUsageInfo(messages);
  if (usageInfo) {
    const usageTokens = calculateContextTokens(usageInfo.usage);
    let trailingTokens = 0;
    for (let i = usageInfo.index + 1; i < messages.length; i++) {
      trailingTokens += estimateMessageTokens(messages[i]);
    }
    return { tokens: usageTokens + trailingTokens, usageTokens, trailingTokens, lastUsageIndex: usageInfo.index };
  }
  let tokens = 0;
  for (const message of messages)
    tokens += estimateMessageTokens(message);
  return { tokens, usageTokens: 0, trailingTokens: tokens, lastUsageIndex: null };
}
function estimateToolsTokens(tools) {
  if (!tools || tools.length === 0)
    return 0;
  return estimateTextTokens(safeJsonStringify2(tools));
}

// node_modules/clinepass-pi-ai/dist/api/simple-options.js
var CONTEXT_SAFETY_TOKENS = 4096;
var MIN_MAX_TOKENS = 1;
function clampMaxTokensToContext(model, context, maxTokens) {
  if (model.contextWindow <= 0)
    return Math.max(MIN_MAX_TOKENS, maxTokens);
  const available = model.contextWindow - estimateContextTokens(context).tokens - CONTEXT_SAFETY_TOKENS;
  return Math.min(maxTokens, Math.max(MIN_MAX_TOKENS, available));
}
function resolveSamplingParams(model, thinkingLevel, requestParams) {
  const effectiveThinkingLevel = clampThinkingLevel(model, thinkingLevel);
  const thinkingLevelParams = model.samplingParamsByThinkingLevel?.[effectiveThinkingLevel];
  return model.samplingParams || thinkingLevelParams || requestParams ? { ...model.samplingParams, ...thinkingLevelParams, ...requestParams } : void 0;
}
function buildBaseOptions(model, context, options, apiKey) {
  const samplingParams = resolveSamplingParams(model, options?.reasoning ?? "off", options?.samplingParams);
  return {
    temperature: options?.temperature,
    samplingParams,
    maxTokens: clampMaxTokensToContext(model, context, options?.maxTokens ?? model.maxTokens),
    signal: options?.signal,
    telemetryContext: options?.telemetryContext,
    apiKey: apiKey || options?.apiKey,
    fetch: options?.fetch,
    transport: options?.transport,
    cacheRetention: options?.cacheRetention,
    sessionId: options?.sessionId,
    headers: options?.headers,
    onPayload: options?.onPayload,
    onResponse: options?.onResponse,
    onProviderStreamEvent: options?.onProviderStreamEvent,
    timeoutMs: options?.timeoutMs,
    websocketConnectTimeoutMs: options?.websocketConnectTimeoutMs,
    maxRetries: options?.maxRetries,
    maxRetryDelayMs: options?.maxRetryDelayMs,
    metadata: options?.metadata,
    env: options?.env
  };
}
var MIN_ANSWER_TOKENS = 1024;
var DEFAULT_THINKING_BUDGETS = {
  minimal: 1024,
  low: 2048,
  medium: 8192,
  high: 16384
};
function clampReasoning(effort) {
  return effort === "xhigh" || effort === "max" ? "high" : effort;
}
function thinkingBudgetForLevel(reasoningLevel, customBudgets) {
  const budgets = { ...DEFAULT_THINKING_BUDGETS, ...customBudgets };
  const level = clampReasoning(reasoningLevel);
  return budgets[level];
}
function clampThinkingBudgetToAnswerRoom(thinkingBudget, ceiling) {
  return Math.min(thinkingBudget, Math.max(0, ceiling - MIN_ANSWER_TOKENS));
}

// node_modules/clinepass-pi-ai/dist/api/transform-messages.js
var NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
var NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
  const result = [];
  let previousWasPlaceholder = false;
  for (const block of content) {
    if (block.type === "image") {
      if (!previousWasPlaceholder) {
        result.push({ type: "text", text: placeholder });
      }
      previousWasPlaceholder = true;
      continue;
    }
    result.push(block);
    previousWasPlaceholder = block.text === placeholder;
  }
  return result;
}
function downgradeUnsupportedImages(messages, model) {
  if (model.input.includes("image")) {
    return messages;
  }
  return messages.map((msg) => {
    if (msg.role === "user" && Array.isArray(msg.content)) {
      return {
        ...msg,
        content: replaceImagesWithPlaceholder(msg.content, NON_VISION_USER_IMAGE_PLACEHOLDER)
      };
    }
    if (msg.role === "toolResult") {
      return {
        ...msg,
        content: replaceImagesWithPlaceholder(msg.content, NON_VISION_TOOL_IMAGE_PLACEHOLDER)
      };
    }
    return msg;
  });
}
function transformMessages(messages, model, normalizeToolCallId) {
  const toolCallIdMap = /* @__PURE__ */ new Map();
  const normalizedMessages = messages.map((msg) => msg.content == null ? { ...msg, content: [] } : msg);
  const imageAwareMessages = downgradeUnsupportedImages(normalizedMessages, model);
  const transformed = imageAwareMessages.map((msg) => {
    if (msg.role === "system" || msg.role === "user") {
      return msg;
    }
    if (msg.role === "toolResult") {
      const normalizedId = toolCallIdMap.get(msg.toolCallId);
      if (normalizedId && normalizedId !== msg.toolCallId) {
        return { ...msg, toolCallId: normalizedId };
      }
      return msg;
    }
    if (msg.role === "assistant") {
      const assistantMsg = msg;
      const isSameModel = assistantMsg.provider === model.provider && assistantMsg.api === model.api && assistantMsg.model === model.id;
      const transformedContent = assistantMsg.content.flatMap((block) => {
        if (block.type === "thinking") {
          if (block.redacted) {
            return isSameModel ? block : [];
          }
          if (isSameModel && block.thinkingSignature)
            return block;
          if (!block.thinking || block.thinking.trim() === "")
            return [];
          if (isSameModel)
            return block;
          return {
            type: "text",
            text: block.thinking
          };
        }
        if (block.type === "text") {
          if (isSameModel)
            return block;
          return {
            type: "text",
            text: block.text
          };
        }
        if (block.type === "toolCall") {
          const toolCall = block;
          let normalizedToolCall = toolCall;
          if (!isSameModel && toolCall.thoughtSignature) {
            normalizedToolCall = { ...toolCall };
            delete normalizedToolCall.thoughtSignature;
          }
          if (!isSameModel && normalizeToolCallId) {
            const normalizedId = normalizeToolCallId(toolCall.id, model, assistantMsg);
            if (normalizedId !== toolCall.id) {
              toolCallIdMap.set(toolCall.id, normalizedId);
              normalizedToolCall = { ...normalizedToolCall, id: normalizedId };
            }
          }
          return normalizedToolCall;
        }
        return block;
      });
      return {
        ...assistantMsg,
        content: transformedContent
      };
    }
    return msg;
  });
  const result = [];
  let pendingToolCalls = [];
  let existingToolResultIds = /* @__PURE__ */ new Set();
  const heldSystemMessages = [];
  const closePendingToolCalls = () => {
    if (pendingToolCalls.length > 0) {
      for (const tc of pendingToolCalls) {
        if (!existingToolResultIds.has(tc.id)) {
          result.push({
            role: "toolResult",
            toolCallId: tc.id,
            toolName: tc.name,
            content: [{ type: "text", text: "No result provided" }],
            isError: true,
            timestamp: Date.now()
          });
        }
      }
      pendingToolCalls = [];
      existingToolResultIds = /* @__PURE__ */ new Set();
    }
    result.push(...heldSystemMessages);
    heldSystemMessages.length = 0;
  };
  for (let i = 0; i < transformed.length; i++) {
    const msg = transformed[i];
    if (msg.role === "assistant") {
      closePendingToolCalls();
      const assistantMsg = msg;
      if (assistantMsg.stopReason === "error" || assistantMsg.stopReason === "aborted") {
        continue;
      }
      const toolCalls = assistantMsg.content.filter((b) => b.type === "toolCall");
      if (toolCalls.length > 0) {
        pendingToolCalls = toolCalls;
        existingToolResultIds = /* @__PURE__ */ new Set();
      }
      result.push(msg);
    } else if (msg.role === "toolResult") {
      existingToolResultIds.add(msg.toolCallId);
      result.push(msg);
    } else if (msg.role === "system") {
      if (pendingToolCalls.length > 0) {
        heldSystemMessages.push(msg);
      } else {
        result.push(msg);
      }
    } else if (msg.role === "user") {
      closePendingToolCalls();
      result.push(msg);
    } else {
      result.push(msg);
    }
  }
  closePendingToolCalls();
  return result;
}

// node_modules/clinepass-pi-ai/dist/api/openai-completions.js
function hasHeader(headers, name2) {
  if (!headers)
    return false;
  const expected = name2.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === expected && value !== null && value.trim().length > 0)
      return true;
  }
  return false;
}
function getClientApiKey(provider, apiKey, headers) {
  if (apiKey)
    return apiKey;
  if (hasHeader(headers, "authorization") || hasHeader(headers, "cf-aig-authorization"))
    return "unused";
  throw new Error(`No API key for provider: ${provider}`);
}
function hasToolHistory(messages) {
  for (const msg of messages) {
    if (msg.role === "toolResult") {
      return true;
    }
    if (msg.role === "assistant") {
      if (msg.content.some((block) => block.type === "toolCall")) {
        return true;
      }
    }
  }
  return false;
}
function isTextContentBlock(block) {
  return block.type === "text";
}
function isThinkingContentBlock(block) {
  return block.type === "thinking";
}
function isToolCallBlock(block) {
  return block.type === "toolCall";
}
function isImageContentBlock(block) {
  return block.type === "image";
}
function isReasoningDetailObject(detail) {
  return typeof detail === "object" && detail !== null && !Array.isArray(detail);
}
function hasValidCommonReasoningDetailFields(candidate) {
  return (candidate.id === void 0 || candidate.id === null || typeof candidate.id === "string") && (candidate.format === void 0 || typeof candidate.format === "string") && (candidate.index === void 0 || typeof candidate.index === "number");
}
function isOpenAIReasoningDetail(detail) {
  if (!isReasoningDetailObject(detail) || !hasValidCommonReasoningDetailFields(detail)) {
    return false;
  }
  switch (detail.type) {
    case "reasoning.summary":
      return typeof detail.summary === "string";
    case "reasoning.encrypted":
      return typeof detail.data === "string";
    case "reasoning.text":
      return typeof detail.text === "string" && (detail.signature === void 0 || detail.signature === null || typeof detail.signature === "string");
    default:
      return false;
  }
}
function parseOpenAIReasoningDetails(signature) {
  if (!signature)
    return void 0;
  try {
    const parsed = JSON.parse(signature);
    return Array.isArray(parsed) && parsed.length > 0 && parsed.every(isOpenAIReasoningDetail) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function parseLegacyEncryptedReasoningDetail(signature) {
  if (!signature)
    return void 0;
  try {
    const parsed = JSON.parse(signature);
    return isOpenAIReasoningDetail(parsed) && parsed.type === "reasoning.encrypted" && typeof parsed.id === "string" && parsed.id.length > 0 && parsed.data.length > 0 ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function fillMissingCommonReasoningDetailFields(target, source) {
  target.id ??= source.id;
  target.format ||= source.format;
  target.index ??= source.index;
}
function appendOpenAIReasoningDetail(details, detail) {
  const lastDetail = details[details.length - 1];
  if (detail.type === "reasoning.text" && lastDetail?.type === "reasoning.text") {
    lastDetail.text += detail.text;
    lastDetail.signature ||= detail.signature;
    fillMissingCommonReasoningDetailFields(lastDetail, detail);
    return;
  }
  if (detail.type === "reasoning.summary" && lastDetail?.type === "reasoning.summary") {
    lastDetail.summary += detail.summary;
    fillMissingCommonReasoningDetailFields(lastDetail, detail);
    return;
  }
  details.push({ ...detail });
}
var OPENAI_COMPLETIONS_REASONING_FIELDS = ["reasoning", "reasoning_content", "reasoning_text"];
function isOpenAICompletionsReasoningField(field) {
  return OPENAI_COMPLETIONS_REASONING_FIELDS.includes(field);
}
function resolveCacheRetention(cacheRetention, env) {
  if (cacheRetention) {
    return cacheRetention;
  }
  if (getProviderEnvValue("PI_CACHE_RETENTION", env) === "long") {
    return "long";
  }
  return "short";
}
var stream = (model, context, options) => {
  const stream2 = new AssistantMessageEventStream();
  const normalizedContext = resolveTranscript(context, getCompat(model).supportsMidConvoSystemMessages);
  (async () => {
    const output = {
      role: "assistant",
      content: [],
      api: model.api,
      provider: model.provider,
      model: model.id,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: "pending",
      timestamp: Date.now()
    };
    let streamedReasoningDetails;
    const applyStreamedReasoningDetails = (block) => {
      if (streamedReasoningDetails !== void 0) {
        block.thinkingSignature = JSON.stringify(streamedReasoningDetails);
      }
    };
    try {
      const apiKey = getClientApiKey(model.provider, options?.apiKey, options?.headers);
      const compat = getCompat(model);
      const grammarToolInputProperties = createGrammarToolInputProperties(getDeclaredTools(normalizedContext.messages), compat.supportsOpenAIGrammarTools);
      const cacheRetention = resolveCacheRetention(options?.cacheRetention, options?.env);
      const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
      const client = createClient(model, normalizedContext, apiKey, options?.headers, options?.fetch, cacheSessionId, compat);
      let params = buildParams(model, normalizedContext, options, compat, cacheRetention, grammarToolInputProperties);
      const nextParams = await options?.onPayload?.(params, model);
      if (nextParams !== void 0) {
        params = nextParams;
      }
      const requestOptions = {
        ...options?.signal ? { signal: options.signal } : {},
        ...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
        maxRetries: 0
      };
      const { data: openaiStream, response } = await retryProviderRequest(() => client.chat.completions.create(params, requestOptions).withResponse(), {
        maxRetries: options?.maxRetries,
        maxRetryDelayMs: options?.maxRetryDelayMs,
        signal: options?.signal
      });
      await options?.onResponse?.({ status: response.status, headers: headersToRecord(response.headers) }, model);
      stream2.push({ type: "start", partial: output });
      let textBlock = null;
      let thinkingBlock = null;
      let hasFinishReason = false;
      const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
      const toolCallBlocksById = /* @__PURE__ */ new Map();
      const blocks = output.content;
      const getContentIndex = (block) => blocks.indexOf(block);
      const getCustomToolCallInput = (block) => {
        const property = block.customInput?.property;
        if (property === void 0)
          return "";
        const value = block.arguments[property];
        return typeof value === "string" ? value : "";
      };
      const appendCustomToolCallInput = (block, nextInput, close) => {
        const customInput = block.customInput;
        if (!customInput)
          return void 0;
        const delta = appendGrammarToolInputJsonDelta(customInput.jsonBuffer, customInput.property, nextInput, close);
        block.arguments = { [customInput.property]: nextInput };
        return delta;
      };
      const finishBlock = (block) => {
        const contentIndex = getContentIndex(block);
        if (contentIndex === -1) {
          return;
        }
        if (block.type === "text") {
          stream2.push({
            type: "text_end",
            contentIndex,
            content: block.text,
            partial: output
          });
        } else if (block.type === "thinking") {
          applyStreamedReasoningDetails(block);
          stream2.push({
            type: "thinking_end",
            contentIndex,
            content: block.thinking,
            partial: output
          });
        } else if (block.type === "toolCall") {
          if (block.customInput) {
            const delta = appendCustomToolCallInput(block, getCustomToolCallInput(block), true);
            if (delta !== void 0) {
              stream2.push({
                type: "toolcall_delta",
                contentIndex,
                delta,
                partial: output
              });
            }
          } else {
            block.arguments = parseStreamingJson(block.partialArgs);
          }
          delete block.partialArgs;
          delete block.customInput;
          delete block.streamIndex;
          stream2.push({
            type: "toolcall_end",
            contentIndex,
            toolCall: block,
            partial: output
          });
        }
      };
      const ensureTextBlock = () => {
        if (!textBlock) {
          textBlock = { type: "text", text: "" };
          blocks.push(textBlock);
          stream2.push({ type: "text_start", contentIndex: getContentIndex(textBlock), partial: output });
        }
        return textBlock;
      };
      const ensureThinkingBlock = (thinkingSignature) => {
        if (!thinkingBlock) {
          thinkingBlock = {
            type: "thinking",
            thinking: "",
            thinkingSignature
          };
          blocks.push(thinkingBlock);
          stream2.push({ type: "thinking_start", contentIndex: getContentIndex(thinkingBlock), partial: output });
        }
        return thinkingBlock;
      };
      const ensureToolCallBlock = (toolCall) => {
        const streamIndex = typeof toolCall.index === "number" ? toolCall.index : void 0;
        const name2 = toolCall.function?.name ?? toolCall.custom?.name ?? "";
        let block = streamIndex !== void 0 ? toolCallBlocksByIndex.get(streamIndex) : void 0;
        if (!block && toolCall.id) {
          block = toolCallBlocksById.get(toolCall.id);
        }
        if (!block) {
          const customInputProperty = toolCall.custom && !toolCall.function ? grammarToolInputProperties.get(name2) ?? "input" : void 0;
          const hasCustomInput = customInputProperty !== void 0;
          block = {
            type: "toolCall",
            id: toolCall.id || "",
            name: name2,
            arguments: hasCustomInput ? { [customInputProperty]: "" } : {},
            partialArgs: hasCustomInput ? void 0 : "",
            customInput: hasCustomInput ? { property: customInputProperty, jsonBuffer: { input: "", started: false, closed: false } } : void 0,
            streamIndex
          };
          if (streamIndex !== void 0) {
            toolCallBlocksByIndex.set(streamIndex, block);
          }
          if (toolCall.id) {
            toolCallBlocksById.set(toolCall.id, block);
          }
          blocks.push(block);
          stream2.push({
            type: "toolcall_start",
            contentIndex: getContentIndex(block),
            partial: output
          });
        }
        if (streamIndex !== void 0 && block.streamIndex === void 0) {
          block.streamIndex = streamIndex;
          toolCallBlocksByIndex.set(streamIndex, block);
        }
        if (toolCall.id) {
          toolCallBlocksById.set(toolCall.id, block);
        }
        if (!block.name && name2) {
          block.name = name2;
        }
        if (toolCall.custom && !toolCall.function && !block.customInput) {
          const customInputProperty = grammarToolInputProperties.get(block.name) ?? "input";
          block.arguments = { [customInputProperty]: "" };
          block.customInput = {
            property: customInputProperty,
            jsonBuffer: { input: "", started: false, closed: false }
          };
          delete block.partialArgs;
        }
        return block;
      };
      for await (const chunk of openaiStream) {
        await options?.onProviderStreamEvent?.(chunk, model);
        if (!chunk || typeof chunk !== "object")
          continue;
        output.responseId ||= chunk.id;
        if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) {
          output.responseModel ||= chunk.model;
        }
        if (chunk.usage) {
          output.usage = parseChunkUsage(chunk.usage, model);
        }
        const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
        if (!choice)
          continue;
        if (!chunk.usage && choice.usage) {
          output.usage = parseChunkUsage(choice.usage, model);
        }
        if (choice.finish_reason) {
          output.rawStopReason = choice.finish_reason;
          const finishReasonResult = mapStopReason2(choice.finish_reason);
          output.stopReason = finishReasonResult.stopReason;
          if (finishReasonResult.errorMessage) {
            output.errorMessage = finishReasonResult.errorMessage;
          }
          hasFinishReason = true;
        }
        if (choice.delta) {
          if (choice.delta.content !== null && choice.delta.content !== void 0 && choice.delta.content.length > 0) {
            const block = ensureTextBlock();
            block.text += choice.delta.content;
            stream2.push({
              type: "text_delta",
              contentIndex: getContentIndex(block),
              delta: choice.delta.content,
              partial: output
            });
          }
          const reasoningFields = ["reasoning_content", "reasoning", "reasoning_text"];
          const deltaFields = choice.delta;
          let foundReasoningField = null;
          for (const field of reasoningFields) {
            const value = deltaFields[field];
            if (typeof value === "string" && value.length > 0) {
              foundReasoningField = field;
              break;
            }
          }
          if (foundReasoningField) {
            const delta = deltaFields[foundReasoningField];
            if (typeof delta === "string" && delta.length > 0) {
              const thinkingSignature = model.provider === "opencode-go" && foundReasoningField === "reasoning" ? "reasoning_content" : foundReasoningField;
              const block = ensureThinkingBlock(thinkingSignature);
              block.thinking += delta;
              stream2.push({
                type: "thinking_delta",
                contentIndex: getContentIndex(block),
                delta,
                partial: output
              });
            }
          }
          if (choice?.delta?.tool_calls) {
            for (const toolCall of choice.delta.tool_calls) {
              const block = ensureToolCallBlock(toolCall);
              if (!block.id && toolCall.id) {
                block.id = toolCall.id;
                toolCallBlocksById.set(toolCall.id, block);
              }
              const name2 = toolCall.function?.name ?? toolCall.custom?.name;
              if (!block.name && name2) {
                block.name = name2;
              }
              let delta = "";
              if (toolCall.function?.arguments) {
                delta = toolCall.function.arguments;
                block.partialArgs = (block.partialArgs ?? "") + toolCall.function.arguments;
                block.arguments = parseStreamingJson(block.partialArgs);
              } else if (toolCall.custom?.input) {
                const nextInput = getCustomToolCallInput(block) + toolCall.custom.input;
                delta = appendCustomToolCallInput(block, nextInput, false) ?? "";
              }
              stream2.push({
                type: "toolcall_delta",
                contentIndex: getContentIndex(block),
                delta,
                partial: output
              });
            }
          }
          const reasoningDetails = choice.delta.reasoning_details;
          if (Array.isArray(reasoningDetails)) {
            for (const detail of reasoningDetails) {
              if (!isOpenAIReasoningDetail(detail))
                continue;
              ensureThinkingBlock("");
              streamedReasoningDetails ??= [];
              appendOpenAIReasoningDetail(streamedReasoningDetails, detail);
            }
          }
        }
      }
      for (const block of blocks) {
        finishBlock(block);
      }
      if (options?.signal?.aborted) {
        throw new Error("Request was aborted");
      }
      if (output.stopReason === "aborted") {
        throw new Error("Request was aborted");
      }
      if (!hasFinishReason && !compat.supportsFinishReason) {
        output.stopReason = output.content.some((block) => block.type === "toolCall") ? "toolUse" : "stop";
      }
      if (output.stopReason === "error") {
        throw new Error(output.errorMessage || "Provider returned an error stop reason");
      }
      if (compat.supportsFinishReason && !hasFinishReason || output.stopReason === "pending") {
        throw new Error("Stream ended without finish_reason");
      }
      stream2.push({ type: "done", reason: output.stopReason, message: output });
      stream2.end();
    } catch (error) {
      for (const block of output.content) {
        if (block.type === "thinking") {
          applyStreamedReasoningDetails(block);
        }
        delete block.index;
        delete block.partialArgs;
        delete block.customInput;
        delete block.streamIndex;
      }
      output.stopReason = options?.signal?.aborted ? "aborted" : "error";
      output.errorMessage = formatProviderError(normalizeProviderError(error));
      const rawMetadata = error?.error?.metadata?.raw;
      if (rawMetadata && !output.errorMessage.includes(String(rawMetadata))) {
        output.errorMessage += `
${rawMetadata}`;
      }
      stream2.push({ type: "error", reason: output.stopReason, error: output });
      stream2.end();
    }
  })();
  return stream2;
};
var streamSimple = (model, context, options) => {
  getClientApiKey(model.provider, options?.apiKey, options?.headers);
  const base = {
    ...buildBaseOptions(model, context, options, options?.apiKey),
    toolChoice: options?.toolChoice
  };
  const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
  const reasoningEffort = clampedReasoning === "off" ? void 0 : clampedReasoning;
  return stream(model, context, {
    ...base,
    reasoningEffort,
    thinkingBudgets: options?.thinkingBudgets
  });
};
function createClient(model, context, apiKey, optionsHeaders, fetch, sessionId, compat = getCompat(model)) {
  const headers = { "User-Agent": getPiUserAgent(), ...model.headers };
  if (model.provider === "github-copilot") {
    const hasImages = hasCopilotVisionInput(context.messages);
    const copilotHeaders = buildCopilotDynamicHeaders({
      messages: context.messages,
      hasImages
    });
    Object.assign(headers, copilotHeaders);
  }
  if (sessionId && compat.sendSessionAffinityHeaders) {
    if (compat.sessionAffinityFormat === "openrouter") {
      headers["x-session-id"] = sessionId;
    } else {
      if (compat.sessionAffinityFormat === "openai") {
        headers.session_id = sessionId;
      }
      headers["x-client-request-id"] = sessionId;
      headers["x-session-affinity"] = sessionId;
    }
  }
  if (optionsHeaders) {
    Object.assign(headers, optionsHeaders);
  }
  return new OpenAI({
    apiKey,
    baseURL: model.baseUrl,
    dangerouslyAllowBrowser: true,
    fetch,
    defaultHeaders: headers
  });
}
function buildParams(model, context, options, compat = getCompat(model), cacheRetention = resolveCacheRetention(options?.cacheRetention, options?.env), grammarToolInputProperties = createGrammarToolInputProperties(getDeclaredTools(context.messages), compat.supportsOpenAIGrammarTools)) {
  const transcriptTools = resolveTranscriptTools(context.messages, compat.supportsMidConvoSystemMessages === true && compat.supportsMidConvoToolAdditions === true);
  const messages = convertMessages(model, context, compat, {
    grammarToolInputProperties
  });
  const cacheControl = getCompatCacheControl(compat, cacheRetention);
  const params = {
    model: model.id,
    messages,
    stream: true,
    prompt_cache_key: model.baseUrl.includes("api.openai.com") && cacheRetention !== "none" || cacheRetention === "long" && compat.supportsLongCacheRetention ? clampOpenAIPromptCacheKey(options?.sessionId) : void 0,
    prompt_cache_retention: cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0
  };
  if (compat.supportsUsageInStreaming !== false) {
    params.stream_options = { include_usage: true };
  }
  if (compat.supportsStore) {
    params.store = false;
  }
  if (options?.maxTokens) {
    if (compat.maxTokensField === "max_tokens") {
      params.max_tokens = options.maxTokens;
    } else {
      params.max_completion_tokens = options.maxTokens;
    }
  }
  if (options?.temperature !== void 0) {
    params.temperature = options.temperature;
  }
  if (transcriptTools.requestTools.length > 0) {
    params.tools = convertTools(transcriptTools.requestTools, compat);
    if (compat.zaiToolStream) {
      params.tool_stream = true;
    }
  } else if (hasToolHistory(context.messages)) {
    params.tools = [];
  }
  if (cacheControl) {
    applyAnthropicCacheControl(messages, params.tools, cacheControl);
  }
  if (options?.toolChoice) {
    params.tool_choice = options.toolChoice;
  }
  if (compat.vllmPriority !== void 0) {
    params.priority = compat.vllmPriority;
  }
  const thinkingTokenBudgetField = resolveThinkingTokenBudgetField(compat);
  const thinkingBudget = resolveClampedThinkingBudget(model, options, params);
  if (compat.thinkingFormat === "zai" && model.reasoning) {
    const zaiParams = params;
    zaiParams.thinking = options?.reasoningEffort ? { type: "enabled", clear_thinking: false } : { type: "disabled" };
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      const mappedEffort = model.thinkingLevelMap?.[options.reasoningEffort];
      const effort = mappedEffort === void 0 ? options.reasoningEffort : mappedEffort;
      if (typeof effort === "string") {
        zaiParams.reasoning_effort = effort;
      }
    }
  } else if (compat.thinkingFormat === "qwen" && model.reasoning) {
    params.enable_thinking = !!options?.reasoningEffort;
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      const effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
      if (typeof effort === "string") {
        params.reasoning_effort = effort;
      }
    }
  } else if (compat.thinkingFormat === "qwen-chat-template" && model.reasoning) {
    params.chat_template_kwargs = {
      enable_thinking: !!options?.reasoningEffort,
      preserve_thinking: true
    };
  } else if (compat.thinkingFormat === "chat-template" && model.reasoning) {
    const chatTemplateKwargs = buildChatTemplateValues(model, options, compat.chatTemplateKwargs, thinkingBudget);
    if (chatTemplateKwargs) {
      params.chat_template_kwargs = chatTemplateKwargs;
    }
  } else if (compat.thinkingFormat === "baseten" && model.reasoning) {
    const basetenParams = params;
    const chatTemplateArgs = buildChatTemplateValues(model, options, compat.chatTemplateArgs, thinkingBudget);
    if (chatTemplateArgs) {
      basetenParams.chat_template_args = chatTemplateArgs;
    }
    if (compat.supportsReasoningEffort) {
      const requestedEffort = options?.reasoningEffort;
      const mappedEffort = requestedEffort ? model.thinkingLevelMap?.[requestedEffort] : model.thinkingLevelMap?.off;
      const effort = mappedEffort === void 0 ? requestedEffort : mappedEffort;
      if (typeof effort === "string") {
        basetenParams.reasoning_effort = effort;
      }
    }
  } else if (compat.thinkingFormat === "deepseek" && model.reasoning) {
    if (options?.reasoningEffort) {
      params.thinking = { type: "enabled" };
    } else if (model.thinkingLevelMap?.off !== null) {
      params.thinking = { type: "disabled" };
    }
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    }
  } else if (compat.thinkingFormat === "openrouter" && model.reasoning) {
    const openRouterParams = params;
    if (options?.reasoningEffort) {
      openRouterParams.reasoning = {
        effort: model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort
      };
    } else if (model.thinkingLevelMap?.off !== null) {
      openRouterParams.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
    }
  } else if (compat.thinkingFormat === "ant-ling" && model.reasoning && options?.reasoningEffort) {
    const effort = model.thinkingLevelMap?.[options.reasoningEffort];
    if (typeof effort === "string") {
      params.reasoning = { effort };
    }
  } else if (compat.thinkingFormat === "together" && model.reasoning) {
    const togetherParams = params;
    togetherParams.reasoning = { enabled: !!options?.reasoningEffort };
    if (options?.reasoningEffort && compat.supportsReasoningEffort) {
      togetherParams.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    }
  } else if (compat.thinkingFormat === "string-thinking" && model.reasoning) {
    const stringThinkingParams = params;
    if (options?.reasoningEffort) {
      stringThinkingParams.thinking = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
    } else if (model.thinkingLevelMap?.off !== null) {
      stringThinkingParams.thinking = model.thinkingLevelMap?.off ?? "none";
    }
  } else if (options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
    params.reasoning_effort = model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort;
  } else if (!options?.reasoningEffort && model.reasoning && compat.supportsReasoningEffort) {
    const offValue = model.thinkingLevelMap?.off;
    if (typeof offValue === "string") {
      params.reasoning_effort = offValue;
    }
  }
  if (thinkingTokenBudgetField && thinkingBudget !== void 0) {
    Object.assign(params, { [thinkingTokenBudgetField]: thinkingBudget });
  }
  if (model.compat?.openRouterRouting) {
    params.provider = model.compat.openRouterRouting;
  }
  if (model.compat?.vercelGatewayRouting) {
    const routing = model.compat.vercelGatewayRouting;
    if (routing.only || routing.order) {
      const gatewayOptions = {};
      if (routing.only)
        gatewayOptions.only = routing.only;
      if (routing.order)
        gatewayOptions.order = routing.order;
      params.providerOptions = { gateway: gatewayOptions };
    }
  }
  const samplingParams = resolveSamplingParams(model, options?.reasoningEffort ?? "off", options?.samplingParams);
  if (samplingParams) {
    Object.assign(params, samplingParams);
  }
  return params;
}
function resolveThinkingTokenBudgetField(compat) {
  if (compat.thinkingTokenBudgetField)
    return compat.thinkingTokenBudgetField;
  if (compat.supportsThinkingTokenBudget)
    return "thinking_token_budget";
  return void 0;
}
function resolveClampedThinkingBudget(model, options, params) {
  if (!options?.reasoningEffort || !model.reasoning)
    return void 0;
  const ceiling = params.max_tokens ?? params.max_completion_tokens ?? model.maxTokens;
  const budget = clampThinkingBudgetToAnswerRoom(thinkingBudgetForLevel(options.reasoningEffort, options.thinkingBudgets), ceiling);
  return budget > 0 ? budget : void 0;
}
function buildChatTemplateValues(model, options, values, thinkingBudget) {
  const resolvedValues = {};
  for (const [key, value] of Object.entries(values)) {
    const resolved = resolveChatTemplateKwargValue(model, options, value, thinkingBudget);
    if (resolved !== void 0) {
      resolvedValues[key] = resolved;
    }
  }
  return Object.keys(resolvedValues).length > 0 ? resolvedValues : void 0;
}
function resolveChatTemplateKwargValue(model, options, value, thinkingBudget) {
  if (typeof value !== "object" || value === null) {
    return value;
  }
  const reasoningEffort = options?.reasoningEffort;
  if (!reasoningEffort && value.omitWhenOff) {
    return void 0;
  }
  if (value.$var === "thinking.enabled") {
    return !!reasoningEffort;
  }
  if (value.$var === "thinking.budget") {
    return thinkingBudget;
  }
  const mappedValue = reasoningEffort ? model.thinkingLevelMap?.[reasoningEffort] : model.thinkingLevelMap?.off;
  return mappedValue === void 0 ? reasoningEffort : typeof mappedValue === "string" ? mappedValue : void 0;
}
function getCompatCacheControl(compat, cacheRetention) {
  if (compat.cacheControlFormat !== "anthropic" || cacheRetention === "none") {
    return void 0;
  }
  const ttl = cacheRetention === "long" && compat.supportsLongCacheRetention ? "1h" : void 0;
  return { type: "ephemeral", ...ttl ? { ttl } : {} };
}
function applyAnthropicCacheControl(messages, tools, cacheControl) {
  addCacheControlToSystemPrompt(messages, cacheControl);
  addCacheControlToLastTool(tools, cacheControl);
  addCacheControlToLastConversationMessage(messages, cacheControl);
}
function addCacheControlToSystemPrompt(messages, cacheControl) {
  for (const message of messages) {
    if (message.role === "system" || message.role === "developer") {
      addCacheControlToInstructionMessage(message, cacheControl);
      return;
    }
  }
}
function addCacheControlToLastConversationMessage(messages, cacheControl) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === "user" || message.role === "assistant" || message.role === "tool") {
      if (addCacheControlToMessage(message, cacheControl)) {
        return;
      }
    }
  }
}
function addCacheControlToLastTool(tools, cacheControl) {
  if (!tools || tools.length === 0) {
    return;
  }
  const lastTool = tools[tools.length - 1];
  lastTool.cache_control = cacheControl;
}
function addCacheControlToInstructionMessage(message, cacheControl) {
  return addCacheControlToTextContent(message, cacheControl);
}
function addCacheControlToMessage(message, cacheControl) {
  if (message.role === "user" || message.role === "assistant" || message.role === "tool") {
    return addCacheControlToTextContent(message, cacheControl);
  }
  return false;
}
function addCacheControlToTextContent(message, cacheControl) {
  const content = message.content;
  if (typeof content === "string") {
    if (content.length === 0) {
      return false;
    }
    message.content = [
      {
        type: "text",
        text: content,
        cache_control: cacheControl
      }
    ];
    return true;
  }
  if (!Array.isArray(content)) {
    return false;
  }
  for (let i = content.length - 1; i >= 0; i--) {
    const part = content[i];
    if (part?.type === "text") {
      const textPart = part;
      textPart.cache_control = cacheControl;
      return true;
    }
  }
  return false;
}
function convertMessages(model, context, compat, options) {
  const normalizedContext = resolveTranscript(context, compat.supportsMidConvoSystemMessages);
  const params = [];
  const normalizeToolCallId = (id) => {
    if (id.includes("|")) {
      const separatorIndex = id.indexOf("|");
      const callId = id.slice(0, separatorIndex).replace(/[^a-zA-Z0-9_-]/g, "_");
      const itemId = id.slice(separatorIndex + 1).replace(/[^a-zA-Z0-9_-]/g, "_");
      const combinedId = itemId.length > 0 ? `${callId}_${itemId}` : callId;
      if (combinedId.length <= 40) {
        return combinedId;
      }
      const hash = shortHash(id).slice(0, 8);
      const prefix = callId.slice(0, Math.max(1, 40 - hash.length - 1));
      return `${prefix}_${hash}`;
    }
    if (model.provider === "openai")
      return id.length > 40 ? id.slice(0, 40) : id;
    return id;
  };
  const transformedMessages = transformMessages(normalizedContext.messages, model, (id) => normalizeToolCallId(id));
  const transcriptTools = resolveTranscriptTools(normalizedContext.messages, compat.supportsMidConvoSystemMessages === true && compat.supportsMidConvoToolAdditions === true);
  const instructionRole = model.reasoning && compat.supportsDeveloperRole ? "developer" : "system";
  let lastRole = null;
  for (let i = 0; i < transformedMessages.length; i++) {
    const msg = transformedMessages[i];
    if (compat.requiresAssistantAfterToolResult && lastRole === "toolResult" && msg.role === "user") {
      params.push({
        role: "assistant",
        content: "I have processed the tool results."
      });
    }
    if (msg.role === "system") {
      const addedTools = i > 0 && transcriptTools.anchorsAdditions ? msg.toolsAdded ?? [] : [];
      if (addedTools.length > 0) {
        const kimiToolMessage = {
          role: "system",
          tools: convertTools(addedTools, compat)
        };
        params.push(kimiToolMessage);
      }
      const text2 = i === 0 ? getSystemMessageText(msg) : renderSystemMessageUpdate(msg);
      if (text2.length > 0) {
        params.push({ role: instructionRole, content: sanitizeSurrogates(text2) });
      }
    } else if (msg.role === "user") {
      if (typeof msg.content === "string") {
        params.push({
          role: "user",
          content: sanitizeSurrogates(msg.content)
        });
      } else {
        const content = msg.content.filter((item) => item.type !== "text" || item.text.length > 0).map((item) => {
          if (item.type === "text") {
            return {
              type: "text",
              text: sanitizeSurrogates(item.text)
            };
          } else {
            return {
              type: "image_url",
              image_url: {
                url: `data:${item.mimeType};base64,${item.data}`
              }
            };
          }
        });
        if (content.length === 0)
          continue;
        params.push({
          role: "user",
          content
        });
      }
    } else if (msg.role === "assistant") {
      const assistantMsg = {
        role: "assistant",
        content: compat.requiresAssistantAfterToolResult ? "" : null
      };
      const assistantTextParts = msg.content.filter(isTextContentBlock).filter((block) => block.text.trim().length > 0).map((block) => ({
        type: "text",
        text: sanitizeSurrogates(block.text)
      }));
      const assistantText = assistantTextParts.map((part) => part.text).join("");
      const thinkingBlocks = msg.content.filter(isThinkingContentBlock);
      const toolCalls = msg.content.filter(isToolCallBlock);
      const signedReasoningDetails = thinkingBlocks.map((block) => parseOpenAIReasoningDetails(block.thinkingSignature)).find((details) => details !== void 0);
      const legacyReasoningDetails = toolCalls.map((toolCall) => parseLegacyEncryptedReasoningDetail(toolCall.thoughtSignature)).filter((detail) => detail !== void 0);
      const preservedReasoningDetails = signedReasoningDetails ?? (legacyReasoningDetails.length > 0 ? legacyReasoningDetails : void 0);
      const nonEmptyThinkingBlocks = thinkingBlocks.filter((block) => block.thinking.trim().length > 0);
      if (nonEmptyThinkingBlocks.length > 0) {
        if (compat.requiresThinkingAsText) {
          const thinkingText = nonEmptyThinkingBlocks.map((block) => sanitizeSurrogates(block.thinking)).join("\n\n");
          assistantMsg.content = [{ type: "text", text: thinkingText }, ...assistantTextParts];
        } else {
          if (assistantText.length > 0) {
            assistantMsg.content = assistantText;
          }
          if (!preservedReasoningDetails) {
            let signature = nonEmptyThinkingBlocks[0].thinkingSignature;
            if (model.provider === "opencode-go" && signature === "reasoning") {
              signature = "reasoning_content";
            }
            if (signature && isOpenAICompletionsReasoningField(signature)) {
              assistantMsg[signature] = nonEmptyThinkingBlocks.map((block) => block.thinking).join("\n");
            }
          }
        }
      } else if (assistantText.length > 0) {
        assistantMsg.content = assistantText;
      }
      if (toolCalls.length > 0) {
        assistantMsg.tool_calls = toolCalls.map((tc) => {
          const customInputProperty = options?.grammarToolInputProperties?.get(tc.name);
          if (customInputProperty !== void 0) {
            return {
              id: tc.id,
              type: "custom",
              custom: {
                name: tc.name,
                input: sanitizeSurrogates(getGrammarToolInput(tc.name, tc.arguments, customInputProperty))
              }
            };
          }
          return {
            id: tc.id,
            type: "function",
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.arguments)
            }
          };
        });
      }
      if (preservedReasoningDetails) {
        assistantMsg.reasoning_details = preservedReasoningDetails;
      }
      if (compat.requiresReasoningContentOnAssistantMessages && model.reasoning && assistantMsg.reasoning_content === void 0) {
        assistantMsg.reasoning_content = "";
      }
      const content = assistantMsg.content;
      const hasContent = content !== null && content !== void 0 && (typeof content === "string" ? content.length > 0 : content.length > 0);
      if (!hasContent && !assistantMsg.tool_calls) {
        continue;
      }
      params.push(assistantMsg);
    } else if (msg.role === "toolResult") {
      const imageBlocks = [];
      let j = i;
      for (; j < transformedMessages.length && transformedMessages[j].role === "toolResult"; j++) {
        const toolMsg = transformedMessages[j];
        const textResult = toolMsg.content.filter(isTextContentBlock).map((block) => block.text).join("\n");
        const hasImages = toolMsg.content.some((c) => c.type === "image");
        const hasText = textResult.length > 0;
        const toolResultText2 = hasText ? textResult : hasImages ? "(see attached image)" : "(no tool output)";
        const toolResultMsg = {
          role: "tool",
          content: sanitizeSurrogates(toolResultText2),
          tool_call_id: toolMsg.toolCallId
        };
        if (compat.requiresToolResultName && toolMsg.toolName) {
          toolResultMsg.name = toolMsg.toolName;
        }
        params.push(toolResultMsg);
        if (hasImages && model.input.includes("image")) {
          for (const block of toolMsg.content) {
            if (isImageContentBlock(block)) {
              imageBlocks.push({
                type: "image_url",
                image_url: {
                  url: `data:${block.mimeType};base64,${block.data}`
                }
              });
            }
          }
        }
      }
      i = j - 1;
      if (imageBlocks.length > 0) {
        if (compat.requiresAssistantAfterToolResult) {
          params.push({
            role: "assistant",
            content: "I have processed the tool results."
          });
        }
        params.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "Attached image(s) from tool result:"
            },
            ...imageBlocks
          ]
        });
        lastRole = "user";
      } else {
        lastRole = "toolResult";
      }
      continue;
    }
    lastRole = msg.role;
  }
  return params;
}
function convertTools(tools, compat) {
  return tools.map((tool) => {
    const grammar = resolveGrammarConstrainedSampling(tool, compat.supportsOpenAIGrammarTools);
    if (grammar) {
      return {
        type: "custom",
        custom: {
          name: tool.name,
          description: tool.description,
          format: {
            type: "grammar",
            grammar: {
              syntax: grammar.format,
              definition: grammar.definition
            }
          }
        }
      };
    }
    const strict = resolveJsonSchemaStrictSampling(tool, compat.supportsStrictMode !== false);
    return {
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: getJsonSchemaToolParameters(tool, strict),
        // Only include strict if provider supports it. Some reject unknown fields.
        ...compat.supportsStrictMode !== false && { strict: strict ?? false }
      }
    };
  });
}
function parseChunkUsage(rawUsage, model) {
  const promptTokens = rawUsage.prompt_tokens || 0;
  const cacheReadTokens = rawUsage.prompt_tokens_details?.cached_tokens ?? rawUsage.prompt_cache_hit_tokens ?? rawUsage.cached_tokens ?? 0;
  const cacheWriteTokens = rawUsage.prompt_tokens_details?.cache_write_tokens || 0;
  const input = Math.max(0, promptTokens - cacheReadTokens - cacheWriteTokens);
  const outputTokens = rawUsage.completion_tokens || 0;
  const usage = {
    input,
    output: outputTokens,
    cacheRead: cacheReadTokens,
    cacheWrite: cacheWriteTokens,
    reasoning: rawUsage.completion_tokens_details?.reasoning_tokens || 0,
    totalTokens: input + outputTokens + cacheReadTokens + cacheWriteTokens,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
  };
  calculateCost(model, usage);
  return usage;
}
function mapStopReason2(reason) {
  if (reason === null)
    return { stopReason: "stop" };
  switch (reason) {
    case "stop":
    case "end":
      return { stopReason: "stop" };
    case "length":
      return { stopReason: "length" };
    case "function_call":
    case "tool_calls":
      return { stopReason: "toolUse" };
    case "content_filter":
      return { stopReason: "error", errorMessage: "Provider finish_reason: content_filter" };
    case "network_error":
      return { stopReason: "error", errorMessage: "Provider finish_reason: network_error" };
    default:
      return {
        stopReason: "error",
        errorMessage: `Provider finish_reason: ${reason}`
      };
  }
}
function detectCompat(model) {
  const provider = model.provider;
  const baseUrl = model.baseUrl;
  const isZai = provider === "zai" || provider === "zai-coding-cn" || baseUrl.includes("api.z.ai") || baseUrl.includes("open.bigmodel.cn");
  const isTogether = provider === "together" || baseUrl.includes("api.together.ai") || baseUrl.includes("api.together.xyz");
  const isMoonshot = provider === "moonshotai" || provider === "moonshotai-cn" || baseUrl.includes("api.moonshot.");
  const isOpenRouter = provider === "openrouter" || baseUrl.includes("openrouter.ai");
  const isCloudflareWorkersAI = provider === "cloudflare-workers-ai" || baseUrl.includes("api.cloudflare.com");
  const isCloudflareAiGateway = provider === "cloudflare-ai-gateway" || baseUrl.includes("gateway.ai.cloudflare.com");
  const isNvidia = provider === "nvidia" || baseUrl.includes("integrate.api.nvidia.com");
  const isAntLing = provider === "ant-ling" || baseUrl.includes("api.ant-ling.com");
  const isCerebras = provider === "cerebras" || baseUrl.includes("cerebras.ai");
  const isDeepSeek = provider === "deepseek" || baseUrl.toLowerCase().includes("deepseek.com");
  const isNonStandard = isNvidia || isCerebras || provider === "xai" || baseUrl.includes("api.x.ai") || isTogether || baseUrl.includes("chutes.ai") || isDeepSeek || isZai || isMoonshot || provider === "opencode" || baseUrl.includes("opencode.ai") || isCloudflareWorkersAI || isCloudflareAiGateway || isAntLing;
  const useMaxTokens = baseUrl.includes("chutes.ai") || isDeepSeek || isMoonshot || isCloudflareAiGateway || isTogether || isNvidia || isAntLing || isZai;
  const isGrok = provider === "xai" || baseUrl.includes("api.x.ai");
  const isOpenRouterDeveloperRoleModel = isOpenRouter && (model.id.startsWith("anthropic/") || model.id.startsWith("openai/"));
  const cacheControlFormat = provider === "openrouter" && model.id.startsWith("anthropic/") ? "anthropic" : void 0;
  return {
    supportsStore: !isNonStandard,
    supportsDeveloperRole: isOpenRouterDeveloperRoleModel || !isNonStandard && !isOpenRouter,
    supportsReasoningEffort: !isGrok && !isZai && !isMoonshot && !isTogether && !isCloudflareAiGateway && !isNvidia && !isAntLing,
    supportsUsageInStreaming: true,
    supportsFinishReason: true,
    maxTokensField: useMaxTokens ? "max_tokens" : "max_completion_tokens",
    requiresToolResultName: false,
    requiresAssistantAfterToolResult: false,
    requiresThinkingAsText: false,
    requiresReasoningContentOnAssistantMessages: isDeepSeek,
    thinkingFormat: isDeepSeek ? "deepseek" : isZai ? "zai" : isTogether ? "together" : isAntLing ? "ant-ling" : isOpenRouter ? "openrouter" : "openai",
    openRouterRouting: {},
    vercelGatewayRouting: {},
    chatTemplateKwargs: {},
    chatTemplateArgs: {},
    zaiToolStream: false,
    supportsThinkingTokenBudget: false,
    thinkingTokenBudgetField: void 0,
    // OpenAI compatibility alone does not imply strict JSON-schema tool support.
    supportsStrictMode: false,
    supportsOpenAIGrammarTools: false,
    supportsMidConvoSystemMessages: false,
    supportsMidConvoToolAdditions: false,
    cacheControlFormat,
    sendSessionAffinityHeaders: isOpenRouter,
    sessionAffinityFormat: isOpenRouter ? "openrouter" : "openai",
    supportsLongCacheRetention: !(isTogether || isCloudflareWorkersAI || isCloudflareAiGateway || isNvidia || isAntLing)
  };
}
function getCompat(model) {
  const detected = detectCompat(model);
  if (!model.compat)
    return detected;
  return {
    supportsStore: model.compat.supportsStore ?? detected.supportsStore,
    supportsDeveloperRole: model.compat.supportsDeveloperRole ?? detected.supportsDeveloperRole,
    supportsReasoningEffort: model.compat.supportsReasoningEffort ?? detected.supportsReasoningEffort,
    supportsUsageInStreaming: model.compat.supportsUsageInStreaming ?? detected.supportsUsageInStreaming,
    supportsFinishReason: model.compat.supportsFinishReason ?? detected.supportsFinishReason,
    maxTokensField: model.compat.maxTokensField ?? detected.maxTokensField,
    requiresToolResultName: model.compat.requiresToolResultName ?? detected.requiresToolResultName,
    requiresAssistantAfterToolResult: model.compat.requiresAssistantAfterToolResult ?? detected.requiresAssistantAfterToolResult,
    requiresThinkingAsText: model.compat.requiresThinkingAsText ?? detected.requiresThinkingAsText,
    requiresReasoningContentOnAssistantMessages: model.compat.requiresReasoningContentOnAssistantMessages ?? detected.requiresReasoningContentOnAssistantMessages,
    thinkingFormat: model.compat.thinkingFormat ?? detected.thinkingFormat,
    openRouterRouting: model.compat.openRouterRouting ?? {},
    vercelGatewayRouting: model.compat.vercelGatewayRouting ?? detected.vercelGatewayRouting,
    chatTemplateKwargs: model.compat.chatTemplateKwargs ?? detected.chatTemplateKwargs,
    chatTemplateArgs: model.compat.chatTemplateArgs ?? detected.chatTemplateArgs,
    zaiToolStream: model.compat.zaiToolStream ?? detected.zaiToolStream,
    supportsThinkingTokenBudget: model.compat.supportsThinkingTokenBudget ?? detected.supportsThinkingTokenBudget,
    thinkingTokenBudgetField: model.compat.thinkingTokenBudgetField ?? detected.thinkingTokenBudgetField,
    supportsStrictMode: model.compat.supportsStrictMode ?? detected.supportsStrictMode,
    supportsOpenAIGrammarTools: model.compat.supportsOpenAIGrammarTools ?? detected.supportsOpenAIGrammarTools,
    supportsMidConvoSystemMessages: model.compat.supportsMidConvoSystemMessages ?? detected.supportsMidConvoSystemMessages,
    supportsMidConvoToolAdditions: model.compat.supportsMidConvoToolAdditions ?? detected.supportsMidConvoToolAdditions,
    cacheControlFormat: model.compat.cacheControlFormat ?? detected.cacheControlFormat,
    sendSessionAffinityHeaders: model.compat.sendSessionAffinityHeaders ?? detected.sendSessionAffinityHeaders,
    sessionAffinityFormat: model.compat.sessionAffinityFormat ?? detected.sessionAffinityFormat,
    supportsLongCacheRetention: model.compat.supportsLongCacheRetention ?? detected.supportsLongCacheRetention,
    vllmPriority: model.compat.vllmPriority
  };
}

// src/catalog.ts
import { attributionHeaders as attributionHeaders2, LlmError as LlmError8 } from "@deepseek-ai/dsh-llm";

// src/models-contract.ts
var INPUT_MODALITIES = ["text", "image", "audio", "video", "pdf"];
function normalizeInputModalities(value) {
  if (!Array.isArray(value)) return void 0;
  const declared = new Set(value.filter((item) => typeof item === "string").map((item) => item.toLowerCase()));
  const ordered = INPUT_MODALITIES.filter((modality) => declared.has(modality));
  return ordered.length === 0 ? void 0 : ordered;
}
function isModelEnabled(model, modelVisibility) {
  if (model.configurationMissing) return false;
  const enabled = modelVisibility && Object.hasOwn(modelVisibility, model.id) ? modelVisibility[model.id] : void 0;
  return typeof enabled === "boolean" ? enabled : !model.deprecated;
}
function validReleaseDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
function isNewModel(model, now = Date.now()) {
  if (model.deprecated || !validReleaseDate(model.releaseDate)) return false;
  const days = Math.floor(now / 864e5) - Date.parse(model.releaseDate) / 864e5;
  return days >= 0 && days < 7;
}
function sortModels(models, now = Date.now()) {
  const rank = (model) => model.deprecated ? 2 : isNewModel(model, now) ? 0 : 1;
  return [...models].sort((a, b) => rank(a) - rank(b) || (isNewModel(a, now) && isNewModel(b, now) ? b.releaseDate.localeCompare(a.releaseDate) : 0));
}
function parseGoModels(value) {
  if (!Array.isArray(value)) throw new Error("Invalid ClinePass model list");
  return value.map((entry) => {
    if (!entry || typeof entry !== "object") throw new Error("Invalid ClinePass model");
    const row = entry;
    if (typeof row.id !== "string" || !row.id) throw new Error("Missing ClinePass model id");
    const model = { id: row.id };
    if (typeof row.name === "string") model.name = row.name;
    for (const key of ["contextWindow", "maxTokens"]) {
      if (typeof row[key] === "number" && Number.isSafeInteger(row[key]) && row[key] > 0) model[key] = row[key];
    }
    if (row.reasoningBudget !== null && typeof row.reasoningBudget === "object") {
      const { min, max } = row.reasoningBudget;
      if (typeof min === "number" && Number.isSafeInteger(min) && min > 0 && typeof max === "number" && Number.isSafeInteger(max) && max >= min) model.reasoningBudget = { min, max };
    }
    if (typeof row.deprecated === "boolean") model.deprecated = row.deprecated;
    if (typeof row.configurationMissing === "boolean") model.configurationMissing = row.configurationMissing;
    if (validReleaseDate(row.releaseDate)) model.releaseDate = row.releaseDate;
    const modalities = normalizeInputModalities(row.inputModalities);
    if (modalities !== void 0) model.inputModalities = modalities;
    return model;
  });
}
function parseGoModelCatalog(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid ClinePass model catalog");
  const catalog = value;
  if (typeof catalog.stale !== "boolean" || catalog.error !== void 0 && typeof catalog.error !== "string") {
    throw new Error("Invalid ClinePass model catalog status");
  }
  return {
    models: parseGoModels(catalog.models),
    stale: catalog.stale,
    ...catalog.error === void 0 ? {} : { error: catalog.error },
    ...catalog.sources === void 0 ? {} : { sources: parseSources(catalog.sources) }
  };
}
function parseSources(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid ClinePass catalog sources");
  const sources = value;
  const parse = (value2) => {
    if (!value2 || typeof value2 !== "object" || Array.isArray(value2)) throw new Error("Invalid ClinePass catalog source status");
    const source = value2;
    if (source.updatedAt !== void 0 && (typeof source.updatedAt !== "number" || !Number.isSafeInteger(source.updatedAt) || source.updatedAt < 0 || source.updatedAt > 864e13)) {
      throw new Error("Invalid ClinePass catalog source timestamp");
    }
    if (source.error !== void 0 && typeof source.error !== "string") throw new Error("Invalid ClinePass catalog source error");
    if (source.warning !== void 0 && typeof source.warning !== "string") throw new Error("Invalid ClinePass catalog source warning");
    return {
      ...source.updatedAt === void 0 ? {} : { updatedAt: source.updatedAt },
      ...source.error === void 0 ? {} : { error: source.error },
      ...source.warning === void 0 ? {} : { warning: source.warning }
    };
  };
  return { listing: parse(sources.listing), metadata: parse(sources.metadata) };
}
var codec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#ClineModelCatalog",
  schema: { parse: parseGoModelCatalog },
  create: () => ({ parse: parseGoModelCatalog })
};
var modelsRemote = {
  package: "dsh-clinepass",
  descriptors: [{
    id: "dsh-clinepass#clinePassModels/read",
    service: "clinePassModels",
    namespace: "clinePassModels",
    method: "read",
    invocation: { kind: "direct" },
    parameters: [],
    result: codec
  }]
};

// src/provider-identity.ts
var PROVIDER_ID = "dsh-clinepass";
var DISPLAY_NAME = "DSH ClinePass";
var SDK_PROVIDER_ID = "clinepass";

// src/clinepass-models.ts
var CLINEPASS_MODEL_PREFIXES = ["cline-pass/", "cline-free/"];
var ALL_THINKING = {
  off: "none",
  minimal: "minimal",
  low: "low",
  medium: "medium",
  high: "high",
  xhigh: "xhigh",
  max: "max"
};
var MANDATORY_REASONING = {
  off: null,
  minimal: "minimal",
  low: "low",
  medium: "medium",
  high: "high",
  xhigh: "xhigh",
  max: null
};
var MAX_HIGH_LOW = {
  off: "none",
  minimal: null,
  low: "low",
  medium: null,
  high: "high",
  xhigh: null,
  max: "max"
};
var MAX_HIGH_LOW_MANDATORY = {
  off: null,
  minimal: null,
  low: "low",
  medium: null,
  high: "high",
  xhigh: null,
  max: "max"
};
var XHIGH_MEDIUM_LOW = {
  off: "none",
  minimal: null,
  low: "low",
  medium: "medium",
  high: null,
  xhigh: "xhigh",
  max: null
};
var COMPAT = {
  supportsDeveloperRole: false,
  cacheControlFormat: "anthropic",
  supportsLongCacheRetention: false
};
function isClinePassNamespaceId(id) {
  return CLINEPASS_MODEL_PREFIXES.some((prefix) => id.startsWith(prefix));
}
var CURATED_CLINEPASS_MODELS = [
  // ── ClinePass subscription models (measured billing rates) ───────────────
  { id: "cline-pass/glm-5.3", name: "GLM-5.3", cost: [1.4, 4.4, 0.26], contextWindow: 921600, maxTokens: 131072, input: ["text"], thinkingLevelMap: MAX_HIGH_LOW_MANDATORY },
  { id: "cline-pass/glm-5.3-flash", name: "GLM-5.3 Flash", cost: [0.15, 0.5, 0.03], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: MAX_HIGH_LOW_MANDATORY },
  { id: "cline-pass/kimi-k3", name: "Kimi K3", cost: [6, 30, 0.6], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: MAX_HIGH_LOW },
  { id: "cline-pass/deepseek-v4-pro", name: "DeepSeek V4 Pro", cost: [1.65, 4.95, 0.06], contextWindow: 921600, maxTokens: 131072, input: ["text"], thinkingLevelMap: MAX_HIGH_LOW },
  { id: "cline-pass/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash", cost: [0.3, 1.2, 6e-3], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: MAX_HIGH_LOW },
  { id: "cline-pass/mimo-v2.5", name: "MiMo-V2.5", cost: [0.14, 0.28, 28e-4], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: ALL_THINKING },
  { id: "cline-pass/mimo-v2.5-pro", name: "MiMo-V2.5-Pro", cost: [0.435, 0.87, 36e-4], contextWindow: 921600, maxTokens: 131072, input: ["text"], thinkingLevelMap: ALL_THINKING },
  { id: "cline-pass/minimax-m3", name: "MiniMax M3", cost: [0.5, 2, 0.1], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: ALL_THINKING },
  { id: "cline-pass/muse-spark-1.3-contributor", name: "Muse Spark 1.3 Contributor", cost: [0.1, 0.2, 0.01], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: MANDATORY_REASONING },
  { id: "cline-pass/qwen3.8-max", name: "Qwen3.8 Max", cost: [2.75, 8.25, 0.34], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: XHIGH_MEDIUM_LOW },
  { id: "cline-pass/qwen3.7-max", name: "Qwen3.7 Max", cost: [4.17, 12.5, 0.83], contextWindow: 921600, maxTokens: 131072, input: ["text"], thinkingLevelMap: ALL_THINKING },
  { id: "cline-pass/qwen3.7-plus", name: "Qwen3.7 Plus", cost: [0.67, 2.67, 0.07], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: ALL_THINKING },
  // ── Cline free tier (cost 0) ────────────────────────────────────────────
  { id: "cline-free/mimo-v2.6-flash", name: "MiMo-V2.6-Flash", cost: [0, 0, 0], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: ALL_THINKING },
  { id: "cline-free/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash", cost: [0, 0, 0], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: MAX_HIGH_LOW },
  { id: "cline-free/muse-spark-1.3-contributor", name: "Muse Spark 1.3 Contributor", cost: [0, 0, 0], contextWindow: 921600, maxTokens: 131072, input: ["text", "image"], thinkingLevelMap: MANDATORY_REASONING }
];
function curatedModelName(row) {
  return row.cost[0] === 0 ? `${row.name} (free)` : row.name;
}
function curatedModel(row, baseURL) {
  return withGatewayReasoning({
    id: row.id,
    name: curatedModelName(row),
    provider: SDK_PROVIDER_ID,
    api: "openai-completions",
    // Cline serves every resource from the one configured base; there is no
    // per-protocol sibling address to select.
    baseUrl: baseURL,
    reasoning: true,
    thinkingLevelMap: { ...row.thinkingLevelMap },
    input: [...row.input],
    contextWindow: row.contextWindow,
    maxTokens: row.maxTokens,
    cost: { input: row.cost[0], output: row.cost[1], cacheRead: row.cost[2], cacheWrite: 0 },
    compat: { ...COMPAT }
  });
}
function curatedClinePassModels(baseURL) {
  const base = migrateGatewayBaseURL(baseURL).replace(/\/+$/, "");
  return new Map(CURATED_CLINEPASS_MODELS.map((row) => [row.id, curatedModel(row, base)]));
}

// src/model-metadata.ts
function curatedModelMetadata(baseURL) {
  const models = curatedClinePassModels(baseURL);
  const details = /* @__PURE__ */ new Map();
  for (const row of CURATED_CLINEPASS_MODELS) {
    const inputModalities = normalizeInputModalities(row.input);
    details.set(row.id, {
      deprecated: false,
      ...inputModalities === void 0 ? {} : { inputModalities }
    });
  }
  return { models, details, errors: /* @__PURE__ */ new Map() };
}

// src/json-response.ts
import { setTimeout as delay } from "node:timers/promises";
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";

// src/diagnostic-timing.ts
async function measureTiming(observer, stage, work, details) {
  if (observer === void 0) return work();
  const started = performance.now();
  const emit = (phase, value) => {
    try {
      observer({
        stage,
        phase,
        elapsedMs: Math.round(performance.now() - started),
        ...phase === "success" ? details?.(value) : {}
      });
    } catch {
    }
  };
  emit("start");
  try {
    const value = await work();
    emit("success", value);
    return value;
  } catch (error) {
    emit("failure");
    throw error;
  }
}

// src/json-response.ts
var RETRYABLE_CODES = /* @__PURE__ */ new Set(["ECONNRESET", "EPIPE", "UND_ERR_SOCKET", "EAI_AGAIN"]);
function errorCauses(error) {
  const causes = [];
  for (let depth = 0; depth < 5 && error !== null && typeof error === "object"; depth += 1) {
    causes.push(error);
    error = "cause" in error ? error.cause : void 0;
  }
  return causes;
}
function retryableTransportFailure(error) {
  if (error instanceof SyntaxError || error instanceof RangeError) return false;
  for (const cause of errorCauses(error)) {
    if (cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError")) return false;
    if ("code" in cause && typeof cause.code === "string") return RETRYABLE_CODES.has(cause.code);
  }
  return false;
}
function transportFailure(error) {
  const causes = errorCauses(error);
  if (causes.some((cause) => cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError"))) {
    return "request timed out or was aborted";
  }
  for (const cause of causes) {
    if ("code" in cause && typeof cause.code === "string" && /^[A-Z][A-Z0-9_]+$/.test(cause.code)) {
      return `network error (${cause.code})`;
    }
  }
  return "network request failed";
}
function diagnosticURL(raw) {
  const url = new URL(raw);
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  return url.href;
}
async function fetchJsonResponse(url, init, maxBytes, encoding = "identity", fetcher = globalThis.fetch, readError, onTiming) {
  if ((init.method ?? "GET").toUpperCase() !== "GET") throw new TypeError("JSON requests must use GET");
  const headers = new Headers(init.headers);
  headers.set("accept-encoding", encoding);
  const options = { ...init, method: "GET", headers };
  const signal = init.signal ?? void 0;
  for (let attempt = 0; ; attempt += 1) {
    signal?.throwIfAborted();
    const observer = onTiming === void 0 ? void 0 : (event) => onTiming({ ...event, attempt: attempt + 1 });
    try {
      const response = await measureTiming(observer, "headers", () => waitWithSignal(async () => {
        const response2 = await fetcher(url, options);
        if (signal?.aborted) {
          cancelResponse(response2, signal.reason);
          signal.throwIfAborted();
        }
        return response2;
      }, signal), (response2) => ({ status: response2.status }));
      if (!response.ok) {
        if (readError) {
          let body2;
          try {
            body2 = await measureTiming(observer, "error-body", () => waitWithSignal(() => readError(response), signal));
          } catch {
            signal?.throwIfAborted();
          } finally {
            cancelResponse(response);
          }
          signal?.throwIfAborted();
          return { response, body: body2 };
        }
        cancelResponse(response);
        signal?.throwIfAborted();
        return { response, body: void 0 };
      }
      const body = await readJsonResponse(response, maxBytes, { gzip: encoding === "gzip", signal, onTiming: observer });
      signal?.throwIfAborted();
      return { response, body };
    } catch (error) {
      signal?.throwIfAborted();
      if (attempt > 0 || !retryableTransportFailure(error)) throw error;
      await measureTiming(observer, "retry-delay", () => delay(150, void 0, { signal }));
    }
  }
}
function cancelResponse(response, reason) {
  void response.body?.cancel(reason).catch(() => {
  });
}
async function readBoundedBody(response, maxBytes, signal) {
  if (signal?.aborted) {
    cancelResponse(response, signal.reason);
    signal.throwIfAborted();
  }
  if (response.body === null) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await waitWithSignal(() => reader.read(), signal);
      signal?.throwIfAborted();
      if (done) return Buffer.concat(chunks, size);
      if (value.byteLength > maxBytes - size) {
        throw new RangeError(`Response body exceeds ${maxBytes} byte limit`);
      }
      size += value.byteLength;
      chunks.push(value);
    }
  } catch (error) {
    void reader.cancel(error).catch(() => {
    });
    throw error;
  } finally {
    reader.releaseLock();
  }
}
async function readGzipBody(bytes, maxBytes, signal) {
  const chunks = [];
  let size = 0;
  await pipeline(Readable.from([bytes]), createGunzip(), new Writable({
    write(chunk, _encoding, done) {
      if (chunk.length > maxBytes - size) {
        done(new RangeError(`Response body exceeds ${maxBytes} byte limit`));
        return;
      }
      size += chunk.length;
      chunks.push(chunk);
      done();
    }
  }), { signal: signal ?? void 0 });
  return Buffer.concat(chunks, size);
}
async function readJsonResponse(response, maxBytes, options = {}) {
  const signal = options.signal ?? void 0;
  let bytes = await measureTiming(options.onTiming, "body", () => readBoundedBody(response, maxBytes, signal), (bytes2) => ({ bytes: bytes2.length }));
  if (options.gzip && bytes[0] === 31 && bytes[1] === 139) {
    try {
      bytes = await measureTiming(options.onTiming, "decompress", () => readGzipBody(bytes, maxBytes, signal), (bytes2) => ({ bytes: bytes2.length }));
    } catch (error) {
      options.signal?.throwIfAborted();
      if (error instanceof RangeError) throw error;
      throw new SyntaxError("Response is not valid gzip", { cause: error });
    }
  }
  const body = await measureTiming(options.onTiming, "parse", () => {
    signal?.throwIfAborted();
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (error) {
      throw new SyntaxError("Response is not valid JSON", { cause: error });
    }
  });
  signal?.throwIfAborted();
  return body;
}

// src/catalog.ts
var MODELS_FETCH_TIMEOUT_MS = 1e4;
var STALE_WHILE_REVALIDATE_MS = 5 * 6e4;
var MODEL_LISTING_MAX_BYTES = 1024 * 1024;
var RETRY_MIN_MS = 5e3;
var RETRY_MAX_MS = 6e4;
var UNCONFIGURED_ADVERTISEMENT = "not in this build's curated ClinePass table; update the plugin to configure it";
async function settled(promise) {
  const [result] = await Promise.allSettled([promise]);
  return result;
}
function waitForSnapshot(pending, signal) {
  if (signal === void 0) return pending;
  return new Promise((resolve3, reject) => {
    const abort = () => {
      signal.removeEventListener("abort", abort);
      reject(new LlmError8("clinepass catalog request aborted by caller", "ABORTED", { cause: signal.reason }));
    };
    pending.then((value) => {
      signal.removeEventListener("abort", abort);
      resolve3(value);
    }, (error) => {
      signal.removeEventListener("abort", abort);
      reject(error);
    });
    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  });
}
function readLiveModelIds(body, onInvalidRows) {
  const data = body?.data;
  if (!Array.isArray(data)) throw new Error('the model listing has no "data" array');
  const ids = [];
  const invalidRows = [];
  let invalidCount = 0;
  for (const [index, entry] of data.entries()) {
    const id = entry?.id;
    if (typeof id === "string" && id.trim().length > 0) ids.push(id);
    else {
      invalidCount++;
      if (invalidRows.length < 8) invalidRows.push(index + 1);
    }
  }
  if (data.length > 0 && ids.length === 0) throw new Error("the nonempty model listing has no valid model ids");
  if (invalidCount > 0) onInvalidRows?.(`Model listing ignored ${invalidCount} of ${data.length} rows with invalid model ids (rows ${invalidRows.join(", ")}${invalidCount > invalidRows.length ? ", \u2026" : ""}); the listing may be incomplete`);
  return [...new Set(ids)];
}
async function fetchLiveModelIds(baseURL, fetcher, onTiming) {
  const url = `${baseURL.replace(/\/+$/, "")}/models`;
  const endpoint = diagnosticURL(url);
  let result;
  try {
    result = await fetchJsonResponse(url, {
      method: "GET",
      cache: "no-cache",
      headers: { ...attributionHeaders2(), accept: "application/json" },
      signal: AbortSignal.timeout(MODELS_FETCH_TIMEOUT_MS)
    }, MODEL_LISTING_MAX_BYTES, "identity", fetcher, void 0, onTiming);
  } catch (error) {
    const detail = error instanceof SyntaxError ? "invalid JSON response" : error instanceof RangeError ? `response exceeds the ${MODEL_LISTING_MAX_BYTES} byte limit` : transportFailure(error);
    const action = error instanceof SyntaxError || error instanceof RangeError ? "read" : "reach";
    throw new LlmError8(`could not ${action} ${endpoint}: ${detail}`, "DISCOVERY_FAILED", { cause: error });
  }
  const { response, body } = result;
  if (!response.ok) throw new LlmError8(`${endpoint} answered HTTP ${response.status}`, "DISCOVERY_FAILED");
  try {
    let warning;
    const ids = readLiveModelIds(body, (value) => {
      warning = value;
    });
    return { ids, ...warning === void 0 ? {} : { warning } };
  } catch (error) {
    throw new LlmError8(`${endpoint} returned an invalid model listing: ${error instanceof Error ? error.message : "invalid data"}`, "DISCOVERY_FAILED", { cause: error });
  }
}
function harnessApiKeyAuth() {
  return { apiKey: {
    name: "Cline API key",
    resolve: () => Promise.resolve({ auth: {}, source: "Cline API key" })
  } };
}
function buildProvider(baseURL, models) {
  return createProvider({
    id: SDK_PROVIDER_ID,
    name: DISPLAY_NAME,
    baseUrl: baseURL,
    auth: harnessApiKeyAuth(),
    models: [...models],
    api: { "openai-completions": openai_completions_exports }
  });
}
var ClinePassCatalog = class {
  constructor(baseURL, refreshMs, onFallback, onOmitted, onRefresh = () => {
  }, fetcher, onWarning, onDiagnostic) {
    this.baseURL = baseURL;
    this.refreshMs = refreshMs;
    this.onFallback = onFallback;
    this.onOmitted = onOmitted;
    this.onRefresh = onRefresh;
    this.fetcher = fetcher;
    this.onWarning = onWarning;
    this.onDiagnostic = onDiagnostic;
    this.baseURL = migrateGatewayBaseURL(baseURL);
    this.metadata = curatedModelMetadata(this.baseURL);
  }
  diagnosticId = randomUUID2();
  /** The shipped table, resolved once for this gateway. Membership never depends on the network. */
  metadata;
  refreshSequence = 0;
  served;
  pending;
  failures = 0;
  refreshAtMs = 0;
  observer(refresh, prefix = "", url) {
    const onDiagnostic = this.onDiagnostic;
    if (onDiagnostic === void 0) return void 0;
    const endpoint = url === void 0 ? void 0 : diagnosticURL(url);
    return (event) => onDiagnostic({
      ...event,
      stage: `${prefix}${event.stage}`,
      catalogId: this.diagnosticId,
      refresh,
      ...endpoint === void 0 ? {} : { url: endpoint }
    });
  }
  snapshot(force = false, signal) {
    if (signal?.aborted) {
      return Promise.reject(new LlmError8("clinepass catalog request aborted by caller", "ABORTED", { cause: signal.reason }));
    }
    return waitForSnapshot(this.currentSnapshot(force), signal);
  }
  currentSnapshot(force) {
    if (!force && this.served !== void 0 && Date.now() < this.refreshAtMs) return Promise.resolve(this.served);
    if (this.pending === void 0) this.startRefresh(force);
    return this.pending;
  }
  startRefresh(force) {
    const refresh = ++this.refreshSequence;
    const observer = this.observer(refresh);
    const notify = !force && this.served !== void 0;
    this.pending = measureTiming(observer, "refresh", async () => {
      const listing = settled(measureTiming(observer, "listing", async () => ({
        ...await fetchLiveModelIds(this.baseURL, this.fetcher, this.observer(refresh, "listing.", `${this.baseURL.replace(/\/+$/, "")}/models`)),
        updatedAtMs: Date.now()
      })));
      const listingResult = await listing;
      const snapshot = await measureTiming(observer, "build", () => this.build(listingResult));
      this.served = snapshot;
      this.failures = snapshot.live ? 0 : Math.min(this.failures + 1, 5);
      if (snapshot.listingWarning && snapshot.live) {
        try {
          this.onWarning?.(snapshot.listingWarning);
        } catch {
        }
      }
      const lifetime = this.failures === 0 ? this.refreshMs : Math.min(this.refreshMs, RETRY_MIN_MS * 2 ** (this.failures - 1), RETRY_MAX_MS);
      this.refreshAtMs = snapshot.fetchedAtMs + lifetime;
      if (notify) this.onRefresh();
      return snapshot;
    }).finally(() => {
      this.pending = void 0;
    });
    void this.pending.catch(() => {
    });
  }
  /**
   * The curated table decides membership; the listing only adds diagnostics.
   *
   * Cline's listing advertises the general router catalog and never the
   * `cline-pass/*` ids, so neither an empty listing nor an unreachable one may
   * change what the picker offers. A namespaced id the gateway advertises that
   * this build cannot configure stays visible as an explicit diagnostic instead
   * of being dropped silently or guessed at.
   */
  build(listing) {
    const models = new Map(this.metadata.models);
    const unavailable = /* @__PURE__ */ new Map();
    const base = {
      details: new Map(this.metadata.details),
      models,
      provider: buildProvider(this.baseURL, [...models.values()]),
      metadataLive: true,
      fetchedAtMs: Date.now()
    };
    if (listing.status === "rejected") {
      this.onFallback({ url: `${this.baseURL.replace(/\/+$/, "")}/models`, error: listing.reason, kept: models.size });
      return { ...base, unavailable, live: false, listingFailure: listing.reason };
    }
    for (const id of listing.value.ids) {
      if (!models.has(id) && isClinePassNamespaceId(id)) unavailable.set(id, UNCONFIGURED_ADVERTISEMENT);
    }
    if (unavailable.size > 0) this.onOmitted([...unavailable.keys()]);
    return {
      ...base,
      unavailable,
      live: true,
      listingUpdatedAtMs: listing.value.updatedAtMs,
      ...listing.value.warning === void 0 ? {} : { listingWarning: listing.value.warning }
    };
  }
  /** New or previously unconfigured ids get a fresh lookup even during the runtime TTL. */
  async forModel(id, signal) {
    const cached = this.served;
    if (signal?.aborted) throw new LlmError8("clinepass catalog request aborted by caller", "ABORTED", { cause: signal.reason });
    if (cached?.models.has(id) && cached.listingUpdatedAtMs !== void 0 && Date.now() < cached.listingUpdatedAtMs + this.refreshMs + STALE_WHILE_REVALIDATE_MS) {
      void this.snapshot().catch(() => {
      });
      return cached;
    }
    let snapshot = await this.snapshot(false, signal);
    if (!snapshot.models.has(id) && snapshot === cached) snapshot = await this.snapshot(true, signal);
    if (signal?.aborted) throw new LlmError8("clinepass catalog request aborted by caller", "ABORTED", { cause: signal.reason });
    if (snapshot.unavailable.has(id)) {
      throw new LlmError8(
        `clinepass model "${id}" is advertised but cannot be configured: ${snapshot.unavailable.get(id)}; refresh the model list to retry`,
        "MODEL_METADATA_UNAVAILABLE"
      );
    }
    if (!snapshot.models.has(id) && !snapshot.live) throw listingError(snapshot);
    return snapshot;
  }
};
async function discoverCatalogModels(catalog) {
  return describeCatalog(await catalog.snapshot(true));
}
function listingError(snapshot) {
  const detail = snapshot.listingFailure instanceof LlmError8 ? snapshot.listingFailure.message : "the live model listing is unreachable";
  return new LlmError8(`llm-clinepass: ${detail}; refresh the model list to retry`, "DISCOVERY_FAILED", { cause: snapshot.listingFailure });
}
function describeConfiguredModels(snapshot) {
  return [...snapshot.models.values()].map((model) => ({
    id: model.id,
    name: model.name,
    contextWindow: model.contextWindow,
    maxTokens: model.maxTokens
  }));
}
function describeCatalog(snapshot) {
  return [
    ...describeConfiguredModels(snapshot),
    ...[...snapshot.unavailable].map(([id, reason]) => ({ id, name: `${id} (metadata unavailable: ${reason})` }))
  ];
}
async function discoverSettingsModels(catalog) {
  const snapshot = await catalog.snapshot(true);
  const listingFailure = snapshot.live ? void 0 : listingError(snapshot).message;
  return {
    models: sortModels([
      ...describeConfiguredModels(snapshot),
      ...[...snapshot.unavailable.keys()].map((id) => ({ id, name: id, configurationMissing: true }))
    ].map((model) => {
      const configured = snapshot.models.get(model.id);
      const budget = configured && reasoningBudgetRange(configured);
      return { ...model, ...snapshot.details.get(model.id), ...budget === void 0 ? {} : { reasoningBudget: budget } };
    })),
    stale: listingFailure !== void 0,
    ...listingFailure === void 0 ? {} : { error: listingFailure },
    sources: {
      listing: {
        ...snapshot.listingUpdatedAtMs === void 0 ? {} : { updatedAt: snapshot.listingUpdatedAtMs },
        ...listingFailure === void 0 ? {} : { error: listingFailure },
        ...snapshot.listingWarning === void 0 ? {} : { warning: snapshot.listingWarning }
      },
      // The curated table ships with the plugin: there is no online
      // configuration source to timestamp or fail.
      metadata: {}
    }
  };
}

// src/proxy-url.ts
function assertProxyURL(raw) {
  const value = raw?.trim() ?? "";
  if (!value) return "";
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("ClinePass: proxy address must be a valid URL");
  }
  if (!["http:", "https:", "socks5:"].includes(url.protocol)) {
    throw new Error("ClinePass: proxy address must use http://, https:// or socks5://");
  }
  if (!url.hostname || url.port === "0" || url.pathname !== "" && url.pathname !== "/" || url.search || url.hash) {
    throw new Error("ClinePass: proxy address must contain a host and optional port, without a path, query or fragment");
  }
  try {
    decodeURIComponent(url.username);
    decodeURIComponent(url.password);
  } catch {
    throw new Error("ClinePass: proxy credentials contain invalid URL encoding");
  }
  return url.href;
}

// src/catalog-manager.ts
var ClineCatalogManager = class {
  constructor(options) {
    this.options = options;
  }
  current;
  forConfig(config) {
    const baseURL = assertBaseURL(config.baseURL);
    const key = JSON.stringify([baseURL, config.refreshMinutes, assertProxyURL(config.proxyURL)]);
    if (this.current?.key !== key) {
      const catalog = new ClinePassCatalog(
        baseURL,
        config.refreshMinutes * 6e4,
        this.options.onFallback ?? (() => {
        }),
        this.options.onOmitted ?? (() => {
        }),
        () => {
          if (this.current?.catalog === catalog) this.options.onRefresh?.();
        },
        this.options.transport.forProxy(config.proxyURL),
        this.options.onWarning,
        this.options.onDiagnostic
      );
      this.current = { key, catalog };
    }
    return this.current.catalog;
  }
};

// src/account-policy.ts
function accountFallback(outcome) {
  if (outcome.emitted || outcome.totalTokens > 0 || outcome.aborted || !outcome.hasNext) return void 0;
  switch (outcome.failure?.code) {
    case "QUOTA":
      return "quota";
    case "MISSING_CREDENTIAL":
    case "INVALID_CREDENTIAL":
      return "credential";
    default:
      return void 0;
  }
}
function isGatewayKeyRejection(failure) {
  return failure.code === "INVALID_CREDENTIAL";
}

// src/proxy.ts
import { ProxyAgent, Socks5ProxyAgent } from "undici";
var ProxyTransport = class {
  current;
  retired = /* @__PURE__ */ new Set();
  disposed = false;
  forProxy(raw) {
    const address = assertProxyURL(raw);
    if (!address) {
      this.retire();
      return void 0;
    }
    return (input, init) => {
      if (this.disposed) return Promise.reject(new Error("ClinePass proxy transport is disposed"));
      if (this.current?.address !== address) {
        const url = new URL(address);
        const dispatcher = url.protocol === "socks5:" ? new Socks5ProxyAgent(url) : new ProxyAgent(address);
        this.retire();
        this.current = { address, dispatcher };
      }
      const options = { ...init, dispatcher: this.current.dispatcher };
      return globalThis.fetch(input, options);
    };
  }
  /** Close replaced pools after their in-flight response bodies have finished. */
  retire() {
    if (!this.current) return;
    const { dispatcher } = this.current;
    this.current = void 0;
    this.retired.add(dispatcher);
    void dispatcher.close().catch(() => dispatcher.destroy()).catch(() => {
    }).finally(() => {
      this.retired.delete(dispatcher);
    });
  }
  /** Unloading the mount cancels remaining requests and releases every pool. */
  async dispose() {
    this.disposed = true;
    const dispatchers = [...this.retired, ...this.current ? [this.current.dispatcher] : []];
    this.current = void 0;
    this.retired.clear();
    await Promise.all(dispatchers.map((dispatcher) => dispatcher.destroy().catch(() => {
    })));
  }
};

// src/call-trace.ts
import { randomUUID as randomUUID3 } from "node:crypto";
var CallTrace = class {
  constructor(model, observer) {
    this.model = model;
    this.observer = observer;
  }
  started = performance.now();
  callId = randomUUID3();
  stages = {};
  attempts = 0;
  outcome = "consumer-stopped";
  code;
  details = [];
  current;
  finished = false;
  startAttempt() {
    this.attempts++;
    this.current = { started: performance.now(), trace: {
      attempt: this.attempts,
      elapsedMs: 0,
      stages: {},
      outcome: "consumer-stopped"
    } };
  }
  response(status, requestId) {
    if (!this.current) return;
    this.current.trace.httpStatus = status;
    if (requestId !== void 0) this.current.trace.requestId = requestId;
  }
  firstOutput() {
    if (this.current && this.current.trace.firstOutputMs === void 0) {
      this.current.trace.firstOutputMs = performance.now() - this.current.started;
    }
  }
  imagePool = (value) => {
    if (!this.current) return;
    const stats = this.current.trace.imagePool ??= { queueWaitMs: 0, maxActive: 0, maxQueued: 0, maxRetainedBytes: 0, rejected: false };
    stats.queueWaitMs += value.queueWaitMs;
    stats.maxActive = Math.max(stats.maxActive, value.active);
    stats.maxQueued = Math.max(stats.maxQueued, value.queued);
    stats.maxRetainedBytes = Math.max(stats.maxRetainedBytes, value.retainedBytes);
    stats.rejected ||= value.rejected === true;
  };
  endAttempt(outcome = "consumer-stopped", code) {
    if (!this.current) return;
    const detail = this.current.trace;
    detail.elapsedMs = performance.now() - this.current.started;
    detail.outcome = outcome;
    if (code !== void 0) detail.code = code;
    if (this.details.length < 32) this.details.push(detail);
    this.current = void 0;
  }
  async measure(stage, work) {
    const started = performance.now();
    const attempt = this.current;
    try {
      return await work();
    } finally {
      const elapsed = performance.now() - started;
      this.stages[stage] = (this.stages[stage] ?? 0) + elapsed;
      if (attempt) attempt.trace.stages[stage] = (attempt.trace.stages[stage] ?? 0) + elapsed;
    }
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    this.endAttempt();
    try {
      this.observer?.({
        callId: this.callId,
        model: this.model,
        elapsedMs: performance.now() - this.started,
        stages: { ...this.stages },
        attempts: this.attempts,
        attemptDetails: structuredClone(this.details),
        outcome: this.outcome,
        ...this.code ? { code: this.code } : {}
      });
    } catch {
    }
  }
};

// src/adapter.ts
var REJECTED_KEY_TTL_MS = 5 * 6e4;
function withModelLimit(model, limits) {
  const limit = limits[model.id];
  if (limit == null) return model;
  return {
    ...model,
    contextWindow: limit.contextWindow ?? model.contextWindow,
    maxTokens: limit.maxTokens ?? model.maxTokens,
    reasoningBudgetPresets: limit.thinkingBudgets ?? void 0
  };
}
var TASK_HEADER_PREFIX = "dsh-cline-task-v1-";
function clineTaskValue(sessionId) {
  if (sessionId === void 0 || sessionId.length === 0) return randomUUID4();
  if (!/[^\x21-\x7e]/.test(sessionId) && !sessionId.startsWith(TASK_HEADER_PREFIX)) return sessionId;
  return TASK_HEADER_PREFIX + createHash2("sha256").update(sessionId, "utf16le").digest("base64url");
}
var ClinePassAdapter = class extends LlmAdapter {
  constructor(options) {
    super();
    this.options = options;
    this.transport = options.transport ?? new ProxyTransport();
    this.requestExecutor = new ClinePassRequestExecutor(options, this.transport);
    const catalogs = options.catalog ? void 0 : new ClineCatalogManager({
      transport: this.transport,
      onFallback: options.onFallback,
      onOmitted: options.onOmitted,
      onRefresh: options.onCatalogRefresh,
      onWarning: options.onCatalogWarning,
      onDiagnostic: options.onCatalogDiagnostic
    });
    this.resolveCatalog = options.catalog ?? ((config) => catalogs.forConfig(config));
  }
  resolveCatalog;
  transport;
  requestExecutor;
  /** Per-reference rejection deadlines, isolated by the gateway that rejected it. */
  rejectedKeys = /* @__PURE__ */ new Map();
  /** Reference updates invalidate rejections from attempts using an older key. */
  credentialVersions = /* @__PURE__ */ new Map();
  /** Monotonic sequence of the latest request this adapter started. */
  callSeq = 0;
  dispose() {
    return this.transport.dispose();
  }
  /**
   * The catalog resolver for one configuration, rebuilding on the facts it
   * owns. Public for the plugin's discovery registration, which resolves the
   * current configuration the same way the adapter does.
   * @param config - the endpoint and refresh interval for the raw catalog.
   * @returns the resolver caching catalog values, independent of deployment limits.
   */
  catalogOf(config) {
    return this.resolveCatalog(config);
  }
  providerInfo(provider) {
    return { id: provider, name: DISPLAY_NAME };
  }
  async listModels(_provider) {
    const config = this.options.config();
    const snapshot = await this.catalogOf(config).snapshot();
    return [...snapshot.models.values()].filter((model) => isModelEnabled({ id: model.id, ...snapshot.details.get(model.id) }, config.modelVisibility)).map((model) => ({
      provider: PROVIDER_ID,
      id: model.id,
      name: model.name,
      inputModalities: [...model.input]
    }));
  }
  async resolveModel(_provider, model, signal) {
    const snapshot = await this.modelSnapshot(model, signal);
    return this.modelInfo(snapshot.model, snapshot.config.modelLimits);
  }
  /** Capture limits and protocol before discovery can yield to a settings update. */
  async modelSnapshot(model, signal, config = structuredClone(this.options.config())) {
    var _stack = [];
    try {
      const preparation = __using(_stack, deadline2(signal, config.requestPreparationTimeoutMs ?? DEFAULT_REQUEST_PREPARATION_TIMEOUT_MS, "LLM_PREPARATION_TIMEOUT"));
      let catalog;
      try {
        catalog = await this.catalogOf(config).forModel(model, preparation.signal);
      } catch (error) {
        if (timeoutOf2(preparation.signal, "LLM_PREPARATION_TIMEOUT")) throw new LlmError9("clinepass discovery preparation timeout", "TIMEOUT", { cause: error });
        throw error;
      }
      const resolved = catalog.models.get(model);
      if (resolved === void 0) {
        throw new LlmError9(`clinepass has no model "${model}"`, "UNKNOWN_MODEL");
      }
      return { config, catalog, model: withModelLimit(resolved, config.modelLimits) };
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  /** Keep capability resolution and eventual dispatch on the same configuration. */
  async prepareCall(_provider, model, signal) {
    const seq = ++this.callSeq;
    const generation = this.options.accountGeneration?.() ?? 0;
    const snapshot = { generation, ...await this.modelSnapshot(model, signal) };
    return {
      model: this.modelInfo(snapshot.model, snapshot.config.modelLimits),
      stream: (options) => this.streamWithSnapshot(options, snapshot, seq)
    };
  }
  /** Report the same default allowance used by dispatch so the host can budget compaction. */
  modelInfo(model, limits) {
    const defaultMaxTokens = requestMaxTokens(model, limits);
    const reasoning = {};
    const choices = reasoningChoices(model);
    if (choices.length > 0) {
      reasoning.reasoning = {
        efforts: choices.map((choice) => ({ ...choice, id: ReasoningEffortId(choice.id) }))
      };
    }
    return {
      provider: PROVIDER_ID,
      id: model.id,
      name: model.name,
      inputModalities: [...model.input],
      context: { contextWindow: model.contextWindow },
      ...defaultMaxTokens === void 0 ? {} : { defaultMaxTokens },
      ...reasoning
    };
  }
  async *stream(options) {
    if (options.stop !== void 0) {
      throw new LlmError9("llm-clinepass does not support GenerateOptions.stop", "UNSUPPORTED_OPTION");
    }
    yield* this.dispatch(options, ++this.callSeq);
  }
  async *streamWithSnapshot(options, snapshot, seq) {
    yield* this.dispatch(options, seq, snapshot);
  }
  async *dispatch(options, seq, prepared) {
    var _stack = [];
    try {
      const captured = prepared ?? { generation: this.options.accountGeneration?.() ?? 0, config: structuredClone(this.options.config()) };
      const sessionId = clineTaskValue(options.sessionId === void 0 ? void 0 : String(options.sessionId));
      const trace = new CallTrace(options.model, this.options.onCallTrace);
      const whole = __using(_stack, deadline2(options.signal, captured.config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS, "LLM_REQUEST_TIMEOUT"));
      try {
        const snapshot = prepared ?? {
          generation: captured.generation,
          ...await trace.measure("discovery", () => this.modelSnapshot(options.model, whole.signal, captured.config))
        };
        for await (const chunk of this.streamAccounts({ ...options, signal: whole.signal }, { ...snapshot, sessionId }, seq, trace)) {
          if (chunk.type === "finish") {
            trace.outcome = chunk.reason.kind === "error" ? "failed" : chunk.reason.kind === "aborted" ? "aborted" : "completed";
            if (chunk.reason.kind === "error" || chunk.reason.kind === "aborted") trace.code = chunk.reason.failure?.code;
          }
          yield chunk;
        }
      } catch (error) {
        trace.outcome = "failed";
        if (timeoutOf2(whole.signal, "LLM_REQUEST_TIMEOUT")) {
          trace.code = "TIMEOUT";
          throw new LlmError9("clinepass whole request timeout", "TIMEOUT", { cause: error });
        }
        if (options.signal?.aborted) {
          trace.outcome = "aborted";
          trace.code = "ABORTED";
          yield { type: "finish", reason: { kind: "aborted", failure: { code: "ABORTED", message: "clinepass request aborted by caller" } } };
          return;
        }
        trace.code = error instanceof LlmError9 ? error.code : "PI_AI_ERROR";
        throw error;
      } finally {
        trace.finish();
      }
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  async *streamAccounts(options, snapshot, seq, trace) {
    const accounts = accountsOf(snapshot.config);
    if (accounts.length === 0) throw new LlmError9("ClinePass has no accounts", "MISSING_CREDENTIAL");
    const preferred = accountRefOf(snapshot.config);
    const ordered = snapshot.config.autoSwitch ? [.../* @__PURE__ */ new Set([preferred, ...accounts.map((account) => account.apiKeyEnv)])] : [preferred];
    const now = Date.now();
    const gateway = assertBaseURL(snapshot.config.baseURL);
    const usable = ordered.filter((ref) => {
      const rejected = this.rejectedKeys.get(ref);
      const until = rejected?.get(gateway);
      if (until === void 0) return true;
      if (now >= until) {
        rejected.delete(gateway);
        if (rejected.size === 0) this.rejectedKeys.delete(ref);
        return true;
      }
      return false;
    });
    const refs = usable.length > 0 ? usable : ordered;
    const skippedRef = ordered.find((ref) => !refs.includes(ref));
    let switchReason;
    let failedRef;
    for (let attempt = 0; attempt < refs.length; attempt++) {
      const credentialVersion = this.credentialVersions.get(refs[attempt]) ?? 0;
      trace.startAttempt();
      let emitted = false;
      let usage;
      let retry = false;
      const retryFailure = (failure) => {
        const reason = accountFallback({
          failure,
          emitted,
          totalTokens: usage?.usage.totalTokens ?? 0,
          aborted: options.signal?.aborted === true,
          hasNext: attempt + 1 < refs.length
        });
        if (!reason || !failure) return false;
        if (isGatewayKeyRejection(failure) && credentialVersion === (this.credentialVersions.get(refs[attempt]) ?? 0)) this.rememberRejectedKey(refs[attempt], gateway);
        switchReason ??= reason;
        failedRef ??= refs[attempt];
        return true;
      };
      const announce = () => {
        if (emitted) return;
        const serving = refs[attempt];
        const replaced = failedRef ?? skippedRef ?? preferred;
        const notice = serving === preferred ? void 0 : {
          // The notice names the account the journey left: the first one that
          // failed this request, else the first one skipped for a remembered
          // rejection.
          fromRef: replaced,
          toRef: serving,
          reason: switchReason ?? "credential",
          at: Date.now()
        };
        this.options.onAccountSettled?.({ seq, generation: snapshot.generation, config: snapshot.config, ref: serving, notice });
        this.options.onAccountSwitch?.(notice, snapshot.config, seq);
      };
      try {
        for await (const chunk of this.requestExecutor.stream(options, {
          config: { ...snapshot.config, apiKeyEnv: refs[attempt] },
          model: snapshot.model,
          provider: snapshot.catalog.provider,
          sessionId: snapshot.sessionId
        }, trace)) {
          if (chunk.type === "usage") {
            usage = chunk;
            continue;
          }
          if (chunk.type === "finish") {
            trace.endAttempt(
              chunk.reason.kind === "error" ? "failed" : chunk.reason.kind === "aborted" ? "aborted" : "completed",
              chunk.reason.kind === "error" || chunk.reason.kind === "aborted" ? chunk.reason.failure?.code : void 0
            );
            const failure = chunk.reason.kind === "error" ? chunk.reason.failure : void 0;
            if (retryFailure(failure)) {
              retry = true;
              break;
            }
            if (chunk.reason.kind === "stop" || chunk.reason.kind === "tool-calls" || chunk.reason.kind === "max-tokens") announce();
            if (usage) yield usage;
            yield chunk;
            return;
          }
          announce();
          emitted = true;
          yield chunk;
        }
        if (!retry) return;
      } catch (error) {
        trace.endAttempt(
          options.signal?.aborted && !(error instanceof LlmError9 && error.code === "TIMEOUT") ? "aborted" : "failed",
          error instanceof LlmError9 ? error.code : "PI_AI_ERROR"
        );
        if (!retryFailure(error instanceof LlmError9 ? error : void 0)) throw error;
      } finally {
        trace.endAttempt();
      }
    }
  }
  rememberRejectedKey(ref, gateway) {
    const rejected = this.rejectedKeys.get(ref) ?? /* @__PURE__ */ new Map();
    rejected.set(gateway, Date.now() + REJECTED_KEY_TTL_MS);
    this.rejectedKeys.set(ref, rejected);
  }
  /** A stored change to a reference outranks the gateway's last rejection of it. */
  forgetRejectedKey(ref) {
    this.credentialVersions.set(ref, (this.credentialVersions.get(ref) ?? 0) + 1);
    this.rejectedKeys.delete(ref);
  }
};

// src/usage.ts
import { randomUUID as randomUUID5 } from "node:crypto";
import { RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { attributionHeaders as attributionHeaders3 } from "@deepseek-ai/dsh-llm";

// src/usage-contract.ts
var USAGE_WINDOWS = ["rolling", "weekly", "monthly"];
var USAGE_LIMIT_TYPES = {
  five_hour: "rolling",
  weekly: "weekly",
  monthly: "monthly"
};
function usageWindowStatus(percent) {
  return percent >= 100 ? "rate-limited" : "ok";
}
function parseAccountSwitch(value) {
  const notice = value;
  if (!notice || typeof notice.fromRef !== "string" || typeof notice.toRef !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(notice.fromRef) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(notice.toRef) || notice.reason !== "quota" && notice.reason !== "credential" || typeof notice.at !== "number" || !Number.isSafeInteger(notice.at) || notice.at < 0 || notice.at > 864e13) throw new Error("Invalid account switch notice");
  return { fromRef: notice.fromRef, toRef: notice.toRef, reason: notice.reason, at: notice.at };
}
function invalidUsage() {
  throw new Error("Invalid ClinePass usage response");
}
function parseWindow(row) {
  const window = row;
  if (!window || typeof window !== "object" || window.status !== "ok" && window.status !== "rate-limited" || typeof window.percent !== "number" || !Number.isFinite(window.percent) || window.percent < 0 || window.percent > 100 || typeof window.resetsAt !== "string" || !Number.isFinite(Date.parse(window.resetsAt))) invalidUsage();
  return { status: window.status, percent: window.percent, resetsAt: window.resetsAt };
}
function parseClineUsage(value) {
  if (!value || typeof value !== "object") invalidUsage();
  const source = value;
  const result = {};
  if (source.source !== void 0) {
    if (typeof source.source !== "string" || source.source.length === 0 || source.source.length > 128) {
      throw new Error("Invalid ClinePass usage source");
    }
    result.source = source.source;
  }
  if (source.lastSwitch !== void 0) {
    result.lastSwitch = parseAccountSwitch(source.lastSwitch);
  }
  for (const key of USAGE_WINDOWS) result[key] = parseWindow(source[key]);
  return result;
}
function parseUsageLimitsResponse(body) {
  if (!body || typeof body !== "object") invalidUsage();
  const data = body.data;
  if (!data || typeof data !== "object") invalidUsage();
  const limits = data.limits;
  if (!Array.isArray(limits)) invalidUsage();
  const windows = /* @__PURE__ */ new Map();
  for (const row of limits) {
    if (!row || typeof row !== "object") invalidUsage();
    const entry = row;
    const key = typeof entry.type === "string" ? USAGE_LIMIT_TYPES[entry.type] : void 0;
    if (key === void 0) continue;
    const percent = entry.percentUsed;
    if (typeof percent !== "number" || !Number.isFinite(percent) || percent < 0 || percent > 100 || typeof entry.resetsAt !== "string" || !Number.isFinite(Date.parse(entry.resetsAt))) invalidUsage();
    if (windows.has(key)) invalidUsage();
    windows.set(key, { status: usageWindowStatus(percent), percent, resetsAt: entry.resetsAt });
  }
  const result = {};
  for (const key of USAGE_WINDOWS) {
    const window = windows.get(key);
    if (window === void 0) invalidUsage();
    result[key] = window;
  }
  return result;
}
var usageCodec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#ClineUsage",
  schema: { parse: parseClineUsage },
  create: () => ({ parse: parseClineUsage })
};
var parseRef = (value) => {
  if (typeof value !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new Error("Invalid account reference");
  return value;
};
var refCodec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#AccountRef",
  schema: { parse: parseRef },
  create: () => ({ parse: parseRef })
};
var usageRemote = {
  package: "dsh-clinepass",
  descriptors: [{
    id: "dsh-clinepass#clinePassUsage/read",
    service: "clinePassUsage",
    namespace: "clinePassUsage",
    method: "read",
    invocation: { kind: "direct" },
    parameters: [],
    result: usageCodec
  }, {
    id: "dsh-clinepass#clinePassUsage/readAccount",
    service: "clinePassUsage",
    namespace: "clinePassUsage",
    method: "readAccount",
    invocation: { kind: "direct" },
    parameters: [{ name: "ref", wire: "ref", source: "json", codec: refCodec }],
    result: usageCodec
  }]
};

// src/usage-error.ts
var MAX_ERROR_BYTES = 16 * 1024;
var ERROR_READ_TIMEOUT_MS = 1e3;
var MAX_REASON_CHARS = 256;
function usageHttpFailure(status) {
  if (status === 401 || status === 403) {
    return { retryable: false, hint: ". Check your Cline API key and ClinePass subscription." };
  }
  if (status === 429) {
    return { retryable: true, hint: ". ClinePass is rate limiting usage; it clears with the window." };
  }
  return { retryable: status === 408 || status >= 500, hint: "" };
}
function errorMessage(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
  const error = value;
  for (const field of ["message", "detail", "reason", "error_description"]) {
    if (typeof error[field] === "string" && error[field].trim()) return error[field];
  }
  return errorMessage(error.data) ?? (typeof error.type === "string" ? error.type : typeof error.code === "string" ? error.code : void 0);
}
function redact(text2, options, incomplete) {
  const secrets = [options.apiKey];
  for (const endpoint of [options.baseURL, options.proxyURL]) {
    if (!endpoint) continue;
    const url = new URL(endpoint);
    for (const credential of [url.username, url.password]) {
      if (credential) secrets.push(credential, decodeURIComponent(credential));
    }
    if (url.username || url.password) {
      secrets.push(Buffer.from(`${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`).toString("base64"));
    }
  }
  const variants = [...new Set(secrets.filter(Boolean).flatMap((secret) => [secret, JSON.stringify(secret).slice(1, -1), encodeURIComponent(secret)]))].sort((left, right) => right.length - left.length);
  for (const secret of variants) {
    text2 = text2.replaceAll(secret, "[REDACTED]");
    if (incomplete) for (let length = Math.min(secret.length - 1, text2.length); length > 0; length--) {
      if (text2.endsWith(secret.slice(0, length))) {
        text2 = text2.slice(0, -length) + "[REDACTED]";
        break;
      }
    }
  }
  return text2.replace(/\b(Bearer|Basic)\s+[\w.~+/=-]+/gi, "$1 [REDACTED]").replace(
    /\b(authorization|proxy-authorization|cookie|set-cookie)\b(["']?\s*:\s*)("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\r\n]+)/gi,
    "$1$2[REDACTED]"
  ).replace(
    /\b(api[_ -]?key|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret|token|password|secret|authorization|cookie)\b(["']?\s*[:=]\s*)("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,;<>]+)/gi,
    "$1$2[REDACTED]"
  ).replace(/https?:\/\/[^\s<>"']+/gi, (raw) => {
    try {
      const url = new URL(raw);
      url.username = "";
      url.password = "";
      url.search = "";
      url.hash = "";
      return url.href;
    } catch {
      return "[REDACTED URL]";
    }
  });
}
async function readUsageError(response, options) {
  const reader = response.body?.getReader();
  if (!reader) return void 0;
  const signal = AbortSignal.any([options.signal, AbortSignal.timeout(ERROR_READ_TIMEOUT_MS)]);
  const abort = Promise.withResolvers();
  const onAbort = () => {
    abort.reject(signal.reason);
  };
  const chunks = [];
  let bytes = 0;
  let incomplete = false;
  try {
    signal.throwIfAborted();
    signal.addEventListener("abort", onAbort, { once: true });
    while (true) {
      const part = await Promise.race([reader.read(), abort.promise]);
      if (part.done) break;
      const remaining = MAX_ERROR_BYTES - bytes;
      chunks.push(part.value.slice(0, remaining));
      bytes += Math.min(part.value.byteLength, remaining);
      if (bytes === MAX_ERROR_BYTES) {
        incomplete = true;
        break;
      }
    }
  } catch {
    incomplete = true;
  } finally {
    signal.removeEventListener("abort", onAbort);
    void reader.cancel().catch(() => {
    });
    reader.releaseLock();
  }
  let text2 = Buffer.concat(chunks, bytes).toString("utf8").replace(/\uFFFD$/, "");
  try {
    const body = JSON.parse(text2);
    text2 = errorMessage(body && typeof body === "object" && "error" in body ? body.error : void 0) ?? errorMessage(body) ?? "";
  } catch {
    if (/^\s*[\[{]/.test(text2)) return void 0;
  }
  text2 = redact(text2, options, incomplete).replace(/<!--[\s\S]*?(?:-->|$)|<(script|style)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi, " ").replace(/<[^>]*>/g, " ").replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, " ").replace(/\s+/g, " ").trim();
  return text2 ? text2.slice(0, MAX_REASON_CHARS) + (text2.length > MAX_REASON_CHARS || incomplete ? "\u2026" : "") : void 0;
}

// src/usage.ts
var USAGE_MAX_BYTES = 1024 * 1024;
var USAGE_PATH = "/users/me/plan/usage-limits";
var ClineUsageService = class extends TypertRemoteService {
  constructor(ctx, options) {
    super(ctx, "clinePassUsage");
    this.options = options;
    this.transport = options.transport ?? new ProxyTransport();
    if (!options.transport) ctx.effect(() => () => this.transport.dispose());
  }
  identities = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  transport;
  async read() {
    try {
      const usage = await this.readRef(this.options.activeRef?.());
      const lastSwitch = this.options.lastSwitch?.();
      return lastSwitch ? { ...usage, lastSwitch } : usage;
    } catch (error) {
      const lastSwitch = this.options.lastSwitch?.();
      if (lastSwitch && error instanceof RemoteError && error.code === "clinepass/usage-unavailable") {
        throw new RemoteError(
          "clinepass/usage-unavailable",
          error.message,
          { ...error.details, lastSwitch },
          { cause: error }
        );
      }
      throw error;
    }
  }
  async readAccount(ref) {
    if (!this.options.accountRefs?.().includes(ref)) {
      throw new RemoteError("gateway/bad-request", "Unknown ClinePass account", {});
    }
    return this.readRef(ref);
  }
  async readRef(ref) {
    const identityKey = ref ?? "";
    if (this.options.accountRefs) for (const saved of this.identities.keys()) {
      if (saved && !this.options.accountRefs().includes(saved)) this.identities.delete(saved);
    }
    const baseURL = assertBaseURL(this.options.baseURL()).replace(/\/$/, "");
    const proxyURL = assertProxyURL(this.options.proxyURL?.());
    let key;
    try {
      key = await this.options.resolveApiKey(ref);
    } catch (error) {
      this.identities.delete(identityKey);
      const missing = error instanceof Error && "code" in error && error.code === "MISSING_CREDENTIAL";
      throw new RemoteError("clinepass/usage-unavailable", missing ? "ClinePass API key is not configured" : "Could not resolve the ClinePass API key", {
        retryable: !missing,
        retainPrevious: false
      }, { cause: error });
    }
    if (!key) {
      this.identities.delete(identityKey);
      throw new RemoteError("clinepass/usage-unavailable", "ClinePass API key is not configured", {
        retryable: false,
        retainPrevious: false
      });
    }
    let identity2 = this.identities.get(identityKey);
    if (identity2?.baseURL !== baseURL || identity2.proxyURL !== proxyURL || identity2.key !== key) {
      identity2 = { baseURL, proxyURL, key, source: randomUUID5() };
      this.identities.set(identityKey, identity2);
    }
    const { source } = identity2;
    const shared = this.pending.get(source);
    if (shared) return shared;
    const pending = this.fetchUsage(baseURL, key, source, proxyURL, this.transport.forProxy(proxyURL));
    this.pending.set(source, pending);
    try {
      return await pending;
    } finally {
      this.pending.delete(source);
    }
  }
  async fetchUsage(baseURL, key, source, proxyURL, fetcher) {
    const url = `${baseURL}${USAGE_PATH}`;
    const endpoint = diagnosticURL(url);
    const signal = AbortSignal.timeout(1e4);
    let result;
    try {
      result = await fetchJsonResponse(
        url,
        {
          headers: { ...attributionHeaders3(), Authorization: `Bearer ${key}`, Accept: "application/json" },
          signal,
          redirect: "error"
        },
        USAGE_MAX_BYTES,
        "identity",
        fetcher,
        (response2) => readUsageError(response2, { apiKey: key, baseURL, proxyURL, signal })
      );
    } catch (error) {
      const invalid = error instanceof SyntaxError || error instanceof RangeError;
      const detail = error instanceof SyntaxError ? "invalid JSON response" : error instanceof RangeError ? `response exceeds the ${USAGE_MAX_BYTES} byte limit` : transportFailure(error);
      throw new RemoteError("clinepass/usage-unavailable", `Could not read ${endpoint}: ${detail}`, {
        retryable: true,
        retainPrevious: !invalid,
        source
      }, { cause: error });
    }
    const { response, body } = result;
    if (!response.ok) {
      const { retryable, hint } = usageHttpFailure(response.status);
      const reason = typeof body === "string" && body ? ` Upstream: ${body}` : "";
      throw new RemoteError("clinepass/usage-unavailable", `ClinePass usage unavailable (HTTP ${response.status})${hint}${reason}`, {
        retryable,
        retainPrevious: retryable,
        source
      });
    }
    try {
      const usage = parseUsageLimitsResponse(body);
      return { ...usage, source };
    } catch (error) {
      throw new RemoteError("clinepass/usage-unavailable", "Invalid ClinePass usage response", {
        retryable: true,
        retainPrevious: false,
        source
      }, { cause: error });
    }
  }
};

// src/models.ts
import { TypertRemoteService as TypertRemoteService2 } from "@deepseek-ai/dsh-typert-protocol";
var ClineModelsService = class extends TypertRemoteService2 {
  constructor(ctx, options) {
    super(ctx, "clinePassModels");
    this.options = options;
  }
  async read() {
    try {
      return await discoverSettingsModels(this.options.catalog());
    } finally {
      this.options.onRefresh?.();
    }
  }
};

// src/analytics.ts
import { RemoteError as RemoteError2, TypertRemoteService as TypertRemoteService3 } from "@deepseek-ai/dsh-typert-protocol";

// src/analytics-contract.ts
var MAX_TIME = 864e13;
var MAX_RANGE_MS = 366 * 864e5;
var MAX_SESSIONS = 2e3;
function object2(value, field) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid analytics " + field);
  return value;
}
function integer(value, field, min = 0, max = MAX_TIME) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error("Invalid analytics " + field);
  }
  return value;
}
function amount(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1e12) {
    throw new Error("Invalid analytics " + field);
  }
  return value;
}
function text(value, field, max = 128) {
  if (typeof value !== "string" || value.length === 0 || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error("Invalid analytics " + field);
  }
  return value;
}
function list(value, field, max) {
  if (!Array.isArray(value) || value.length > max) throw new Error("Invalid analytics " + field);
  return value;
}
function bool(value, field) {
  if (typeof value !== "boolean") throw new Error("Invalid analytics " + field);
  return value;
}
function optionalAmount(value, field) {
  return value === null ? null : amount(value, field);
}
var TRUNCATIONS = ["sessions", "events", "time"];
var NOTES = ["unlimited", "limited-time", "unknown"];
function parseAnalyticsQuery(value) {
  const row = object2(value, "query");
  const from = integer(row.from, "query.from");
  const to = integer(row.to, "query.to", 1);
  if (from >= to) throw new Error("Invalid analytics range");
  if (to - from > MAX_RANGE_MS) throw new Error("Invalid analytics range");
  const timeZone = text(row.timeZone, "query.timeZone", 64);
  if (!/^[A-Za-z0-9_+\-/]+$/.test(timeZone)) throw new Error("Invalid analytics timezone");
  const maxSessions = row.maxSessions === void 0 ? void 0 : integer(row.maxSessions, "query.maxSessions", 1, MAX_SESSIONS);
  return { from, to, timeZone, ...maxSessions === void 0 ? {} : { maxSessions } };
}
function validateTotals(value) {
  const row = object2(value, "totals");
  for (const key of [
    "requests",
    "unsettledAttempts",
    "summaries",
    "inputTokens",
    "outputTokens",
    "cacheReadTokens",
    "cacheWriteTokens",
    "estimatedMicroUsd",
    "pricedRequests",
    "unpricedRequests",
    "missingUsage"
  ]) {
    integer(row[key], "totals." + key);
  }
}
function validateModel(value) {
  const row = object2(value, "model");
  text(row.model, "model.model");
  if (row.name !== void 0) text(row.name, "model.name");
  for (const key of [
    "requests",
    "missingUsage",
    "inputTokens",
    "outputTokens",
    "cacheReadTokens",
    "cacheWriteTokens",
    "estimatedMicroUsd",
    "pricedRequests",
    "unpricedRequests"
  ]) integer(row[key], "model." + key);
  optionalAmount(row.limitGoUsd, "model.limitGoUsd");
  optionalAmount(row.limitGoPlusUsd, "model.limitGoPlusUsd");
  if (row.limitNote !== void 0 && !NOTES.includes(row.limitNote)) throw new Error("Invalid analytics model.limitNote");
}
function validateDay(value) {
  const row = object2(value, "day");
  const day = text(row.day, "day.day", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("Invalid analytics day");
  const parsed = /* @__PURE__ */ new Date(day + "T00:00:00Z");
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) throw new Error("Invalid analytics day");
  integer(row.requests, "day.requests");
  integer(row.tokens, "day.tokens");
  integer(row.estimatedMicroUsd, "day.estimatedMicroUsd");
}
function validateCoverage(value) {
  const row = object2(value, "coverage");
  for (const key of [
    "listedSessions",
    "scannedSessions",
    "matchedSessions",
    "failedSessions",
    "eventsScanned",
    "summaries",
    "legacyRequests",
    "missingUsage",
    "scanMs"
  ]) integer(row[key], "coverage." + key);
  for (const key of ["unreadSessions", "evictedSessions", "unattributedRequests", "listMs", "pricingMs"]) {
    if (row[key] !== void 0) integer(row[key], "coverage." + key);
  }
  bool(row.truncated, "coverage.truncated");
  if (row.truncation !== void 0 && !TRUNCATIONS.includes(row.truncation)) throw new Error("Invalid analytics truncation");
  if (row.timeZoneFallback !== void 0 && row.timeZoneFallback !== true) throw new Error("Invalid analytics timezone fallback");
}
function validatePricing(value) {
  const row = object2(value, "pricing");
  if (row.source !== "clinepass-catalog") throw new Error("Invalid analytics pricing source");
  if (row.updatedAt !== void 0) integer(row.updatedAt, "pricing.updatedAt");
  if (row.unavailable !== void 0 && row.unavailable !== true) throw new Error("Invalid analytics pricing state");
  for (const model of list(row.unpricedModels, "pricing.unpricedModels", 256)) text(model, "pricing.unpricedModels", 128);
}
function parseAnalyticsReport(value) {
  const row = object2(value, "report");
  integer(row.generatedAt, "generatedAt");
  const range = object2(row.range, "range");
  const from = integer(range.from, "range.from");
  const to = integer(range.to, "range.to", 1);
  if (from >= to) throw new Error("Invalid analytics range");
  text(row.timeZone, "timeZone", 64);
  validateTotals(row.totals);
  for (const model of list(row.byModel, "byModel", 256)) validateModel(model);
  for (const day of list(row.byDay, "byDay", 366)) validateDay(day);
  validateCoverage(row.coverage);
  validatePricing(row.pricing);
  return value;
}
var queryCodec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#AnalyticsQuery",
  schema: { parse: parseAnalyticsQuery },
  create: () => ({ parse: parseAnalyticsQuery })
};
var reportCodec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#AnalyticsReport",
  schema: { parse: parseAnalyticsReport },
  create: () => ({ parse: parseAnalyticsReport })
};
var analyticsRemote = {
  package: "dsh-clinepass",
  descriptors: [{
    id: "dsh-clinepass#clinePassAnalytics/read",
    service: "clinePassAnalytics",
    namespace: "clinePassAnalytics",
    method: "read",
    invocation: { kind: "direct" },
    parameters: [{ name: "query", wire: "query", source: "json", codec: queryCodec }],
    // Review M4: the signal is injected after the business parameters and
    // never enters the wire args, so single-argument callers keep working
    // (precedent: dsh-llm discoverModels, typert.remote-client.js:62).
    cancellation: { parameter: "signal" },
    result: reportCodec
  }]
};

// src/analytics-scan.ts
var LEGACY_PROVIDER_ID = "clinepass";
var LEGACY_ROUTE_CUTOFF_MS = Date.parse("2026-09-30T00:00:00Z");
function record(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function count(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
}
function usageOf(value) {
  const usage = record(value);
  if (usage === void 0) return void 0;
  const input = count(usage.inputTokens);
  const output = count(usage.outputTokens);
  if (input === void 0 && output === void 0) return void 0;
  const cacheRead = (usage.cacheReadTokens === void 0 ? 0 : count(usage.cacheReadTokens)) ?? 0;
  const cacheWrite = (usage.cacheWriteTokens === void 0 ? 0 : count(usage.cacheWriteTokens)) ?? 0;
  const sum = (input ?? 0) + (output ?? 0) + cacheRead + cacheWrite;
  if (!Number.isSafeInteger(sum)) return void 0;
  return { input: input ?? 0, output: output ?? 0, cacheRead, cacheWrite };
}
function stepKey(data) {
  const turn = count(data?.turn);
  const step = count(data?.step);
  return turn === void 0 || step === void 0 ? void 0 : turn + ":" + step;
}
function isPluginRoute(provider, at, cutoff = LEGACY_ROUTE_CUTOFF_MS) {
  return provider === PROVIDER_ID || provider === LEGACY_PROVIDER_ID && at < cutoff;
}
function foldSession(snapshot, options = {}) {
  const inherited = count(snapshot.inheritedEventCount) ?? 0;
  const cutoff = options.cutoff ?? LEGACY_ROUTE_CUTOFF_MS;
  const facts = [];
  const attempts = [];
  const unattributed = [];
  const stepStarts = /* @__PURE__ */ new Map();
  let lastStart;
  let header;
  let ownEvents = 0;
  for (const event of snapshot.events) {
    const seq = count(event.seq);
    if (seq === void 0 || seq < inherited) continue;
    ownEvents++;
    const eventTime = count(event.time);
    const data = record(event.data);
    if (event.type === "request/header") {
      const config = record(record(data?.header)?.config);
      const provider = typeof config?.provider === "string" ? config.provider : void 0;
      const model = typeof config?.model === "string" && config.model ? config.model : void 0;
      header = provider === void 0 ? void 0 : { provider, ...model === void 0 ? {} : { model } };
      continue;
    }
    if (event.type === "step/start" || event.type === "step/end") {
      const key = stepKey(data);
      if (event.type === "step/start") {
        if (eventTime === void 0) continue;
        if (key !== void 0) stepStarts.set(key, eventTime);
        lastStart = eventTime;
      } else if (key !== void 0) {
        stepStarts.delete(key);
      }
      continue;
    }
    if (event.type === "assistant/message") {
      const at = stepStarts.get(stepKey(data) ?? "") ?? lastStart ?? eventTime;
      if (at === void 0) continue;
      if (header === void 0) {
        unattributed.push(at);
        continue;
      }
      if (!isPluginRoute(header.provider, at, cutoff)) continue;
      const messageModel = record(data?.message)?.model;
      const model = typeof messageModel === "string" && messageModel ? messageModel : header.model;
      if (model === void 0) {
        unattributed.push(at);
        continue;
      }
      const usage = usageOf(data?.usage);
      facts.push({
        at,
        model,
        kind: "message",
        legacy: header.provider === LEGACY_PROVIDER_ID,
        missingUsage: usage === void 0,
        input: usage?.input ?? 0,
        output: usage?.output ?? 0,
        cacheRead: usage?.cacheRead ?? 0,
        cacheWrite: usage?.cacheWrite ?? 0
      });
      continue;
    }
    if (event.type === "compaction/summary") {
      if (eventTime === void 0) continue;
      const provider = data?.provider;
      if (typeof provider !== "string" || !isPluginRoute(provider, eventTime, cutoff)) continue;
      const model = typeof data?.model === "string" && data.model ? data.model : void 0;
      if (model === void 0) {
        unattributed.push(eventTime);
        continue;
      }
      const usage = usageOf(data?.usage);
      facts.push({
        at: eventTime,
        model,
        kind: "summary",
        legacy: provider === LEGACY_PROVIDER_ID,
        missingUsage: usage === void 0,
        input: usage?.input ?? 0,
        output: usage?.output ?? 0,
        cacheRead: usage?.cacheRead ?? 0,
        cacheWrite: usage?.cacheWrite ?? 0
      });
      continue;
    }
    if (event.type === "assistant/attempt") {
      const at = stepStarts.get(stepKey(data) ?? "") ?? lastStart ?? eventTime;
      if (at === void 0) continue;
      if (header === void 0) {
        unattributed.push(at);
        continue;
      }
      if (isPluginRoute(header.provider, at, cutoff)) attempts.push(at);
    }
  }
  return { facts, attempts, unattributed, events: ownEvents };
}

// src/analytics-fold-cache.ts
import { randomUUID as randomUUID6 } from "node:crypto";
import { mkdir as mkdir2, readFile, rename, rm, stat, writeFile as writeFile2 } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join as join2, resolve as resolve2 } from "node:path";
var ANALYTICS_FOLD_CACHE_VERSION = 1;
var ANALYTICS_FOLD_CACHE_MAX_BYTES = 32 * 1024 * 1024;
var ANALYTICS_FOLD_CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
var MAX_ENTRIES = 4096;
var MAX_FACTS = 2e5;
var MAX_MARKS = 2e5;
var MAX_ID_LENGTH = 256;
var MAX_REVISION_LENGTH = 512;
var MAX_MODEL_LENGTH = 256;
var FACT_LEGACY = 1;
var FACT_SUMMARY = 2;
var FACT_MISSING_USAGE = 4;
var FACT_FLAGS_MAX = FACT_LEGACY | FACT_SUMMARY | FACT_MISSING_USAGE;
function analyticsFoldCachePath(options = {}) {
  const home = options.home?.trim() || process.env.DSH_HOME?.trim() || join2(homedir(), ".dsh");
  return resolve2(home, "cache", "dsh-clinepass", "analytics-folds.v1.json");
}
function validString(value, max) {
  return typeof value === "string" && value.length > 0 && value.length <= max;
}
function validCount(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function encodeFact(fact) {
  const flags = (fact.legacy ? FACT_LEGACY : 0) | (fact.kind === "summary" ? FACT_SUMMARY : 0) | (fact.missingUsage ? FACT_MISSING_USAGE : 0);
  return [fact.at, fact.model, fact.input, fact.output, fact.cacheRead, fact.cacheWrite, flags];
}
function decodeFacts(value) {
  if (!Array.isArray(value) || value.length > MAX_FACTS) return void 0;
  const facts = [];
  for (const raw of value) {
    if (!Array.isArray(raw) || raw.length !== 7) return void 0;
    const [at, model, input, output, cacheRead, cacheWrite, flags] = raw;
    if (!validCount(at) || !validString(model, MAX_MODEL_LENGTH)) return void 0;
    if (!validCount(input) || !validCount(output)) return void 0;
    if (!validCount(cacheRead) || !validCount(cacheWrite)) return void 0;
    if (!validCount(flags) || flags > FACT_FLAGS_MAX) return void 0;
    facts.push({
      at,
      model,
      input,
      output,
      cacheRead,
      cacheWrite,
      legacy: (flags & FACT_LEGACY) !== 0,
      kind: (flags & FACT_SUMMARY) !== 0 ? "summary" : "message",
      missingUsage: (flags & FACT_MISSING_USAGE) !== 0
    });
  }
  return facts;
}
function decodeMarks(value) {
  if (!Array.isArray(value) || value.length > MAX_MARKS) return void 0;
  const marks = [];
  for (const mark of value) {
    if (!validCount(mark)) return void 0;
    marks.push(mark);
  }
  return marks;
}
function encodable(id, entry) {
  if (!validString(id, MAX_ID_LENGTH) || !validString(entry.revision, MAX_REVISION_LENGTH)) return false;
  if (!validCount(entry.storedAt) || !validCount(entry.createdAt) || !validCount(entry.events)) return false;
  if (!Array.isArray(entry.facts) || entry.facts.length > MAX_FACTS) return false;
  if (!Array.isArray(entry.attempts) || entry.attempts.length > MAX_MARKS) return false;
  if (!Array.isArray(entry.unattributed) || entry.unattributed.length > MAX_MARKS) return false;
  for (const fact of entry.facts) {
    if (!validCount(fact.at) || !validString(fact.model, MAX_MODEL_LENGTH)) return false;
    if (!validCount(fact.input) || !validCount(fact.output)) return false;
    if (!validCount(fact.cacheRead) || !validCount(fact.cacheWrite)) return false;
  }
  for (const mark of entry.attempts) if (!validCount(mark)) return false;
  for (const mark of entry.unattributed) if (!validCount(mark)) return false;
  return true;
}
function decodeFoldCache(text2) {
  if (typeof text2 !== "string") return void 0;
  if (Buffer.byteLength(text2) > ANALYTICS_FOLD_CACHE_MAX_BYTES) return void 0;
  let document;
  try {
    document = JSON.parse(text2);
  } catch {
    return void 0;
  }
  if (!isRecord(document) || document.version !== ANALYTICS_FOLD_CACHE_VERSION) return void 0;
  if (!Array.isArray(document.sessions) || document.sessions.length > MAX_ENTRIES) return void 0;
  const entries = /* @__PURE__ */ new Map();
  for (const raw of document.sessions) {
    if (!Array.isArray(raw) || raw.length !== 8) return void 0;
    const [id, revision, storedAt, createdAt, events, rawFacts, rawAttempts, rawUnattributed] = raw;
    if (!validString(id, MAX_ID_LENGTH) || !validString(revision, MAX_REVISION_LENGTH)) return void 0;
    if (!validCount(storedAt) || !validCount(createdAt) || !validCount(events)) return void 0;
    const facts = decodeFacts(rawFacts);
    const attempts = decodeMarks(rawAttempts);
    const unattributed = decodeMarks(rawUnattributed);
    if (facts === void 0 || attempts === void 0 || unattributed === void 0) return void 0;
    if (entries.has(id)) return void 0;
    entries.set(id, { revision, storedAt, createdAt, events, facts, attempts, unattributed });
  }
  return entries;
}
async function loadFoldCache(path, options = {}) {
  const limit = options.maxBytes ?? ANALYTICS_FOLD_CACHE_MAX_BYTES;
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size > limit) return /* @__PURE__ */ new Map();
    const bytes = await readFile(path);
    if (bytes.byteLength > limit) return /* @__PURE__ */ new Map();
    return decodeFoldCache(bytes.toString("utf8")) ?? /* @__PURE__ */ new Map();
  } catch {
    return /* @__PURE__ */ new Map();
  }
}
async function saveFoldCache(path, entries, options = {}) {
  const limit = options.maxBytes ?? ANALYTICS_FOLD_CACHE_MAX_BYTES;
  const prefix = `{"version":${ANALYTICS_FOLD_CACHE_VERSION},"sessions":[`;
  const suffix = "]}";
  const rows = [];
  let content;
  try {
    for (const [id, entry] of entries) {
      if (!encodable(id, entry)) continue;
      const session = [
        id,
        entry.revision,
        entry.storedAt,
        entry.createdAt,
        entry.events,
        entry.facts.map(encodeFact),
        entry.attempts,
        entry.unattributed
      ];
      const text2 = JSON.stringify(session);
      if (text2 === void 0) return false;
      rows.push({ storedAt: entry.storedAt, text: text2, bytes: Buffer.byteLength(text2) });
    }
    rows.sort((left, right) => left.storedAt - right.storedAt);
    let total = Buffer.byteLength(prefix) + Buffer.byteLength(suffix);
    for (const row of rows) total += row.bytes;
    total += Math.max(0, rows.length - 1);
    let start = 0;
    while (start < rows.length && total > limit) {
      total -= rows[start].bytes;
      if (rows.length - start > 1) total -= 1;
      start++;
    }
    if (total > limit) return false;
    content = prefix + rows.slice(start).map((row) => row.text).join(",") + suffix;
    if (Buffer.byteLength(content) > limit) return false;
  } catch {
    return false;
  }
  const temporary = `${path}.tmp-${process.pid}-${randomUUID6()}`;
  try {
    await mkdir2(dirname(path), { recursive: true });
    await writeFile2(temporary, content, { flag: "wx", mode: 384 });
    await rename(temporary, path);
    return true;
  } catch {
    return false;
  } finally {
    await rm(temporary, { force: true }).catch(() => {
    });
  }
}

// src/analytics-pricing.ts
function billedInput(usage) {
  return usage.input + usage.cacheRead + usage.cacheWrite;
}
function isFreeCost(cost) {
  const free = (rates) => rates.input === 0 && rates.output === 0 && rates.cacheRead === 0 && rates.cacheWrite === 0;
  return free(cost) && (cost.tiers === void 0 || cost.tiers.every(free));
}
function tierOf(cost, billed) {
  let chosen = cost;
  let threshold = -1;
  for (const tier of cost.tiers ?? []) {
    if (billed > tier.inputTokensAbove && tier.inputTokensAbove >= threshold) {
      chosen = tier;
      threshold = tier.inputTokensAbove;
    }
  }
  return chosen;
}
function priceUsage(model, usage, cost, at) {
  void model;
  void at;
  const rates = tierOf(cost, billedInput(usage));
  return Math.round(usage.input * rates.input) + Math.round(usage.output * rates.output) + Math.round(usage.cacheRead * rates.cacheRead) + Math.round(usage.cacheWrite * rates.cacheWrite);
}

// src/clinepass-plan.ts
var CLINEPASS_MONTHLY_LIMITS = {};
function clinepassMonthlyLimit(model) {
  return Object.hasOwn(CLINEPASS_MONTHLY_LIMITS, model) ? CLINEPASS_MONTHLY_LIMITS[model] : void 0;
}

// src/analytics.ts
var DEFAULT_BUDGET_MS = 12e3;
var DEFAULT_MAX_SESSIONS = 500;
var DEFAULT_MAX_EVENTS = 5e5;
var DEFAULT_MAX_FACTS = 2e5;
var DEFAULT_MAX_CONCURRENCY = 8;
var MAX_CACHE_SESSIONS = 2e3;
var PRICING_TIMEOUT_MS = 4e3;
var UNVERSIONED_REUSE_MS = 5e3;
var AnalyticsDeadlineError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AnalyticsDeadlineError";
  }
};
function idOf(record2) {
  const id = record2.header?.id;
  return typeof id === "string" && id.length > 0 ? id : void 0;
}
function createdAtOf(record2) {
  const createdAt = record2.header?.createdAt;
  return typeof createdAt === "number" && Number.isSafeInteger(createdAt) && createdAt >= 0 ? createdAt : 0;
}
function abortOf(signal) {
  return signal.reason ?? new Error("analytics read aborted");
}
function withTimeout(promise, ms, message, signal) {
  return new Promise((resolve3, reject) => {
    let settled2 = false;
    const timer = setTimeout(() => {
      settle(new AnalyticsDeadlineError(message));
    }, ms);
    const onAbort = () => {
      settle(abortOf(signal));
    };
    const detach = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };
    const settle = (error) => {
      if (settled2) return;
      settled2 = true;
      detach();
      reject(error);
    };
    promise.then((value) => {
      if (settled2) return;
      settled2 = true;
      detach();
      resolve3(value);
    }, (error) => {
      settle(error);
    });
    if (signal?.aborted === true) onAbort();
    else signal?.addEventListener("abort", onAbort, { once: true });
    timer.unref?.();
  });
}
function resolveTimeZone(value) {
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: value }).format(0);
    return { name: value, fallback: false };
  } catch {
    return { name: "UTC", fallback: true };
  }
}
function dayKey(at, formatter) {
  const parts = formatter.formatToParts(new Date(at));
  const value = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return value("year") + "-" + value("month") + "-" + value("day");
}
function nextDay(day) {
  return new Date(Date.parse(day + "T00:00:00Z") + 864e5).toISOString().slice(0, 10);
}
function firstInstantOf(day, formatter) {
  const midnight = Date.parse(day + "T00:00:00Z");
  let low = midnight - 14 * 36e5;
  let high = midnight + 15 * 36e5;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (dayKey(mid, formatter) >= day) high = mid;
    else low = mid + 1;
  }
  return low;
}
function localDayBuckets(from, to, formatter) {
  const starts = [];
  const keys = [];
  let day = dayKey(from, formatter);
  while (starts.length < 367) {
    const start = firstInstantOf(day, formatter);
    if (start >= to) break;
    starts.push(start);
    keys.push(day);
    day = nextDay(day);
  }
  return { starts, keys };
}
function bucketIndexOf(buckets, at) {
  let low = 0;
  let high = buckets.starts.length - 1;
  let index = 0;
  while (low <= high) {
    const mid = low + high >> 1;
    if (buckets.starts[mid] <= at) {
      index = mid;
      low = mid + 1;
    } else high = mid - 1;
  }
  return index;
}
function sortedFacts(folded) {
  const facts = folded.facts;
  let ordered = true;
  for (let index = 1; index < facts.length; index++) {
    if (facts[index].at < facts[index - 1].at) {
      ordered = false;
      break;
    }
  }
  if (!ordered) facts.sort((left, right) => left.at - right.at);
  return folded;
}
function lowerBound(facts, from) {
  let low = 0;
  let high = facts.length;
  while (low < high) {
    const mid = low + high >> 1;
    if (facts[mid].at < from) low = mid + 1;
    else high = mid;
  }
  return low;
}
function usageOf2(fact) {
  return { input: fact.input, output: fact.output, cacheRead: fact.cacheRead, cacheWrite: fact.cacheWrite };
}
function analyticsPriceBook(snapshot) {
  const models = /* @__PURE__ */ new Map();
  for (const [id, model] of snapshot.models) {
    models.set(id, {
      ...model.id === void 0 ? {} : { id: model.id },
      ...model.name === void 0 ? {} : { name: model.name },
      ...snapshot.details?.get(id)?.costKnown === false ? {} : { cost: model.cost }
    });
  }
  return {
    models,
    ...snapshot.metadataUpdatedAtMs === void 0 ? {} : { updatedAt: snapshot.metadataUpdatedAtMs }
  };
}
var ClineAnalyticsService = class extends TypertRemoteService3 {
  constructor(ctx, options) {
    super(ctx, "clinePassAnalytics");
    this.options = options;
  }
  cache = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  /** The most recent successful price table; stale-on-error fallback (review P4/S4). */
  lastPriceBook;
  factTotal = 0;
  /**
   * The on-disk fold cache, loaded lazily once per service. The promise is
   * memoized even when loading fails, because a missing or corrupt file is an
   * empty cache and retrying it on every run would only add latency.
   */
  folds;
  /**
   * Read one aggregate report.
   * @param raw - the validated query from the RPC codec.
   * @param signal - caller cancellation, injected by the gateway after the
   *   business parameters and never carried on the wire.
   * @returns the report; failures carry a reason in the domain error details.
   */
  async read(raw, signal) {
    let query;
    try {
      query = parseAnalyticsQuery(raw);
    } catch (error) {
      throw new RemoteError2("clinepass/analytics-unavailable", "Invalid analytics range", {
        reason: "invalid-range",
        retryable: false
      }, { cause: error });
    }
    const key = JSON.stringify(query);
    const shared = this.pending.get(key);
    if (shared !== void 0) return shared;
    const pending = this.run(query, signal).finally(() => {
      this.pending.delete(key);
    });
    this.pending.set(key, pending);
    return pending;
  }
  now() {
    return this.options.now?.() ?? Date.now();
  }
  foldPath() {
    return this.options.foldCachePath ?? analyticsFoldCachePath();
  }
  /** Load the persistent folds once; later runs share the same map. */
  diskFolds() {
    this.folds ??= loadFoldCache(this.foldPath());
    return this.folds;
  }
  /**
   * Ask the durable index for the current revisions. Any failure — the service
   * is absent, rejects, or the caller aborts — yields an empty table, which
   * disables disk reuse for this run without touching the scan.
   */
  async revisionTable(persistence, signal) {
    if (persistence === void 0) return /* @__PURE__ */ new Map();
    try {
      const listed = await persistence.list({ signal });
      const revisions = /* @__PURE__ */ new Map();
      for (const record2 of listed) {
        const id = record2.header?.id;
        const revision = record2.revision;
        if (typeof id === "string" && id.length > 0 && typeof revision === "string" && revision.length > 0) {
          revisions.set(id, revision);
        }
      }
      return revisions;
    } catch {
      return /* @__PURE__ */ new Map();
    }
  }
  limitOf(name2, fallback) {
    const value = this.options[name2];
    return value === void 0 ? fallback : value;
  }
  async run(query, signal) {
    const queryService = this.options.query();
    if (queryService === void 0) {
      throw new RemoteError2("clinepass/analytics-unavailable", "Session history is unavailable on this Host", {
        reason: "no-session-query",
        retryable: false
      });
    }
    const persistence = this.options.persistence?.();
    const revisionsPromise = this.revisionTable(persistence, signal);
    const foldsPromise = persistence === void 0 ? Promise.resolve(/* @__PURE__ */ new Map()) : this.diskFolds();
    const listStarted = this.now();
    let listed;
    try {
      listed = await queryService.listSessions(signal);
    } catch (error) {
      if (signal?.aborted === true) throw abortOf(signal);
      throw new RemoteError2("clinepass/analytics-unavailable", "Could not list local sessions", {
        reason: "scan-failed",
        retryable: true
      }, { cause: error });
    }
    const listMs = Math.max(0, this.now() - listStarted);
    const revisions = await revisionsPromise;
    const cachedFolds = await foldsPromise;
    const zone = resolveTimeZone(query.timeZone);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone.name,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const started = this.now();
    const budgetMs = this.limitOf("budgetMs", DEFAULT_BUDGET_MS);
    const maxEvents = this.limitOf("maxEvents", DEFAULT_MAX_EVENTS);
    const maxSessionCount = Math.min(query.maxSessions ?? this.limitOf("maxSessions", DEFAULT_MAX_SESSIONS), 2e3);
    const ordered = [...listed].sort((left, right) => {
      const live = Number(right.live === true) - Number(left.live === true);
      return live !== 0 ? live : createdAtOf(right) - createdAtOf(left);
    });
    const targets = ordered.slice(0, maxSessionCount);
    const local = /* @__PURE__ */ new Map();
    const readFolds = /* @__PURE__ */ new Map();
    let scanned = 0;
    let events = 0;
    let newEvents = 0;
    let failed = 0;
    let stopped;
    let abortReason;
    const pricingStarted = this.now();
    const pricingPromise = this.options.pricing();
    pricingPromise.catch(() => {
    });
    const scanRecord = async (record2) => {
      const id = idOf(record2);
      if (id === void 0) {
        scanned++;
        failed++;
        return;
      }
      const live = record2.live === true;
      const revision = live ? void 0 : revisions.get(id);
      const cached = this.cache.get(id);
      const reusable = cached !== void 0 && live === cached.live && (!live && revision !== void 0 ? cached.revision === revision : this.now() - cached.storedAt < UNVERSIONED_REUSE_MS);
      if (reusable && cached !== void 0) {
        this.cache.delete(id);
        this.cache.set(id, cached);
        scanned++;
        events += cached.facts.events;
        local.set(id, sortedFacts(cached.facts));
        return;
      }
      if (revision !== void 0) {
        const stored = cachedFolds.get(id);
        if (stored !== void 0 && stored.revision === revision) {
          scanned++;
          events += stored.events;
          local.set(id, sortedFacts({
            facts: stored.facts,
            attempts: stored.attempts,
            unattributed: stored.unattributed,
            events: stored.events
          }));
          return;
        }
      }
      if (this.now() - started > budgetMs) {
        stopped = "time";
        return;
      }
      if (newEvents > maxEvents) {
        stopped = "events";
        return;
      }
      const remaining = budgetMs - (this.now() - started);
      try {
        const snapshot = await withTimeout(
          queryService.readSession(id),
          Math.max(1, remaining),
          "session read timed out",
          signal
        );
        const facts = foldSession(snapshot);
        scanned++;
        events += facts.events;
        newEvents += facts.events;
        this.remember(id, createdAtOf(record2), facts, live, this.now(), revision);
        local.set(id, sortedFacts(facts));
        if (revision !== void 0) {
          readFolds.set(id, {
            revision,
            storedAt: this.now(),
            createdAt: createdAtOf(record2),
            events: facts.events,
            facts: facts.facts,
            attempts: facts.attempts,
            unattributed: facts.unattributed
          });
        }
      } catch (error) {
        if (signal?.aborted === true) {
          abortReason = { reason: abortOf(signal) };
          return;
        }
        scanned++;
        failed++;
        if (error instanceof AnalyticsDeadlineError) {
          stopped = "time";
          return;
        }
      }
    };
    const poolSize = Math.max(1, Math.min(
      this.limitOf("maxConcurrency", DEFAULT_MAX_CONCURRENCY),
      targets.length
    ));
    let cursor = 0;
    const worker = async () => {
      for (; ; ) {
        if (signal?.aborted === true) {
          abortReason ??= { reason: abortOf(signal) };
          return;
        }
        if (stopped !== void 0 || abortReason !== void 0) return;
        const index = cursor;
        if (index >= targets.length) return;
        cursor++;
        await scanRecord(targets[index]);
      }
    };
    const workers = [];
    for (let index = 0; index < poolSize; index++) workers.push(worker());
    await Promise.all(workers);
    if (abortReason !== void 0) throw abortReason.reason;
    const scanMs = Math.max(0, this.now() - started);
    if (readFolds.size > 0 && signal?.aborted !== true) {
      await this.persistFolds(cachedFolds, readFolds);
    }
    let priceBook;
    let pricingUnavailable = false;
    try {
      priceBook = await withTimeout(pricingPromise, PRICING_TIMEOUT_MS, "pricing request timed out", signal);
      if (priceBook === void 0) pricingUnavailable = true;
    } catch (error) {
      if (signal?.aborted === true) throw abortOf(signal);
      pricingUnavailable = true;
    }
    const pricingMs = Math.max(0, this.now() - pricingStarted);
    if (pricingUnavailable && this.lastPriceBook !== void 0) {
      priceBook = this.lastPriceBook;
      pricingUnavailable = false;
    } else if (!pricingUnavailable) {
      this.lastPriceBook = priceBook;
    }
    const totals = {
      requests: 0,
      unsettledAttempts: 0,
      summaries: 0,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      estimatedMicroUsd: 0,
      pricedRequests: 0,
      unpricedRequests: 0,
      missingUsage: 0
    };
    const models = /* @__PURE__ */ new Map();
    const days = /* @__PURE__ */ new Map();
    const unpriced = /* @__PURE__ */ new Set();
    let matchedSessions = 0;
    let legacyRequests = 0;
    let unattributedRequests = 0;
    let buckets;
    for (const folded of local.values()) {
      const facts = folded.facts;
      let matched = false;
      for (let index = lowerBound(facts, query.from); index < facts.length; index++) {
        const fact = facts[index];
        if (fact.at >= query.to) break;
        matched = true;
        const model = fact.model;
        let row = models.get(model);
        if (row === void 0) {
          row = {
            model,
            requests: 0,
            missingUsage: 0,
            inputTokens: 0,
            outputTokens: 0,
            cacheReadTokens: 0,
            cacheWriteTokens: 0,
            estimatedMicroUsd: 0,
            pricedRequests: 0,
            unpricedRequests: 0
          };
          models.set(model, row);
        }
        row.requests++;
        totals.requests++;
        if (fact.kind === "summary") totals.summaries++;
        if (fact.legacy) legacyRequests++;
        let tokens = 0;
        let micro = 0;
        if (fact.missingUsage) {
          totals.missingUsage++;
          row.missingUsage++;
        } else {
          tokens = fact.input + fact.output + fact.cacheRead + fact.cacheWrite;
          totals.inputTokens += fact.input;
          totals.outputTokens += fact.output;
          totals.cacheReadTokens += fact.cacheRead;
          totals.cacheWriteTokens += fact.cacheWrite;
          row.inputTokens += fact.input;
          row.outputTokens += fact.output;
          row.cacheReadTokens += fact.cacheRead;
          row.cacheWriteTokens += fact.cacheWrite;
          const cost = priceBook?.models.get(model)?.cost;
          if (cost === void 0) {
            totals.unpricedRequests++;
            row.unpricedRequests++;
            unpriced.add(model);
          } else {
            micro = priceUsage(model, usageOf2(fact), cost, fact.at);
            totals.estimatedMicroUsd += micro;
            totals.pricedRequests++;
            row.estimatedMicroUsd += micro;
            row.pricedRequests++;
          }
        }
        buckets ??= localDayBuckets(query.from, query.to, formatter);
        const day = buckets.keys[bucketIndexOf(buckets, fact.at)];
        let bucket = days.get(day);
        if (bucket === void 0) {
          bucket = { requests: 0, tokens: 0, estimatedMicroUsd: 0 };
          days.set(day, bucket);
        }
        bucket.requests++;
        bucket.tokens += tokens;
        bucket.estimatedMicroUsd += micro;
      }
      for (const at of folded.attempts) {
        if (at < query.from || at >= query.to) continue;
        matched = true;
        totals.unsettledAttempts++;
      }
      for (const at of folded.unattributed) {
        if (at >= query.from && at < query.to) unattributedRequests++;
      }
      if (matched) matchedSessions++;
    }
    const byModel = [...models.values()].map((row) => {
      const limit = clinepassMonthlyLimit(row.model);
      const priced = priceBook?.models.get(row.model);
      const note = limit?.note ?? (limit === void 0 ? priced?.cost !== void 0 && isFreeCost(priced.cost) ? "unlimited" : "unknown" : void 0);
      const result = {
        model: row.model,
        ...priced?.name === void 0 ? {} : { name: priced.name },
        requests: row.requests,
        missingUsage: row.missingUsage,
        inputTokens: row.inputTokens,
        outputTokens: row.outputTokens,
        cacheReadTokens: row.cacheReadTokens,
        cacheWriteTokens: row.cacheWriteTokens,
        estimatedMicroUsd: row.estimatedMicroUsd,
        pricedRequests: row.pricedRequests,
        unpricedRequests: row.unpricedRequests,
        limitGoUsd: limit?.go ?? null,
        limitGoPlusUsd: limit?.goPlus ?? null,
        ...note === void 0 ? {} : { limitNote: note }
      };
      return result;
    }).sort((left, right) => right.estimatedMicroUsd - left.estimatedMicroUsd || right.requests - left.requests || left.model.localeCompare(right.model));
    const byDay = [...days.entries()].map(([day, row]) => ({ day, requests: row.requests, tokens: row.tokens, estimatedMicroUsd: row.estimatedMicroUsd })).sort((left, right) => left.day.localeCompare(right.day));
    const evictedSessions = this.trim();
    const truncation = stopped ?? (ordered.length > targets.length ? "sessions" : void 0);
    const truncated = truncation !== void 0;
    const report = {
      generatedAt: this.now(),
      range: { from: query.from, to: query.to },
      timeZone: zone.name,
      totals,
      byModel,
      byDay,
      coverage: {
        listedSessions: listed.length,
        scannedSessions: scanned,
        matchedSessions,
        failedSessions: failed,
        eventsScanned: events,
        summaries: totals.summaries,
        legacyRequests,
        missingUsage: totals.missingUsage,
        truncated,
        ...truncation === void 0 ? {} : { truncation },
        scanMs,
        ...zone.fallback ? { timeZoneFallback: true } : {},
        // P16/P18/M1: sessions listed but never scanned — the slice cap or a
        // budget stopped first. Observability only: this never implies the
        // range was covered.
        unreadSessions: Math.max(0, listed.length - scanned),
        // P3/S1: entries the end-of-run trim dropped; they were counted in
        // this report from run-local results, but the next run re-reads them.
        evictedSessions,
        // P12: unattributed model calls in range, counted for visibility only.
        unattributedRequests,
        // S6: segmented timing (list / scan / pricing).
        listMs,
        pricingMs
      },
      pricing: {
        source: "clinepass-catalog",
        ...priceBook?.updatedAt === void 0 ? {} : { updatedAt: priceBook.updatedAt },
        ...pricingUnavailable ? { unavailable: true } : {},
        unpricedModels: [...unpriced].sort().slice(0, 64)
      }
    };
    return report;
  }
  /**
   * Merge this run's newly read folds into the persistent cache. Entries the
   * run never looked at are kept, entries past the age limit are dropped, and
   * saveFoldCache applies the byte cap by storedAt. The write is best-effort:
   * a failed save leaves the previous file and never fails the report.
   */
  async persistFolds(cached, read) {
    const oldest = this.now() - ANALYTICS_FOLD_CACHE_MAX_AGE_MS;
    for (const [id, entry] of cached) {
      if (entry.storedAt < oldest) cached.delete(id);
    }
    for (const [id, entry] of read) cached.set(id, entry);
    await saveFoldCache(this.foldPath(), cached);
  }
  remember(id, createdAt, facts, live, storedAt, revision) {
    const previous = this.cache.get(id);
    if (previous !== void 0) this.factTotal -= previous.facts.facts.length;
    this.cache.delete(id);
    this.cache.set(id, { createdAt, facts, live, storedAt, revision });
    this.factTotal += facts.facts.length;
  }
  /** The one eviction point; returns how many entries it dropped (review S1/P2). */
  trim() {
    const maxFacts = this.limitOf("maxFacts", DEFAULT_MAX_FACTS);
    let evicted = 0;
    while (this.cache.size > MAX_CACHE_SESSIONS || this.factTotal > maxFacts) {
      const first = this.cache.keys().next().value;
      if (first === void 0) break;
      const entry = this.cache.get(first);
      if (entry !== void 0) this.factTotal -= entry.facts.facts.length;
      this.cache.delete(first);
      evicted++;
    }
    return evicted;
  }
};

// src/accounts-contract.ts
function parseAccountCommand(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid account command");
  const row = value;
  const fields2 = {
    add: ["kind", "id", "name", "key"],
    remove: ["kind", "ref"],
    select: ["kind", "ref"],
    rename: ["kind", "ref", "name"],
    "replace-key": ["kind", "ref", "key"],
    move: ["kind", "ref", "toIndex"],
    "auto-switch": ["kind", "value"]
  };
  if (typeof row.kind !== "string" || !Object.hasOwn(fields2, row.kind) || Object.keys(row).some((key) => !fields2[row.kind].includes(key)) || fields2[row.kind].some((key) => !Object.hasOwn(row, key))) throw new Error("Invalid account command");
  if ("ref" in row && (typeof row.ref !== "string" || !ACCOUNT_REF_PATTERN.test(row.ref))) throw new Error("Invalid account reference");
  if ("name" in row && (typeof row.name !== "string" || !row.name.trim() || row.name.trim().length > 80)) throw new Error("Invalid account name");
  if ("key" in row && (typeof row.key !== "string" || !row.key.trim())) throw new Error("Missing account credential");
  if (row.kind === "add" && (typeof row.id !== "string" || !/^[a-f0-9]{32}$/.test(row.id))) throw new Error("Invalid account operation ID");
  if (row.kind === "move" && (!Number.isInteger(row.toIndex) || row.toIndex < 0)) throw new Error("Invalid account position");
  if (row.kind === "auto-switch" && typeof row.value !== "boolean") throw new Error("Invalid account switch");
  return { ...row };
}
function parseResult(value) {
  if (value !== "applied" && value !== "rejected" && value !== "unknown") throw new Error("Invalid account command result");
  return value;
}
var commandCodec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#AccountCommand",
  schema: { parse: parseAccountCommand },
  create: () => ({ parse: parseAccountCommand })
};
var resultCodec = {
  mode: "strict",
  typeSymbol: "dsh-clinepass#AccountCommandResult",
  schema: { parse: parseResult },
  create: () => ({ parse: parseResult })
};
var accountsRemote = {
  package: "dsh-clinepass",
  descriptors: [{
    id: "dsh-clinepass#clinePassAccounts/execute",
    service: "clinePassAccounts",
    namespace: "clinePassAccounts",
    method: "execute",
    invocation: { kind: "direct" },
    parameters: [{ name: "command", wire: "command", source: "json", codec: commandCodec }],
    result: resultCodec
  }]
};

// src/remote-contract.ts
var clineRemote = {
  package: "dsh-clinepass",
  descriptors: [...usageRemote.descriptors, ...modelsRemote.descriptors, ...accountsRemote.descriptors, ...analyticsRemote.descriptors]
};

// src/remotes.ts
function registerClineRemotes(ctx) {
  ctx.inject(["typert"], (scope) => {
    scope.effect(() => scope.typert.register({
      package: clineRemote.package,
      face: "host",
      schemas: [],
      model: { services: [], events: [], objects: [] },
      invocations: clineRemote.descriptors
    }));
  });
}

// src/config-contract.ts
var SETTINGS_NAMESPACE = "llm-clinepass";
var PROFILE_ENTRY_ID = "clinepass";

// src/settings-bridge.ts
function accountSettingsRow(settings) {
  const rows = settings.describe();
  return rows.find((row) => row.ns === PROFILE_ENTRY_ID) ?? rows.find((row) => row.ns === SETTINGS_NAMESPACE);
}
function settingsWriteResult(verdict, committed, confirmation = "acknowledged") {
  if (verdict === true && confirmation === "acknowledged") return "applied";
  if (verdict === false) return "rejected";
  return committed() ? "applied" : "unknown";
}
function isSettingsConflict(error) {
  if (!error || typeof error !== "object") return false;
  const { name: name2, code, message } = error;
  return /conflict/i.test(`${String(name2 ?? "")} ${String(code ?? "")} ${String(message ?? "")}`);
}

// src/account-commit.ts
var ACCOUNT_COMMIT_ATTEMPTS = 3;
function accountSelectionPatch(accounts, ref) {
  return [
    { op: "set", path: ["accounts"], value: accounts },
    { op: "set", path: ["apiKeyEnv"], value: ref }
  ];
}
function commitAccountSettings(settings, target, ops) {
  return settings.mutate(target.ns, ops, target.revision);
}
function accountCommitMatches(target, committed) {
  return committed?.ns === target.ns && committed.revision === target.revision + 1;
}
function canRetryAccountCommit(error, attempt) {
  return attempt + 1 < ACCOUNT_COMMIT_ATTEMPTS && isSettingsConflict(error);
}

// src/account-selection.ts
function identity(config) {
  return JSON.stringify([config.enabled, accountRefOf(config), config.accounts, config.autoSwitch, config.baseURL, config.proxyURL]);
}
var ClineAccountSelection = class {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }
  settings;
  connection = 0;
  credentials = 0;
  version = 0;
  signature = "";
  latestSeq = -1;
  notice;
  connect(settings) {
    this.settings = settings;
    this.connection++;
    this.capture();
    return () => {
      if (this.settings !== settings) return;
      this.settings = void 0;
      this.connection++;
      this.capture();
    };
  }
  row() {
    try {
      return this.settings && accountSettingsRow(this.settings);
    } catch {
      return void 0;
    }
  }
  /** Reading the revision also catches A → C → A before async change watchers run. */
  capture() {
    const row = this.row();
    const signature = JSON.stringify([identity(this.config()), this.connection, this.credentials, row?.ns, row?.revision]);
    if (signature !== this.signature) {
      this.signature = signature;
      this.version++;
      this.notice = void 0;
    }
    return this.version;
  }
  credentialChanged() {
    this.credentials++;
    this.capture();
  }
  lastSwitch() {
    this.capture();
    return this.notice;
  }
  /** One freshness decision governs both side effects of a request's outcome. */
  settle(event) {
    if (event.generation !== this.capture() || event.seq < this.latestSeq) return;
    const config = this.config();
    if (identity(config) !== identity(event.config) || !accountsOf(config).some((account) => account.apiKeyEnv === event.ref)) return;
    this.latestSeq = event.seq;
    this.notice = event.notice;
    if (event.notice && config.enabled && config.autoSwitch) void this.adopt(event);
  }
  async adopt(event) {
    const settings = this.settings;
    if (!settings) return;
    const connection = this.connection;
    const credentials = this.credentials;
    try {
      const row = this.row();
      if (!row) {
        this.logger.debug("llm-clinepass: no editable account settings row; the fallback stays per request");
        return;
      }
      const selected = row.value?.apiKeyEnv;
      if (event.generation !== this.capture() || event.seq !== this.latestSeq || selected !== accountRefOf(event.config)) return;
      const accounts = [...moveAccountFirst(accountsOf(event.config), event.ref)];
      const expected = identity({ ...event.config, accounts, apiKeyEnv: event.ref });
      const result = await commitAccountSettings(settings, row, accountSelectionPatch(accounts, event.ref));
      this.capture();
      const committed = this.row();
      if (settingsWriteResult(result, () => this.connection === connection && this.credentials === credentials && event.seq === this.latestSeq && accountCommitMatches(row, committed) && identity(this.config()) === expected, "observed") === "applied") this.notice = event.notice;
    } catch (error) {
      this.logger.warn(`llm-clinepass: could not make "${event.ref}" the current account (${String(error)})`);
    }
  }
};

// src/account-manager.ts
import { credentialRef } from "@deepseek-ai/dsh-credentials";

// src/account-operations.ts
function ownsAccountCredential(account) {
  return /^[a-f0-9]{32}$/.test(account.id) && account.apiKeyEnv === ACCOUNT_REF_PREFIX + account.id.toUpperCase();
}
function assertAccountOperations(value) {
  if (value === void 0) return;
  if (!Array.isArray(value) || value.length > MAX_ACCOUNTS) throw new Error("Too many pending ClinePass account operations");
  const ids = /* @__PURE__ */ new Set(), refs = /* @__PURE__ */ new Set();
  for (const operation of value) {
    if (!operation || typeof operation.id !== "string" || !/^[a-f0-9]{32}$/.test(operation.id) || ids.has(operation.id) || !["add", "remove"].includes(operation.kind)) throw new Error("Invalid ClinePass account operation");
    const fields2 = operation.kind === "add" ? ["id", "kind", "account", "previousRef", "select"] : ["id", "kind", "account"];
    if (Object.keys(operation).some((key) => !fields2.includes(key)) || !operation.account || Object.keys(operation.account).some((key) => !["id", "name", "apiKeyEnv"].includes(key))) {
      throw new Error("Unexpected ClinePass account operation fields");
    }
    assertAccounts([operation.account]);
    if (refs.has(operation.account.apiKeyEnv)) throw new Error("Duplicate ClinePass account operation");
    if (operation.kind === "add" && (!ownsAccountCredential(operation.account) || typeof operation.select !== "boolean" || !ACCOUNT_REF_PATTERN.test(operation.previousRef))) {
      throw new Error("Invalid ClinePass account addition");
    }
    ids.add(operation.id);
    refs.add(operation.account.apiKeyEnv);
  }
}
function visibleAccountsOf(settings) {
  const entries = [...accountsOf(settings)];
  for (const operation of settings.accountOperations ?? []) {
    if (!entries.some((account) => account.apiKeyEnv === operation.account.apiKeyEnv)) entries.push(operation.account);
  }
  return entries;
}
function accountOperationPatch(settings, operation, dropLegacyRef) {
  let accounts = [...accountsOf(settings)];
  const ref = operation.account.apiKeyEnv;
  const occupied = accounts.find((account) => account.apiKeyEnv === ref || account.id === operation.account.id);
  if (occupied && (occupied.id !== operation.account.id || occupied.apiKeyEnv !== ref)) {
    throw new Error("Account identity changed while operation was pending");
  }
  let selected;
  if (operation.kind === "add") {
    if (!occupied) {
      if (settings.accounts == null && dropLegacyRef) accounts = accounts.filter((account) => account.apiKeyEnv !== dropLegacyRef);
      accounts.push(operation.account);
    }
    if (operation.select && accountRefOf(settings) === operation.previousRef) selected = ref;
  } else {
    accounts = accounts.filter((account) => account.apiKeyEnv !== ref);
    if (accountRefOf(settings) === ref && accounts.length) selected = accounts[0].apiKeyEnv;
  }
  accounts = [...moveAccountFirst(accounts, selected ?? accountRefOf(settings))];
  assertAccounts(accounts, selected ?? accountRefOf(settings));
  return [
    { op: "set", path: ["accounts"], value: accounts },
    ...selected ? [{ op: "set", path: ["apiKeyEnv"], value: selected }] : [],
    ...settings.accountOperations?.some((entry) => entry.id === operation.id) ? [{
      op: "set",
      path: ["accountOperations"],
      value: settings.accountOperations.filter((entry) => entry.id !== operation.id)
    }] : []
  ];
}

// src/account-manager.ts
import { randomUUID as randomUUID7 } from "node:crypto";
import { deadline as deadline3 } from "@deepseek-ai/dsh-timeout";
var ACCOUNT_RECOVERY_TIMEOUT_MS = 3e4;
var credentialWrites = /* @__PURE__ */ new Map();
function serializeCredentialWrite(ref, write) {
  const pending = (credentialWrites.get(ref) ?? Promise.resolve()).then(write);
  const settled2 = pending.then(() => {
  }, () => {
  });
  credentialWrites.set(ref, settled2);
  void settled2.then(() => {
    if (credentialWrites.get(ref) === settled2) credentialWrites.delete(ref);
  });
  return pending;
}
var ClineAccountManager = class {
  constructor(logger) {
    this.logger = logger;
  }
  connection;
  pending;
  again = false;
  queue = Promise.resolve();
  connect(settings, credentials) {
    this.connection?.cancel.abort("Account recovery connection replaced");
    const connection = this.connection = { settings, credentials, cancel: new AbortController() };
    this.trigger();
    return () => {
      if (this.connection !== connection) return;
      this.connection = void 0;
      connection.cancel.abort("Account recovery connection closed");
    };
  }
  trigger() {
    void this.recover().catch(() => {
      this.logger.warn("llm-clinepass: account recovery is waiting for writable settings and credentials");
    });
  }
  recover() {
    this.again = true;
    if (this.pending) return this.pending;
    this.pending = this.enqueue(() => this.run()).finally(() => {
      this.pending = void 0;
      if (this.again) this.trigger();
    });
    return this.pending;
  }
  row(connection) {
    return accountSettingsRow(connection.settings);
  }
  async run() {
    for (let pass = 0; this.again && pass < 4; pass++) {
      this.again = false;
      const connection = this.connection;
      if (!connection) return;
      await this.normalizeOrder(connection);
      if (this.connection !== connection) return;
      const row = this.row(connection);
      const value = row?.value;
      assertAccountOperations(value?.accountOperations);
      for (const operation of value?.accountOperations ?? []) {
        if (this.connection !== connection) return;
        try {
          await this.complete(connection, operation);
        } catch {
          this.logger.warn(`llm-clinepass: account operation ${operation.id} remains pending; it will retry on settings/credential reconnect or update`);
        }
      }
    }
    this.again = false;
  }
  /** Preserve an old selection by moving it first in the same revision-guarded write. */
  async normalizeOrder(connection) {
    var _stack = [];
    try {
      const row = this.row(connection);
      const value = row?.value;
      assertAccountOperations(value?.accountOperations);
      if (!row || !value?.accounts?.length) return;
      const accounts = accountsOf(value);
      if (accounts.length === value.accounts.length && accounts.every((account, index) => account.apiKeyEnv === value.accounts[index].apiKeyEnv)) return;
      const timeout = __using(_stack, deadline3(connection.cancel.signal, ACCOUNT_RECOVERY_TIMEOUT_MS, "CLINE_ACCOUNT_RECOVERY_TIMEOUT"));
      await waitWithSignal(() => commitAccountSettings(
        connection.settings,
        row,
        accountSelectionPatch(accounts, accountRefOf(value))
      ), timeout.signal);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  async complete(connection, operation, keyConfirmed = false, signal) {
    var _stack = [];
    try {
      const timeout = __using(_stack, deadline3(signal ? AbortSignal.any([connection.cancel.signal, signal]) : connection.cancel.signal, ACCOUNT_RECOVERY_TIMEOUT_MS, "CLINE_ACCOUNT_RECOVERY_TIMEOUT"));
      const wait = (work) => waitWithSignal(work, timeout.signal);
      const get = () => {
        if (this.connection !== connection) return void 0;
        const row = this.row(connection);
        if (!row) return void 0;
        const value = row.value;
        assertAccountOperations(value.accountOperations);
        const current = value.accountOperations?.find((entry) => entry.id === operation.id);
        if (JSON.stringify(current) !== JSON.stringify(operation)) return void 0;
        return { row, value };
      };
      let state = get();
      if (!state) return "unknown";
      const ref = operation.account.apiKeyEnv;
      const info = keyConfirmed ? { configured: true, writable: true } : await wait(() => connection.credentials.describe(credentialRef(ref)));
      state = get();
      if (!state) return "unknown";
      const occupied = accountsOf(state.value).find((account) => account.apiKeyEnv === ref || account.id === operation.account.id);
      if (occupied && (occupied.id !== operation.account.id || occupied.apiKeyEnv !== ref)) {
        throw new Error("Account identity changed while recovery was pending");
      }
      if (operation.kind === "add" && !info.configured) return "unknown";
      if (operation.kind === "remove" && ownsAccountCredential(operation.account)) {
        await wait(() => serializeCredentialWrite(ref, async () => {
          timeout.signal.throwIfAborted();
          if (!get()) throw new Error("Account removal changed while waiting for credentials");
          const latest = await wait(() => connection.credentials.describe(credentialRef(ref)));
          timeout.signal.throwIfAborted();
          if (!get()) throw new Error("Account removal changed while describing credentials");
          if (latest.configured) {
            if (!latest.writable) throw new Error("Credential is read-only");
            await connection.credentials.unset(credentialRef(ref));
          }
        }));
      }
      let dropLegacyRef;
      if (operation.kind === "add" && state.value.accounts == null) {
        const legacyRef = accountRefOf(state.value);
        try {
          if (!(await wait(() => connection.credentials.describe(credentialRef(legacyRef)))).configured) dropLegacyRef = legacyRef;
        } catch {
        }
      }
      state = get();
      if (!state) return "unknown";
      timeout.signal.throwIfAborted();
      const target = state;
      const result = await wait(() => commitAccountSettings(
        connection.settings,
        target.row,
        accountOperationPatch(target.value, operation, dropLegacyRef)
      ));
      timeout.signal.throwIfAborted();
      if (this.connection !== connection) throw new Error("Account connection changed");
      const status = settingsWriteResult(result, () => !get());
      if (status !== "applied") {
        this.again = true;
        throw new Error("Account settings have not committed");
      }
      return status;
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  enqueue(work) {
    const pending = this.queue.then(work);
    this.queue = pending.catch(() => {
    });
    return pending;
  }
  execute(raw) {
    const command = parseAccountCommand(raw);
    const connection = this.connection;
    return this.enqueue(async () => {
      var _stack = [];
      try {
        if (!connection || this.connection !== connection) return "rejected";
        const timeout = __using(_stack, deadline3(connection.cancel.signal, ACCOUNT_RECOVERY_TIMEOUT_MS, "CLINE_ACCOUNT_COMMAND_TIMEOUT"));
        const wait = (work) => waitWithSignal(work, timeout.signal);
        const read = () => {
          timeout.signal.throwIfAborted();
          if (this.connection !== connection) throw new Error("Account connection changed");
          const row = this.row(connection);
          if (!row) throw new Error("Account settings are unavailable");
          const value = row.value;
          assertAccountOperations(value.accountOperations);
          return { row, value };
        };
        const write = async (ops, committed, target = read()) => {
          const { row } = target;
          read();
          const verdict = await wait(() => commitAccountSettings(connection.settings, row, ops));
          read();
          return settingsWriteResult(verdict, () => committed(read().value));
        };
        const describe = async (ref) => {
          try {
            return await wait(() => connection.credentials.describe(credentialRef(ref)));
          } catch {
            read();
            return void 0;
          }
        };
        const begin = async (operation) => {
          for (let attempt = 0; attempt < ACCOUNT_COMMIT_ATTEMPTS; attempt++) {
            const target = read();
            const { value } = target;
            const operations = value.accountOperations ?? [];
            if (operations.some((entry) => JSON.stringify(entry) === JSON.stringify(operation))) return "applied";
            if (operation.kind === "add" && operations.some((entry) => entry.kind === "remove" && entry.account.apiKeyEnv === operation.account.apiKeyEnv)) return "rejected";
            const next = [...operations.filter((entry) => entry.account.apiKeyEnv !== operation.account.apiKeyEnv), operation];
            assertAccountOperations(next);
            try {
              const status = await write(
                [{ op: "set", path: ["accountOperations"], value: next }],
                (value2) => value2.accountOperations?.some((entry) => entry.id === operation.id) === true,
                target
              );
              return status;
            } catch (error) {
              if (!canRetryAccountCommit(error, attempt)) throw error;
            }
          }
          return "unknown";
        };
        try {
          let target = read();
          let { value } = target;
          if (command.kind === "add") {
            const id = command.id;
            const ref = ACCOUNT_REF_PREFIX + id.toUpperCase();
            const resumed = value.accountOperations?.find((entry) => entry.id === id || entry.account.apiKeyEnv === ref);
            if (resumed && (resumed.kind !== "add" || resumed.id !== id || resumed.account.id !== id)) return "rejected";
            if (value.accounts?.some((account2) => account2.id === id) && !value.accountOperations?.some((entry) => entry.id === id)) return "applied";
            const visible = visibleAccountsOf(value).filter((account2) => account2.apiKeyEnv !== ref);
            const infos = await Promise.all(visible.map(async (account2) => [account2.apiKeyEnv, await describe(account2.apiKeyEnv)]));
            read();
            const configured = new Map(infos);
            const retained = visible.filter((account2) => !(value.accounts == null && !account2.name && configured.get(account2.apiKeyEnv)?.configured === false));
            if (retained.length >= MAX_ACCOUNTS) return "rejected";
            const operation = resumed ?? {
              id,
              kind: "add",
              account: { id, apiKeyEnv: ref, name: command.name.trim() },
              previousRef: accountRefOf(value),
              select: visible.every((account2) => configured.get(account2.apiKeyEnv)?.configured === false)
            };
            const started = await begin(operation);
            if (started !== "applied") return started;
            if (!connection.credentials.set) return "rejected";
            const stored = await wait(() => serializeCredentialWrite(ref, async () => {
              const value2 = read().value;
              if (!value2.accountOperations?.some((entry) => JSON.stringify(entry) === JSON.stringify(operation))) return false;
              const occupied = accountsOf(value2).find((account2) => account2.id === id || account2.apiKeyEnv === ref);
              if (occupied && (occupied.id !== id || occupied.apiKeyEnv !== ref)) return false;
              await connection.credentials.set(credentialRef(ref), command.key.trim());
              return true;
            }));
            if (!stored) return "rejected";
            read();
            for (let attempt = 0; attempt < ACCOUNT_COMMIT_ATTEMPTS; attempt++) {
              try {
                return await this.complete(connection, operation, true, timeout.signal);
              } catch (error) {
                if (!canRetryAccountCommit(error, attempt)) throw error;
              }
            }
            return "unknown";
          }
          if (command.kind === "auto-switch") {
            return await write([{ op: "set", path: ["autoSwitch"], value: command.value }], (value2) => value2.autoSwitch === command.value, read());
          }
          const account = visibleAccountsOf(value).find((account2) => account2.apiKeyEnv === command.ref);
          if (!account) return "rejected";
          if (command.kind === "replace-key") {
            if (!connection.credentials.set || value.accountOperations?.some((entry) => entry.kind === "remove" && entry.account.apiKeyEnv === command.ref)) return "rejected";
            const info = await describe(command.ref);
            if (info?.writable === false) return "rejected";
            const canReplace = () => {
              const value2 = read().value;
              return visibleAccountsOf(value2).some((entry) => entry.id === account.id && entry.apiKeyEnv === command.ref) && !value2.accountOperations?.some((entry) => entry.kind === "remove" && entry.account.apiKeyEnv === command.ref);
            };
            const stored = await wait(() => serializeCredentialWrite(command.ref, async () => {
              if (!canReplace()) return false;
              await connection.credentials.set(credentialRef(command.ref), command.key.trim());
              return true;
            }));
            if (!stored || !canReplace()) return "rejected";
            this.trigger();
            return "applied";
          }
          if (command.kind === "remove") {
            if (ownsAccountCredential(account)) {
              const info = await describe(command.ref);
              if (!info || info.configured && !info.writable) return "rejected";
              const operation2 = value.accountOperations?.find((entry) => entry.kind === "remove" && entry.account.apiKeyEnv === command.ref) ?? { id: randomUUID7().replaceAll("-", ""), kind: "remove", account: { ...account } };
              const started = await begin(operation2);
              if (started !== "applied") return started;
              return await this.complete(connection, operation2, false, timeout.signal);
            }
            target = read();
            value = target.value;
            const operation = { id: randomUUID7().replaceAll("-", ""), kind: "remove", account };
            return await write(accountOperationPatch(value, operation), (value2) => !visibleAccountsOf(value2).some((entry) => entry.apiKeyEnv === command.ref), target);
          }
          target = read();
          value = target.value;
          const accounts = [...accountsOf(value)];
          if (command.kind === "select") {
            if (!accounts.some((account2) => account2.apiKeyEnv === command.ref)) return "rejected";
            return await write(
              accountSelectionPatch(moveAccountFirst(accounts, command.ref), command.ref),
              (value2) => value2.accounts?.[0]?.apiKeyEnv === command.ref && accountRefOf(value2) === command.ref,
              target
            );
          }
          if (command.kind === "rename") {
            if (!accounts.some((account2) => account2.apiKeyEnv === command.ref)) return "rejected";
            const next = accounts.map((account2) => account2.apiKeyEnv === command.ref ? { ...account2, name: command.name.trim() } : account2);
            return await write([{ op: "set", path: ["accounts"], value: next }], (value2) => value2.accounts?.some((account2) => account2.apiKeyEnv === command.ref && account2.name === command.name.trim()) === true, target);
          }
          const from = accounts.findIndex((account2) => account2.apiKeyEnv === command.ref);
          if (from < 0 || command.toIndex >= accounts.length || from === command.toIndex) return "rejected";
          const [moved] = accounts.splice(from, 1);
          accounts.splice(command.toIndex, 0, moved);
          return await write(
            accountSelectionPatch(accounts, accounts[0].apiKeyEnv),
            (value2) => value2.accounts?.[command.toIndex]?.apiKeyEnv === command.ref && accountRefOf(value2) === accounts[0].apiKeyEnv,
            target
          );
        } catch {
          return "unknown";
        }
      } catch (_) {
        var _error = _, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    });
  }
};

// src/account-service.ts
import { TypertRemoteService as TypertRemoteService4 } from "@deepseek-ai/dsh-typert-protocol";
var ClineAccountsService = class extends TypertRemoteService4 {
  constructor(ctx, options) {
    super(ctx, "clinePassAccounts");
    this.options = options;
  }
  execute(command) {
    return this.options.manager.execute(command);
  }
};

// src/host-settings.ts
function validateClinePassConfig(value) {
  assertBaseURL(value.baseURL);
  assertProxyURL(value.proxyURL);
  assertApiKeyEnv(value.apiKeyEnv);
  assertAccounts(value.accounts, value.apiKeyEnv);
  assertAccountOperations(value.accountOperations);
}
function installHostSettings(ctx, entry, options) {
  ctx.inject(["settings"], (settingsCtx) => {
    settingsCtx.effect(() => options.connect(settingsCtx.settings));
    const modern = "configure" in settingsCtx.settings;
    const namespace = modern ? PROFILE_ENTRY_ID : SETTINGS_NAMESPACE;
    let migrating = false;
    const migrateSavedGateway = () => {
      if (migrating || !settingsCtx.settings.writable) return;
      migrating = true;
      void (async () => {
        for (let attempt = 0; attempt < 3; attempt++) {
          const row = settingsCtx.settings.describe().find((row2) => row2.ns === namespace);
          const raw = row?.user?.baseURL;
          if (typeof raw !== "string" || migrateGatewayBaseURL(raw) === raw) return;
          try {
            await settingsCtx.settings.mutate(
              namespace,
              [{ op: "set", path: ["baseURL"], value: migrateGatewayBaseURL(raw) }],
              row.revision
            );
            return;
          } catch (error) {
            if (!isSettingsConflict(error) || attempt === 2) throw error;
          }
        }
      })().catch((error) => {
        ctx.logger.warn(`llm-clinepass: could not save the migrated gateway address (${String(error)})`);
      }).finally(() => {
        migrating = false;
      });
    };
    settingsCtx.on("settings/document-updated", (ns) => {
      if (ns === namespace) migrateSavedGateway();
    });
    if (modern) {
      const settings = settingsCtx.settings;
      settingsCtx.effect(() => {
        const dispose = settings.configure({ auto: false }, ctx.fiber);
        options.recover();
        migrateSavedGateway();
        return dispose;
      });
      return;
    }
    settingsCtx.settings.installSection(ctx, SETTINGS_NAMESPACE, PlainConfig, entry, {
      validate: validateClinePassConfig,
      setSource: (source) => options.setSource(() => {
        const value = source();
        return { ...value, baseURL: migrateGatewayBaseURL(value.baseURL) };
      }),
      onChange: () => {
        options.onChange();
        migrateSavedGateway();
      }
    });
    options.recover();
  });
  ctx.on("internal/config", function(_raw, next) {
    const value = next();
    if (this === ctx.fiber) {
      const raw = value;
      if (typeof raw.apiKeyEnv === "string") assertApiKeyEnv(raw.apiKeyEnv);
      validateClinePassConfig(PlainConfig(value));
      if (typeof raw.baseURL === "string") return { ...value, baseURL: migrateGatewayBaseURL(raw.baseURL) };
    }
    return value;
  });
}

// src/index.ts
var name = "llm-clinepass";
var inject = ["llm"];
var NS = SETTINGS_NAMESPACE;
function apply(ctx, raw) {
  const config = raw && typeof raw.enabled === "object" ? raw : Config(raw);
  const entry = readConfig(config);
  validateClinePassConfig(entry);
  let current = () => readConfig(config);
  const resolveApiKey = async (config2 = current()) => {
    const ref = accountRefOf(config2);
    if (!accountsOf(config2).some((account) => account.apiKeyEnv === ref)) {
      throw new LlmError10("ClinePass has no selected account", "MISSING_CREDENTIAL");
    }
    const credentials = ctx.get("credentials");
    const hit = credentials !== void 0 ? (await credentials.resolve(credentialRef2(ref)))?.value : launchEnvironmentOf(ctx).get(ref)?.value;
    if (hit !== void 0 && hit.length > 0) return assertUsableApiKey(hit, name, ref);
    throw new LlmError10(
      `llm-clinepass: no credential; the profile resolves ${ref}, which is not set \u2014 store ${ref} through the credentials service or export it`,
      "MISSING_CREDENTIAL"
    );
  };
  registerClineRemotes(ctx);
  const selection = new ClineAccountSelection(() => current(), ctx.logger);
  const accountManager = new ClineAccountManager(ctx.logger);
  ctx.plugin(ClineAccountsService, { manager: accountManager });
  ctx.inject(["settings", "credentials"], (ready) => {
    ready.effect(() => accountManager.connect(ready.settings, ready.credentials));
  });
  const transport = new ProxyTransport();
  ctx.effect(() => () => transport.dispose());
  ctx.plugin(ClineUsageService, {
    baseURL: () => current().baseURL,
    proxyURL: () => current().proxyURL,
    transport,
    resolveApiKey: (ref) => resolveApiKey({ ...current(), apiKeyEnv: ref ?? current().apiKeyEnv }),
    activeRef: () => accountRefOf(current()),
    accountRefs: () => accountsOf(current()).map((account) => account.apiKeyEnv),
    lastSwitch: () => selection.lastSwitch()
  });
  const logger = {
    fallback: ({ url, error }) => {
      ctx.logger.warn(`llm-clinepass: could not refresh ${url}; using last-known model data (${String(error)})`);
    },
    omitted: (ids) => {
      ctx.logger.warn(`llm-clinepass: gateway models this build cannot configure: ${ids.join(", ")}`);
    }
  };
  let registration;
  const catalogs = new ClineCatalogManager({
    transport,
    onFallback: logger.fallback,
    onOmitted: logger.omitted,
    onWarning: (warning) => {
      ctx.logger.warn(`llm-clinepass: ${warning}`);
    },
    onDiagnostic: (event) => {
      ctx.logger.info(`llm-clinepass: catalog ${JSON.stringify(event)}`);
    },
    onRefresh: () => {
      registration?.replace([PROVIDER_ID]);
    }
  });
  const adapter = new ClinePassAdapter({
    transport,
    catalog: (config2) => catalogs.forConfig(config2),
    debugDirectory: () => launchEnvironmentOf(ctx).get("DSH_CLINEPASS_DEBUG_DIR")?.value,
    config: () => current(),
    resolveApiKey,
    onCallTrace: (trace) => {
      ctx.logger.debug(`llm-clinepass call: ${JSON.stringify(trace)}`);
    },
    accountGeneration: () => selection.capture(),
    onAccountSettled: (event) => {
      selection.settle(event);
    },
    imageAccess: {
      resolveAttachments: () => ctx.get("attachments"),
      resolveImageAccess: (attachments, ref) => resolveImageAttachmentAccess(
        attachments,
        (hostPath) => ctx.get("fs")?.processPathFromHostPath(hostPath),
        ref
      )
    },
    onReplayDegrade: (reason) => {
      ctx.logger.warn(`llm-clinepass: unusable replay state on assistant history; sending provider-neutral content (${reason})`);
    }
  });
  ctx.plugin(ClineModelsService, {
    catalog: () => catalogs.forConfig(current()),
    onRefresh: () => {
      registration?.replace([PROVIDER_ID]);
    }
  });
  const sessionQueryOf = () => ctx.get("sessionQuery");
  const sessionPersistenceOf = () => ctx.get("sessionPersistence");
  ctx.plugin(ClineAnalyticsService, {
    query: sessionQueryOf,
    persistence: sessionPersistenceOf,
    // Review P14 (core half): the price book omits cost for models whose
    // upstream cost block is missing or malformed (ModelDetails.costKnown ===
    // false), so their requests are reported unpriced instead of silently
    // priced at 0; a published block with legal components stays priced even
    // when all of its rates are zero.
    pricing: async () => analyticsPriceBook(await catalogs.forConfig(current()).snapshot())
  });
  const pickerVisibilityOf = () => JSON.stringify(current().modelVisibility ?? {});
  let pickerVisibility = pickerVisibilityOf();
  const applyRoute = (configured) => {
    if (configured && current().enabled && registration === void 0) {
      try {
        registration = ctx.llm.registerAdapter([PROVIDER_ID], adapter);
        ctx.logger.info(`llm-clinepass: route "${PROVIDER_ID}" registered as ${DISPLAY_NAME}`);
      } catch (error) {
        ctx.logger.error(`llm-clinepass: not registering the "${PROVIDER_ID}" route (${String(error)})`);
      }
    } else if ((!configured || !current().enabled) && registration !== void 0) {
      registration();
      registration = void 0;
      if (!current().enabled) {
        ctx.logger.info("llm-clinepass: disabled by configuration; the route and its models are withdrawn");
      }
    }
  };
  let routeCheck = 0;
  let selectedRef = accountRefOf(current());
  const syncRoute = () => {
    accountManager.trigger();
    const check = ++routeCheck;
    const config2 = current();
    selection.capture();
    const visibility = pickerVisibilityOf();
    if (pickerVisibility !== visibility) {
      pickerVisibility = visibility;
      registration?.replace([PROVIDER_ID]);
    }
    const credentials = ctx.get("credentials");
    const selected = accountRefOf(config2);
    if (selected !== selectedRef) {
      selectedRef = selected;
      adapter.forgetRejectedKey(selected);
    }
    const refs = accountsOf(config2).filter((account) => config2.autoSwitch || account.apiKeyEnv === selected).map((account) => account.apiKeyEnv);
    if (credentials === void 0) {
      applyRoute(refs.some((ref) => Boolean(launchEnvironmentOf(ctx).get(ref)?.value)));
      return;
    }
    void Promise.all(refs.map((ref) => credentials.describe(credentialRef2(ref)))).then((infos) => {
      if (check === routeCheck) applyRoute(infos.some((info) => info.configured));
    }).catch((error) => {
      ctx.logger.error(`llm-clinepass: credential describe failed; keeping the previous route state (${String(error)})`);
    });
  };
  syncRoute();
  let undiscover = () => {
  };
  try {
    undiscover = ctx.llm.registerModelDiscovery(name, async (request) => {
      if (request.provider !== PROVIDER_ID && !(request.baseURL ?? "").includes("api.cline.bot")) {
        throw new LlmError10(
          "llm-clinepass discovers only Cline zen/go endpoints; enter this provider's models by hand",
          "DISCOVERY_UNSUPPORTED"
        );
      }
      return discoverCatalogModels(catalogs.forConfig(current()));
    });
  } catch (error) {
    ctx.logger.error(`llm-clinepass: not registering model discovery for "${name}" (${String(error)})`);
  }
  ctx.effect(() => () => {
    registration?.();
    registration = void 0;
    undiscover();
  });
  installHostSettings(ctx, entry, {
    connect: (settings) => selection.connect(settings),
    setSource: (source) => {
      current = source;
    },
    onChange: syncRoute,
    recover: () => accountManager.trigger()
  });
  ctx.on("loader/volatile-update", syncRoute);
  ctx.inject(["credentials"], (credentialsCtx) => {
    credentialsCtx.on("credentials/reference-updated", (ref) => {
      accountManager.trigger();
      adapter.forgetRejectedKey(ref);
      if (accountsOf(current()).some((account) => account.apiKeyEnv === ref)) {
        selection.credentialChanged();
        syncRoute();
      }
    });
    syncRoute();
  });
}
export {
  ClinePassAdapter,
  ClinePassCatalog,
  Config,
  DEFAULT_BASE_URL,
  DISPLAY_NAME,
  NS,
  PROVIDER_ID,
  PlainConfig,
  apply,
  assertBaseURL,
  assertProxyURL,
  discoverCatalogModels,
  inject,
  name,
  readLiveModelIds
};
