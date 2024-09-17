// Polyfill for `global`
if (typeof global === 'undefined') {
  window.global = window;
}

// Polyfill for `Buffer`
import { Buffer } from "buffer";
window.Buffer = Buffer;