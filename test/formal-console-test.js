#!/usr/bin/env node
var consoleConfig = require('../index.js');
var oldFormatter = consoleConfig.options.dateFormatter;
var fixedDate = new Date(1995, 11, 17, 3, 24, 4);
consoleConfig.options.dateFormatter = date => oldFormatter(fixedDate);

console.log("Hello, World!");
console.log("test with object", {test: "test"}, "a string");
console.log("%s: %s", "test with substitution", "ok?");

console.info("info message, log = info");

console.warn("something is fishy");

console.error("something went wrong");

console.debug("a debugging message");
consoleConfig.disable("debug");
console.debug("this should not show up");
consoleConfig.enable("debug");
console.debug("second debug message");

console.success("we did it! (so far)");

console.dir({
  test: "test",
  arr: [
    "one",
    "two"
  ],
  obj: {
    test: "test",
    arr: [
      {
        test: "test"
      }
    ]
  }
});
// timers fluctuate with each run, cannot be used for tests ☹️
// console.time("test");
// console.timeEnd("test");
console.trace("we detected some serious error and would like a stack trace");

consoleConfig.makeSimpleLogger("fancy");
console.fancy("fancy message");

var term = require('terminal-kit').terminal;
consoleConfig.makeSimpleLogger("❤️ ");
// The first style object is for the prefix, and is a terminal-kit object
// Optional: the second style object is for the message, and is
// consoleConfig.nativeLog or consoleConfig.nativeError
consoleConfig.options.styles.fancy[0] = term.bgMagenta.underline.yellow;
console["❤️ "]("even more fancy message");

consoleConfig.makeCustomLogger("fatal", function() {
  consoleConfig.printPrefix("FATAL", term.error.bgRed.underline.white);
  consoleConfig.nativeError.apply(this, arguments);
});
console.fatal("we went too fancy ☹️");
