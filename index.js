var term = require('terminal-kit').terminal;
var moment = require('moment');
var stringz = require('stringz'); // for emoji support ❤️

// keep the native pipe to stdout & stderr
module.exports.nativeLog = global.console.log;
module.exports.nativeError = global.console.error;

// enables or disables certain types of logging
var loggerTypes = {}
module.exports.enable = type => {
  module.exports.options.styles[type] = module.exports.options.styles[type] || [term, module.exports.nativeLog];
  loggerTypes[type] = true;
};
module.exports.disable = type => loggerTypes[type] = false;
module.exports.isEnabled = type => loggerTypes[type];

module.exports.options = {
  typePadding: '         ',       // dictates the width of the type prefix
  styles: {                       // contains term styles for the various prefixes
    error: [term.error.bgRed.white, module.exports.nativeError],
    warn: [term.error.bgYellow.white, module.exports.nativeError],
    info: [term, module.exports.nativeLog],
    debug: [term, module.exports.nativeLog],
    success: [term.bgGreen.white, module.exports.nativeLog]
  },
  // a function that takes a date and returns a string
  // used to print the date in the prefix
  dateFormatter: date => moment(date).format("D/M/YY HH:mm:ss.SSS")
}

var getLogTypePrefix = type => ` [${type}] ${module.exports.options.typePadding.substring(stringz.length(type) + 4)}`;
var getPrefix = type => getLogTypePrefix(type) + module.exports.options.dateFormatter(new Date()) + " ";
module.exports.printPrefix = (type, t = term) => {t(getPrefix(type));t.styleReset("| ")};

module.exports.makeSimpleLogger = type => {
  module.exports.enable(type);
  var TYPE = type == "success" ? "OK" : type.toUpperCase();
  global.console[type] = function() {
    if (loggerTypes[type]) {
      module.exports.printPrefix(TYPE, module.exports.options.styles[type][0]);
      module.exports.options.styles[type][1].apply(this, arguments);
    }
  }
}

module.exports.makeCustomLogger = (type, myfunction) => {
  module.exports.enable(type);
  global.console[type] = function() {
    if (loggerTypes[type]) {
      myfunction.apply(this, arguments);
    }
  };
}

module.exports.makeSimpleLogger("debug");
module.exports.makeSimpleLogger("info");
global.console.log = global.console.info;
module.exports.makeSimpleLogger("warn");
module.exports.makeSimpleLogger("success");

module.exports.makeCustomLogger("error", function() {
  var isTrace = typeof arguments[0] == "string" && arguments[0].substring(0, 5) == "Trace";
  var type = isTrace ? "TRACE" : "ERROR";
  module.exports.printPrefix(type, module.exports.options.styles.error[0]);
  if (isTrace) {
    arguments[0] = arguments[0].substring(7);
  }
  module.exports.options.styles.error[1].apply(this, arguments);
})
