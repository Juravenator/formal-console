# formal-console

Extends console object to present a more useful log output by adding the log type, timestamp, and fancy colors.

Since this extends the console object, you only need to import & configure it once (probably in your main script) and you're good to go for the whole project.

## Usage

```js
var consoleConfig = require('formal-console');

console.log("test", {test: "test"}, new Date());
console.log("test");
console.error("some error");
console.warn("some warning");
console.info("some info");
console.debug("some debug");
console.success("success");

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
console.time("test");
console.timeEnd("test");
console.trace("some error");
```

## Custom output types

```js
var consoleConfig = require('formal-console');

// simple
consoleConfig.makeSimpleLogger("fancy");
console.fancy("fancy message");

// custom styling
var term = require('terminal-kit').terminal;
consoleConfig.makeSimpleLogger("fancy");
// The first style object is for the prefix, and is a terminal-kit object
// Optional: the second style object is for the message, and is
// consoleConfig.nativeLog or consoleConfig.nativeError
consoleConfig.options.styles.fancy[0] = term.bgMagenta.underline.yellow;
console.fancy("even more fancy message");

// completely custom logic
consoleConfig.makeCustomLogger("fatal", function() {
  // reuse the standard prefix
  consoleConfig.printPrefix("fatal", term.error.bgRed.underline.white);
  // log normally
  consoleConfig.nativeError.apply(this, arguments);
  // custom logic: trigger a crash
  process.abort();
});
console.fatal("test");
```
