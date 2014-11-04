var logger = function () {
    var oldConsole = window.console;
    var emptyLogger = {
            log : function(){},
        };
    if (oldConsole == null) {
        // no console to start with; always replace with an empty log function
        window['console'] = emptyLogger;
    }

    var pub = {};
    
    pub.enableLogger = function enableLogger() {
        if (oldConsole != null) {
            window['console'] = oldConsole;
        }
    };

    pub.disableLogger = function disableLogger() {
        if (oldConsole != null) {
            window['console']['log'] = emptyLogger.log;
        }
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
