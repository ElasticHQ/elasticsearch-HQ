var logger = function () {
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger = function enableLogger() {
        if (oldConsoleLog == null) {
            return;
        }

        window['console']['log'] = oldConsoleLog;
    };

    pub.disableLogger = function disableLogger() {
        oldConsoleLog = console.log;
        window['console']['log'] = function () {
        };
    };

    return pub;
}();


var activateLogging = function () {
    var debugMode = settingsModel.get('settings').debugMode;
    if (debugMode == 1) {
        logger.enableLogger();
    }
    else {
        logger.disableLogger();
    }
}
