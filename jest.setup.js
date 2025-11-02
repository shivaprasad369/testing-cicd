import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill fetch and Response for MSW
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.fetch = require("node-fetch");
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.Response = require("node-fetch").Response;
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.Request = require("node-fetch").Request;

// Polyfill BroadcastChannel for MSW
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name;
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};
