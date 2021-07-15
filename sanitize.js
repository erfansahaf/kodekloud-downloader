"use strict";
// based on https://github.com/parshap/node-sanitize-filename

function truncate(chars, n) {
  //https://stackoverflow.com/a/1516420
  const toBytesUTF8 = (chars) => unescape(encodeURIComponent(chars));
  const fromBytesUTF8 = (bytes) => decodeURIComponent(escape(bytes));

  let bytes = toBytesUTF8(chars).substring(0, n);
  while (true) {
    try {
      return fromBytesUTF8(bytes);
    } catch (e) {}
    bytes = bytes.substring(0, bytes.length - 1);
  }
}

const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;
const blanksRe = /\s+/g;

function sanitize(input, replacement) {
  if (typeof input !== "string") {
    throw new Error("Input must be string");
  }
  const sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement)
    .replace(blanksRe, "");
  return truncate(sanitized, 255);
}
