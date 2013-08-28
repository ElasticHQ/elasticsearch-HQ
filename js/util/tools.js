var ajaxloading = {
    show:function (id) {
        if (id) {
            $(id).fadeIn({duration:1000});
        } else {
            $('#ajaxindicator').fadeIn({duration:1000});
        }
    },
    hide:function (id) {
        if (id) {
            $(id).fadeOut({duration:1000});
        } else {
            $('#ajaxindicator').fadeOut({duration:1000});
        }
    }
};

var scrollToTop = {
    activate:function () {
        // scroll-to-top button show and hide
        jQuery(document).ready(function () {
            jQuery(window).scroll(function () {
                if (jQuery(this).scrollTop() > 100) {
                    jQuery('.scrollup').fadeIn();
                    jQuery('.scrollupLeft').fadeIn();
                } else {
                    jQuery('.scrollup').fadeOut();
                    jQuery('.scrollupLeft').fadeOut();
                }
            });
            // scroll-to-top animate
            jQuery('.scrollup').click(function () {
                jQuery("html, body").animate({ scrollTop:0 }, 600);
                return false;
            });
            // scroll-to-top animate
            jQuery('.scrollupLeft').click(function () {
                jQuery("html, body").animate({ scrollTop:0 }, 600);
                return false;
            });
        });
    }
};

var timeUtil = {
    lastUpdated:function () {
        var dt = new Date();
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var seconds = dt.getSeconds();
        if (hours < 10)
            hours = '0' + hours;

        if (minutes < 10)
            minutes = '0' + minutes;

        if (seconds < 10)
            seconds = '0' + seconds;
        return hours + ":" + minutes + ":" + seconds;
    }
};

/**
 * Notification system. https://github.com/sciactive/pnotify
 * @type {Object}
 */
$.pnotify.defaults.history = false;
var stack_bottomright = {"dir1":"up", "dir2":"left", "firstpos1":25, "firstpos2":25};
function show_stack_bottomright(args) {
    var opts = {
        title:args.title,
        text:args.text,
        addclass:"stack-bottomright",
        stack:stack_bottomright,
        styling:"bootstrap",
        history:false,
        icon:true,
        hide:(args.hide == undefined) ? true : args.hide,
        closer_hover:(args.closer_hover == undefined) ? true : args.closer_hover,
        delay:5000
    };
    switch (args.type) {
        case 'error':
            opts.type = "error";
            break;
        case 'info':
            opts.type = "info";
            break;
        case 'success':
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};

/**
 * Convert number of bytes into human readable format
 *
 * @param integer bytes     Number of bytes to convert
 * @param integer precision Number of digits after the decimal separator
 * @return string
 */
var convert = {
    bytesToSize:function (bytes, precision) {
        var kilobyte = 1024;
        var megabyte = kilobyte * 1024;
        var gigabyte = megabyte * 1024;
        var terabyte = gigabyte * 1024;

        if ((bytes >= 0) && (bytes < kilobyte)) {
            return bytes + ' B';

        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
            return (bytes / kilobyte).toFixed(precision) + ' KB';

        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
            return (bytes / megabyte).toFixed(precision) + ' MB';

        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            return (bytes / gigabyte).toFixed(precision) + ' GB';

        } else if (bytes >= terabyte) {
            return (bytes / terabyte).toFixed(precision) + ' TB';

        } else {
            return bytes + ' B';
        }
    }
};

function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

/**
 * Returns value inside an object.
 * @param obj
 * @param string
 * @return {*}
 */
function lookupValue(obj, string) {
    var returnString = obj[string];
    if (obj[string] == undefined) {
        returnString = getValue(string, obj);
        //console.log(obj);
    }
    return returnString;
}

/**
 * Util method that finds an object value by key. Used for deeply nested dot-notation keys.
 *
 * @param namespace
 * @param parent
 * @return {*}
 */
function getValue(namespace, parent) {
    var parts = namespace.split('.'),
        current = parent || window;
    for (var i = 0; i < parts.length; i += 1) {
        if (current[parts[i]]) {
            current = current[parts[i]];
        } else {
            if (i >= parts.length - 1)
                return undefined;
        }
    }
    return current;
}

var getURLParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
};